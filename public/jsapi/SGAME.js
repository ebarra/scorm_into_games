var global;
/**
 * SGAME JavaScript API
 * Integrate SCORM into web games
 *
 * @module SGAME
 */

SGAME = (function(undefined){
	
	//Modules

	///////////
	// Debugger
	//////////
	var deb = (function(undefined){

		var _debugging = false;

		var init = function(debugging){
			if(debugging===true){
				_debugging = debugging;
			}
		}

		var log = function(msg){
			if((_debugging)&&(window.console)){
				console.log(msg)
			}
		}

		return {
			init	: init,
			log		: log
		};

	}) ();


	///////////
	// Fancybox
	//////////
	var fancybox = (function(undefined){

		var _currentFancybox = undefined;

		var init = function(){

		}

		var create = function(options,onCloseCallback){
			_removeCurrentFancybox();

			//Params
			var width = 850;
			var height = 650;
			var url;

			if(options){
				if(options.width){
					width = options.width;
				}
				if(options.height){
					height = options.height;
				}
				if(options.url){
					url = options.url;
				}
			}

			//Params Validation
			if(!url){
				return;
			}

			var fancybox = document.createElement('div');
			fancybox.style.width = width + "px";
			fancybox.style.height = height + "px";
			fancybox.style.overflow = "hidden";
			fancybox.style.background = 'white';
			fancybox.style.position = "absolute";
			fancybox.style.top = 0;
			fancybox.style.zindex = 9999;
			fancybox.style.borderRadius = '1em';

			fancybox.setAttribute('id', "test");

			var marginLeft = (window.innerWidth - width)/2;
			fancybox.style.marginLeft = marginLeft + "px";

			var marginTop = (window.innerHeight - height)/2;
			fancybox.style.marginTop = marginTop + "px";

			//Close button
			var closeButton = document.createElement('img'); 
			closeButton.src = "/assets/close.png";
			closeButton.style.width = "25px";
			closeButton.style.height = "25px";
			closeButton.style.padding = "5px";
			closeButton.style.cursor = "pointer";
			closeButton.style.position = "absolute";
			closeButton.style.right = 0;
			closeButton.onclick = function(){
				_removeCurrentFancybox();
				if(typeof onCloseCallback === "function"){
					var report = observer.getReport();
					onCloseCallback(report);
				}
			}
			fancybox.appendChild(closeButton);

			//Iframe
			var iframe = document.createElement('iframe');
			iframe.src = url;
			iframe.style.width = "95%";
			iframe.style.height = "95%";
			iframe.style.marginLeft = "2.5%";
			iframe.style.marginTop = "30px";
			iframe.style.overflow = "hidden";
			iframe.scrolling = "no";
			iframe.style.frameBorder = "0";
			iframe.style.borderStyle="none";
			fancybox.appendChild(iframe);

			//Add observer
			observer.start(iframe);

			_currentFancybox = fancybox;
			document.body.appendChild(fancybox);
		}

		var _removeCurrentFancybox = function(){
			if(!_currentFancybox){
				return;
			}
			//Hide fancybox
			_currentFancybox.style.display = "none";
			//Remove fancybox
			_currentFancybox.parentNode.removeChild(_currentFancybox);
			_currentFancybox = undefined;
		}

		return {
			init 			: init,
			create			: create
		};

	}) ();


	///////////
	// Observer
	//////////
	var observer = (function(undefined){

		var _currentIframe = undefined;
		var _eventsLoaded = false;

		//Params
		var startTime;
		var success;

		var start = function(iframe){
			if(iframe){
				_loadEvents();
				_currentIframe = iframe;

				//Reset params
				startTime = Date.now();
				success = false;
			}
		}

		var _loadEvents = function(){
			if(_eventsLoaded){
				return;
			}
			if (window.addEventListener){
				window.addEventListener("message", _onMessage, false);
			} else if (el.attachEvent){
				window.addEventListener("message", _onMessage);
			}
			_eventsLoaded = true;
		}

		var _onMessage = function(message){
		}

		var getReport = function(){
			var timeSpent = Math.round((Date.now() - startTime)/1000);

			//First version
			//Success only depends of timeSpent
			success = timeSpent > 3;

			var report = {
				time: timeSpent,
				success: success
			};

			return report;
		}

		return {
			start		: start,
			getReport	: getReport
		};

	}) ();


	//Init debug module for developping
	deb.init(true);



	//////////////
	// SGAME Module
	//////////////

	//vars
	var _settings;
	var _event_mapping = {};
	var _togglePauseFunction = undefined;


	/**
	 * SGAME API
	 * 
	 * init
	 * loadSeetings
	 * triggerLO
	 * showLO
	 **/

	var init = function(options) {
		deb.log("SGAME init with options ");
		deb.log(options);

		if(options){
			if(typeof options.togglePause === "function"){
				_togglePauseFunction = options.togglePause;
			}
		}
	};

	var loadSettings = function(settings){
		deb.log("SGAME load settings ");
		deb.log(settings);
		_settings = settings;

		if(settings.event_mapping){
			for(var i=0;i<settings.event_mapping.length;i++){
				_event_mapping[settings.event_mapping[i].event_id] = {};
				_event_mapping[settings.event_mapping[i].event_id].los = settings.event_mapping[i].los_id;
			}
		}
	}

	var triggerLO = function(event_id,callback){
		var los_candidate = _event_mapping[event_id].los;
		if(los_candidate){
			var loId = _randomChoice(los_candidate);
			_renderLO(loId,callback);
		}
	};


	/*
	 * Use cases:
	 * showLO(callback)
	 * showLO(options,callback)
	 */
	var showLO = function(param1,param2){
		if(!param2){
			_showLO(undefined,param1);
		} else {
			_showLO(param1,param2);
		}
	};


	var _showLO = function(options,callback){
		var loId;
		if(typeof options == "object"){
			if(options["lo_id"]){
				//TODO: get lo with this id
			} else {
				//[...]
			}
		}
		_renderLO(loId,callback);
	};


	//////////////
	// Utils
	//////////////

	var _renderLO = function(loId,callback){
		_togglePause();

		//TODO: get LO metadata

		fancybox.create({ url: "/lo/" + loId}, function(report){
			deb.log("LO report");
			deb.log(report);
			if(typeof callback == "function"){
				callback(report.success);
				_togglePause();
			}
		});
	}

	var _randomChoice = function(box){
		if(typeof box == "number"){
			return box; //one single element
		} else {
			//TODO: random
			return box[0];
		}
	}

	var _togglePause = function(){
		if(typeof _togglePauseFunction === "function"){
			_togglePauseFunction();
		}
	}

	return {
		init 			: init,
		loadSettings	: loadSettings,
		showLO 			: showLO,
		triggerLO		: triggerLO
	};

}) ();



//Metadata
SGAME.VERSION = '0.1';
SGAME.AUTHORS = 'Enrique Barra, Aldo Gordillo';
SGAME.URL = "http://github.com/ebarra/scorm_into_games";

//Constants
SGAME.EVENT = {};
SGAME.EVENT.GENERIC = 0;
SGAME.EVENT.EXTRA_LIFE = 1;
SGAME.EVENT.EXTRA_SKILL = 2;
SGAME.EVENT.EXTRA_ITEM = 3;
SGAME.EVENT.BLOCKER = 4;
SGAME.EVENT.CHEAT = 5;
SGAME.EVENT.CONTINUE = 6;