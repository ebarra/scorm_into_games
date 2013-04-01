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

		var init = function(){

		}

		return {
			init 			: init
		};

	}) ();


	//Init debug module for developping
	deb.init(true);

	//vars
	var _settings;
	var _event_mapping = {};
	var _togglePauseFunction = undefined;

	var init = function(options) {
		deb.log("SGAME init with options ");
		deb.log(options);

		if(options){
			if(typeof options.togglePause === "function"){
				_togglePauseFunction = options.togglePause;
			}
		}
	};

	var _togglePause = function(){
		if(typeof _togglePauseFunction === "function"){
			_togglePauseFunction();
		}
	}

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
		var los_candidate = _event_mapping[event_id];
		if(los_candidate){
			var loId = _randomChoice(los_candidate);
			_renderLO(loId,callback);
		}
	};


	/*
	 * Uses cases:
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


	var _renderLO = function(loId,callback){
		//TODO: render LO
		_togglePause();
		var result = confirm('¿Quieres consumir este LO?');
		if(typeof callback == "function"){
			callback(result);
			_togglePause();
		}
	}


	//Utils
	var _randomChoice = function(box){
		if(typeof box == "number"){
			return box; //one single element
		} else {
			//TODO: random
			return box[0];
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