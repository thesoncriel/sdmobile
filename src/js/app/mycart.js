
requirejs.config({
    "baseUrl": "/mobile/js/lib/min",
    "paths": {
      "jquery": "jquery-2.1.1.min",
      "bootstrap": "/mobile/js/bootstrap/min/bootstrap.min",
      "carousel": "/mobile/js/bootstrap/min/carousel.min",
      "knockout": "knockout-3.1.0.min",
      "knockoututils": "knockoututils.min",
      "knockoutdebug": "knockout-3.1.0.debug.min",
      "knockoutmap": "knockout.mapping.2.4.1.min",
      "uisub": "/mobile/js/app/order_uisub"
    },		
	"shim": {
		"carousel": ["jquery"],
		"bootstrap": ["jquery"],
        /*"jquerycarousel": {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: [	"jquery", 
					"carousel"],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: "jquerycarousel"	
        }//*/
    } 
});
requirejs.onError = function (err) {
    console.log(err.requireType);
    if (err.requireType === 'timeout') {
        console.log('모듈 로딩 오류 발생---modules: ' + err.requireModules);
    }
    throw err;
};
      //"jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min"

// Load the main app module to start the app
//requirejs(["/mobile/js/app/index_main"]);


window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "uisub"], function($, carousel, ko, koutil, json, bootstrap) {
	
	$(function(m, $, ko){
		//m.setMBdata(m.mb_name, m.mb_id);	
	}(window.m, $, ko));
	
	
});