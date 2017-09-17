// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap","mobilebase","jqueryfinger"], function($, carousel, ko, koutil, json, bootstrap,mobilebase,jqueryfinger) {

	function MyPageModel() {
		
		var self = this;	
						
		var _PLAYSTORE_URL = "market://details?id=kr.imgtech.zoneplayer";				
		var _APP_INSTALL_URL_ANDROID = _PLAYSTORE_URL;
		
		self.myLecture = {		
			loginNow : false,
			itemList : ko.observableArray(),
			tbList : ko.observableArray(),
			init : function(){
				$(".phead a").addClass("collapsed");
				$(".subjecttitle a").addClass("collapsed");				
				/*$("body").append( $("<div id=\"wrap_modal\"></div>")
					.click(function(){
						self.myLecture.hide4dep();	
						self.myLecture.hideMessage();		 			
						return false;
					})                                                
				);
				$("body").append( $("<div id=\"message_layer\"></div>")
					.click(function(){
						self.myLecture.hideMessage();										
						return false;
					}) 
				);*/	
				if(!m.mb_id){
					$("#login_error").modal('show');		
					self.myLecture.showModalBackground();	
					return false;
				}
				
				$("#login_error").on("hide.bs.modal", function(e){
					console.log(e);
					if(self.myLecture.loginNow === false){
						m.viewSlider.prev();
					}
					self.myLecture.loginNow = false;
				});
			},
			setData : function(data){				
				this.itemList.removeAll();					
				$.map(data, function(item){					
					self.myLecture.itemList.push(item);								
				});
				self.myLecture.init();											
			},
			setTbData : function(data){
				this.tbList.removeAll();
				$.map(data, function(item){					
					self.myLecture.tbList.push(item);							
				});									
			},
			load: function(){
				$.getJSON("/mobile/mb/mypage_lecture.php",{mb_id: m.mb_id}, function(data){
					console.log(data);
					self.myLecture.setData(data);
					self.myLecture.loadContentData(0, 0);
				});
			},
			loadContentData : function(tb_id,it_id){	
				console.log(tb_id + "," + it_id);
				self.showLoadingModal();
				$.getJSON("/mobile/mb/tbcontentlist.php",{tb_id: tb_id, it_id: it_id},function(data){
					console.log(data);								
					self.myLecture.setTbData(data);
					self.hideLoadingModal();													
				});							
			},
			showByParam: function(param){
				if (param.bbsId){
					self.myLecture.loadContentData(param.bbsId, param.subId/*it_id*/);
					m.viewSlider.left( "#view_lectureContentList" );
				}
				else{
					this.show();
				}
			},
			show: function(){
				self.myLecture.load();
				m.viewSlider.left( "#view_lectureContent" );
			},
			show4dep : function(item, event){
				var mParam = m.parseParam( $(event.currentTarget).attr("href") );
				
				self.myLecture.loadContentData(item.tb_id, mParam.bbsId/*it_id*/);
				m.viewSlider.left( "#view_lectureContentList" );
				/*
				var tbId = item.tb_id;
				var tb_name = item.tb_name;
				var it_id = item.it_id;
				var width = $("#view_lectureContent").width();
				var height = $("#view_lectureContent").height();				
				if(event.bubbles===true){
					$("#tbContent").css({						
						"position":"absolute",
						"background":"#FFF",
						"margin-left":"-"+width+"px",						
						"display":"block",
						"z-index":"1039",
						"border":"1px solid #CCC",					
						"top":"0",
						"width":width+"px",
						"box-shadow": "5px 5px 10px #333",
						"padding-bottom":"30px"						
					});
					
					$("#tbName").text(tb_name);										
					self.myLecture.loadContentData(tbId,it_id);
					$("#tbContent").animate({
						"margin-left":"0px"						
					},500,function(){
						$(window).scrollTop(0);						
						self.myLecture.showModalBackground();
					});													
				}
				*/
			},
			hide4dep : function(){
				/*
				var width = $("#view_lectureContent").width();				
				$("#tbContent").animate({
					"margin-left":"-"+width+"px"									
				},500).animate({
					"display":"none"						
				},100, function(){
					self.myLecture.hideModalBackground();										
					$("#tbContent").css({
						"box-shadow": "none"
					});
				});
				*/
			},	
			showMessage : function(message){				
				if(event.bubbles === true){
					self.myLecture.showModalBackground();
					$("#message_layer p").remove();
					$("#message_layer").append("<p>"+message+"</p>");
					$("#message_layer").fadeIn();
					$("#message_layer").css({
						"box-shadow": "5px 5px 10px #333"
					});
				}
			},
			hideMessage : function(){						
				$("#message_layer").fadeOut();
				self.myLecture.hideModalBackground();
				$("#message_layer").css({
					"box-shadow": "none"
				});
			},
			showModalBackground : function(){
				//$("#wrap_modal").fadeIn();
			},
			hideModalBackground : function(){
				//$("#wrap_modal").fadeOut();
			},		
			set_ad_app : function(){ //앱 설치(Android only)				
				var result=confirm("Zone@Player 앱을 설치하거나\n업데이트하시면\n이용할 수 있습니다.\n설치 하시겠습니까?");
				if(result){					
					location.href=_APP_INSTALL_URL_ANDROID;
				}
			},
			startZonePlayer : function(target){
				if(event.bubbles===true){					
					document.appframe.location = target;
        			setTimeout(self.myLecture.callback(), 500);
				}
			},
			callback : function() { 								
				try {
					var s = document.appframe.document.body;							
					var resultDiv = document.getElementById("applinkDiv");
					resultDiv.innerHTML = "Installed!<p>" + s;					
				} catch (e) {					
					if (confirm("앱이 설치 되어 있지 않습니다.\n\n앱을 설치하시겠습니까?\n\n이미 설치하신경우 새로고침 해주세요!")) {
						alert("설치후 반드시 새로고침을 해주세요.");
						location.href = _APP_INSTALL_URL_ANDROID;
						return false;
					}
				}
			},
			executeApp : function(target) {	
				if(event.bubbles===true){							
					$(location).attr('href',target);
				}				
			},
		};// myLecture object end::::::::::::::::::
		
		self.coupon = new m.CouponViewController().init({
			form: "#form_searchCoupon", 
			view: "#view_coupon", 
			useDateRange: true,
			colTotalRowCount: "cou_cnt",
			customField: ["cou_total_cnt"]
		});
		self.mileage = new m.DefaultViewController().init({
			form: "#form_searchMileage", 
			view: "#view_mileage",
			useDateRange: true, 
			colTotalRowCount: "mil_cnt",
			customField: ["mb_cash"]
		});
	}
	
	MyPageModel.prototype = new m.BaseViewModel();
	MyPageModel.prototype.constructor = MyPageModel;
	
	m.MyPageModel = MyPageModel;
	
	
	m.DefaultViewController = function(){
		var self = this;
		
		self.jqForm = null;
		self.list = null;
		self.pagination = null;
		self.data = null;
		
		self.evt_dataloaded = [];
		self.dataloaded = function(callback){
			this.evt_dataloaded.push(callback);
		};
		self.onDataLoaded = function(data){
			try{
				var iLen = this.evt_dataloaded.length;
				
				for(var i = 0; i < iLen; i++){
					this.evt_dataloaded[i](data);
				}
			}
			catch(e){}
		};
		
		self.evt_shown = [];
		self.shown = function(callback){
			this.evt_shown.push(callback);
		};
		self.onShown = function(data){
			try{
				var iLen = this.evt_shown.length;
				
				for(var i = 0; i < iLen; i++){
					this.evt_shown[i](data);
				}
			}
			catch(e){}
		};
		
	};
	
	m.DefaultViewController.prototype = {
		init: function(mOption){
			var self = this;
			var defaultOption = {
				form: "#form",
				view: "#view",
				useDateRange: false,
				colTotalRowCount: "totalRowCount",
				colList: "list",
				usePagenation: true,
				pageClickToTop: false,
				customField: [],
				useEndDatePlus: true
			};
			
			$.extend(defaultOption, mOption);
			
			self.option = defaultOption;
			self.jqForm = $(self.option.form);
			self.jqView = $(self.option.view);
			self.list = ko.observableArray();

			self.onSubmitSearch = function(e){
				self.search();
				
				return false;
			};
			
			self.jqForm.submit(self.onSubmitSearch);
			self.jqView.on("m.slidechanged", function(empty, event){
				self.onShown(event);
			});
			
			if (self.option.useDateRange === true){
				self.initDateRange();
			}
			
			if (self.option.usePagenation === true){
				self.initPagenation();
			}
			
			if (self.option.customField.length > 0){
				self.initCustomField();
			}

			return this;
		},
		initDateRange: function(){
			var self = this;
			var jqForm = self.jqForm;
			var jqDateRangeSelector = jqForm.find("*[data-role='dateRangeSelector']");
			
			jqDateRangeSelector.find("button[data-range]").click(function(){
				var iDayRange = $.tryParseInt( $(this).data("range") );
				var dateNow = new Date();;
				var sDateStart = "";
				var sDateEnd = $.formatDate(dateNow);//$.addDate(dateNow, 1);
				
				switch (iDayRange){
					case 7:
					case 30:
					case 90:
						sDateStart = $.addDate(dateNow, -1 * iDayRange);
						break;
					default:
						sDateStart = $.addDate(dateNow, -1);
						break;
				}
				
				self.setDateRange( sDateStart, sDateEnd );
			});
		},
		initPagenation: function(){
			var self = this;
			
			self.pagination = new m.Pagination().init({pageClickToTop: self.option.pageClickToTop});
			self.dataloaded(function(data){
				self.pagination.generateByMap(data);
			});
			self.pagination.pageclick(function(data){
				self.search( data.page );
			});
		},
		initCustomField: function(){
			var aCustomField = this.option.customField;
			var iLen = aCustomField.length;
			
			for(var i = 0; i < iLen; i++){
				this[ aCustomField[ i ] ] = ko.observable();
			}
		},
		clearDateRange: function(){
			this.setDateRange("", "");
		},
		setDateRange: function(date1, date2){
			var jqDate = this.jqForm.find("[data-role='dateRange'] input[type='date']");
			
			console.log("DefaultViewController.setDateRange");
			console.log(date1);
			console.log(date2);
			
			jqDate.eq(0).val( date1 );
			jqDate.eq(1).val( date2 );
		},
		setData: function(data){
			if (data){
				this.list(data);
			}
			else{
				try{
					this.list.removeAll();
				}
				catch(e){}
			}
		},
		setCustomField: function(data){
			var aCustomField = this.option.customField;
			var iLen = aCustomField.length;
			var sField = "";
			
			for(var i = 0; i < iLen; i++){
				sField = aCustomField[ i ];
				this[ sField ]( data[ sField ] );
			}
		},
		getPage: function(){
			return $.tryParseInt( this.jqForm.find("[name='page']").val() );
		},
		setPage: function(page){
			this.jqForm.find("[name='page']").val(page);
		},
		getRows: function(){
			return $.tryParseInt( this.jqForm.find("[name='rows']").val() );
		},
		setRows: function(rows){
			this.jqForm.find("[name='rows']").val(rows);
		},
		search: function(page){
			var self = this;
			var jqForm = self.jqForm;
			var mParam = null;
			var iPage = page || 1;
			
			this.setPage( iPage );
			mParam = m.serializeMap(jqForm);
			
			if (this.option.useEndDatePlus === true){
				mParam.e_date = $.addDate(mParam.e_date, 1);
			}
			
			console.log(mParam);
			$.getJSON( self.jqForm.attr("action"), mParam, function(data){
				console.log("DefaultViewController.search");
				console.log(data);
				
				self.setData( data[ self.option.colList ] );
				self.setCustomField( data );
				
				self.data = data;
				data.page = iPage;
				data.rows = self.getRows();
				data.totalRowCount = $.tryParseInt( data[ self.option.colTotalRowCount ] );
				self.onDataLoaded(data);
			} );
		},
		
		isVisible: function(){
			return this.jqView.hasClass("active-view");
		},
		show: function(){
			this.clearDateRange();
			this.search();
			m.viewSlider.left( this.jqView );
		},
		hide: function(){
			m.viewSlider.prev();
		}
	};
	
	m.CouponViewController = function(){
		
	};
	
	m.CouponViewController.prototype = new m.DefaultViewController();
	$.extend(m.CouponViewController.prototype, {
		constructor : m.CouponViewController,
		init : function(mOption){
			m.DefaultViewController.prototype.init.call(this, mOption);
			
			var self = this;
			
			self.jqFormRegCoupon = $(self.option.formRegCoupon || "#form_regOfflineCoupon");
			self.jqFormRegCoupon.submit( self.onSubmitRegCoupon );
			
			self.onSubmitRegCoupon = function(e){
				var jqForm = self.jqFormRegCoupon;
				var sParam = jqForm.serialize();
				
				$.post( self.jqFormRegCoupon.attr("action"), sParam, function(dataAll){
					//console.log(dataAll);
					var sResult = dataAll;
					
					if(sResult === "1"){
						alert("쿠폰 등록이 완료 되었습니다.");
						self.search(1);
					}
					else if(sResult === "2"){
						alert("쿠폰 적용이 완료 되어 온라인 쿠폰으로 교환 되었습니다.");
						self.search(1);
					}
					else if(sResult === "99"){
						alert("로그인이 필요 합니다.");
					}
					else if(sResult === "noaddr"){
						alert("교환 상품에 도서가 포함된 경우 회원 정보란에 주소가 입력 되어있어야 합니다.\n\r상단 정보수정을 클릭하신후 주소를 입력하시고 쿠폰을 재사용 부탁드립니다.");
					}
					else if(sResult === "n"){
						alert("쿠폰번호가 틀렸거나 존재 하지 않는 쿠폰입니다.");
					}
					else if(sResult === "j"){
						alert('이미 사용한 쿠폰입니다.');
					}
					
					self.setCouponNo("");
				} );
				
				return false;
			};
			
			self.jqFormRegCoupon.submit( self.onSubmitRegCoupon );
			
			return this;
		},
		setData : function(data){
			if (data){
				var iLen = data.length;
			
				for(var i = 0; i < iLen; i++){
					data[ i ].cp_period_edate = data[ i ].cp_period_edate.replace("<br>", "");
				}
				
				this.list(data);
			}
			else{
				try{
					this.list.removeAll();
				}
				catch(e){}
			}
		},
		setCouponNo: function(code){
			this.jqFormRegCoupon.find("[name='coupon_no']").val(code);
		}
	});
});