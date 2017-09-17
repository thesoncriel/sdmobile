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
requirejs._appJsRoot = "http://js.sdedu.co.kr/mobile/js";
requirejs.config({
    "baseUrl": requirejs._appJsRoot + "/lib/min",
    "paths": {
      "jquery": "jquery-2.1.1.min",
      "bootstrap": requirejs._appJsRoot + "/bootstrap/min/bootstrap.min",
      "carousel": requirejs._appJsRoot + "/bootstrap/min/carousel.min",
      "knockout": "knockout-3.2.0.min",
      "knockoututils": "knockoututils.min",
      "knockoutdebug": "knockout-3.2.0.debug.min",
      "knockoutmap": "knockout.mapping.2.4.1.min",
      "jqueryfinger": "jquery.finger.min",			// 터치 이벤트 추가용
      "owlcarousel": "owl.carousel.min",			// 메인 상단 배너 및 도서 소개쪽 반응형 슬라이더 추가용
      "iscroll": "iscroll.min",				// 좌측 팝업 메뉴의 터치 스크롤 적용
      "sammy": "sammy-0.7.6.min",  
      //"kcaptcha" : "/mobile/js/lib/jquery.kcaptcha",  //자동등록방지
      "recaptcha": 	"http://www.google.com/recaptcha/api/js/recaptcha_ajax",// recaptcha ajax library
      "receipt": 	"http://pgweb.uplus.co.kr/WEB_SERVER/js/receipt_link",	// 현금영수증 출력용 라이브러리
      "mobilebase": requirejs._appJsRoot + "/app/min/mobile_base.min",							// 시대에듀 모바일의 View Model 에서 자주 쓰이는 기능들을 한데 모아놓은 Base Class 및 유틸
      "autocomplete": requirejs._appJsRoot + "/app/min/autocomplete.min",						// 자동완성 및 최근 검색어 기능 컨트롤러
      "navbar": 	requirejs._appJsRoot + "/app/min/navbar.min", 						// 좌측 팝업 메뉴 - 카테고리 & 마이메뉴 기능 커트롤러
      "order": 		requirejs._appJsRoot + "/app/min/order_main.min",							// 장바구니 및 주문결제 페이지 컨트롤러
      "myorder": 	requirejs._appJsRoot + "/app/min/myorder_main.min",  				// 내 구매내역 및 내도서 페이지 컨트롤러
      "contents": 	requirejs._appJsRoot + "/app/min/contents_main.min", 				// 도서, 동영상 검색 및 리스트와 상세보기 관련 컨트롤러
      "member": 	requirejs._appJsRoot + "/app/min/member_main.min",							// 로그인, ID 및 비밀번호 찾기 등 멤버 관련 기능 컨트롤럴
      "board": 		requirejs._appJsRoot + "/app/min/board_main.min",					// 게시판 기능 컨트롤러
      "mypage": 	requirejs._appJsRoot + "/app/mypage_main",							// 내 동영상 화면 기능 컨트롤러
      "event": 		requirejs._appJsRoot + "/app/_event"								// 일회성 이벤트용 스크립트 코드 
    },
	"shim": {
		"carousel": 	["jquery"],
		"bootstrap": 	["jquery"],
		"jqueryfinger": ["jquery"],
		"owlcarousel": 	["jquery"],
		"sammy": 		["jquery"],
		//"kcaptcha": 	["jquery"],
		"mobilebase": 	["jquery", "sammy"],
		"navbar": 		["jquery", "knockout", "jqueryfinger", "iscroll", "mobilebase"],
		"order": 		["jquery", "knockout", "jqueryfinger", "mobilebase"],
		"myorder": 		["jquery", "knockout", "jqueryfinger", "mobilebase"],
		"contents": 	["jquery", "knockout", "jqueryfinger", "mobilebase"],
		"member": 		["jquery", "knockout", "jqueryfinger", "mobilebase"],
		"board": 		["jquery", "knockout", "jqueryfinger", "mobilebase"],
		"mypage": 		["jquery", "knockout", "jqueryfinger", "mobilebase"],
		"event": 		["jquery", "knockout", "jqueryfinger", "mobilebase"]
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
requirejs([requirejs._appJsRoot + "/app/index_main.js" ]);