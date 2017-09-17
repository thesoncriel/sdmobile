// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "mobilebase" ], function($, carousel, ko, koutil, json, bootstrap, mobilebase) {

	function MyOrderModel(pmid, pkword) {
		var self = this;
		/*self.mnamehello = (window.m.mb_name) ?  ko.observable(window.m.mb_name+"님! 안녕하세요."):ko.observable();
		self.mname = ko.observable(window.m.mb_name).extend({logChange: "회원성명~"});
		self.skword = ko.observable(pkword).extend({logChange: "검색어~"});		
		self.mid = ko.observable(pmid).extend({logChange: "아이디~"});
		self.mpw = ko.observable().extend({logChange: "비밀번호~"});
		self.mrememberid = ko.observable().extend({logChange: "아이디 저장~"});
		self.madmpw = ko.observable().extend({logChange: "관리자 비번~"});
		*/
		
		// FIXME: 추후 내강의실 - 도서, 모의고사 등으로 분류할 필요 있음.
		self.myBooks = new m.MyOrderController({
			view: "#view_myBookList",
			form: "#form_searchBooks"
		});
		self.myOrder = new m.MyOrderController({
			view: "#view_myOrderList",
			form: "#form_searchOrder",
			lib: "receipt"
		});
		self.myBooks.init(); 
		self.myOrder.init();
		
		//self.myOrders = ko.observableArray();
		//self.myOrderDetail = new m.MyOrder();
		//self.myOrder.cache = [];
		//self.searchRange = ko.observable("전체");
	
		/**
		 self.readMyOrderList({
					svs: "book",
					stab: "",
					s_date: sStartDate,
					e_date: sEndDate,
					page: 1
				}); 
		 */
		
		/**
		 * 
		 mParam = {
		 	svs: "book",
			stab: "",
			s_date: "",
			e_date: "",
			page: 1
		} 
		 */

		
		
	}
	MyOrderModel.prototype = new m.BaseViewModel();
	MyOrderModel.prototype.constructor = MyOrderModel;
	
	m.MyOrderModel = MyOrderModel;
	
	m.MyOrderController = function(mOption){
		var self = this;
		var sViewSelector = mOption.view;
		var sFormSelector = mOption.form;
		
		self.option = mOption;
		self.libIncluded = false;
		
		this.searchParam = {
			svs: "book",
			stab: "",
			s_date: "",
			e_date: "",
			page: 1,
			rows: 5
		};
		this.jqForm = $( sFormSelector );
		this.list = ko.observableArray();
		this.detail = new m.MyOrder;
		this.cache = [];
		
		this.init = function(){
			var jqForm = this.jqForm;
	
			jqForm.submit(function(){
				/*
				var jqForm = $( this );
				var jqChecked = jqForm.find("input[name='search_range_month']:checked");
				
				if (jqChecked.length > 0){
					self.searchRange( jqChecked.next().text() );
				}
				else{
					self.searchRange( "전체" );
				}
				
				*/
				var mParam = {
					page: 1,
					s_date: jqForm.find("input[name='s_date']").val(),
					e_date: jqForm.find("input[name='e_date']").val(),
					svs: "book",
					stab: "",
					rows: jqForm.find("input[name='rows']").val(),
				};
				self.readMyOrderList( mParam );
				
				return false;
			});
		};
		
		this.selectMonthRange = function(self, event){
			if (event === undefined) return;
			
			var jqThis = $(event.currentTarget);
			var jqButton = jqThis.parent();
			var jqStartDate = $("input[name='s_date']");
			var jqEndDate = $("input[name='e_date']");
			var elemRadio = event.currentTarget;
			var sTagName = jqThis.prop("tagName");
			var iDay = $.tryParseInt( jqThis.val() );
			var dateNow = new Date();
			var sEndDate = $.formatDate(dateNow, "-");
			var sStartDate = $.addDate(dateNow, -iDay);
						
			if (elemRadio.checked === true){
				jqButton.siblings().removeClass("btn-primary");
				jqButton.addClass("btn-primary");
			}
			
			jqStartDate.val( sStartDate );
			jqEndDate.val( sEndDate );
		};
		this.seeOrderDetail = function(myOrder, event){
			if (event === undefined) return;
			
			self.detail.set( myOrder);
		};
		this.show = function(){
			this.searchParam.page = 1;
			this.includeLibrary();
			this.load();
			m.viewSlider.left( sViewSelector );
		};
		this.isSameParams = function(mParam){
			var bRet = true;
			for(var d in mParam){
				if (d !== "page"){
					bRet = bRet && (mParam[d] === this.searchParam[d]);
				}
			}
			return bRet;
		};
		this.load = function(){
			this.readMyOrderList( this.searchParam );
		};
		this.includeLibrary = function(){
			if (this.libIncluded === false){
				if ((this.option.lib) && (this.option.lib !== "")){
					var self = this;
					require([ this.option.lib ], function(receipt){
						self.libIncluded = true;
					});
				}
				else{
					this.libIncluded === true;
				}
			}
		},
		this.readMyOrderList = function(mParam){
			var isSameParams = self.isSameParams(mParam);
			if ((isSameParams === true) && 
				(self.cache[ mParam.page ] !== undefined)){
				self.setMyOrdersList( self.cache[ mParam.page ] );
				self.searchParam = mParam;
				return;
			}
			
			if (isSameParams === false){
				self.cache = [];
			}
			
			self.searchParam = mParam;
			console.log(mParam);
			$.getJSON(self.jqForm.attr("action"), mParam, function(data, txtstatus) {
				//console.log(allData);
				
				//var data = $.parseJSON( allData );
				//console.log("save donegoToMdata=="+txtstatus); 	//console.log("save Data=="+allData);
				//console.table(allData);
				console.log(data);  
				//self.items.removeAll();
				//self.items(allData.lt);
				//self.odata.removeAll();
				//self.odatas.removeAll();
				/*$.map(allData.status, function(item) { 
					
					if(item.sqlmsg=="에러" || (!item.atype && !item.mtype)){
						alert('에러가 발생하였습니다. sql='+item.sqlmsg+', sqlitem ='+item.sqlmsgitem+', atype ='+item.atype+', mtype ='+item.mtype);
					}
				});*/
								
				if ((data === undefined) || (data.length === 0)){
					if (self.searchParam.page === 1){
						self.setMyOrdersList( [] );
					}
					else{
						self.searchParam.page--;
					}
				}
				else{
					self.setMyOrdersList( data );
				}
				
				
				//$.map(allData.orders, function(item) { self.odatas.push(new m.setOdata(item))});
				//self.mdataCollection.sort(function(left, right) { return left.l == right.l ? 0 : (left.l < right.l ? -1 : 1) });
				//self.mdataCollection(mappedMdatas);
			}).fail(function(d, textStatus, error) {
			
				console.log(error);
				console.log(d);
				console.log(textStatus);
				alert('에러가 발생하였습니다');
			});
		};
		this.prevMyOrderList = function(data, event){
			if (event === undefined) return;
			
			if(self.searchParam.page > 1){
				self.searchParam.page--;
				self.readMyOrderList( self.searchParam );
			}
			
			return false; 
		};
		this.nextMyOrderList = function(data, event){
			if (event === undefined) return;
			
			self.searchParam.page++;
			self.readMyOrderList( self.searchParam );
			
			return false;
		};
		this.setMyOrdersList = function(data){
			self.cache[ self.searchParam.page ] = data;
			self.list.removeAll();
			$.map(data, function(item) { self.list.push(new m.MyOrder(item));});
		};
		
		//카드전표1
		this.onClickReceiptByTID_card = function(data, event){
			var sArg1 = ((data.it_type() === "3") || (data.it_type() === "5"))? "sidaegosi" : "sidaedu1";
			var sArg2 = data.od_tid();
			var sArg3 = data.authdata();
			
			console.log(data);
			window.showReceiptByTID(sArg1, sArg2, sArg3);
			
			return false;
		};
		// 카드전표2
		this.onClickReceiptByTID_ars = function(data, event){
			var sArg1 = "1011940";
			var sArg2 = data.od_tid();
			var sArg3 = data.authdata();
			
			console.log(data);
			window.showReceiptByTID(sArg1, sArg2, sArg3);
			
			return false;
		};
		// 현금영수증
		this.onClickCashReceipts = function(data, event){
			var sArg1 = ((data.it_type() === "3") || (data.it_type() === "5"))? "sidaegosi" : "sidaedu1";
			var sArg2 = data.od_id();
			var sArg3 = "001";
			var sArg4 = ((data.od_settle_use() === "real"))? "BANK" : "CAS";
			var sArg5 = "service";
			
			console.log(data);
			window.showCashReceipts(sArg1, sArg2, sArg3, sArg4, sArg5);
			
			return false;
		};
	};// myOrder [ends] :::::
	
	
	m.MyOrderProps = [
		"authdata",
		"ca_id",
		"ca_qty",
		"ca_status",
		"ca_status2",
		"cat_id",
		"d_status",
		"de_id",
		"deliveryTraceurl",
		"e_date",
		"ex_price",
		"img",
		"it_cash",
		"it_coupon",
		"it_coupon_use",
		"it_cp",
		"it_delivery",
		"it_delivery_use",
		"it_enuri",
		"it_id",
		"it_name",
		"it_opt",
		"it_price",
		"it_res_price",
		"it_settle_price",
		"it_type",
		"life_e_date",
		"life_s_date",
		"od_b_name",
		"od_bank_use",
		"od_deposit_name",
		"od_id",
		"od_invoice",
		"od_invoice_time",
		"od_settle_price",
		"od_settle_use",
		"od_status",
		"od_status2",
		"od_tid",
		"pa_ca_id",
		"pause_cnt",
		"pause_day",
		"pause_state",
		"s_date",
		"s_status",
		"site",
		"stock_use",
		"tax_use",
		"tempOLDordergoodsID",
		"update_datetime",
		"update_mb_id"
	];
	
	
	// 초기화 및 바인딩
	function MyOrder(data) {
		var self = this;
		var arrKeys = m.MyOrderProps;
		var iLen = arrKeys.length;
		var sImg = "";
		
		if (data){
			for(var i = 0; i < iLen; i++){
				self[ arrKeys[i] ] = ko.observable( data[ arrKeys[i] ] );
			}
			
			sImg = self.img();
			
			if (sImg !== undefined){
				self.img( "/" + sImg.replace( /\.\.\//g, "" ) );
			}
		}
		else{
			for(var i = 0; i < iLen; i++){
				self[ arrKeys[i] ] = ko.observable("");
			}
		}
		
		self.itemTotalDiscount = ko.computed(function(){
			var iCash 	= $.tryParseInt( self.it_cash() );
			var iCoupon = $.tryParseInt( self.it_coupon() );
			var iCp 	= $.tryParseInt( self.it_cp() );
			var iEnuri 	= $.tryParseInt( self.it_enuri() );
			
			return iCash + iCoupon + iCash + iEnuri;
		});
		/*
		self.od_status_kor = ko.computed(function(){
			switch( $.tryParseInt(self.od_status() ) ){
				case 0: return "입금전";
				case 1: return "입금확인";
				case 2: return "배송준비중";
				case 3: return "배송중";
				case 4: return "배송완료";
				default: return "";
			}
		});
		
		self.it_type_kor = ko.computed(function(){
			switch( $.tryParseInt(self.it_type() ) ){
				case 0: return "도서";
				case 1: return "동영상";
				case 2: return "모의고사";
				case 3: return "CP";
				case 4: return "평생온라인";
				default: return "";
			}
		});
		*/
		self.set = function(myOrder){
			var arrKeys = m.MyOrderProps;
			var iLen = arrKeys.length;
			var sImg = "";
			
			for(var i = 0; i < iLen; i++){
				self[ arrKeys[i] ]( myOrder[ arrKeys[i] ]() );
			}
			
			sImg = self.img();
			
			if (sImg !== undefined){
				self.img( "/" + sImg.replace( /\.\.\//g, "" ) );
			}
		};
		
	}
	m.MyOrder = MyOrder;
/*

	function App(){
		this.run = function(){
			var vm = new m.MyOrderModel();
			ko.applyBindings(vm);
		};
	}
	m.App = App;


	$(function(m, $, ko){
		var app = new m.App();
		app.run();
		//m.setMBdata(m.mb_name, m.mb_id);	
	}(window.m, $, ko));
	
	*/
});