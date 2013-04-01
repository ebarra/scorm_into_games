SGAME_WEB = (function($,undefined){
	var catalog = {};
	catalog.games = {};
	catalog.los = {};

	current_game = {};
	current_los = [];

	var games_carrousel_id = "games_carrousel";
	var lo_carrousel_id = "lo_carrousel";

	var init = function (){
		_createFancybox();
		_requestScormFiles(_createScormFilesCarrousel);
		_requestGameTemplates(_createGameCarrousel);
		_loadEvents();
	}

	var _createFancybox = function(){
		$("#upload_scorm").fancybox({
			'autoDimensions' : false,
			'scrolling': 'no',
			'width': 600,
			'height': 400,
			'padding': 0,
			'hideOnOverlayClick': false,
			'hideOnContentClick': false,
			'showCloseButton': true
		});
	};

	var _createCarrousels = function(data){
		_createGameCarrousel(data.games);
		_createLOCarrousel(data.los);
	};

	var _createGameCarrousel = function(games){
		var carrouselImages = [];
		carrouselImages.push($("<img itemId='-1' src='assets/add_game.png'/>")[0]);
		// carrouselImages.push($("<img src='assets/game_dpark.png'/>")[0]);
		// carrouselImages.push($("<img src='assets/game_OnslaughtArena.jpg'/>")[0]);
		// carrouselImages.push($("<img src='assets/game_sokoban.png'/>")[0]);
		$.each(games, function(i, game) {
			var myImg = $("<img itemId="+game.id+" src="+game.avatar_url+" />");
			carrouselImages.push($(myImg)[0]);
			catalog.games[game.id] = game;
		});
		CarrouselWrapper.loadImagesOnCarrouselOrder(carrouselImages,_onGameImagesLoaded,games_carrousel_id);
	}

	var _onGameImagesLoaded = function(){
		$("#" + games_carrousel_id).show();
		var options = new Array();
		options['rows'] = 1;
		options['callback'] = _onGameSelected;
		options['rowItems'] = 3;
		options['styleClass'] = "game";
		CarrouselWrapper.createCarrousel(games_carrousel_id, options);

		_previewGame(catalog.games[Object.keys(catalog.games)[0]]); //Preview first game
	}

	/* los is an array with scorm_files
	*/
	var _createScormFilesCarrousel = function(los){
		var carrouselImages = [];
		carrouselImages.push($("<img itemId='-1' src='assets/add_lo.png'/>")[0]);
		$.each(los, function(i, lo) {
			if(lo.avatar_url==""){
				lo.avatar_url = "https://www.servage.net/blog/wp-content/uploads/2012/01/zip.gif";
			}
			var myImg = $("<img itemId="+lo.id+" src="+lo.avatar_url+" />");
			carrouselImages.push($(myImg)[0]);
			catalog.los[lo.id] = lo;
		});
		CarrouselWrapper.loadImagesOnCarrouselOrder(carrouselImages,_onLOImagesLoaded,lo_carrousel_id);
	}

	var _onLOImagesLoaded = function(){
		$("#" + lo_carrousel_id).show();
		var options = new Array();
		options['rows'] = 1;
		options['callback'] = _onLOSelected;
		options['rowItems'] = 3;
		options['styleClass'] = "game";
		CarrouselWrapper.createCarrousel(lo_carrousel_id, options);
	}


	/**
	 * Events
	 */
	 var _loadEvents = function(){

	 };

	/**
	 * API
	 */
	 var _requestScormFiles = function(successCallback,failCallback){
		$.ajax({
			async: false,
			type: 'GET',
			url: '/scorm_file.json',
			dataType: 'json',
			success: function(data) {
				if(typeof successCallback == "function"){
					successCallback(data);
				}
			},
			error: function(xhr, ajaxOptions, thrownError){
				if(typeof failCallback == "function"){
					failCallback(xhr, ajaxOptions, thrownError);
				}
			}
		});
	};

	var _requestGameTemplates = function(successCallback,failCallback){
		$.ajax({
			async: false,
			type: 'GET',
			url: '/game_template.json',
			dataType: 'json',
			success: function(data) {
				if(typeof successCallback == "function"){
					successCallback(data);
				}
			},
			error: function(xhr, ajaxOptions, thrownError){
				if(typeof failCallback == "function"){
					failCallback(xhr, ajaxOptions, thrownError);
				}
			}
		});
	}

			 

	/**
	 * Callbacks
	 */

	var _onGameSelected = function(event){
		var itemid = $(event.target).attr("itemid");
		if(itemid!==undefined){
			var id = parseInt(itemid);
			if(id===-1){
				_triggerFacyboxToUploadNewGame();
				return;
			}
			var game = catalog.games[id];
			_previewGame(game);
		}
	}

	var _onLOSelected = function(event){
		var itemid = $(event.target).attr("itemid");
		if(itemid!==undefined){
			var id = parseInt(itemid);
			if(id===-1){
				_triggerFacyboxToUploadNewLO();
				return;
			}
			var lo = catalog.los[id];
			_addLO(lo);
		}
	}

	/*
	 * Update UI
	 */

	var _previewGame = function(game){
		current_game = game;
		$("#game_preview").attr("src",game.avatar_url);
		$("#game_description").html(game.description);
	}

	var _triggerFacyboxToUploadNewGame = function(game){
		// console.log("New game");
	}

	var _triggerFacyboxToUploadNewLO = function(game){
		$("#upload_scorm").click();
	}

	var _addLO = function(lo){

		//Max 3
		if(current_los.length >= 3){
			return;
		}

		//Already added LO
		if(current_los.indexOf(lo)!==-1){
			return;
		}

		current_los.push(lo);

		var li = $("<li itemid='"+lo.id+"'>")

		var img = $("<img class='lo_preview' src='"+lo.avatar_url+"' />");
		var img_wrapper = $("<div class='lo_preview_wrapper'>");
		$(img_wrapper).append(img);
		$(li).append(img_wrapper);

		var description = $("<p class='lo_description'>"+lo.description+"</p>");
		var description_wrapper = $("<div class='lo_description_wrapper'>");
		$(description_wrapper).append(description);
		$(li).append(description_wrapper);

		var remove = $("<div class='remove_wrapper'><img class='remove' src='/assets/remove.png'/></div>");
		$(li).append(remove);

		$("#lo_list").append(li);

		$(remove).click(function(event){
			var li = $(event.target).parent().parent();
			var id = $(li).attr("itemid");
	 		 _removeLO(catalog.los[id]);
	 		 $(li).remove();
		});

		// <li>
  //       <div class="lo_preview_wrapper">
  //         <img class="lo_preview" src="/assets/scorm_nano.png" />
  //       </div>
  //       <div class="lo_description_wrapper">
  //         <p class="lo_description"> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
  //         </p>
  //       </div>
  //       <div class="remove_wrapper">
  //         <img class="remove" src="/assets/remove.png" />
  //       </div>
  //     </li>


	}

	var _removeLO = function(lo){
		current_los.splice(current_los.indexOf(lo),1);
	}

	return {
		init : init
	};

}) (jQuery);

