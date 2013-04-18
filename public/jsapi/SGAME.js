/**
 * SGAME JavaScript API
 * Integrate SCORM into web games
 *
 * @module SGAME
 */

//SCORM LMS API
var API_1484_11;
//SGAME Jquery
var jq191;


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
			fancybox.style.border = "2px solid black";

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
					var report = observer.stop(); //Stop the observer and get final report
					onCloseCallback(report);
				}
			}
			fancybox.appendChild(closeButton);

			var semaphore = document.createElement('img');
			semaphore.id = "semaphore";
			semaphore.src = "/assets/semaphore/semaphore_red.png";
			semaphore.style.width = "45px";
			semaphore.style.height = "40px";
			semaphore.style.padding = "5px";
			semaphore.style.position = "absolute";
			// semaphore.style.right = "-5px";
			// semaphore.style.top = "32px";
			semaphore.style.left = "0px";
			semaphore.style.top = "0px";
			fancybox.appendChild(semaphore);

			//Iframe
			var iframe = document.createElement('iframe');
			iframe.src = url;
			iframe.style.width = "95%";
			iframe.style.height = "95%";
			iframe.style.marginLeft = "2.5%";
			iframe.style.marginTop = "40px";
			iframe.style.overflow = "hidden";
			iframe.style.overflowY = "auto";
			iframe.scrolling = "yes";
			iframe.style.frameBorder = "0";
			iframe.style.borderStyle="none";
			fancybox.appendChild(iframe);

			_currentFancybox = fancybox;
			document.body.appendChild(fancybox);

			//Add observer
			observer.start(iframe,LOmetadata);
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
		//Metadata params
		var TLT; //Typical Learning Time

		var start = function(iframe,LOmetadata){
			if(iframe){
				_loadEvents();
				_currentIframe = iframe;
				_currentLOmetadata = LOmetadata;

				_resetParams();

				//Get Typical Learning Time (in seconds)
				//null if is not specified in the metadata
				TLT = _getTypicalLearningTime(_currentLOmetadata);

				var requiredTime = _getRequiredSpentTime();
				deb.log("Required Time: " + requiredTime);
				semaphore.changeColor("red");
				semaphore.setUpBlink("yellow",requiredTime*0.4-0.5,requiredTime*0.6);
				semaphore.changeColor("green",requiredTime);
			}
		}

		var _resetParams = function(){
			startTime = Date.now();
			success = false;
			TLT = null;
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

		/*
		 * Stop and get report
		 */
		var stop = function(){
			semaphore.stop();

			if(!_currentIframe){
				return null;
			}

			var timeSpent = Math.round((Date.now() - startTime)/1000);
			success = _callOracle({timeSpent: timeSpent});

			var report = {
				time: timeSpent,
				success: success
			};

			//Reset params
			_currentIframe = undefined;
			_currentLOmetadata = undefined;

			return report;
		}

		var _callOracle = function(info){
			var requiredTime = _getRequiredSpentTime();
			return info.timeSpent > requiredTime;
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

		/*
		 * Success when the student spent more than 25% of the TLT time
		 * A maximum and a minimum thresholds are considered
		 */
		var _getRequiredSpentTime = function(){
			var minLOtime = 10;
			var maxLOtime = 30;

			if(!TLT){
				return minLOtime;
			}

			return Math.max(Math.min(0.25*TLT,maxLOtime),minLOtime);
		}

		return {
			start		: start,
			stop		: stop
		};

	}) ();


	///////////
	// Semaphore
	//////////
	var semaphore = (function(undefined){

		var changeColorTimer;
		var startBlinkTimer;
		var blinkTimer;
		var stopBlinkTimer;

		var changeColor = function(color,delay){
			if(delay){
				changeColorTimer = setTimeout(function(){
					_changeColor(color);
				},delay*1000);
			} else {
				_changeColor(color);
			}
		}

		var _changeColor = function(color){
			var semaphore = document.getElementById("semaphore");
			if(semaphore){
				semaphore.src = _getImageForColor(color);
			}
		}

		var _getImageForColor = function(color){
			switch(color){
				case "green":
					return "/assets/semaphore/semaphore_green.png";
					break;
				case "yellow":
					return "/assets/semaphore/semaphore_yellow.png";
					break;
				case "red":
					return "/assets/semaphore/semaphore_red.png";
					break;
				default:
					return "/assets/semaphore/semaphore.png";
					break;
			}
		}

		var setUpBlink = function(color,duration,delay){
			if(delay){
				startBlinkTimer = setTimeout(function(){
					_blink(color,duration);
				},delay*1000);
			} else {
				_blink(color,duration);
			}
		}

		var _blink = function(color,duration){
			var semaphore = document.getElementById("semaphore");
			if(!semaphore){
				return;
			}
			var coin = false;
			blinkTimer = setInterval(function(){
				if(!semaphore){
					return;
				}
				if(coin){
					semaphore.src = _getImageForColor(null);
					coin = false;
				} else {
					semaphore.src = _getImageForColor(color);
					coin = true;
				}
			},500);
			stopBlinkTimer = setTimeout(function(){
				clearTimeout(blinkTimer);
			},duration*1000);
		}

		var stop = function(){
			if(changeColorTimer){
				clearTimeout(changeColorTimer);
			}
			if(startBlinkTimer){
				clearTimeout(startBlinkTimer);
			}
			if(blinkTimer){
				clearTimeout(blinkTimer);
			}
			if(stopBlinkTimer){
				clearTimeout(stopBlinkTimer);
			}
		}


		return {
			changeColor	: changeColor,
			setUpBlink	: setUpBlink,
			stop 		: stop
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
	var _los;
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

		_loadScript("http://code.jquery.com/jquery-1.9.1.js",function(){
			$.noConflict();
			jq191 = jQuery.noConflict(true);
			API_1484_11 = new Local_API_1484_11({},jq191);
		});

		_settings = settings;

		if(settings.lo_list){
			if(!_los){
				_los = [];
			}
			for(var i=0; i<settings.lo_list.length;i++){
				_los.push({id: settings.lo_list[i], marked: false});
			}
		} else {
			_los = [null];
		}

		if(settings.event_mapping){
			for(var i=0;i<settings.event_mapping.length;i++){
				var eMapping = settings.event_mapping[i];
				_event_mapping[eMapping.event_id] = {};
				_event_mapping[eMapping.event_id].los = [];
				for(var j=0; j<eMapping.los_id.length; j++){
					_event_mapping[eMapping.event_id].los.push({id: eMapping.los_id[j], marked: false});
				}
			}
		}
	}

	var triggerLO = function(event_id,callback){
		var loId;
		var los_candidate = _event_mapping[event_id].los;

		if(los_candidate){
			if(_containWildcard(los_candidate)){
				var rRobinResult = _roundRobinChoice(_los);
				_los = rRobinResult.los;
			} else {
				var rRobinResult = _roundRobinChoice(los_candidate);
				_event_mapping[event_id].los = rRobinResult.los;
			}
			loId = rRobinResult.lo.id;
			_renderLO(loId,callback);
		}
	};

	/*
	 * Return true if an LOs array contain the special id '*'
	 * In that case any LO of the game can be showed
	 */
	var _containWildcard = function(los_array){
		var wildcard = false;
		for(var i=0; i<los_array.length; i++){
			if(los_array[i].id==="*"){
				wildcard = true;
			}
		}
		return wildcard;
	}


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

	var _roundRobinChoice = function(los){
		var selectedLO;
		var purge_los = [];

		for(var i=0; i<los.length; i++){
			if(los[i].marked === false){
				purge_los.push(los[i]);
			}
		}

		if(purge_los.length > 0){
			selectedLO = _randomChoice(purge_los);
		} else {
			//All LOs marked, reset
			for(var i=0; i<los.length; i++){
				los[i].marked = false;
			}
			selectedLO = _randomChoice(los);
		}

		los[los.indexOf(selectedLO)].marked = true;
		return {lo: selectedLO, los: los};
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

	/*
	 * Load a script asynchronously
	 */
	var _loadScript = function(scriptSrc,callback){
	  if((typeof scriptSrc !== "string")||(typeof callback !== "function")){
	    return;
	  }
	 
	  var head = document.getElementsByTagName('head')[0];
	  if(head) {
	    var script = document.createElement('script');
	    script.setAttribute('src',scriptSrc);
	    script.setAttribute('type','text/javascript');

	    var loadFunction = function(){
	      if((this.readyState == 'complete')||(this.readyState == 'loaded')){
	        callback();
	      }
	    };

	    //calling a function after the js is loaded (IE)
	    script.onreadystatechange = loadFunction;

	    //calling a function after the js is loaded (Firefox)
	    script.onload = callback;

	    head.appendChild(script);
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






/**
 * SCORM LMS API
 */

 /*global $, JQuery, debug, scorm */
/*jslint devel: true, browser: true, nomen: true */
/**
 * Local API_1484_11
 * Mimics LMS Connectivity in Local Mode i.e. standalone functionality
 *
 * https://github.com/cybercussion/SCORM_API
 * @author Mark Statkus <mark@cybercussion.com>
 * @requires JQuery
 * @param options {Object} override default values
 * @constructor
 */
/*!
 * Local_API_1484_11
 * Copyright (c) 2011-2012 Mark Statkus <mark@cybercussion.com>
 * The MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
function Local_API_1484_11(options,jQuery) {
	if(jQuery){
		$ = jQuery;
	}

    // Constructor
    "use strict";
    var defaults = {
            version:     "2.2",
            moddate:     "03/05/2013 5:10PM",
            createdate:  "07/17/2010 08:15AM",
            prefix:      "Local_API_1484_11",
            errorCode:   0,
            diagnostic:  '',
            initialized: 0,
            terminated:  0,
            debug: true,
            CMI:         {
                _version:              "Local 1.0",
                comments_from_learner: {
                    _children: "comment,location,timestamp",
                    _count:    "0"
                },
                comments_from_lms:     {
                    _children: "comment,location,timestamp",
                    _count:    "0"
                },
                completion_status:     "unknown",
                completion_threshold:  "0.7",
                credit:                "no-credit",
                entry:                 "ab-initio",
                exit:                  "",
                interactions:          {
                    _children: "id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description",
                    _count:    "0"
                },
                launch_data:           "?name1=value1&name2=value2&name3=value3", // {\"name1\": \"value1\", \"name2\": \"value2\", \"name3\": \"value3\"} or ?name1=value1&name2=value2&name3=value3
                learner_id:            "100",
                learner_name:          "Simulated User",
                learner_preference:    {
                    _children:        "audio_level,language,delivery_speed,audio_captioning",
                    audio_level:      "1",
                    language:         "",
                    delivery_speed:   "1",
                    audio_captioning: "0"
                },
                location:              "",
                max_time_allowed:      "", // PT26.4S for 26.4 Seconds
                mode:                  "normal",
                objectives:            {
                    _children: "id,score,success_status,completion_status,description",
                    _count:    "0"
                },
                progress_measure:      "",
                scaled_passing_score:  "0.7",
                score:                 {
                    _children: "scaled,raw,min,max",
                    scaled:    "",
                    raw:       "",
                    min:       "",
                    max:       ""
                },
                session_time:          "PT0H0M0S",
                success_status:        "unknown",
                suspend_data:          "",
                time_limit_action:     "", // exit, no message or continue, message etc ...
                total_time:            "PT0H0M0S"
            }
        },
    // Settings merged with defaults and extended options */
        settings = $.extend(defaults, options),
        cmi = {},
        /**
         * Completion Status's that are allowed
         */
        completion_status = "|completed|incomplete|not attempted|unknown|",
        /**
         Read Only values -
         The hash following could of been much simpler had certain name spaces always been read-only in all areas.
         This would of allowed me to just evaluate the last item and perform that rule globally.  The following are issues -
         id -       This is read-only under adl.data.n.id, and read/write everywhere else
         comments_from_lms are entirely read-only (global rule)
         timestamp is RO for comments from LMS
         */
        read_only = "|_version|completion_threshold|credit|entry|launch_data|learner_id|learner_name|_children|_count|mode|maximum_time_allowed|scaled_passing_score|time_limit_action|total_time|comment|",
        /**
         * Write Only values
         */
        write_only = "|exit|session_time|",
        exit = "|time-out|suspend|logout|normal||",
        errors = {
            0:   "No error",
            101: "General exception",
            102: "General Initialization Failure",
            103: "Already Initialized",
            104: "Content Instance Terminated",
            111: "General Termination Failure",
            112: "Termination Before Initialization",
            113: "Termination After Termination",
            122: "Retrieve Data Before Initialization",
            123: "Retrieve Data After Termination",
            132: "Store Data Before Initialization",
            133: "Store Data After Termination",
            142: "Commit Before Initialization",
            143: "Commit After Termination",
            201: "General Argument Error",
            301: "General Get Failure",
            351: "General Set Failure",
            391: "General Commit Failure",
            401: "Undefined Data Model",
            402: "Unimplemented Data Model Element",
            403: "Data Model Element Value Not Initialized",
            404: "Data Model Element Is Read Only",
            405: "Data Model Element Is Write Only",
            406: "Data Model Element Type Mismatch",
            407: "Data Model Element Value Out Of Range",
            408: "Data Model Dependency Not Established"
        },
        self = this;
    // Private
    /**
     * Throw Vocabulary Error
     * This sets the errorCode and Diagnostic for the key and value attempted.
     * @param k {String} key
     * @param v {String} value
     * @returns {String} 'false'
     */
    function throwVocabError(k, v) {
        settings.diganostic = "The " + k + " of " + v + " must be a proper vocabulary element.";
        settings.errorCode = 406;
        return 'false';
    }

    /**
     * Throw Unimplemented Error
     * 402 data model doesn't exist yet.
     * @param key {String}
     * @returns {String} 'false'
     */
    function throwUnimplemented(key) {
        settings.errorCode = 402;
        settings.diagnostic = 'The value for key ' + key + ' has not been created yet.';
        return 'false';
    }

    /**
     * Throw General Set Error
     * This sets the errorCode and Diagnostic for the key and value attempted.
     * Note, messages differ too much for this to be genericized.  I think the SCORM Error, Message and Diagnostic needs to be bundled better.
     * @param k {String} key
     * @param v {String} value
     * @param o {String} optional
     * @returns {String} 'false'
     */
    function throwGeneralSetError(k, v, o) {
        settings.errorCode = "351";
        settings.diagnostic = "The " + k + " element must be unique.  The value '" + v + "' has already been set in #" + o;
        return 'false';
    }

    /**
     * Set Data (Private)
     * This covers setting key's values against a object even when there are numbers as objects
     * It will chase thru the Object dot syntax to locate the key you request.  This worked out
     * better than doing a eval(param); which breaks when numbers are introduced.
     * @param key {String} Location of value in object
     * @param val {String} Value of the Key
     * @param obj {Object} Object to search and set
     */
    function setData(key, val, obj) {
        //if (!obj) { obj = data;} //outside (non-recursive) call, use "data" as our base object
        var ka = key.split(/\./);
        //split the key by the dots
        if (ka.length < 2) {
            obj[ka[0]] = val;
            //only one part (no dots) in key, just set value
        } else {
            if (!obj[ka[0]]) {
                obj[ka[0]] = {};
            }//create our "new" base obj if it doesn't exist
            obj = obj[ka.shift()];
            //remove the new "base" obj from string array, and hold actual object for recursive call
            setData(ka.join("."), val, obj);
            //join the remaining parts back up with dots, and recursively set data on our new "base" obj
        }
    }

    /**
     * Get Data (Private)
     * This covers getting key's values against a object even when there are numbers as objects
     * It will chase thru the Object dot syntax to locate the key you request.  This worked out
     * better than doing a eval(param); which breaks when numbers are introduced.
     * @param key {String} Location of value in object
     * @param obj {Object} Object to search
     * @returns {String}
     */
    function getData(key, obj) {
        //if (!obj) { obj = data;} //outside (non-recursive) call, use "data" as our base object
        //debug(settings.prefix + ": GetData Checking " + key, 4);
        var ka = key.split(/\./), v;
        //split the key by the dots
        if (ka.length < 2) {
            try {
                //debug(settings.prefix + ":  getData returning -   key:" + ka[0] + " value:" + obj[ka[0]], 4);
                return obj[ka[0]];
            } catch (e) {
                throwUnimplemented(key);
                return 'false';
            }
            //only one part (no dots) in key, just set value
        } else {
            v = ka.shift();
            if (obj[v]) {
                return String(getData(ka.join("."), obj[v])); // just in case its undefined
            }
            throwUnimplemented(key);
            return 'false';
            //join the remaining parts back up with dots, and recursively set data on our new "base" obj
        }
    }

    /**
     * CMI Get Value (Private)
     * This covers getting CMI Keys and returning there values.
     * It will have mild error control against the CMI object for Write Only values.
     * @param key {String} Location of value in object
     * @returns {String}
     */
    function cmiGetValue(key) {
        var r = "false";
        switch (key) {
            //Write Only
        case "cmi.exit":
        case "cmi.session_time":
            settings.errorCode = 405;
            settings.diagnostic = "Sorry, this has been specified as a read-only value for " + key;
            break;

        default:
            r = getData(key.substr(4, key.length), cmi);
            //debug(settings.prefix + ": cmiGetValue got " + r, 4);
            // Filter
            if (r === 'undefined') {
                settings.errorCode = 401;
                settings.diagnostic = "Sorry, there was a undefined response from " + key;
                r = "false";
            }
            debug(settings.prefix + ": GetValue " + key + " = " + r, 4);
            break;
        }
        return r;
    }

    /**
     * Is Read Only?
     * I've placed several of the read-only items in a delimited string.  This is used to compare
     * the key, to known read-only values to keep you from changing something your not supposed to.
     * @param key {String} like cmi.location
     * @returns {Boolean} true or false
     */
    function isReadOnly(key) {
        // See note above about read-only
        var tiers = key.split('.'),
            v = tiers[tiers.length - 1]; // last value
        if (tiers[0] === 'adl' && tiers[4] === 'id') {
            return true;
        }
        if (tiers[1] === 'comments_from_lms') {// entirely read only
            return true;
        }
        if (tiers[1] === 'comments_from_learner') { // Condition where comment in this case is allowed.
            return false;
        }
        return read_only.indexOf('|' + v + '|') >= 0;
    }

    /**
     * Is Write Only?
     * I've placed several write-only items in a delimited string.  This is used to compare
     * the key, to known write-only values to keep you from reading things your not suppose to.
     * @param key {String}
     * @returns {Boolean} true or false
     */
    function isWriteOnly(key) {
        var tiers = key.split("."),
            v = tiers[tiers.length - 1]; // last value
        return write_only.indexOf('|' + v + '|') >= 0;
    }

    /**
     * Round Value
     * Rounds to 2 decimal places
     * @param v {Number}
     * @returns {Number}
     */
    function roundVal(v) {
        var dec = 2;
        return Math.round(v * Math.pow(10, dec)) / Math.pow(10, dec);
    }

    /**
     * Get Object Length
     * @param obj {Object}
     * returns {Number}
     */
    function getObjLength(obj) {
        var name,
            length = 0;
        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                length += 1;
            }
        }
        return length;
    }

    function checkExitType() {
        if (cmi.exit === "suspend") {
            cmi.entry = "resume";
        }
    }

    /**
     * Update Suspend Data Usage Statistics
     * Will update settings.suspend_date_usage with current % level
     */
    function suspendDataUsageStatistic() {
        return roundVal((cmi.suspend_data.length / 64000) * 100) + "%";
    }

     /**
     * Debug
     * Built-In Debug Functionality to output to console (Firebug, Inspector, Dev Tool etc ...)
     * @param msg {String} Debug Message
     * @param lvl {Integer} 1=Error, 2=Warning, 3=Log, 4=Info
     */
    function debug(msg, lvl) {
        if (settings.debug) {// default is false
            if (!window.console) {// IE 7 probably 6 was throwing a error if 'console undefined'
                window.console = {};
                window.console.info = noconsole;
                window.console.log = noconsole;
                window.console.warn = noconsole;
                window.console.error = noconsole;
                window.console.trace = noconsole;
            }
            switch (lvl) {
            case 1:
                console.error(msg);
                break;
            case 2:
                console.warn(msg);
                break;
            case 4:
                console.info(msg);
                break;
            case 3:
                console.log(msg);
                break;
            default:
                console.log(msg);
                return false;
            }
            return true;
        }
        if (lvl < 3 && settings.throw_alerts) {
            alert(msg);
        }
        return false;
    };


    // End Private
    // Public
    /**
     * isRunning, Returns true if initialized is 1 and terminated is 0
     * @returns {Boolean} true or false
     */
    this.isRunning = function () {
        return settings.initialized === 1 && settings.terminated === 0;
    };
    /*jslint nomen: true */
    /**
     * Initialize Session (SCORM) only once!
     * @returns {String} "true" or "false" depending on if its been initialized prior
     */
    this.Initialize = function () {
        debug(settings.prefix + ":  Initializing...", 3);
        if (settings.cmi) {
            cmi = settings.cmi;
            checkExitType();
        } else {
            cmi = settings.CMI;
        }
        // Clean CMI Object
        settings.initialized = 1;
        settings.terminated = 0;
        return 'true';
    };
    /**
     * GetValue (SCORM)
     * @param key {String}
     * @returns {String} "true" or "false" depending on if its been initialized prior
     */
    this.GetValue = function (key) {
        //debug(settings.prefix + ":  Running: " + this.isRunning() + " GetValue: " + key + "...", 4);
        settings.errorCode = 0;
        var r = "false",
            k = key.toString(), // ensure string
            tiers = [];
        if (this.isRunning()) {
            if (isWriteOnly(k)) {
                debug(settings.prefix + ": This " + k + " is write only", 4);
                settings.errorCode = 405;
                return "false";
            }
            tiers = k.toLowerCase().split(".");
            switch (tiers[0]) {
            case "cmi":
                r = cmiGetValue(k);
                break;
            case "ssp":

                break;
            case "adl":

                break;
            }
            return r;
        }
        settings.errorCode = 123;
        return r;
    };
    /**
     * SetValue (SCORM)
     * @param key {String}
     * @param value {String}
     * @returns {String} "true" or "" depending on if its been initialized prior
     */
    this.SetValue = function (key, value) {
        debug(settings.prefix + ": SetValue: " + key + " = " + value, 4);
        settings.errorCode = 0;
        var tiers = [],
            k = key.toString(), // ensure string
            v = value.toString(), // ensure string
            z = 0,
            count = 0,
            arr = [];
        if (this.isRunning()) {
            if (isReadOnly(k)) {
                debug(settings.prefix + ": This " + k + " is read only", 4);
                settings.errorCode = 404;
                return "false";
            }
            tiers = k.split(".");
            //debug(settings.prefix + ": Tiers " + tiers[1], 4);
            switch (tiers[0]) {
            case "cmi":
                switch (key) {
                case "cmi.location":
                    if (v.length > 1000) {
                        debug(settings.prefix + ": Some LMS's might truncate your bookmark as you've passed " + v.length + " characters of bookmarking data", 2);
                    }
                    break;
                case "cmi.completion_status":
                    if (completion_status.indexOf('|' + v + '|') === -1) {
                        // Invalid value
                        return throwVocabError(key, v);
                    }
                    break;
                case "cmi.exit":
                    if (exit.indexOf('|' + v + '|') === -1) {
                        // Invalid value
                        return throwVocabError(key, v);
                    }
                    break;
                default:
                    // Need to dig in to some of these lower level values
                    switch (tiers[1]) {
                    case "comments_from_lms":
                        settings.errorCode = "404";
                        settings.diagnostic = "The cmi.comments_from_lms element is entirely read only.";
                        return 'false';
                    case "comments_from_learner":
                        // Validate
                        if (cmi.comments_from_learner._children.indexOf(tiers[3]) === -1) {
                            return throwVocabError(key, v);
                        }
                        setData(k.substr(4, k.length), v, cmi);
                        cmi.comments_from_learner._count = (getObjLength(cmi.comments_from_learner) - 2).toString(); // Why -1?  _count and _children
                        return 'true';
                    case "interactions":
                        // Validate
                        if (cmi.interactions._children.indexOf(tiers[3]) === -1) {
                            return throwVocabError(key, v);
                        }
                        //debug(settings.prefix + ": Checking Interactions .... " + getObjLength(cmi.interactions), 4);
                        cmi.interactions._count = (getObjLength(cmi.interactions) - 2).toString(); // Why -2?  _count and _children
                        // Check interactions.n.objectives._count
                        // This one is tricky because if a id is added at tier[3] this means the objective count needs to increase for this interaction.
                        // Interactions array values may not exist yet, which is why its important to build these out ahead of time.
                        // this should work (Subtract _count, and _children)
                        if (isNaN(parseInt(tiers[2], 10))) {
                            return 'false';
                        }
                        // Interactions uses objectives and correct_repsponses that need to be constructed.
                        // Legal build of interaction array item
                        if (!$.isPlainObject(cmi.interactions[tiers[2]])) {
                            if (tiers[3] === "id") {
                                cmi.interactions[tiers[2]] = {};
                                setData(k.substr(4, k.length), v, cmi);
                                cmi.interactions._count = (getObjLength(cmi.interactions) - 2).toString(); // Why -2?  _count and _children
                                if (!$.isPlainObject(cmi.interactions[tiers[2]].objectives)) {
                                    // Setup Objectives for the first time
                                    debug(settings.prefix + ": Constructing objectives object for new interaction", 4);
                                    cmi.interactions[tiers[2]].objectives = {};
                                    cmi.interactions[tiers[2]].objectives._count = "-1";
                                }
                                // Wait, before you go trying set a count on a undefined object, lets make sure it exists...
                                if (!$.isPlainObject(cmi.interactions[tiers[2]].correct_responses)) {
                                    // Setup Objectives for the first time
                                    debug(settings.prefix + ": Constructing correct responses object for new interaction", 4);
                                    cmi.interactions[tiers[2]].correct_responses = {};
                                    cmi.interactions[tiers[2]].correct_responses._count = "-1";
                                }
                                return 'true';
                            }
                            debug("Can't add interaction without ID first!", 3);
                            return 'false';
                            // throw error code
                        }
                        // Manage Objectives
                        if (tiers[3] === 'objectives') { // cmi.interactions.n.objectives
                            // Objectives require a unique ID
                            if (tiers[5] === "id") {
                                count = parseInt(cmi.interactions[tiers[2]].objectives._count, 10);
                                for (z = 0; z < count; z += 1) {
                                    if (cmi.interactions[tiers[2]].objectives[z].id === v) {
                                        return throwGeneralSetError(key, v, z);
                                        //settings.errorCode = "351";
                                        //settings.diagnostic = "The objectives.id element must be unique.  The value '" + v + "' has already been set in objective #" + z;
                                    }
                                }
                            } else {
                                return throwVocabError(key, v);
                            }
                            setData(k.substr(4, k.length), v, cmi);
                            cmi.interactions[tiers[2]].objectives._count = (getObjLength(cmi.interactions[tiers[2]].objectives) - 1).toString(); // Why -1?  _count
                            return 'true';
                        }
                        // Manage Correct Responses
                        if (tiers[3] === 'correct_responses') {
                            // Validate Correct response patterns
                            setData(k.substr(4, k.length), v, cmi);
                            cmi.interactions[tiers[2]].correct_responses._count = (getObjLength(cmi.interactions[tiers[2]].correct_responses) - 1).toString(); // Why -1?  _count
                        }
                        setData(k.substr(4, k.length), v, cmi);
                        cmi.interactions._count = (getObjLength(cmi.interactions) - 2).toString(); // Why -2?  _count and _children
                        return 'true';
                        //break;
                    case "objectives":
                        // Objectives require a unique ID, which to me contradicts journaling
                        if (tiers[3] === "id") {
                            count = parseInt(cmi.objectives._count, 10);
                            for (z = 0; z < count; z += 1) {
                                if (cmi.objectives[z].id === v) {
                                    settings.errorCode = "351";
                                    settings.diagnostic = "The objectives.id element must be unique.  The value '" + v + "' has already been set in objective #" + z;
                                    return 'false';
                                }
                            }
                        }
                        // End Unique ID Check
                        // Now Verify the objective in question even has a ID yet, if not throw error.
                        if (tiers[3] !== "id") {
                            arr = parseInt(tiers[2], 10);
                            if (cmi.objectives[arr] === undefined) {
                                settings.errorCode = "408";
                                settings.diagnostic = "The objectives.id element must be set before other elements can be set";
                                return 'false';
                            }
                        }
                        // END ID CHeck
                        if (isNaN(parseInt(tiers[2], 10))) {
                            return 'false';
                            // throw error code
                        }
                        setData(k.substr(4, k.length), v, cmi);
                        cmi.objectives._count = (getObjLength(cmi.objectives) - 2).toString(); // Why -2?  _count and _children
                        return 'true';
                    }
                    break;
                    // More reinforcement to come ...
                }
                // Rip off 'cmi.' before we add this to the model
                setData(k.substr(4, k.length), v, cmi);
                break;
            case "ssp":
                // Still to do (build off cmi work)
                break;
            case "adl":
                // Still to do (build off cmi work)
                break;
            }
            return "true";
        }
        // Determine Error Code
        if (settings.terminated) {
            settings.errorCode = 133;
        } else {
            settings.errorCode = 132;
        }
        return "false";
    };
    /**
     * Commit (SCORM)
     * Typically empty, I'm unaware of anyone ever passing anything.
     * @returns {String} "true" or "false"
     */
    this.Commit = function () {
        debug(settings.prefix + ": Commit CMI Object:", 4);
        debug(cmi);
        debug(settings.prefix + ": Suspend Data Usage " + suspendDataUsageStatistic());
        $(self).triggerHandler({
            type:        "StoreData",
            runtimedata: cmi
        });
        return 'true';
    };
    /**
     * Terminate
     * @returns {String}
     */
    this.Terminate = function () {
        // Could do things here like a LMS
        self.Commit();
        settings.terminated = 1;
        settings.initialized = 0;
        return 'true';
    };
    /**
     * GetErrorString (SCORM) - Returns the error string from the associated Number
     * @param param number
     * @returns string
     */
    this.GetErrorString = function (param) {
        if (param !== "") {
            var nparam = parseInt(param, 10);
            if (errors[nparam] !== undefined) {
                return errors[nparam];
            }
        }
        return "";
    };
    /**
     * GetLastError (SCORM) - Returns the error number from the last error
     * @returns {Number}
     */
    this.GetLastError = function () {
        return settings.errorCode;
    };
    /**
     * Get Diagnostic
     * This would return further information from the lms about a error
     * @returns {String} description of error in more detail
     */
    this.GetDiagnostic = function () {
        return settings.diagnostic;
    };
}