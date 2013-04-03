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


	//////////////
	// iso8601 parser
	//////////////
	/*
	* Provided by https://github.com/nezasa/iso8601-js-period/blob/master/iso8601.js
	* Shared and maintained by [Nezasa](http://www.nezasa.com)
	* Published under [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0.html)
	* © Nezasa, 2012-2013
	*
	* Javascript library for parsing of ISO 8601 durations. Supported are durations of
	* the form P3Y6M4DT12H30M17S or PT1S or P1Y4DT1H3S etc.
	*
	* @author Nezasa AG -- https://github.com/nezasa
	* @contributor Jason "Palamedes" Ellis -- https://github.com/palamedes
	*/

	var iso8601Parser = (function(undefined){

		var getDuration = function(period){
			var multiplicators = [ 31104000,2592000,604800,86400,3600,60,1];
			/*
				var multiplicators = [year (360*24*60*60),month (30*24*60*60),
            	week (24*60*60*7),day (24*60*60),hour (60*60),minute (60),second (1)];
            */

            try {
            	var durationPerUnit = _parsePeriodString(period);
            } catch (e){
            	return null;
            }
			
			var durationInSeconds = 0;
			for (var i = 0; i < durationPerUnit.length; i++) {
				durationInSeconds += durationPerUnit[i] * multiplicators[i];
			}

			return durationInSeconds;
		}

	   /**
		* Parses a ISO8601 period string.
		* @param period iso8601 period string
		* @param _distributeOverflow if 'true', the unit overflows are merge into the next higher units.
		*/
	    function _parsePeriodString(period, _distributeOverflow) {

	        var distributeOverflow = (_distributeOverflow) ? _distributeOverflow : false;
	        var valueIndexes = [2, 3, 4, 5, 7, 8, 9];
	        var duration = [0, 0, 0, 0, 0, 0, 0];
	        var overflowLimits = [0, 12, 4, 7, 24, 60, 60];
	        var struct;

	        // upcase the string just in case people don't follow the letter of the law
	        period = period.toUpperCase();

	        // input validation
	        if (!period) {
	        	return duration;
			} else if (typeof period !== "string"){
				throw new Error("Invalid iso8601 period string '" + period + "'");
			} 

	        // parse the string
	        if (struct = /^P((\d+Y)?(\d+M)?(\d+W)?(\d+D)?)?(T(\d+H)?(\d+M)?(\d+S)?)?$/.exec(period)) {
	            // remove letters, replace by 0 if not defined
	            for (var i = 0; i < valueIndexes.length; i++) {
	                var structIndex = valueIndexes[i];
	                duration[i] = struct[structIndex] ? +struct[structIndex].replace(/[A-Za-z]+/g, '') : 0;
	            }
	        } else {
	            throw new Error("String '" + period + "' is not a valid ISO8601 period.");
	        }

	        if (distributeOverflow) {
	            // note: stop at 1 to ignore overflow of years
	            for (var i = duration.length - 1; i > 0; i--) {
	                if (duration[i] >= overflowLimits[i]) {
	                    duration[i-1] = duration[i-1] + Math.floor(duration[i]/overflowLimits[i]);
	                    duration[i] = duration[i] % overflowLimits[i];
	                }
	            }
	        }

	        return duration;
	    };

		return {
			getDuration	: getDuration
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
			var LOmetadata = {};

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
				if(options.LOmetadata){
					LOmetadata = options.LOmetadata;
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
			iframe.style.overflowY = "scroll";
			iframe.scrolling = "yes";
			iframe.style.frameBorder = "0";
			iframe.style.borderStyle="none";
			fancybox.appendChild(iframe);

			//Add observer
			observer.start(iframe,LOmetadata);

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
		var _currentLOmetadata = undefined;
		var _eventsLoaded = false;

		//Params
		var startTime;
		var success;

		var start = function(iframe,LOmetadata){
			if(iframe){
				_loadEvents();
				_currentIframe = iframe;
				_currentLOmetadata = LOmetadata;

				//Reset params
				startTime = Date.now();
				success = false;
			}
		}

		var stop = function(){
			_currentIframe = undefined;
			_currentLOmetadata = undefined;
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
			if(!_currentIframe){
				return null;
			}

			var timeSpent = Math.round((Date.now() - startTime)/1000);
			success = _callOracle({timeSpent: timeSpent});

			var report = {
				time: timeSpent,
				success: success
			};

			return report;
		}

		var _callOracle = function(info){
			var minLOtime = 5;
			var maxLOtime = 10;

			if(_currentLOmetadata){
				//Future Work (LMS API)
				//Check if the LO must be evaluated based on time or based on assessments

				//Fist version: always evaluated based on time

				//Get Typical Learning Time in seconds
				var TLT = _getTypicalLearningTime(_currentLOmetadata);

				//Success when the student spent more than 25% of the TLT time
				//A maximum value of 10 seconds and a minimum value of 5 seconds are considered
				return info.timeSpent > Math.max(Math.min(0.25*TLT,maxLOtime),minLOtime);
			}
			return info.timeSpent > minLOtime;
		}

		var _getTypicalLearningTime = function(metadata){
			if(metadata.educational){
				if(metadata.educational.typicalLearningTime){
					if(metadata.educational.typicalLearningTime.duration){
						if(metadata.educational.typicalLearningTime.duration.langstrings){
							if(metadata.educational.typicalLearningTime.duration.langstrings["x-none"]){
								var TLT = metadata.educational.typicalLearningTime.duration.langstrings["x-none"];
								var parsedTLT = iso8601Parser.getDuration(TLT);
								if(parsedTLT){
									//parsedTLT will be null if is not a valid ISO 8601 duration
									return parsedTLT;
								}
							}
						}
					}
				}
			}
			return null;
		}

		return {
			start		: start,
			stop		: stop,
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
	var _los = [];
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

		if(settings.lo_list){
			_los = settings.lo_list;
		} else {
			_los = [null];
		}

		if(settings.event_mapping){
			for(var i=0;i<settings.event_mapping.length;i++){
				_event_mapping[settings.event_mapping[i].event_id] = {};
				_event_mapping[settings.event_mapping[i].event_id].los = settings.event_mapping[i].los_id;
			}
		}
	}

	var triggerLO = function(event_id,callback){
		var loId;
		var los_candidate = _event_mapping[event_id].los;
		if(los_candidate){
			if(los_candidate.indexOf("*") != -1){
				loId = _randomChoice(_los);
			} else {
				loId = _randomChoice(los_candidate);
			}
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
		if((typeof options == "object")&&(typeof options["lo_id"] === "number")){
			_renderLO(options["lo_id"],callback);
		} else {
			_renderLO(undefined,callback);
		}
	};


	//////////////
	// Utils
	//////////////

	var _requestLOMetadata = function(loId,successCallback,failCallback){
		var serverAPIurl;

		if(!loId){
			serverAPIurl = "/lo/random/metadata.json";
		} else {
			serverAPIurl = "/lo/" + loId + "/metadata.json";
		}

		try{
			_XMLHttprequest(serverAPIurl,function(data){
				successCallback(data);
			});
		} catch (e){
			failCallback(e);
		}
	}

	var _XMLHttprequest = function(url,callback){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function(){
			if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
        		var data = JSON.parse(xmlHttp.responseText);
        		callback(data);
    		}
		};
		xmlHttp.open("GET", url, true);
		xmlHttp.send("");
	}

	var _renderLO = function(loId,callback){
		_togglePause();

		_requestLOMetadata(loId, function(metadata){
			//Success
			fancybox.create({ url: metadata.url, LOmetadata: metadata}, function(report){
				deb.log("LO report");
				deb.log(report);
				if(typeof callback == "function"){
					callback(report.success,report);
					_togglePause();
				}
			});
		}, function(){
			//Fail
			_togglePause();
			callback(true,null);
		});
	}

	var _randomChoice = function(box){
		if(typeof box == "number"){
			return box; //one single element
		} else {
			return box[_generateRandomNumber(0,box.length-1)];
		}
	}

	/*
	 *	Generate a random number in the [a,b] interval
	 */
	var _generateRandomNumber = function(a,b){
		if((typeof a != "number")||(typeof b != "number")){
			throw { name: "Invalid number format exception" };
		}

		return Math.round(a + Math.random()*(b-a));
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
SGAME.EVENT.GENERIC = "generic";
SGAME.EVENT.EXTRA_LIFE = "extra_life";
SGAME.EVENT.EXTRA_SKILL = "extra_skill";
SGAME.EVENT.EXTRA_ITEM = "extra_item";
SGAME.EVENT.BLOCKER = "blocker";
SGAME.EVENT.CHEAT = "cheat";
SGAME.EVENT.CONTINUE = "continue";