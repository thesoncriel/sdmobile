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
      "jqueryfinger": "jquery.finger.min",			// 터치 이벤트 추가용
      "owlcarousel": "owl.carousel.min",			// 메인 상단 배너 및 도서 소개쪽 반응형 슬라이더 추가용
      "iscroll": "iscroll.min",				// 좌측 팝업 메뉴의 터치 스크롤 적용
      //"sammy": "/mobile/js/lib/sammy.min",
	  "recaptcha": "http://www.google.com/recaptcha/api/js/recaptcha_ajax",
      "mobilebase": "/mobile/js/app/mobile_base",	// 시대에듀 모바일의 View Model 에서 자주 쓰이는 기능들을 한데 모아놓은 Base Class 및 유틸
      "navbar": "/mobile/js/app/navbar", 			// 좌측 팝업 메뉴 - 카테고리 & 마이메뉴 기능 커트롤러
      "order": "/mobile/js/app/order_main",			// 장바구니 및 주문결제 페이지 컨트롤러
      "myorder": "/mobile/js/app/myorder_main",  	// 내 구매내역 및 내도서 페이지 컨트롤러
      "contents": "/mobile/js/app/contents_main", 	// 도서, 동영상 검색 및 리스트와 상세보기 관련 컨트롤러
      "member": "/mobile/js/app/member_main",		// 로그인, ID 및 비밀번호 찾기 등 멤버 관련 기능 컨트롤럴
	  "member_update": "/mobile/js/app/member_update",		// 로그인, ID 및 비밀번호 찾기 등 멤버 관련 기능 컨트롤럴	 
      "board": "/mobile/js/app/board_main",			// 게시판 기능 컨트롤러
      "mylec": "/mobile/js/app/mylec_main"			// 내 동영상 화면 기능 컨트롤러
    },
	"shim": {
		"carousel": ["jquery"],
		"bootstrap": ["jquery"],
		"jqueryfinger": ["jquery"],
		"owlcarousel": ["jquery"],
		"mobilebase": ["jquery"],		
		"navbar": ["jquery", "knockout", "jqueryfinger", "iscroll", "mobilebase"],
		"order": ["jquery", "knockout", "jqueryfinger", "mobilebase"],
		"myorder": ["jquery", "knockout", "jqueryfinger", "mobilebase"],
		"contents": ["jquery", "knockout", "jqueryfinger", "mobilebase"],
		"member": ["jquery", "knockout", "jqueryfinger", "mobilebase"],
		"member_join": ["jquery", "knockout", "jqueryfinger", "mobilebase"],
		"board": ["jquery", "knockout", "jqueryfinger", "mobilebase"],
		"mylec": ["jquery", "knockout", "jqueryfinger", "mobilebase"]
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
requirejs(["/mobile/js/app/member_update.js" ]);