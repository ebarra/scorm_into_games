/**
 * SGAME JavaScript API
 * Integrate SCORM into web games
 *
 * @module SGAME
 */

SGAME = (function(undefined){
	
	var _settings;
	var event_mapping = {};

	var init = function(settings) {
		console.log("SGAME init with settings ");
		console.log(settings);

		_settings = settings;
		
		if(settings.event_mapping){
			for(var i=0;i<settings.event_mapping.length;i++){
				event_mapping[settings.event_mapping[i].event_id] = settings.event_mapping[i].lo_id;
			}
		}
	};

	var triggerLO = function(event_id,callback){
		var los_candidate = event_mapping[event_id];
		//TODO: Select lo in function of event_id
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
		var result = confirm('¿Quieres consumir este LO?');
		if(typeof callback == "function"){
			callback(result);
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
		init 		: init,
		showLO 		: showLO,
		triggerLO	: triggerLO
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