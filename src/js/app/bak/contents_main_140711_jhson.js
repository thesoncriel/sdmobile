// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "sammy", "jqueryfinger", "owlcarousel"], function($, carousel, ko, koutil, json, bootstrap) {

	function ContentsModel(pmid, pkword) {
		var self = this;
		
		self.slideMove = function(fromTarget, toTarget, oper){
			var jqFrom = $(fromTarget);	
			var jqTo = $(toTarget);
			var iScreenWidth  = $(window).width();
			var iLeftViewHeight = jqFrom.height();
			
			jqFrom.css({
				position: "relative",
				display: "block"
			});
			
			jqTo.css({
				position: "absolute",
				top: "0px",
				left: ((oper === "-")? "" : "-") + iScreenWidth + "px",
				display: "block",
				width: iScreenWidth + "px"
			});
			
			jqFrom.animate({
				left: oper + "=" + iScreenWidth + "px"
			}, {
				complete: function(){
					$(this).css({
						position: "absolute",
						display: "none"
					});
				}	
			});
			
			jqTo.animate({
				left: oper + "=" + iScreenWidth + "px"
			}, {
				complete: function(){
					$(this).css({
						position: "relative",
						width: "100%"
					});
				}
			});
		},
		self.slideLeft = function(fromTarget, toTarget){
			self.slideMove(fromTarget, toTarget, "-");
		};
		self.slideRight = function(fromTarget, toTarget){
			self.slideMove(fromTarget, toTarget, "+");
		}
		// 메인화면 데이터 바인딩 객체 초기화 - 2014.07.07 by jhson
		self.contents = {
			jqForm: $("#form_topSearch"),
			canRequest: true,
			listShown: true,
			searchText: ko.observable(""),
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
					self.contents.searchDetail(item, self.contents.book.showDetail);
					location.hash = "book/" + item.it_id;
				},
				showDetail : function(){
					self.slideLeft( $("#view_contentsList"), $(".view_bookDetail") );
					self.contents.listShown = false;
					location.href = "#";
				},
				hideDetail : function(){
					self.slideRight( $(".view_bookDetail"), $("#view_contentsList") );
					self.contents.listShown = true;
				}
			},
			lec: {
				cache: [],
				count: ko.observable(0),
				list: ko.observableArray(),
				detail: new m.lecDetailData(),
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
						obsarr.push( new m.lecListData(item) );
					});

					this.endOfList( false );
				},
				onClickViewDetail: function(item){
					self.contents.searchDetail(item, self.contents.lec.showDetail);
					location.hash = "lec/" + item.it_id;
				},
				showDetail : function(){
					self.slideLeft( $("#view_contentsList"), $(".view_lecDetail") );
					self.contents.listShown = false;
					location.href = "#";
				},
				hideDetail : function(){
					self.slideRight( $(".view_lecDetail"), $("#view_contentsList") );
					self.contents.listShown = true;
				}
			},
			getSearchCount: ko.computed(function(){
				try{
					return self.contents.book.count() + self.contents.lec.count();
				}
				catch(e){
					return 0;
				}
			}),
			// 컨텐츠 이벤트 초기화 부분
			init: function(){
				this.jqForm.submit(function(){
					self.contents.search();
					return false;
				})
				$("#tab_itemType a[data-toggle='tab']").on("show.bs.tab", function(e){
					var jqTabItem = $( e.target );
					var sItType = jqTabItem.attr("rel");
					
					//console.log(sItType);
					self.contents.setItemType( sItType );
					self.contents.search();
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
					if (self.contents.listShown === false) return;
					
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
				$(".view_bookDetail").on("flick", function(e){
					//console.log(e);
					if (e.direction === 1){
						self.contents.book.hideDetail();
					}
				});
				$(".view_lecDetail").on("flick", function(e){
					//console.log(e);
					if (e.direction === 1){
						self.contents.lec.hideDetail();
					}
				});
				
				// Location Hash - sammy 적용 부분
				Sammy(function(){
					this.get
				}).run();
				
				$("#button_lecInfoPlaySample").click(function(){
					
				});
				
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
				
				self.contents.search();
			},// init [종료]
			getSearchText: function(){
				return this.jqForm.find("[name='stx']").val();
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
			setContentType: function(ContentType){
				this.jqForm.find("[name='content_type']").val( ContentType );
			},
			
			search: function(page){
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
								
				$.getJSON(jqForm.attr("action"), mParam, function(data){
					console.log(data);
					
					self.contents.searchText( sSearchText );
					self.contents.book.count( parseInt( data.book ) );
					self.contents.lec.count( parseInt( data.lec ) );
					
					if(iItemType === 0){
						if (iPage > 1){
							self.contents.book.addData(data.list);
							self.contents.book.page = iPage;
						}
						else{
							self.contents.book.setData(data.list);
							self.contents.book.page = 1;
						}
					}
					else{
						if (iPage > 1){
							self.contents.lec.addData(data.list);
							self.contents.lec.page = iPage;
						}
						else{
							self.contents.lec.setData(data.list);
							self.contents.lec.page = 1;
						}
					}
					
					if (data.bn){
						self.contents.bn.bn_file( data.bn[0].bn_file );
						self.contents.bn.bn_subject( data.bn[0].bn_subject );
						self.contents.bn.bn_url( data.bn[0].bn_url );
					}
					
					if (mParam.it_id){
						if (mParam.it_type === 0){
							self.contents.book.detail.set( data );
						}
						else{
							
							self.contents.lec.detail.set( data );
							console.log( self.contents.lec.detail );
						}
					}
					
					//self.contents.book.detail.set()
				})
				.fail(function(){
					
				});
				
				return false;
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
				var sItemType = self.contents.getItemType();
				var mParam = {
					it_id: item.it_id,
					it_type: sItemType
				};
				var jqForm = self.contents.jqForm;
												
				$.getJSON(jqForm.attr("action"), mParam, function(data){
					console.log(data);
										
					if (mParam.it_type === 0){
						self.contents.book.detail.set( data.list[0] );
					}
					else{
						self.contents.lec.detail.set( data );
					}
					
					if (callback !== undefined){
						callback();
					}
					
				})
				.fail(function(){
					
				});
				
				return false;
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
					var sItemId = jqForm.find("[name='it_id']").val();
					
					self.samplePlayer.setItemId( sItemId );
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
			setItemId: function(itId){
				//itId = 1398232031; //FIXME: 테스트용 샘플 it_id
				$.get( this.mediaPathAction, {it_id: itId}, function(response){
					if (response.indexOf("1|") === 0){
						
						//self.samplePlayer.jqModal.modal("hide");
						//alert( response.split("|")[1] );
						self.samplePlayer.jqModal.modal("show");
						self.samplePlayer.jqModal.find(".modal-body").text(
							response.split("|")[1]
						)
					}
					else{
						//self.samplePlayer.setSrc( response );
						location.href = response;
					}
				} );
			}
		};// smaplePlayer object end:::::
		
		// FIXME: 메인 결합 시 삭제. [시작]
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
		}
		// FIXME: 메인 결합 시 삭제. [종료]
		
		self.contents.init();
		self.samplePlayer.init();
	}
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
			return 
		}
	}
		
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
			return 
		}
	}
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
			return 
		}
	}
		
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
		"it_icon1",
		"it_icon2",
		"it_icon3",
		"it_icon4",
		"it_icon5",
		"it_icon6",
		"it_icon7",
		"it_icon8",
		"it_icon9",
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
		"it_tag",
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
		}
		else{
			for(var i = 0; i < iLen; i++){
				self[ aProp[i] ] = ko.observable( "" );
			}
		}
		
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
			}
			else{
				for(var i = 0; i < iLen; i++){
					self[ aProp[i] ]( "" );
				}
			}
			
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
				self.p_book.removeAll()
			}
			
			self.lec_tb.removeAll();
			if(dataAll && dataAll.lec_tb){
				if(dataAll.lec_tb.length > 0){
					var aLecTb = dataAll.lec_tb[0];
					var iLecTbLen = aLecTb.length;
					
					for(var i = 0; i < iLecTbLen; i++){
						self.lec_tb.push( aLecTb[i].tb_name );
					}
				}
			}
		};
	}
	// 도서목록 정보 데이터 부분 - 2014.07.09 - by jhson [종료]
	
	function App(){
		this.run = function(){
			var vm = new m.ContentsModel();
			try{
				$.extend(vm, new m.NavModel());
				m.vm = vm;
				ko.applyBindings(vm);
				m.binded = true;
			}
			catch(e){}
		}
	}
	m.App = App;


	$(function(m, $, ko){
		var app = new m.App();
		app.run();
		//m.setMBdata(m.mb_name, m.mb_id);	
	}(window.m, $, ko));
	
	
});