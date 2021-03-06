// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 

/*
<script src="./js/lib/min/jquery-2.1.1.min.js"></script>
<script src="./js/bootstrap/min/bootstrap.min.js"></script>
<script src='./js/lib/min/knockout-3.1.0.min.js'></script>
<script src='./js/lib/min/knockout.mapping.2.4.1.min.js'></script>

      "bootstrap": "lib/min/bootstrap.min",
      "json2": "lib/min/json2.min",
*/
/*
requirejs.isOldIE = function(){
	var dVersion = 0.0;
	
	if (navigator.appName === "Microsoft Internet Explorer"){
		var sUserAgent = navigator.userAgent;
		var regexCheck = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (regexCheck.exec(sUserAgent) !== null){
			dVersion = parseFloat( RegExp.$1 );
			
			if (dVersion < 9.0){
				return true;
			}
		}
	}
	
	return false;
};
*/

requirejs.config({
    "baseUrl": "/mobile/js/lib/min",
    "paths": {
      "jquery": "jquery-2.1.1.min",
      "bootstrap": "/mobile/js/bootstrap/min/bootstrap.min",
      "carousel": "/mobile/js/bootstrap/min/carousel.min",
      "knockout": "knockout-3.1.0.min",
      "knockoututils": "knockoututils.min",
      "knockoutdebug": "knockout-3.1.0.debug.min",
      "knockoutmap": "knockout.mapping.2.4.1.min"
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
requirejs(["/mobile/js/app/order_main.js"]);