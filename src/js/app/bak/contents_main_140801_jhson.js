// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "jqueryfinger", "owlcarousel", "mobilebase"], function($, carousel, ko, koutil, json, bootstrap, owlcarousel, mobilebase) {

	function ContentsModel(pmid, pkword) {
		var self = this;
		
		// 메인화면 데이터 바인딩 객체 초기화 - 2014.07.07 by jhson
		self.contents = {
			jqForm: $("#form_topSearch"), 
			canRequest: true,
			listShown: function(){
				return $("#view_contentsList").hasClass("active-view");
			},
			searchText: ko.observable(""),
			cateText: ko.observable(""),
			bn: {
				bn_file: ko.observable(""),
				bn_subject: ko.observable(""),
				bn_url: ko.observable("")
			},
			book: {
				cache: [],
				count: ko.observable(0),
				list: ko.observableArray(),
				detail: new m.bookDetailData(),
				page: 1,
				endOfList: ko.observable(false),
				setData: function(data){
					this.list.removeAll();
					this.addData( data );
				},
				addData: function(data){
					var obsarr = this.list;
					
					if ((data === undefined) || (data.length === 0)){
						this.endOfList( true );
						return;
					}
					$.map(data, function(item){
						obsarr.push( new m.bookListData(item) );
					});

					this.endOfList( false );
				},
				onClickViewDetail: function(item){
					location.hash = "book/" + item.it_id();
					self.contents.searchDetail(item, self.contents.book.showDetail);
				},
				showDetail : function(){
					m.slideLeft( $(".active-view"), $(".view_bookDetail") );
					window.scrollTo(0, 0);
				},
				hideDetail : function(){
					m.slideRight( $(".view_bookDetail"), $("#view_contentsList") );
				}/*,
				setOrderType : function(formElem, type){
					$(formElem).find("[name='order_type']").val( type );
				},
				onSubmitOrder: function(elem){
					var jqFormItem = $(elem);
					var mParam = jqFormItem.serialize();
					
					$.post(jqFormItem.attr("action"), mParam, function(data){
						//FIXME: 보내고 난 뒤 ORDER VIEW 보여주기
						
						if (self.order !== undefined){
							self.order.load( self.order.show );
						}
						//console.log( mParam );
						//console.log( "보내기 성공!" );
					});
					
					self.contents.book.setOrderType( jqFormItem, "cart" );
					
					return false;
				},
				onClickBuy: function(item, event){
					var jqButton = $(event.currentTarget);
					var jqFormItem = jqButton.parentsUntil("form").parent();
					
					console.log(item);
					console.log(event);
					
					self.contents.book.setOrderType( jqFormItem, "buy" );
					self.contents.book.onSubmitOrder( jqFormItem );
					
					return false;
				}*/
			}, /// book object end ::::::::::::::::::::::::
			lec: {
				cache: [],
				count: ko.observable(0),
				list: ko.observableArray(),
				detail: new m.lecDetailData(),
				f_mock: ko.observableArray(),
				flec_list: ko.observableArray(),
				page: 1,
				lec_free: ko.observable(0),
				lec_one: ko.observable(0),
				lec_set: ko.observable(0),
				endOfList: ko.observable(false),
				setData: function(data){
					this.list.removeAll();
					this.addData( data );
				},
				addData: function(data){
					var obsarr = this.list;
					
					if ((data === undefined) || (data.length === 0)){
						this.endOfList( true );
						return;
					}
					$.map(data, function(item){
						obsarr.push( new m.lecListData(item) );
					});

					this.endOfList( false );
				},
				onClickViewDetail: function(item){
					location.hash = "lec/" + item.it_id();
					self.contents.searchDetail(item, self.contents.lec.showDetail);
				},
				showDetail : function(){
					m.slideLeft( $("#view_contentsList"), $(".view_lecDetail") );
					window.scrollTo(0, 0);
					//location.href = "#";
				},
				hideDetail : function(){
					m.slideRight( $(".view_lecDetail"), $("#view_contentsList") );
				},
				
				onChangeLecPeriod : function(item, event){
					//console.log(item);
					//console.log(event);
					var jqItPrice = $(event.currentTarget).next();
					
					item.it_price( jqItPrice.val() );
					
					console.log(jqItPrice);
				},
				
				// change sub price
				onChangeSubPrice : function(item, event){
					var jqItemForm = $(event.currentTarget).parentsUntil("form").parent().eq(0);
					var jqItBooks = jqItemForm.find("input[name='it_book']:checked");
					var jqItMocks = jqItemForm.find("input[name='it_mock']:checked");
					var iSumPrice = 0;
					
					jqItBooks.each(function(){
						iSumPrice += $.tryParseInt( $(this).next().val(), 0 );
					});
					jqItMocks.each(function(){
						iSumPrice += $.tryParseInt( $(this).next().val(), 0 );
					});
					
					self.contents.lec.detail.subPrice( iSumPrice );
				}
				/*,
				setOrderType : function(formElem, type){
					$(formElem).find("[name='order_type']").val( type );
				},
				onSubmitOrder: function(elem){
					var jqFormItem = $(elem);
					var mParam = jqFormItem.serialize();
					
					$.post(jqFormItem.attr("action"), mParam, function(data){
						console.log( mParam );
						console.log( "보내기 성공!" );
					});
					
					self.contents.book.setOrderType( jqFormItem, "cart" );
					
					return false;
				},
				onClickBuy: function(item, event){
					var jqButton = $(event.currentTarget);
					var jqFormItem = jqButton.parentsUntil("form").parent();
					
					self.contents.lec.setOrderType( jqFormItem, "buy" );
					self.contents.lec.onSubmitOrder( jqFormItem );
					
					return false;
				}*/
			},/// lec object end :::::::::::::::::::::::::::
			
			freeLec : {
				jqForm: $("#form_freeLec"),
				topList : [
					{name: "자격증", code: "001", col_xs: 3},
					{name: "공무원", code: "002", col_xs: 3},
					{name: "금융", code: "003", col_xs: 3},
					{name: "취업", code: "004", col_xs: 3},
					{name: "초/중등 학습진학", code: "005", col_xs: 6},
					{name: "검정고시/독학사/편입", code: "006", col_xs: 6}
				],
				subList: ko.observableArray(),
				
				init: function(){
					var freeLec = this;
					freeLec.jqForm.submit(function(){
						var jqForm = self.contents.freeLec.jqForm;
						var sParam = jqForm.serialize();
						
						$.getJSON(jqForm.attr("action"), sParam, function(data){
							var sCatId = "";
							
							try{freeLec.subList.removeAll();}catch(e){}
							$.map(data, function(item){
								sCatId = item.cat_id;
								/*
								if ( m.lecCateInfo[ sCatId ] !== undefined ){
									item.lec_cat_id = m.lecCateInfo[ sCatId ].lec_cate;
								}
								else{
									item.lec_cat_id = "";
								}
								*/
								//item.cat_id_book = 
								freeLec.subList.push(item);
							});
							
							console.log(data);
						});
						
						return false;
					});
				},
				
				setCatId: function(cat_id){
					this.jqForm.find("input[name='cat_id']").val( cat_id );
				},
				
				load: function(){
					this.jqForm.submit();
				},
				show: function(){
					m.viewSlider.left("#view_freeLec"); 
				}
			},/// freelec object end :::::::::::::::::::::::::::::::
			
			showList: function(itemType){
				if (itemType !== undefined){
					this.showTab(itemType);
				}
				
				m.slideLeft( $(".active-view"), $("#view_contentsList") );
			},
			showTab: function(tabIndex){
				$("#tab_itemType li:eq(" + tabIndex + ") a").tab('show');
				/*
				var jqTab = $("#tab_itemType");
				var jqTabLi = jqTab.find("li");
				var jqSelected = jqTabLi.eq(tabIndex);
				var jqContent = $("#" + jqSelected.find("a").attr("href").split("#")[1]);
				
				jqTabLi.removeClass("active");
				jqSelected.addClass("active");
				jqContent.siblings().removeClass("active");
				jqContent.addClass("active");
				*/
			},
			setOrderType : function(formElem, type){
				$(formElem).find("[name='order_type']").val( type );
			},
			submitorder: function(callback){
				this.evt_submitorder = callback;
			},
			onsubmitorder: function(data, isBuy){
				try{
					this.evt_submitorder(data, isBuy);
				}
				catch(e){
					console.log(e);      ///                     
				}
			},
			onSubmitOrder: function(elem, isBuy){
				var jqFormItem = $(elem).eq(0);
				var mParam = jqFormItem.serialize();
				
				console.log(mParam);
				$.post(jqFormItem.attr("action"), mParam, function(dataAll){
					var data = null;
					
					//console.log(dataAll);
					data = $.parseJSON(dataAll);
					console.log(data);
					//FIXME: 보내고 난 뒤 ORDER VIEW 보여주기
					self.contents.onsubmitorder( data, isBuy );
					//console.log( mParam );
					//console.log( "보내기 성공!" );
				});
				
				self.contents.setOrderType( jqFormItem, "cart" );
				
				return false;
			},
			onClickBuy: function(item, event){
				var jqButton = $(event.currentTarget);
				var jqFormItem = jqButton.parentsUntil("form").parent("form");

				console.log(jqFormItem);
				self.contents.setOrderType( jqFormItem, "buy" );
				self.contents.onSubmitOrder( jqFormItem, true );
				
				return false;
			},
			// 컨텐츠 이벤트 초기화 부분 [시작]
			init: function(){
				
				this.getSearchCount = ko.computed(function(){
					try{
						return self.contents.book.count() + self.contents.lec.count();
					}
					catch(e){
						return 0;
					}
				});
				
				this.calcLecTotalPrice = ko.computed(function(){
					var mDetail = self.contents.lec.detail;
					return  mDetail.choosePrice() + mDetail.subPrice();
				});
				
				this.jqForm.submit(function(){
					self.contents.cateText("검색결과");
					self.contents.removeCategoryParams();
					self.contents.search();
					
					return false;
				});
				
				$("#tab_itemType li").click(function(e){
					var jqTabItem = $( e.currentTarget ).find("a");
					var sItType = jqTabItem.attr("rel");
					
					if ( parseInt(sItType) === self.contents.getItemType() ){
						return;
					}
					//console.log(sItType);
					self.contents.setItemType( sItType );
					self.contents.search();
				});
				$("#tab_itemType a[data-toggle='tab']").on("show.bs.tab", function(e){
					
				});
				$(".contents-order-filters").click(function(e){
					var jqSelected = $( e.target );
					var jqFilter = $( e.currentTarget );
					
					jqFilter.find("a").removeClass("selected");
					jqSelected.addClass("selected");
					self.contents.setOrderBy( jqSelected.attr("rel") );
					self.contents.search();
					
					return false;
				});
				$(".contents-type-filters").click(function(e){
					var jqSelected = $( e.target );
					var jqFilter = $( e.currentTarget );
					
					jqFilter.find("a").removeClass("btn-primary").addClass("btn-gray");
					jqSelected.removeClass("btn-gray").addClass("btn-primary");
					self.contents.setContentType( jqSelected.attr("rel") );
					self.contents.search();
					
					return false;
				});
				
				// 무한스크롤 이벤트 바인딩
				$(window).scroll(function(){
					if (self.contents.listShown() === false) return;
					
					var jqWin = $(window);
					var iScrollHeight = jqWin.scrollTop() + jqWin.height();
					var iDocHeight = $(document).height();
					
					if (iScrollHeight + 320 >= iDocHeight){
						if (self.contents.canRequest === true){
							self.contents.requestTimer = setInterval(function(){
								clearInterval(self.contents.requestTimer);
								self.contents.canRequest = true;
							}, 500);
							self.contents.canRequest = false;
							self.contents.searchNext();
						}
					}
				});
				
				// 슬라이드 이벤트 바인딩
				$.Finger = {
				    pressDuration: 300,
				    doubleTapInterval: 300,
				    flickDuration: 200,
				    motionThreshold: 5
				};
				/*
				$(".view_bookDetail").on("flick", function(e){
					//console.log(e);
					if (e.direction === 1){
						m.slidePrev();
					}
				});
				$(".view_lecDetail").on("flick", function(e){
					//console.log(e);
					if (e.direction === 1){
						m.slidePrev();
					}
				});
				*/
				// 동영상 - 기간 선택 옵션
				$(".wrap-lec-period-radio input[name='it_opt']").click(function(){
					self.contents.lec.detail.choosePrice( $.tryParseInt( $(this).siblings("[name='it_opt_price']").val() ) );
				});
				
				
				// TODO: Location Hash - sammy 적용 부분
				
				
				$("#button_lecInfoPlaySample").click(function(){
					
				});
				
				$("#accordion_productBookInfo").on("show.bs.collapse", function(e){
					var jqCollapse = $(e.currentTarget);
					var jqCont = $(e.target);
					var jqPoint = jqCollapse.find("a[href$='" + jqCont.attr("id") + "'] i");
					
					jqPoint.removeClass("glyphicon-chevron-down");
					jqPoint.addClass("glyphicon-chevron-up");
					
					//console.log(e);
				});
				$("#accordion_productBookInfo").on("hide.bs.collapse", function(e){
					var jqCollapse = $(e.currentTarget);
					var jqCont = $(e.target);
					var jqPoint = jqCollapse.find("a[href$='" + jqCont.attr("id") + "'] i");
					
					jqPoint.removeClass("glyphicon-chevron-up");
					jqPoint.addClass("glyphicon-chevron-down");
					
					//console.log(e);
				});
				
				this.freeLec.init();
				
				// FIXME: 임시 상세 페이지 데이터 적용 [시작]
				/*
				try{
					self.contents.book.detail.set({
						it_id: "1404802603",
						it_name: "Win-Q 지게차운전기능사 : 실기시험대비 무료동영상CD제공! - 최근 상시시험 복원문제 수록!  [예약판매]",
						it_author: "전상철저",
						it_file_d: "1404802603_d.png",
						it_release: "2014-08-05",
						it_sug_price: "15000",
						it_price: "12000",
						it_res_price: "600",
						it_isbn: "9791125405917",
						it_delivery: "1000",
						it_delivery_use: "0",
						it_basic: //도서특징
									"<div><font face=\"dotum, Verdana, Geneva, sans-serif\" color=\"#ff0000\"><span style=\"font-size: 11px; line-height: 16.5px\"><b>[발송예정일 2014년 7월 16일 입니다.]</b></span></font></div>"+
									"<div><font color=\"#888888\" face=\"dotum, Verdana, Geneva, sans-serif\"><span style=\"font-size: 11px; line-height: 16.5px\"><br /></span></font></div>"+
									"<div><font color=\"#888888\" face=\"dotum, Verdana, Geneva, sans-serif\"><span style=\"font-size: 11px; line-height: 16.5px\">1. 각 과목별로 필수적으로 학습해야 할 핵심이론을 알기 쉽게 정리!</span></font></div>"+
									"<div><font color=\"#888888\" face=\"dotum, Verdana, Geneva, sans-serif\"><span style=\"font-size: 11px; line-height: 16.5px\">2. 각 핵심이론당 출제 빈도가 높고 중요도가 높은 핵심예제만을 엄선하여 명쾌한 해설과 함께 수록(핵심예제에 출제된 연도 표시)</span></font></div>"+
									"<div><font color=\"#888888\" face=\"dotum, Verdana, Geneva, sans-serif\"><span style=\"font-size: 11px; line-height: 16.5px\">3. 지난 과년도 기출문제 + 최근 출제된 상시시험 기출복원문제와 자세한 해설 수록으로 최신 출제경향까지 완벽하게 마무리!</span></font></div>"+
									"<div><font color=\"#888888\" face=\"dotum, Verdana, Geneva, sans-serif\"><span style=\"font-size: 11px; line-height: 16.5px\">4. 계획에 맞춘 단기간 학습을 돕는 스터디 플래너 수록!</span></font></div>"+
									"<div><font color=\"#888888\" face=\"dotum, Verdana, Geneva, sans-serif\"><span style=\"font-size: 11px; line-height: 16.5px\">5. 빨리보는 간단한 키워드를 통해 응시생들이 꼭 기억해야 할 정답 키워드 수록!</span></font></div>"+
									"<div><font color=\"#888888\" face=\"dotum, Verdana, Geneva, sans-serif\"><span style=\"font-size: 11px; line-height: 16.5px\">6. 무료동영상으로 실기시험까지 대비!</span></font></div>",
						it_content: //목차
									"<div><b><font color=\"#002060\">빨리보는 간단한 키워드</font></b></div>"+
									"<div><b><font color=\"#002060\"><br /></font></b></div>"+
									"<div><b><font color=\"#002060\">제1편 핵심이론+핵심예제</font></b></div>"+
									"<div>제1과목 건설기계기관</div>"+
									"<div>제2과목 전기 및 작업장치</div>"+
									"<div>제3과목 유압일반</div>"+
									"<div>제4과목 건설기계관리법규 및 도로통행방법</div>"+
									"<div>제5과목 안전관리</div>"+
									"<div><b><font color=\"#002060\"><br /></font></b></div>"+
									"<div><b><font color=\"#002060\">제2편 과년도 기출문제+최근 상시시험 복원문제</font></b></div>"+
									"<div>2010년 과년도 기출문제</div>"+
									"<div>2011년 과년도 기출문제</div>"+
									"<div>2014년 최근 상시시험 복원문제</div>"+
									"<div><br /></div>",
						it_review: // 출판사 서평
									"<div>윙크 지게차운전기능사 도서는 기능사 시험을 준비하시는 수험생분들이 단기간에 시험에 합격할 수 있도록 시험에 꼭 출제되는 핵심 이론과 핵심 예제만 선별하여 수록하였습니다. 과년도 기출문제와 2014년 최근 기출복원문제를 수록하여 최신 시험경향을 파악할 수 있습니다. 실기시험을 대비하는 무료동영상을 제공함으로 자격증 취득까지의 지름길을 제시합니다.</div>"+
									"<div>&nbsp;</div>"+
									"<div><br /></div>"
					});
					self.contents.lec.detail.set({
						
					});
				}
				catch(e){}
				*/
				// FIXME: 임시 상세 페이지 데이터 적용 [종료]
				
				//self.contents.search();
			},// 컨텐츠 이벤트 초기화 부분 init [종료]
			
			getSearchText: function(){
				return this.jqForm.find("[name='stx']").val();
			},
			setSearchText: function(stx){
				this.jqForm.find("[name='stx']").val(stx);
			},
			getPage: function(){
				return parseInt(this.jqForm.find("[name='page']").val());
			},
			setPage: function(page){
				self.contents.jqForm.find("[name='page']").val( page );
			},
			getItemType: function(){
				return parseInt(this.jqForm.find("[name='it_type']").val());
			},
			setItemType: function(type){
				this.jqForm.find("[name='it_type']").val( type );
			},
			getOrderBy: function(){
				return parseInt(this.jqForm.find("[name='order_by']").val());
			},
			setOrderBy: function(orderBy){
				self.contents.jqForm.find("[name='order_by']").val( orderBy );
			},
			getContentType: function(){
				return parseInt(this.jqForm.find("[name='contents_type']").val());
			},
			setShowAll: function(showAll){
				self.contents.jqForm.find("[name='showall']").val(showAll);
			},
			getShowAll: function(){
				return self.contents.jqForm.find("[name='showall']").val();
			},
			setContentType: function(ContentType){
				this.jqForm.find("[name='content_type']").val( ContentType );
			},
			setCategory: function(cat_id, lec_cat_id){
				if (this.jqForm.find("[name='lec_cat_id']").length === 0){
					this.jqForm.append("<input type=\"hidden\" name=\"cat_id\" value=\"" + cat_id + "\"/>");
					this.jqForm.append("<input type=\"hidden\" name=\"lec_cat_id\" value=\"" + (lec_cat_id || "") + "\"/>");
				}
				else{
					this.jqForm.find("input[name='cat_id']").val( cat_id );
					this.jqForm.find("input[name='lec_cat_id']").val( lec_cat_id || "" );
				}
			},
			setContentTypeButtonActivation: function(index){
				var jqFilter = $( ".contents-type-filters" );
				var jqSelected = jqFilter.find("a").eq(index);
				
				jqFilter.find("a").removeClass("btn-primary").addClass("btn-gray");
				jqSelected.removeClass("btn-gray").addClass("btn-primary");
			},
			removeCategoryParams: function(){
				this.jqForm.find("[name='cat_id']").remove();
				this.jqForm.find("[name='lec_cat_id']").remove();
			},
			
			searchByCatId: function(catId){
				
			},
			
			searchByParam: function(param){
				var iItemType = 1;
				
				if (param.view_type){
					if (param.view_type !== "contents"){
						console.log("잘못된 컨텐츠 코드 입니다: " + param.view_type);
						console.log(param);
						return;
					}
				}
				
				if (param.name){
					if (param.name === "book"){
						this.setItemType(0);
						iItemType = 0;
					}
					else if (param.name === "lec"){
						this.setItemType(1);
						iItemType = 1;
					}
					else if (param.name === "freelec"){
						this.setItemType(1);
						iItemType = 1;
						
						if (param.bbsId !== undefined){
							this.freeLec.setCatId( param.bbsId );
							this.freeLec.load();
						}
						else{
							this.freeLec.show();
						}
						
						return;
					}
				}
				
				
				if (param.bbsId !== undefined){
					if (param.name === "freeleclist"){
						this.setContentType(99);
						this.setContentTypeButtonActivation(2);
					}
					
					if ((param.subId !== undefined)){
						this.setItemType(1);
						iItemType = 1;
						
						this.setCategory( param.bbsId, param.subId );
						this.cateText( param.keyword );
						this.search(1, true, true);
						//this.jqForm.find("[name='cat_id']").remove();
						//this.jqForm.find("[name='lec_cat_id']").remove();
					}
					else if(param.name === "all"){
						this.setItemType(0);
						iItemType = 0;
						
						this.setCategory( param.bbsId, param.subId );
						this.cateText( param.keyword );
						this.search(1, true);
					}
					
					else{
						this.cateText( "전체보기" );
						
						if (iItemType === 0){
							this.searchBook( param.bbsId );
						}
						else{
							this.searchLec( param.bbsId );
						}
					}
				}
				else{
					this.cateText( "전체보기" );
					
					this.setSearchText("");
					this.showTab(iItemType);
					this.search();
				}
			},
			
			//searchCategory: function()
			
			search: function(page, autoTab, useCate){
				var mParam = null;
				var jqForm = self.contents.jqForm;
				var iItemType = self.contents.getItemType();
				var iPage = self.contents.getPage();
				var sSearchText = self.contents.getSearchText();
				
				if (page){
					self.contents.setPage( page );
					iPage = page;
				}
				else{
					self.contents.setPage( 1 );
					iPage = 1;
					
					if(iItemType === 0){
						self.contents.book.page = iPage;
					}
					else{
						self.contents.lec.page = iPage;
					}
				}
				
				if ((useCate !== true) && (sSearchText === "")){
					self.contents.setShowAll( true );
				}
				else{
					self.contents.setShowAll( false );
				}
				
				// FIXME: 아이템 정보 전용 가져오기
				/*
				if ($("#view_lecDetail").length > 0){
					mParam = {
						it_id : 1398235775,
						it_type : 1
					};
				}
				else if ($("#view_bookDetail").length > 0){
					mParam = {
						it_id : 1404802603,
						it_type : 0
					};
				}
				else{
					mParam = jqForm.serialize();
				}
				*/
				mParam = jqForm.serialize();
				console.log(mParam);				
				$.getJSON(jqForm.attr("action"), mParam, function(data){
					console.log(data);
					
					self.contents.searchText( sSearchText );
					self.contents.book.count( parseInt( data.book ) );
					self.contents.lec.count( parseInt( data.lec ) );
					
					if((iItemType === 0) || 
						((autoTab === true) &&
						 (self.contents.lec.count() === 0)
						)){
						if (iPage > 1){
							self.contents.book.addData(data.list);
							self.contents.book.page = iPage;
						}
						else{
							self.contents.book.setData(data.list);
							self.contents.book.page = 1;
						}
						
						//self.contents.book.endOfList( self.contents.book.count() < 5 );
					}
					else{
						if (iPage > 1){
							self.contents.lec.addData(data.list);
							self.contents.lec.page = iPage;
						}
						else{
							self.contents.lec.lec_free( data.lec_free );
							self.contents.lec.lec_one( data.lec_one );
							self.contents.lec.lec_set( data.lec_set );
							self.contents.lec.setData(data.list);
							self.contents.lec.page = 1;
						}
						
						//self.contents.lec.endOfList( self.contents.lec.count() < 5 );
					}
					
					if (data.bn && (data.bn.length > 0)){
						self.contents.bn.bn_file( "/data/cm_shop/banner/" + data.bn[0].bn_file );
						self.contents.bn.bn_subject( data.bn[0].bn_subject );
						self.contents.bn.bn_url( data.bn[0].bn_url );
					}
					else{
						self.contents.bn.bn_file( "/_skin/sidae/images/book/list/it.jpg" );
						self.contents.bn.bn_subject( "배너" );
						self.contents.bn.bn_url( "" );
					}
					
					self.contents.showList(iItemType);
					/*if (mParam.it_id){
						if (mParam.it_type === 0){
							self.contents.book.detail.set( data );
						}
						else{
							
							self.contents.lec.detail.set( data );
							//console.log( self.contents.lec.detail );
						}
					}
					else{
						//self.contents.showTab(iItemType);
						self.contents.showList(iItemType);
					}
					*/
					
					//self.contents.book.detail.set()
				})
				.fail(function(){
					console.log("실패?");
				});
				
				return false;
			},
			hideContentsCollapse: function(){
				var jqAccordion = $(".accordion-product-info");
				var jqIcons = jqAccordion.find("h4 a i");
				
				jqAccordion.find(".panel-collapse.collapse").removeClass("in");
				jqIcons.removeClass("glyphicon-chevron-up");
				jqIcons.addClass("glyphicon-chevron-down");
			},
			searchNext: function(){
				var iPage = self.contents.getPage();
				var iItemType = self.contents.getItemType();
				
				if (
					((iItemType === 0) && 
					 (self.contents.book.endOfList() === false)
					) || 
					((iItemType === 1) && 
					 (self.contents.lec.endOfList() === false)
					)
				   ){
					
					self.contents.search( ++iPage );
				}
			},
			searchPrev: function(){
				var iPage = self.contents.getPage();
				if (iPage > 1){
					self.contents.search( --iPage );
				}
			},
			searchDetail: function(item, callback){
				return self.contents.searchDetailCommon(
					item.it_id(), 
					self.contents.getItemType(),
					callback);
			},
			searchDetailCommon : function(it_id, it_type, callback){
				var mParam = {
					it_id: it_id,
					it_type: it_type
				};
				var jqForm = self.contents.jqForm;
												
				$.getJSON(jqForm.attr("action"), mParam, function(data){
					console.log(data);
					
					self.contents.hideContentsCollapse();
										
					if (mParam.it_type === 0){
						self.contents.book.detail.set( data.list[0] );
						self.contents.book.showDetail();
					}
					else{
						self.contents.lec.f_mock.removeAll();
						self.contents.lec.flec_list.removeAll();
						if (data.f_mock){
							self.contents.lec.f_mock(data.f_mock);
						}
						if (data.flec_list){
							self.contents.lec.flec_list(data.flec_list);
						}
						
						self.contents.lec.detail.set( data );
						self.contents.lec.showDetail();
					}
				})
				.fail(function(){
					
				});
				
				return false;
			},
			searchBook: function(it_id, callback){
				return self.contents.searchDetailCommon(it_id, 0, callback);
			},
			searchLec: function(it_id, callback){
				return self.contents.searchDetailCommon(it_id, 1, callback);
			}
		};//contents object end:::::
		
		// 샘플 플레이어 객체:::::::::::::::::::::
		self.samplePlayer = {
			palyer: null,
			me: null,
			videoElement: "#video_samplePalyer",
			jqModal: $("#modal_productLecSamplePlayerMessage"),
			mediaPathAction: "/mobile/study/player_path.php",
			init: function(){
				$("#button_lecInfoPlaySample").click(function(e){
					var jqTarget = $(e.currentTarget);
					var jqForm = jqTarget.parentsUntil("form").parent();
					var sTbId = jqForm.find("[name='tb_id']").val();
					
					self.samplePlayer.setTbId( sTbId );
				});
				/*this.player = $( this.videoElement ).mediaelementplayer({
					success: function (mediaElement, domObject) {
						var jqVideo = $(domObject);
						
						self.samplePlayer.me = mediaElement;
					},
					// fires when a problem is detected
					error: function () {
						alert("플레이어에 오류가 발생하였습니다. 고객센터로 전화나 1:1게시판으로 문의주시면 확인 후 바로 조치하겠습니다.");
						if(confirm("플래시 플레이어의 설치가 필요합니다(http://get.adobe.com/flashplayer)\n확인을 누르시면 해당 설치페이지로 이동합니다. \n\n(상단의 팝업을 허용하여 주십시요.)\n\n※ 설치 완료 하였음에도 본 알림글이 보인다면 인터넷브라우저를 종료하고 다시 열어 주십시요.")){
							window.open("http://get.adobe.com/flashplayer", "installflash","","");
						};
					}
				});
				*/
			},
			setSrc: function(mediaPath){
				this.me.setSrc([
					{src: this.mediaPath, type: "video/mp4"}
				]);
				this.me.load();
				this.me.play();
			},
			/*
			setItemId: function(itId){
				//itId = 1398232031; //FIXME: 테스트용 샘플 it_id
				$.get( this.mediaPathAction, {it_id: itId}, function(response){
					if (response.indexOf("1|") === 0){
						
						//self.samplePlayer.jqModal.modal("hide");
						//alert( response.split("|")[1] );
						self.samplePlayer.jqModal.modal("show");
						self.samplePlayer.jqModal.find(".modal-body").html(
							response.split("|")[1]
						);
					}
					else{
						//self.samplePlayer.setSrc( response );
						location.href = response;
					}
				} );
			},*/
			setTbId: function(tbId){
				$.get( this.mediaPathAction, {tb_id: tbId}, function(response){
					if (response.indexOf("1|") === 0){
						
						//self.samplePlayer.jqModal.modal("hide");
						//alert( response.split("|")[1] );
						self.samplePlayer.jqModal.modal("show");
						self.samplePlayer.jqModal.find(".modal-body").html(
							response.split("|")[1]
						);
					}
					else{
						//self.samplePlayer.setSrc( response );
						var winSample = window.open("about:blank");
						winSample.location.href = response;
					}
				} );
			}
		};// smaplePlayer object end:::::
		
		
		
		self.contents.init();
		self.samplePlayer.init();
	}
	
	ContentsModel.prototype = new m.BaseViewModel();
	ContentsModel.prototype.constructor = ContentsModel;
	m.ContentsModel = ContentsModel;
	
	// 도서목록 정보 데이터 부분 - 2014.07.09 - by jhson [시작]
	m.bookListDataKeys = [
		"it_id",
		"cat_id",
		"it_file_l",
		"it_name",
		"it_author",
		"it_price",
		"it_sug_price",
		"it_res_price"
	];
	m.bookListData = function(data){
		var self = this;
		var iLen = m.bookListDataKeys.length;
		var aProp = m.bookListDataKeys;
		
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
		
	m.bookDetailDataKeys = [
		"cat_id",
		"it_admin_memo",
		"it_author",
		"it_barcode",
		"it_basic",
		"it_book_responsible",
		"it_buy_use",
		"it_content",
		"it_datetime",
		"it_delivery",
		"it_delivery_use",
		"it_edit_responsible",
		"it_edition_number",
		"it_file_d",
		"it_file_l",
		"it_file_m",
		"it_file_o",
		"it_file_r",
		"it_icon1",
		"it_icon2",
		"it_icon3",
		"it_icon4",
		"it_icon5",
		"it_icon6",
		"it_icon7",
		"it_icon8",
		"it_icon9",
		"it_icon10",
		"it_icon11",
		"it_icon12",
		"it_icon13",
		"it_icon14",
		"it_icon15",
		"it_id",
		"it_isbn",
		"it_name",
		"it_order_num",
		"it_page",
		"it_plate",
		"it_price",
		"it_price1",
		"it_price2",
		"it_price_text",
		"it_qty_use",
		"it_rating",
		"it_relation_use",
		"it_release",
		"it_res_price",
		"it_review",
		"it_status",
		"it_stock",
		"it_stock_use",
		"it_sug_price",
		"it_tag",
		"it_tax_use",
		"it_type",
		"it_update",
		"it_version",
		"mb_id_updatetime",
		"mk_id",
		"r_dual",
		"r_height",
		"r_page",
		"tempOLDbookID",
		"trigger_event",
		"update_mb_id"
	];
	m.bookDetailData = function(data){
		var self = this;
		var iLen = m.bookDetailDataKeys.length;
		var aProp = m.bookDetailDataKeys;
		
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
	// 도서목록 정보 데이터 부분 - 2014.07.09 - by jhson [종료]
	
	
	
	
	// 도서목록 정보 데이터 부분 - 2014.07.09 - by jhson [시작]
	m.lecListDataKeys = [
		"it_id",
		"cat_id",
		"lec_id",
		"it_name",
		"it_lecture_days",
		"it_tb_cnt",
		"it_period_1",
		"it_period_2",
		"it_period_3",
		"it_price_1",
		"it_price_2",
		"it_price_3"
	];
	m.lecListData = function(data){
		var self = this;
		var iLen = m.lecListDataKeys.length;
		var aProp = m.lecListDataKeys;
		
		if(data){
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( data[ aProp[i] ] );
			}
			self.it_price = ko.observable( data.it_price_1 );
		}
		else{
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( "" );
			}
			self.it_price = ko.observable( 0 );
		}
		
		self.set = function(data){
			if(data){
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( data[ aProp[i] ] );
				}
				self.it_price( data.it_price_1 );
			}
			else{
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( "" );
				}
				self.it_price( 0 );
			}
		};
		
		self.getDcRate = function(){
			return 0;
		};
	};
		
	m.lecDetailDataKeys = [
		"cat_id",
		"it_admin_memo",
		"it_basic",
		"it_buy_use",
		"it_content",
		"it_datetime",
		"it_file_d",
		"it_file_l",
		"it_file_m",
		"it_file_o",
		/*"it_icon1",
		"it_icon2",
		"it_icon3",
		"it_icon4",
		"it_icon5",
		"it_icon6",
		"it_icon7",
		"it_icon8",
		"it_icon9",*/
		"it_id",
		"it_lecture_days",
		"it_name",
		"it_period_1",
		"it_period_2",
		"it_period_3",
		"it_price_1",
		"it_price_2",
		"it_price_3",
		"it_rating",
		//"it_tag",
		"it_tb_cnt",
		"it_type",
		"it_update",
		"lec_id",
		"mb_id_updatetime",
		"tempOLDlectureID",
		"trigger_event",
		"update_mb_id"
	];
	m.lecDetailData = function(dataAll){
		var self = this;
		var iLen = m.lecDetailDataKeys.length;
		var aProp = m.lecDetailDataKeys;
		var data = null;
		var lecturer_name = null;
		var f_mock = null;
		var p_mock = null;
		var p_book = null;
		var lec_tb = [];
		var iItPrice = 0;
		
		try{
			data = dataAll.list[0];
			lecturer_name = dataAll.lecturer_name;
			f_mock = dataAll.f_mock;
			p_mock = dataAll.p_mock;
			p_book = dataAll.p_book;
		}
		catch(e){}
		
		if(data){
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( data[ aProp[i] ] );
			}
			iItPrice = $.tryParseInt( data.it_price_1 );
			self.choosePrice = ko.observable( iItPrice );
			self.totalPrice = ko.observable( iItPrice );
			self.it_price = ko.observable( iItPrice );
		}
		else{
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( "" );
			}
			self.choosePrice = ko.observable( 0 );
			self.totalPrice = ko.observable( 0 );
			self.it_price = ko.observable( 0 );
		}
		self.subPrice = ko.observable( 0 );
		self.tb_id = ko.observable("");
		
		if (lecturer_name){
			self.lecturer_name = ko.observable( lecturer_name );
		}
		else{
			self.lecturer_name = ko.observable( "" );
		}
		
		if (f_mock){
			self.f_mock = ko.observableArray( f_mock );
		}
		else{
			self.f_mock = ko.observableArray();
		}
		
		if (p_mock){
			self.p_mock = ko.observableArray( p_mock );
		}
		else{
			self.p_mock = ko.observableArray();
		}
		
		if (p_book){
			self.p_book = ko.observableArray( p_book );
		}
		else{
			self.p_book = ko.observableArray();
		}
		
		self.lec_tb = ko.observableArray();
		if(dataAll && dataAll.lec_tb){
			if(dataAll.lec_tb.length > 0){
				var aLecTb = dataAll.lec_tb[0];
				var iLecTbLen = aLecTb.length;
				
				self.tb_id( aLecTb[0].tb_id );
				
				for(var i = 0; i < iLecTbLen; i++){
					self.lec_tb.push( aLecTb[i].tb_name );
				}
			}
		}
		
		self.set = function(dataAll){
			var data = null;
			var lecturer_name = null;
			var f_mock = null;
			var p_mock = null;
			var p_book = null;
			var lec_tb = [];
			
			try{
				data = dataAll.list[0];
				lecturer_name = dataAll.lecturer_name;
				f_mock = dataAll.f_mock;
				p_mock = dataAll.p_mock;
				p_book = dataAll.p_book;
			}
			catch(e){}
			
			if(data){
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( data[ aProp[i] ] );
				}
				iItPrice = $.tryParseInt( data.it_price_1 );
				self.choosePrice( iItPrice );
				self.totalPrice( iItPrice );
				self.it_price( iItPrice );
			}
			else{
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( "" );
				}
				self.choosePrice( 0 );
				self.totalPrice( 0 );
				self.it_price( 0 );
			}
			self.subPrice( 0 );
			
			if (lecturer_name){
				self.lecturer_name( lecturer_name );
			}
			else{
				self.lecturer_name( "" );
			}
			
			if (f_mock){
				self.f_mock( f_mock );
			}
			else{
				self.f_mock.removeAll();
			}
			
			if (p_mock){
				self.p_mock( p_mock );
			}
			else{
				self.p_mock.removeAll();
			}
			
			if (p_book){
				self.p_book( p_book );
			}
			else{
				self.p_book.removeAll();
			}
						
			self.lec_tb.removeAll();
			if(dataAll && dataAll.lec_tb){
				if(dataAll.lec_tb.length > 0){
					var aLecTb = dataAll.lec_tb[0];
					var iLecTbLen = aLecTb.length;
					
					self.tb_id( aLecTb[0].tb_id );
					
					for(var i = 0; i < iLecTbLen; i++){
						self.lec_tb.push( aLecTb[i].tb_name );
					}
				}
			}
		};
	};
	// 도서목록 정보 데이터 부분 - 2014.07.09 - by jhson [종료]
	/*
	$(function(m, $, ko){
		try{
			var app = new m.App();
			app.run();
		}
		catch(e){}
		//m.setMBdata(m.mb_name, m.mb_id);	
	}(window.m, $, ko));
	*/
});