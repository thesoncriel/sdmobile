// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "owlcarousel", "iscroll", "sammy", 
		"mobilebase", "navbar", "order", "myorder", "contents", "member", "board", "mypage", "autocomplete", "event"], 
	function($, carousel, ko, koutil, json, bootstrap, owlcarousel, iScroll, sammy, 
		mobilebase, navbar, order, myorder, contents, member, board, mypage, autocomplete, event) {

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
					$("*[data-close]").click(function(){
						$( $(this).data("close") ).modal("hide");
					});
					$("#modal_popup").get(0).addEventListener("touchmove", function(e){
						e.preventDefault();
						return false;
					}, false);
				}
				catch(e){}
				
				
				$.getJSON("/mobile/mb/main.json", function(data){
					console.log(data);
					if(self.nav){
						self.nav.setData( data.cate );
					}
					
					self.main.setData(data);
					try{
						//self.headline.setData(data);
						self.headline.init();
						self.hideLoadingModal();
					}
					catch(e){}
					
					try{
						if ((m.web_param.view_type === "main") && 
							((m.sammy.params.view_type === "main") || (m.sammy.params.view_type === "home")) &&
							(m.cookie.get("popup_not_today") !== "true") &&
							(m.web_param.cat_id === "")){
							self.showPopup();
						}
					}
					catch(e){
						console.log("팝업 띄우기 실패");
					}
					
					self.main.onMainDataLoaded(data);
				})
				.fail(function(event){
					console.log("main.php 로딩에 실피 했습니다.");
				});
				
				// 하단 푸터 네비게이션 열기/닫기 버튼
				var jqFooterNavCloser = $("#button_footerNavCloser");
				var sFooterNavStatus = m.cookie.get("footerNav");
				
				jqFooterNavCloser.click(function(){
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
						m.cookie.set("footerNav", "close", 24);
					}
					else{
						jqFooterButton.animate({
							"bottom": "+=55px"
						}, function(){
							$(this).toggleClass("down");
							jqFooterMargin.css("height", "66px");
						});
						m.cookie.set("footerNav", "open", 24);
					}
					
					jqThis.toggleClass("bg-f-nav-close");
					jqThis.toggleClass("bg-f-nav-open");
					$(this).next().slideToggle();
					
					//55px
					return false;
				});//.trigger("click");
				
				if (sFooterNavStatus === "close"){
					jqFooterNavCloser.trigger("click");
				}
				
				
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
			},
			
		};
		
		self.headline = {
			lecList: ko.observableArray(),
			bookList: ko.observableArray(),
			
			init: function(){
				try{
					self.main.headline = new m.HeadlineRoller().init({
						list: "#headline_topLecture .roller",
						panel: "#headline_topLecture",
						requestURL: "/mobile/mb/ranking_cate.php"
						//requestURL: "/mobile/mb/ranking_cate.php"
					});
					
					self.main.headline.dataloaded(function(data){
						self.headline.lecList( data.lec_cat );
						self.headline.bookList( data.book_cat );
					});
					
					$("#headline_topLecture .btn-collapse").click(function(){
						self.headline.toggle();
					});
					
					$(".wrap-headline-tab .btn-collapse-close").click(function(){
						self.headline.toggle();
					});
					console.log("헤드라인 로드 완료!");
				}
				catch(e){
					console.log("오류있다능 조심하라능");
					console.log(e);
				}
			},
			
			toggle: function(){
				self.main.headline.toggle();
				$(".wrap-headline-tab").toggle();
			}/*,
			
			setData: function(data){
				if (data.lec_cate){
					var iLen = data.lec_cat.length;
					var mLecCat = null;
					var sLecCatId = "";
										
					$(data.lec_cate).each(function(index){
						mLecCat = data.top_cate_lec[index];
						sLecCatId = mLecCat.cat_id;
						mLecCat.lec_cat_id = sLecCatId;
						mLecCat.cat_id = m.findBookCateByLecCate( sLecCatId ).book_cate;
						mLecCat.nth = index + 1;
					});
				}
				this.lecList(data.lec_cate);
				this.bookList(data.b_cate);
			}*/
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
			self.wr_subject = ko.observable( data.wr_subject );
			self.bf_file = ko.observable( self.bf_file_path + data.bf_file );
			self.wr_id = ko.observable( data.wr_id );
		}
		else{
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( "" );
			}
			self.bf_file( m.img.none );
		}

		self.set = function(data){
			if(data){
				self.wr_subject( data.wr_subject );
				self.bf_file( self.bf_file_path + data.bf_file );
				self.wr_id( data.wr_id );
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
	
	//헤드라인 롤러 부분 [시작] :::::::::::::::::::::::::::::::::::::::::::::::::::
	m.HeadlineRoller = function(){
		this.stopped = ko.observable(false);
		this.list = ko.observableArray();
		this.jqList = null;
		this.jqPanel = null;
		this.currIndex = 0;
		this.lastIndex = 0;
	};
	m.HeadlineRoller.prototype = {
		init: function(mOption){
			var self = this;
			var mDefOption = {
				max: 10,
				list: null,
				panel: null,
				stopDelay: 3000,
				aniDelay: 1000,
				autoStart: true,
				height: 26
			};
			
			$.extend(mDefOption, mOption);

			this.checkRequireOption(mDefOption, this._getRequireOptionNames());			
			this.option = mDefOption;
			this.max = this.option.max;
			this.jqList = $( this.option.list );
			this.jqPanel = $( this.option.panel );
			//this.jqHeading = this.jqPanel.find(".panel-heading");
			//this.jqUsedButton = this.jqPanel.find(".last-search-used");
			//this.jqCloseButton = this.jqPanel.find(".close");
			this.jqList.css({
				"position": "relative",
				"overflow": "hidden"
			});
			
			this.option.height = this.option.height || this.jqList.children().eq(0).height();
			this.initEvent();
			this.load();
			
			return this;
		},
		
		checkRequireOption: function(option, aReqField){
			var iLenReqField = aReqField.length;
			var sProp = "";
			var objField = undefined;
			
			for(var i = 0; i < iLenReqField; i++){
				sProp = aReqField[i];
				objField = option[ sProp ];
				
				if ((objField === null) || (objField === undefined)){
					throw "HeadlineRoller.checkRequireOption: 오류: " + sProp + " 옵션은 필수 입니다.";
				}
			}
		},
		
		animate: function(){
			var iHeight = this.option.height;
			var iAniDelay = this.option.aniDelay;
			var iStopDelay = this.option.stopDelay;
			var jqList = this.jqList;
			var self = this;
			
			//console.log(jqList);
			//console.log(jqList.children());
			
			//console.log("롤링시작");
			
			jqList.children().delay(iStopDelay).each(function(index){
				if (index === (self.max - 1)){
					$(this).animate({
					"top": "-=" + iHeight + "px"
					}, iAniDelay, function(){
						//console.log("롤링끝");
						
						jqList.children().eq(self.currIndex).css({
							"top": ((self.max - 1) * iHeight) + "px"
						});
						
						
						self.currIndex++;
						self.lastIndex++;
						
						if (self.currIndex >= self.max){
							self.currIndex = 0;
						}
						if (self.lastIndex >= self.max){
							self.lastIndex = 0;
						}
						
						//console.log(self.currIndex);
						//console.log(self.lastIndex);
						
						if (self.stopped() === false){
							self.animate();
						}
					});
				}
				else{
					$(this).animate({
					"top": "-=" + iHeight + "px"
					}, iAniDelay);
				}
			});

		},
		
		start: function(){
			this.animate();
		},
		stop: function(){
			this.stopped(false);
		},
		toggle: function(){
			this.jqPanel.toggle();
		},
		
		_getRequireOptionNames: function(){
			return ["list", "panel"];
		},
		
		initEvent: function(){
			this.evt_dataloaded = null;
			this.dataloaded = function(callback){
				this.evt_dataloaded = callback;
			};
			this.onDataLoaded = function(data){
				try{
					this.evt_dataloaded(data);
				}catch(e){}
			};
		},
		load: function(){
			
			var self = this;
			$.getJSON(this.option.requestURL, {rows: this.option.max}, function(data){
				try{
					console.log(data);
					var iLen = data.lec_cat.length;
					var mLecCat = null;
					var mBookCat = null;
					var sLecCatId = "";
										
					$.each(data.lec_cat, function(index){
						mLecCat = data.lec_cat[index];
						sLecCatId = mLecCat.cat_id;
						mLecCat.lec_cat_id = sLecCatId;
						mLecCat.cat_id = m.findBookCateByLecCate( sLecCatId ).book_cate;
						mLecCat.nth = index + 1;
						mLecCat.cat_name_enc = mLecCat.cat_name.replace(/\//g, "%2F");
					});
					
					$.each(data.book_cat, function(index){
						mBookCat = data.book_cat[index];
						mBookCat.cat_name_enc = mBookCat.cat_name.replace(/\//g, "%2F");
					});
					
					self.onDataLoaded(data);
					self.setList(data.lec_cat);

					if (self.option.autoStart === true){
						self.start();
					}
				}
				catch(e){
					console.log(e);
					console.log("헤드라인 데이터 로딩 오류");
				}
				
			}).fail(function(e){
				console.log(e);
			});
			
			
			if (this.option.autoStart === true){
				this.start();
			}
		},
		clear: function(){
			try{
				this.list.removeAll();
			}
			catch(e){}
		},
		setList: function(data){
			var iLen = data.length;
			var self = this;
			
			this.clear();
			
			for(var i = 0; i < iLen; i++){
				data[i].nth = i + 1;
			}
			
			this.list(data);
			this.currIndex = 0;
			this.lastIndex = iLen - 1;
			this.max = iLen;
			
			this.jqList.children().each(function(index){
				$(this).css({
					"position": "absolute",
					"top": (index * self.option.height) + "px"
				});
			});
		}
	};
	//헤드라인 롤러 부분 [종료] ------------------------------------------------------
	
	function App(){
		this.run = function(){
			
			if ((m.NavModel === undefined) ||
				(m.OrderModel === undefined) ||
				(m.MyOrderModel === undefined) ||
				(m.BoardModel === undefined) ||
				(m.MemberModel === undefined) ||
				(m.MyPageModel === undefined) ||
				(m.ContentsModel === undefined) ||
				(m.AutoCompleteModel === undefined)
				
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
			var vmAutoComplete = new m.AutoCompleteModel();
			
			//try{
				$.extend(vm, vmNav);
				$.extend(vm, vmOrder);
				$.extend(vm, vmMyOrder);
				$.extend(vm, vmBoard);
				$.extend(vm, vmMember);
				$.extend(vm, vmMyPage);
				$.extend(vm, vmContents);
				$.extend(vm, vmAutoComplete);
				
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
					
					if ((hasLogin === true)){
						if (isBuy === true){
							location.href = "#order/cartlist" + ((isBuy === true)? "/buy" : "");
						}
						else if (confirm("상품이 장바구니에 담겼습니다.\r\n지금 바로 확인하시겠습니까?") === true){
							location.href = "#order/cartlist" + ((isBuy === true)? "/buy" : "");
						}
					}
					else{
						location.href = "#member/login" + ((isBuy === true)? "/buy" : "");
						m.viewSlider.push(param);
					}
				});
				vm.contents.submitorderfree( function(sendData){
					var hasLogin = vm.member.hasLogin();
					//console.log("vm.contents.submitorderfree::sendData");
					//console.log(sendData);
					if ((sendData.status[0].status === "YES") && (hasLogin === true)){
						if (confirm("무료수강 신청이 완료 되었습니다.\r\n마이페이지로 이동하시겠습니까?") === true){
							location.href = "#mypage/mylec";
						}
					}
					else{
						/*
						vm.member.moveViewByParam({
							view_type: "member",
							name: "login"
						});
						m.viewSlider.push(param);
						*/
						location.href = "#member/login";
					}
				});
				vm.contents.searchtextfocus(function(event){
					if ($(event.currentTarget).val() === ""){
						if (vm.lastsearch.isVisible() === false){
							vm.lastsearch.show();
						}
					}
					else{
						if (vm.autocomplete.isVisible() === false){
							vm.autocomplete.show();
						}
					}
					
					setTimeout(function(){
						window.scrollTo(0, 0);
					}, 1500);
				});
				vm.contents.submitsearch(function(stx){
					vm.lastsearch.put(stx);
						vm.lastsearch.hide();
				});
				vm.lastsearch.shown(function(){
					vm.autocomplete.hide();
					$(".navbar")
					.removeClass("navbar-fixed-top")
					.css({
						"position": "relative",
						"top": 0,
						"right": 0,
						"left": 0,
						"border": "none"
					});
					$(".container-first").hide();
					
					$(".aside, .footer-float-nav").hide();
					//location.href = "#";
					//$(window).scrollTop(0, 0);
					//alert("고정일건데?");
				});
				vm.lastsearch.shown(function(){
					vm.autocomplete.hide();
					$(".navbar")
					.removeClass("navbar-fixed-top")
					.css({
						"position": "relative",
						"top": 0,
						"right": 0,
						"left": 0,
						"border": "none"
					});
					
					$(".container-first").hide();
					$(".aside, .footer-float-nav").hide();
					//location.href = "#";
					//$(window).scrollTop(0, 0);
					//window.scrollTo(0, 0);
				});
				vm.lastsearch.hidden(function(){
					if (vm.autocomplete.isVisible() === false){
						$(".navbar")
						.addClass("navbar-fixed-top")
						.css({
							"position": "fixed"
						});
						$(".container-first").show();
					}
					
					if ((vm.lastsearch.isVisible() === false) && 
						(vm.autocomplete.isVisible() === false)
						){
						$(".aside, .footer-float-nav").show();
					}
				});
				vm.autocomplete.hidden(function(){
					if (vm.lastsearch.isVisible() === false){
						$(".navbar")
						.addClass("navbar-fixed-top")
						.css({
							"position": "fixed"
						});
						$(".container-first").show();
					}
					
					if ((vm.lastsearch.isVisible() === false) && 
						(vm.autocomplete.isVisible() === false)
						){
						$(".aside, .footer-float-nav").show();
					}
				});
				$("input[type='text'], input[type='password'], input[type='number'], input[type='date'], textarea")
				.focus(function(){
					$(".aside, .footer-float-nav").hide();
				})
				.focusout(function(){
					if ((vm.lastsearch.isVisible() === false) && 
						(vm.autocomplete.isVisible() === false)
						){
						$(".aside, .footer-float-nav").show();
					}
					/*
					if((m.mb_id === "sd_yotimer") || (m.mb_id === "sd_ohj0213") || (m.mb_id === "sunsky0802")){
						
					}
					else{
						$(".aside, .footer-float-nav").show();
					}
					*/
				});
				/*vm.contents.searchtextblur(function(event){
					/// FIXME: 변경 예정
					if(m.mb_id === "sd_yotimer"){
						vm.lastsearch.hide();
					}
				});
				*/
				vm.member.loginsuccess( function(member, data){
					vm.order.member.mb_id( member.mb_id );
					//vm.mnamehello( (window.m.mb_name !== "")? (window.m.mb_name/* + "님! 안녕하세요."*/) : "" );
					
					if (data.toOtherView === "main"){
						vm.doClickBoard({
							view_type: ""
						});
					}
					
					$(".aside, .footer-float-nav").show();
				} );
				vm.member.logoutsuccess( function(member){
					vm.order.member.mb_id( "" );
					//vm.mnamehello( "" );
					//vm.doClickBoard({view_type: ""});
					m._cpiClicked = false;
					location.href = "#main";
				} );
				
				vm.board.logincheck(function(){
					var hasLogin = vm.member.hasLogin();
					
					console.log("vm.board.logincheck:: 진행중::" + hasLogin);
					
					return hasLogin;
				});
				vm.comment.logincheck(function(){
					var hasLogin = vm.member.hasLogin();
					if (hasLogin === false){
						if (confirm("덧글을 남기기 위해서는 로그인이 필요합니다.\r\n로그인 하시겠습니까?") === true){
							//m.viewSlider.prevStack.pop();
							//m.viewSlider.push( $("#view_boardDetail") );
							//location.href = "#member/login";
							//vm.member.showLogin();
							location.href = "#member/login";
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
							name: "login",
							bbsId: ""
						});
						//location.href = "#member/login";
						m.viewSlider.push(param);
						return true;
					}
				});
				vm.order.infoshown(function(){
					$.post("/mobile/mb/mem_chk.php", {mb_id: vm.member.mb_id()}, function(response){
						
					});
				});
				
				vm.coupon.dataloaded(function(data){
					
				});
				
				vm.zipcode.selected(function(data){
					if (vm.order.isVisible() === true){
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
					
					vm.autocomplete.hide();
					vm.lastsearch.hide();
					
					if ((param.view_type !== "board") && (param.name !== "g4_write_cs_faq")){
						$(window).scrollTop(0);
					}
					
					//console.log("index_main: vm.clickboard");
					//console.log(param);
					//alert("뜬다: " + param.view_type);
					if (param.view_type === "board"){
						console.log("보드!");
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
								vm.order.load(undefined, function(){
									if (param.bbsId === "buy"){
										vm.order.show(true);
									}
									else{
										vm.order.show();
									}
								});
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
						if (param.name === "regbook"){
							alert("준비중 입니다.");
						}
						else if (vm.member.hasLogin() === false){
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
					else if (param.view_type === "main"){
						m._cpiClicked = false;
						console.log("cpi 초기화");
						m.viewSlider.left("#view_main");
					}
					else if (param.view_type === "gotoback"){
						m.viewSlider.prev();
						console.log("뒤로가기");
					}
					else{
						//location.replace("#main");
						m._cpiClicked = false;
						console.log("cpi 초기화");
						m.viewSlider.left("#view_main");
					}
					
					vm.nav.hideMyMenu();
					vm.nav.hide();
				};
				
				m.sammy.urichange(fnOnURIChange);
				//vm.clickboard(fnOnURIChange);
				
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
						
						m.event.init();
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
						
						m.event.init();
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
					//location.href = m.uri;
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