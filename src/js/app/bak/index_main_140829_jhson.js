// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "owlcarousel", "iscroll", "sammy", "mobilebase", "navbar", "order", "myorder", "contents", "member", "board", "mypage"], 
	function($, carousel, ko, koutil, json, bootstrap, owlcarousel, iScroll, sammy, mobilebase, navbar, order, myorder, contents, member, board, mypage) {

	function MVModel(pmid, pkword) {
		var self = this;
		//self.mnamehello = (window.m.mb_name) ?  ko.observable(window.m.mb_name) : ko.observable();
		//console.log( self.mnamehello() );
		//self.mname = ko.observable(window.m.mb_name).extend({logChange: "회원성명~"});
		//self.skword = ko.observable(pkword).extend({logChange: "검색어~"});		
		//self.mid = ko.observable(pmid).extend({logChange: "아이디~"});
		//self.mpw = ko.observable().extend({logChange: "비밀번호~"});
		//self.mrememberid = ko.observable().extend({logChange: "아이디 저장~"});
		//self.madmpw = ko.observable().extend({logChange: "관리자 비번~"});
		//self.searcheditems = ko.observableArray();
		//self.mainbanner = ko.observableArray();
		
		// 메인화면 데이터 바인딩 객체 초기화 - 2014.07.07 by jhson
		self.main = {
			jqMain: $("#view_main"),
			jqAd: $("#owlca_ad"),
			jqBooks: $("#owlca_books"),                 
			/*
			// owl caroulse 는 knockout으로 binding 되지 않기에 삭제 함.
			ad: ko.observableArray(),
			books: ko.observableArray(),
			*/
			event: new m.eventData(),
			exam: ko.observableArray(),
			notice: new m.bbsListData(),
			news: new m.bbsListData(),
			isMain: ko.observable(true),
			init: function(){
				if ((m.web_param.view_type === "") || (m.web_param.view_type === "main")){
					//self.showLoadingModal();
				}
				// owl carousel initialize //////////////////////////
				self.main.jqAd.owlCarousel({
					autoPlay: 3000,
					
					items: 1,
					itemsDesktop : [ 1199, 1 ],
					itemsDesktopSmall : [ 979, 1 ],
					itemsMobile : [479,1],
					itemsTablet: [768,1],
					afterMove: function(owlca){
						//onsole.log(owlca);
					}
				});
				
				// FIXME: 삭제 예정
				if (m.mb_id !== "sd_yotimer"){
					self.main.jqAd.click( self.main.onBannerClick );
					self.main.jqBooks.click( self.main.onBannerClick );
				}
				
				self.main.jqBooks.owlCarousel({
					autoPlay: 4000,
					
					items: 6,
					itemsDesktop : [1199,6],
				    itemsDesktopSmall : [980,5],
				    itemsTablet: [768,4],
				    itemsTabletSmall: [699,3],
				    itemsMobile : [450,2]
				});
				
				$("#owlca_books").siblings(".prev").click(function(){
					self.main.jqBooks.data("owlCarousel").prev();
					return false;
				});
				$("#owlca_books").siblings(".next").click(function(){
					self.main.jqBooks.data("owlCarousel").next();
					return false;
				});
				
				$(window).on("m.slidechanged", function(empty, e){
					if (self.main.jqMain.get(0) === e.target){
						self.main.isMain( true );
					}
					else{
						self.main.isMain( false );
					}
				});
				
				// 팝업 초기화부
				try{
					$("#modal_popup .btn-popup-close-not-today").click(function(){
						m.cookie.set("popup_not_today", "true", 24, "m.sdedu.co.kr");
					});
					$("#modal_popup").get(0).addEventListener("touchmove", function(e){
						e.preventDefault();
						return false;
					}, false);
				}
				catch(e){}
				
				
				$.getJSON("/mobile/mb/main.php", function(data){
					console.log(data);
					if(self.nav){
						self.nav.setData( data.cate );
					}
					
					self.main.setData(data);
					self.hideLoadingModal();
					
					if ((m.web_param.view_type === "main") && 
						(m.cookie.get("popup_not_today") !== "true") &&
						(m.web_param.cat_id === "")){
						self.showPopup();
					}
					
					self.main.onMainDataLoaded(data);
				});
				
				// 하단 푸터 네비게이션 열기/닫기 버튼
				$("#button_footerNavCloser").click(function(){
					var jqThis = $(this);
					var jqFooterButton = $("#button_myMenuOpener, #button_gotoTop");
					var jqFooterMargin = $(".footer-float-nav-margin");
					
					if(jqFooterButton.hasClass("down") === false){
						jqFooterButton.animate({
							"bottom": "-=55px"
						}, function(){
							$(this).toggleClass("down");
							jqFooterMargin.css("height", "0px");
						});
					}
					else{
						jqFooterButton.animate({
							"bottom": "+=55px"
						}, function(){
							$(this).toggleClass("down");
							jqFooterMargin.css("height", "66px");
						});
					}
					
					jqThis.toggleClass("bg-f-nav-close");
					jqThis.toggleClass("bg-f-nav-open");
					$(this).next().slideToggle();
					
					//55px
					return false;
				}).trigger("click");
				
				/*
				try{
					m.sammy.urichange(function(params){
						self.doClickBoard(params);
					});
				}
				catch(e){}
				*/
			},/////// init function end ::::::::::::::::::::::::::::::::::::::::::::::::
			
			setData : function(data){
				var owl = self.main.jqAd.data("owlCarousel");
				var sTags = "";
				var sDomain = "http://image.sdedu.co.kr";
				
				self.main.jqAd.empty();
				$.map(data.bn, function(item){
					//console.log(item);
					owl.addItem( self.makeOwlcaItem(
						sDomain + "/data/cm_shop/banner/" + item.bn_file, 
						"#contents/lec/" + m.findBookCateByLecCate( item.lec_cat_id ).book_cate + "/" + item.lec_cat_id + "/" + item.cat_name//( (m.lecCateInfo[ item.cat_id ])? m.lecCateInfo[ item.cat_id ].name : "컨텐츠 검색" )
						//item.bn_url/*,
						//self.getViewButton( item.type )*/
						 ) );
				});
				
				owl = self.main.jqBooks.data("owlCarousel");
				self.main.jqBooks.empty();
				$.map(data.best, function(item){
					var iDcRate = self.dcRate(item.it_price, item.it_sug_price);
					
					owl.addItem( self.makeOwlcaItem( 
						sDomain + "/data/cm_shop/book/" + item.it_id + "/" + item.it_file_l, 
						"#contents/book/" + item.it_id,// + "&cat_id=" + item.cat_id,
						"<br/><span><b>" + item.it_name + "<br/>" +
						"</b><br/>" +
						"<strong class=\"text-danger\">&#8361;" + self.numberFormat(item.it_price) + "(" + iDcRate + "%할인)</strong></span>"
						 ) );
				});
				
				self.main.event.set( data.event );
				self.main.exam.removeAll();
				$.map(data.exam, function(item){
					self.main.exam.push( new m.examListData( item ) );
				});
				
				self.main.notice.set( data.notice );
				self.main.news.set( data.news );
				
			},
			
			onBannerClick: function(e){
				var jqAnchor = null;
				var jqTarget = $(e.target);
				var saHref = "";
				var sItId = "";
				
				if (jqTarget.prop("tagName") === "IMG"){
					jqAnchor = jqTarget.parent();
				}
				else{
					jqAnchor = jqTarget.parentsUntil("a").parent();
				}
				
				try{
					e.currentTarget = jqAnchor.get(0);
					self.onClickBoard(self, e);
					/*
					saHref = jqAnchor.attr("href").split("/");
					sItId = saHref[ saHref.length - 1 ];
										
					self.contents.searchBook( sItId, function(){
						m.slideLeft( $(".active-view"), $(".view_bookDetail") );
					} );
					*/
				}
				catch(e){}
			},
			
			evt_maindataloaded : null,
			maindataloaded : function(callback){
				this.evt_maindataloaded = callback;
			},
			onMainDataLoaded : function(data){
				try{
					this.evt_maindataloaded(data);
				}
				catch(e){}
			}
		};
		
		
		self.makeOwlcaItem = function(imgSrc, href, customTags){
			return "<div class=\"item\">"+
						"<a href=\"" + href + "\">"+
							"<img alt=\"\" src=\"" + imgSrc + "\"/>"+
							((customTags !== undefined)? customTags : "") + 
						"</a>"+
					"</div>";
		};
		self.getViewButton = function(type){
			var jqButton = null;
			if (type === "movie"){
				jqButton = $("#wrap_adViewButtons").find(".btn-movie").clone();
			}
			else{
				jqButton = $("#wrap_adViewButtons").find(".btn-book").clone();
			}
			
			return $("<div/>").append( jqButton ).html();
		};
		
		
		/*
		self.numberFormat = function(num) {
			var pattern = /(-?[0-9]+)([0-9]{3})/;
			while(pattern.test(num)) {
				num = num.replace(pattern,"$1,$2");
			}
			return num;
		};
		self.dcRate = function(price, sugPrice){
			var iSugPrice = parseInt( sugPrice );
			var iPrice = parseInt( price );
			return Math.floor( ((iSugPrice - iPrice) / iSugPrice) * 100 );
		};
		self.earnRate = function(price, resPrice){
			var iResPrice = parseInt( resPrice );
			var iPrice = parseInt( price );
			return Math.floor( ((iResPrice / iPrice) * 100) );
		};
		*/
		/*
		self.loginme = function(data,event) {			
			if(self.mid()=='' || self.mid().length<2 || self.mpw()=='' || self.mpw().length<2) {alert("아이디와 비밀번호를 입력하시기 바랍니다"); return;}			
			var param = {crudtype: 'R', mb_id: self.mid, mb_password: self.mpw ,auto_login: self.mrememberid, adm_password: self.madmpw , rememberid: self.mrememberid };
			//console.log(self.mid);
			$.getJSON("./mb/login_check.php",param, function(r, txtstatus) {
				//console.table(r);
				if(r['status'][0].status!=1) {alert(r['status'][0].msg); return;}
				//self.mname = ko.observable(r['mb'][0].mb_name).extend({logChange: "회원성명~"});
				self.mnamehello( r['mb'][0].mb_name+"님! 안녕하세요.");
				//console.log("asdfsad="+self.mname() );
				$('#logindiv').hide();$('.logoutdiv').show();
			}).fail(function(d, textStatus, error) {
				console.log("get =="+d);	
					alert('에러가 발생하였습니다. 동일 증상이 지속되면 고객센터로 문의 주시기 바랍니다.');
			});
			//this.currentPage = ko.observable(1);
			
		};
		
		
		self.searchkword = function(data,event) {
			//event.preventDefault();
			if(self.skword()=='' || self.skword().length<2) {alert("강의, 도서, 저자, 강사 등의 검색어를 2자 이상 입력하시기 바랍니다"); return;}
			var param = {crudtype: 'R', keywd: self.skword };
			var jqxhr = $.getJSON("./item/searchItem.php",param, function(r, txtstatus) {
				//console.log(r);
				if(r[0].result!=1) alert(r[0].msg);
				self.mainbanner.removeAll();
				$.map(r[0].mainbanner.list, function(item) {self.mainbanner.push(item);}); //new mdataapp.setMdata(item))});
				
				//self.searcheditems = ko.observableArray(r[0].b_list);
				self.searcheditems.removeAll();
				$.map(r[0].b_list, function(item) {self.searcheditems.push(item);}); //new mdataapp.setMdata(item))});
				

				//var allDatav = JSON.parse(allData);
				//console.table(self.searcheditems());
				//console.log(r[0].result);
				$('.carousel').carousel({
				  interval: 2000
				});
			}).fail(function(d, textStatus, error) {
				console.log("get =="+d);	
					alert('에러가 발생하였습니다. 동일 증상이 지속되면 고객센터로 문의 주시기 바랍니다.');
			});
			jqxhr.complete(function() {
				//$('.carousel').carousel({
				//  interval: 1000
				//});
			});
		};
		self.clickSearchItem = function(pitem) {
			//self.searcheditems.remove(pitem)
			console.table(pitem);
			
		};
		*/
		self.main.init();
		
		
		//////////////////////////////////////////////////////////////
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//////////////////////////////////////////////////////////////
		

	}// main model end :::::::::::::::::::::::::
	MVModel.prototype = new m.BaseViewModel();
	MVModel.prototype.constructor = MVModel;
	
	
	m.MVModel = MVModel;

	function setMBdata(mbname, mbid) {
		console.log("setMbdata---"+mbname);		
        var self = new m.MVModel();
		self.mname = ko.observable(mbname);
		self.mid = ko.observable(mbid);			
	}
	m.setMBdata = setMBdata;
	
	// 광고 배너 정보 데이터 부분 - 2014.07.07 - by jhson [시작]
	m.bannerDataKeys = [
		"bn_cnt",
		"bn_file",
		"bn_sort",
		"bn_subject",
		"bn_type",
		"bn_url",
		"cat_id"
	];
	m.bannerData = function(data){
		var self = this;
		var iLen = m.bannerDataKeys.length;
		var aProp = m.bannerDataKeys;
		
		if(data){
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( data[ aProp[i] ] );
			}
		}
		else{
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( "" );
			}
		}

		self.set = function(data){
			if(data){
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( data[ aProp[i] ] );
				}
			}
			else{
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( "" );
				}
			}
		};
	};
	// 광고 배너 정보 데이터 부분 - 2014.07.07 - by jhson [종료]
	
	// 도서추천상품 정보 데이터 부분 - 2014.07.07 - by jhson [시작]
	m.bookDataKeys = [
		"cat_id",
		"it_file_l",
		"it_id",
		"it_name",
		"it_price",
		"it_sug_price"
	];
	m.bookData = function(data){
		var self = this;
		var iLen = m.bookDataKeys.length;
		var aProp = m.bookDataKeys;
		
		if(data){
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( data[ aProp[i] ] );
			}
		}
		else{
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( "" );
			}
		}
		
		self.set = function(data){
			if(data){
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( data[ aProp[i] ] );
				}
			}
			else{
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( "" );
				}
			}
		};
		
		self.getDcRate = function(){
			return 0;
		};
	};
	// 도서추천상품 정보 데이터 부분 - 2014.07.07 - by jhson [종료]
	
	// 이벤트 정보 데이터 부분 - 2014.07.08 - by jhson [시작]
	m.eventDataKeys = [
		"wr_subject",
		"bf_file",
		"wr_id"
	];
	m.eventData = function(data){
		var self = this;
		var iLen = m.eventDataKeys.length;
		var aProp = m.eventDataKeys;
		
		self.bf_file_path = "/data/file/event/";
		
		if(data){
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable(self.bf_file_path +  data[ aProp[i] ] );
			}
		}
		else{
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( "" );
			}
			self.bf_file( m.img.none );
		}

		self.set = function(data){
			if(data){
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ](self.bf_file_path +  data[ aProp[i] ] );
				}
			}
			else{
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( "" );
				}
				self.bf_file( m.img.none );
			}
		};
	};
	// 이벤트 정보 데이터 부분 - 2014.07.08 - by jhson [종료]
	
	// 게시판 정보 데이터 부분 - 2014.07.07 - by jhson [시작]
	m.bbsListDataKeys = [
		"wr_subject",
		"wr_id"
	];
	m.bbsListData = function(data){
		var self = this;
		
		var iLen = m.bbsListDataKeys.length;
		var aProp = m.bbsListDataKeys;
		
		if(data){
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( data[ aProp[i] ] );
			}
		}
		else{
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( "" );
			}
		}
		
		self.set = function(data){
			if(data){
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( data[ aProp[i] ] );
				}
			}
			else{
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( "" );
				}
			}
		};
	};
	// 게시판 정보 데이터 부분 - 2014.07.07 - by jhson [종료]
	
	// 시험 정보 데이터 부분 - 2014.07.08 - by jhson [시작]
	m.examListDataKeys = [
		"ES_wrsdate",
		"wr_subject",
		"wr_id"
	];
	m.examListData = function(data){
		var self = this;
		
		var iLen = m.examListDataKeys.length;
		var aProp = m.examListDataKeys;
		
		if(data){
			var sProp = "";
			for(var i = 0; i < iLen; i++){
				sProp = aProp[i];
				if (sProp === "ES_wrsdate"){
					self[ sProp ] = ko.observable( data[ sProp ].replace("-", ".") );
				}
				else{
					self[ sProp ] = ko.observable( data[ sProp ] );
				}
			}
		}
		else{
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( "" );
			}
		}
		
		self.set = function(data){
			var sProp = "";
			if(data){
				for(var i = 0; i < iLen; i++){
					if (sProp === "ES_wrsdate"){
						self[ aProp[i] ]( data[ aProp[i] ].replace("-", ".") );
					}
					else{
						self[ aProp[i] ]( data[ aProp[i] ] );
					}
				}
			}
			else{
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( "" );
				}
			}
		};
	};
	// 시험 정보 데이터 부분 - 2014.07.08 - by jhson [종료]
	
	function App(){
		this.run = function(){
			
			if ((m.NavModel === undefined) ||
				(m.OrderModel === undefined) ||
				(m.MyOrderModel === undefined) ||
				(m.BoardModel === undefined) ||
				(m.MemberModel === undefined) ||
				(m.MyPageModel === undefined) ||
				(m.ContentsModel === undefined)
				
				){
				throw "some models are undefined.";
			}
			if (m.binded === true) return;
			
			var vm = new m.MVModel();
			var vmNav = new m.NavModel();
			var vmOrder = new m.OrderModel();
			var vmMyOrder = new m.MyOrderModel();
			var vmBoard = new m.BoardModel();
			var vmMember = new m.MemberModel();
			var vmMyPage = new m.MyPageModel();
			var vmContents = new m.ContentsModel();
			
			//try{
				$.extend(vm, vmNav);
				$.extend(vm, vmOrder);
				$.extend(vm, vmMyOrder);
				$.extend(vm, vmBoard);
				$.extend(vm, vmMember);
				$.extend(vm, vmMyPage);
				$.extend(vm, vmContents);
				
				vm.main.maindataloaded( function(data){
					if (m.web_param.cat_id !== ""){
						var mParam = {};
						var mCate = data.cate;
						var mSubCateList = null;
						var mSubCate = null;
						var aSubSubCate = null;
						var sCatId = m.web_param.cat_id;
						var eow = false;
						var iLenSubCate = 0;
						var mCateResult = null;
						
						mParam.view_type = "contents";
						mParam.name = "all";
						
						if (m.web_param.it_type === "0"){
							for(var cate1 in mCate){
								mSubCateList = mCate[cate1].sub_cat;
								for (var cate2 in mSubCateList){
									mSubCate = mSubCateList[ cate2 ];
									aSubSubCate = mSubCate.sub_cat;
									iLenSubCate = aSubSubCate.length;
									
									for(var i = 0; i < iLenSubCate; i++){
										if (aSubSubCate[i].cat_id === sCatId ){
											mParam.bbsId = sCatId;
											mParam.subId = (m.lecCateInfo.hasOwnProperty( sCatId ))? m.lecCateInfo[ sCatId ].lec_cate : "";
											mParam.keyword = aSubSubCate[i].cat_name;
											eow = true;
											break;
										}
									}
								}
								
								if (eow === true){
									break;
								}
							}
						}
						else if (m.web_param.it_type === "1"){
							mCateResult = m.findBookCateByLecCate( m.web_param.cat_id );
							mParam.bbsId = mCateResult.book_cate;
							mParam.subId = mCateResult.lec_cate;
							mParam.keyword = mCateResult.name;
						}
						
						vm.doClickBoard(mParam);
						m.viewSlider.push( $("#view_main") );
					}
				});
				
				vm.contents.submitorder( function(sendData, isBuy){
					var hasLogin = vm.member.hasLogin();
					var isBuy = (isBuy === undefined)? false : isBuy;
					
					// FIXME: 삭제 예정
					if (m.mb_id === "sd_yotimer"){
						if (hasLogin === true){
							location.href = "#order/cartlist" + ((isBuy === true)? "/buy" : "");
						}
						else{
							location.href = "#member/login" + ((isBuy === true)? "/buy" : "");
							m.viewSlider.push(param);
						}
					}
					else{
						if (hasLogin === true){
							vm.order.load(sendData);
							vm.order.show(isBuy);
						}
						else{
							vm.member.moveViewByParam({
								view_type: "member",
								name: "login"
							});
							m.viewSlider.push(param);
						}
					}
									
					if (hasLogin === true){
						if (m.mb_id === "sd_yotimer"){
							location.href = "#order/cartlist" + ((isBuy === true)? "/buy" : "");
							//console.log("장바구니로!");
						}
						else{
							vm.order.load(sendData);
							vm.order.show(isBuy);
						}
					}
					else{
						
						vm.member.moveViewByParam({
							view_type: "member",
							name: "login"
						});
						m.viewSlider.push(param);
					}
				});
				vm.contents.submitorderfree( function(sendData){
					var hasLogin = vm.member.hasLogin();
					//console.log("vm.contents.submitorderfree::sendData");
					//console.log(sendData);
					if ((sendData.status[0].status === "YES") && (hasLogin === true)){
						if (confirm("무료수강 신청이 완료 되었습니다.\r\n마이페이지로 이동하시겠습니까?") === true){
							vm.doClickBoard({
								view_type: "mypage",
								name: "mylec"
							});
						}
					}
					else{
						vm.member.moveViewByParam({
							view_type: "member",
							name: "login"
						});
						m.viewSlider.push(param);
					}
				});
				vm.member.loginsuccess( function(member, data){
					vm.order.member.mb_id( member.mb_id );
					//vm.mnamehello( (window.m.mb_name !== "")? (window.m.mb_name/* + "님! 안녕하세요."*/) : "" );
					
					if (data.toOtherView === "main"){
						vm.doClickBoard({
							view_type: ""
						});
					}
				} );
				vm.member.logoutsuccess( function(member){
					vm.order.member.mb_id( "" );
					//vm.mnamehello( "" );
					vm.doClickBoard({view_type: ""});
				} );
				
				vm.board.logincheck(function(){
					var hasLogin = vm.member.hasLogin();
					return hasLogin;
				});
				vm.comment.logincheck(function(){
					var hasLogin = vm.member.hasLogin();
					if (hasLogin === false){
						if (confirm("덧글을 남기기 위해서는 로그인이 필요합니다.\r\n로그인 하시겠습니까?") === true){
							//m.viewSlider.prevStack.pop();
							//m.viewSlider.push( $("#view_boardDetail") );
							//location.href = "#member/login";
							vm.member.showLogin();
						}
					}
					
					return hasLogin;
				});
				vm.memUpdate.logincheck(function(){
					var hasLogin = vm.member.hasLogin();
					return hasLogin;
				});
				vm.board.levelcheck(function(){
					var iLevel = vm.member.mb_level();
					return iLevel;
				});
				vm.board.authcheck(function(param, boardInfo){
					var isAuthOK = false;
					
					if (param.bbsId !== undefined){
						isAuthOK = vm.member.mb_level() >= boardInfo.auth.detail;
					}
					else{
						isAuthOK = vm.member.mb_level() >= boardInfo.auth.list;
					}
					
					console.log(param);
					console.log(isAuthOK);
					
					if (isAuthOK === true){
						return false;
					}
					else{
						vm.member.moveViewByParam({
							view_type: "member",
							name: "login"
						});
						m.viewSlider.push(param);
						return true;
					}
				});
				
				vm.zipcode.selected(function(data){
					if (vm.order.shown() === true){
						vm.order.member.mb_zip1( data.zip1 );
						vm.order.member.mb_zip2( data.zip2 );
						vm.order.member.mb_addr1( data.addr );
						vm.order.member.mb_addr2( "" );
					}
				});
				vm.zipcode.selected(function(data){
					if (vm.memUpdate.isVisible() === true){
						vm.memUpdate.mb_zip1( data.zip1 );
						vm.memUpdate.mb_zip2( data.zip2 );
						vm.memUpdate.mb_addr1( data.addr );
						vm.memUpdate.mb_addr2( "" );
					}
				});
				
				/*
				vm.board.loginneeded( function(params){
					var hasLogin = vm.member.hasLogin();
					
					if (hasLogin === false){
						(param.view_type === 
					}
					return false;
				} );
				*/
				var fnOnURIChange = function(param){
					m._cpiClicked = m._cpiClicked || false;
			
					console.log("index.fnOnURIChange");
					
					if (m._cpiClicked === true){
						return;
					}

					m._cpiClicked = true;
					
					setTimeout(function(){
						m._cpiClicked = false;
					}, 500);
					
					if ((param.view_type !== "board") && (param.name !== "g4_write_cs_faq")){
						$(window).scrollTop(0);
					}
					
					//console.log("index_main: vm.clickboard");
					//console.log(param);
					//alert("뜬다: " + param.view_type);
					if (param.view_type === "board"){
						vm.board.searchByParam( param );
					}
					else if (param.view_type === "contents"){
						vm.contents.searchByParam( param );
					} 
					else if (param.view_type === "member"){
						vm.member.moveViewByParam( param );
					}
					else if (param.view_type === "order"){
						if (param.name === "mocklist"){
							alert("준비중 입니다.");
						}
						else if (vm.member.hasLogin() === false){
							vm.member.moveViewByParam({
								view_type: "member",
								name: "login"
							}); 
							m.viewSlider.push(param);
						}
						else{
							if (param.name === "cartlist"){
								vm.order.load();
								if (param.bbsId === "buy"){
									vm.order.show(true);
								}
								else{
									vm.order.show();
								}
								
							}
							else if (param.name === "booklist"){
								vm.myBooks.show();
							}
							else if (param.name === "list"){
								vm.myOrder.show();
							}
						}
					}
					else if (param.view_type === "nav"){
						vm.nav.showNavByParam( param );
						return;
					}
					else if (param.view_type === "mypage"){
						if (vm.member.hasLogin() === false){
							vm.member.moveViewByParam({
								view_type: "member",
								name: "login"
							});
							m.viewSlider.push(param);
						}
						else if (param.name === "mylec"){
							vm.myLecture.showByParam( param );
						}
						else if (param.name === "coupon"){
							vm.coupon.show();
						}
						else if (param.name === "mileage"){
							vm.mileage.show();
						}
						else if (param.name === "regbook"){
							alert("준비중 입니다.");
						}
					}
					else if (param.view_type === "doc"){
						$.get("/mobile/doc/" + param.name + ".php", function(data){
							var jqViewDoc = $("#view_doc");
							
							//console.log(data);
							jqViewDoc.find("h2>span").text(param.bbsId);
							jqViewDoc.find(".article").html(data);
							m.viewSlider.left(jqViewDoc);
						});
					}
					else{
						m.viewSlider.left("#view_main");
					}
					
					vm.nav.hideMyMenu();
					vm.nav.hide();
				};
				
				if (m.mb_id !== "sd_yotimer"){
					vm.clickboard(fnOnURIChange);
				}
				else{
					console.log("uri change!! : sd_yotimer");
					m.sammy.urichange(fnOnURIChange);
				}
				
				
				$("#view_lectureContent").on("m.slidechanged", function(empty, event){
					//vm.myLecture.load();
					//console.log(empty);
					//console.log(event);
				});
				
				$("#view_boardList").on("m.slidechanged", function(empty, event){
					
					//vm.myLecture.load();
					//console.log(empty);
					//console.log(event);
				});
				
				$(".view_bookDetail").on("m.slidechanged", function(empty, event){
					var jqAnchor = $("#panel_productInfo1").find("a");
					var jqTable = $("#panel_productInfo1 table").filter(function(){
						var jqThis = $(this);
						var iWidth = $.tryParseInt( jqThis.attr("width") );
						
						if ( (iWidth > 400) && (iWidth < 700) ){
							return true;
						}
					});
					
					jqAnchor.parentsUntil("div").empty();
					jqTable.css({
						"width": "100%"
					});
				});
				
				$("#view_boardDetail").on("m.slidechanged", function(empty, event){
					var sType = vm.board.heading.type();
					
					if ((sType === "event")){
						var jqImg = $("#view_boardDetail").find(".wrap-wr-content img");
						console.log(jqImg);
						jqImg.css({
							"width": "100%",
							"height": "auto"
						});
					}
				});
				$("#view_boardDetail").on("m.sameslidefound", function(empty, event){
					var sType = vm.board.heading.type();
					
					if ((sType === "event")){
						var jqImg = $("#view_boardDetail").find(".wrap-wr-content img");
						console.log(jqImg);
						jqImg.css({
							"width": "100%",
							"height": "auto"
						});
					}
				});
				/*
				$(window).on("m.slidechanged", function(empty, event){
					console.log(empty);
					console.log(event);
				});
				*/
				m.vm = vm;
				$(".heading-contents").append( 
					$("<a href=\"#\" class=\"_gotoback\"></a>").click(function(){
					m.viewSlider.prev();
				}));
				
				ko.applyBindings(vm);
				m.binded = true;
				
				if (m.web_param.view_type !== "main"){
					m.vm.doClickBoard(m.web_param);
					m.viewSlider.push( $("#view_main") );
				}
				else if (m.web_param.cat_id !== ""){
					
				}
				//console.log( vm ) ;
			//}
			//catch(e){}
		};
	}
	m.App = App;
	

	$(function(m, $, ko){
		var app = new m.App();
		app.run();
	}(window.m, $, ko));
});