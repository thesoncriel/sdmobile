// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap" ], function($, carousel, ko, koutil, json, bootstrap) {

	function MyOrderModel(pmid, pkword) {
		var self = this;
		self.mnamehello = (window.m.mb_name) ?  ko.observable(window.m.mb_name+"님! 안녕하세요."):ko.observable();
		self.mname = ko.observable(window.m.mb_name).extend({logChange: "회원성명~"});
		self.skword = ko.observable(pkword).extend({logChange: "검색어~"});		
		self.mid = ko.observable(pmid).extend({logChange: "아이디~"});
		self.mpw = ko.observable().extend({logChange: "비밀번호~"});
		self.mrememberid = ko.observable().extend({logChange: "아이디 저장~"});
		self.madmpw = ko.observable().extend({logChange: "관리자 비번~"});
		self.searchParam = {
			svs: "book",
			stab: "",
			s_date: "",
			e_date: "",
			page: 1
		};
		
		self.myOrders = ko.observableArray();
		self.myOrderDetail = new m.MyOrder();
		self.myOrdersCash = [];
		//self.searchRange = ko.observable("전체");
		
		self.selectMonthRange = function(self, event){
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
		
		self.seeOrderDetail = function(myOrder, event){
			if (event === undefined) return;
			
			self.myOrderDetail.set( myOrder);
		}
				
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
		self.isSameParams = function(mParam){
			var bRet = true;
			for(var d in mParam){
				if (d !== "page"){
					bRet = bRet && (mParam[d] === self.searchParam[d]);
				}
			}
			return bRet;
		}
		self.readMyOrderList = function(mParam){
			var isSameParams = self.isSameParams(mParam);
			if ((isSameParams === true) && 
				(self.myOrdersCash[ mParam.page ] !== undefined)){
				self.setMyOrdersList( self.myOrdersCash[ mParam.page ] );
				self.searchParam = mParam;
				return;
			}
			
			if (isSameParams === false){
				self.myOrdersCash = [];
			}
			
			self.searchParam = mParam;
			$.getJSON("/mobile/mb/myorder_list.php", mParam, function(allData, txtstatus) {
				//console.log("save donegoToMdata=="+txtstatus); 	//console.log("save Data=="+allData);
				//console.table(allData);
				console.log(allData);  
				//self.items.removeAll();
				//self.items(allData.lt);
				//self.odata.removeAll();
				//self.odatas.removeAll();
				/*$.map(allData.status, function(item) { 
					
					if(item.sqlmsg=="에러" || (!item.atype && !item.mtype)){
						alert('에러가 발생하였습니다. sql='+item.sqlmsg+', sqlitem ='+item.sqlmsgitem+', atype ='+item.atype+', mtype ='+item.mtype);
					}
				});*/
								
				if ((allData === undefined) || (allData.length === 0)){
					if (self.searchParam.page === 1){
						self.setMyOrdersList( [] );
					}
					else{
						self.searchParam.page--;
					}
				}
				else{
					self.setMyOrdersList( allData );
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
		}
		self.prevMyOrderList = function(data, event){
			if (event === undefined) return;
			
			if(self.searchParam.page > 1){
				self.searchParam.page--;
				self.readMyOrderList( self.searchParam );
			}
			
			return false; 
		}
		self.nextMyOrderList = function(data, event){
			if (event === undefined) return;
			
			self.searchParam.page++;
			self.readMyOrderList( self.searchParam );
			
			return false;
		}
		self.setMyOrdersList = function(data){
			self.myOrdersCash[ self.searchParam.page ] = data;
			self.myOrders.removeAll();
			$.map(data, function(item) { self.myOrders.push(new m.MyOrder(item))});
		}
		
		self.readMyOrderList( self.searchParam );
		
		(function(){
			$("#form_searchOrder").submit(function(){
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
					s_date: $("input[name='s_date']").val(),
					e_date: $("input[name='e_date']").val(),
					svs: "book",
					stab: ""
				}
				self.readMyOrderList( mParam );
				
				return false;
			});
		})();
	}
	
	m.MyOrderModel = MyOrderModel;
	
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
		
		if (data){
			for(var i = 0; i < iLen; i++){
				self[ arrKeys[i] ] = ko.observable( data[ arrKeys[i] ] );
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
		
		self.set = function(myOrder){
			var arrKeys = m.MyOrderProps;
			var iLen = arrKeys.length;
			
			for(var i = 0; i < iLen; i++){
				self[ arrKeys[i] ]( myOrder[ arrKeys[i] ]() );
			}
		}
		
	}
	m.MyOrder = MyOrder;


	function App(){
		this.run = function(){
			var vm = new m.MyOrderModel();
			ko.applyBindings(vm);
		}
	}
	m.App = App;


	$(function(m, $, ko){
		var app = new m.App();
		app.run();
		//m.setMBdata(m.mb_name, m.mb_id);	
	}(window.m, $, ko));
	
	
});