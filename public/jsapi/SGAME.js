/**
 * SGAME JavaScript API
 * Integrate SCORM into web games
 *
 * @module SGAME
 */

window.onload = function(){
	SGAME.init();
};

SGAME = (function(undefined){
	
	var init = function(options) {
		
	};

	var triggerLO = function(event_id,callback){
		var lo;
		//TODO: Select lo in function of event_id
		_renderLO(lo,callback);
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
		var lo;
		if(typeof options == "object"){
			if(options["lo_id"]){
				//TODO: get lo with this id
			} else {
				//[...]
			}
		}
		_renderLO(lo,callback);
	};

	var _renderLO = function(lo,callback){
		//TODO: render LO
		var result = confirm('¿Quieres consumir este LO?');
		if(typeof callback == "function"){
			callback(result);
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