// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "uisub" ], function($, carousel, ko, koutil, json, bootstrap) {

	function MVModel(pmid, pkword) {
		var self = this;
		self.mnamehello = (window.m.mb_name) ?  ko.observable(window.m.mb_name+"님! 안녕하세요."):ko.observable();
		self.mname = ko.observable(window.m.mb_name).extend({logChange: "회원성명~"});
		self.skword = ko.observable(pkword).extend({logChange: "검색어~"});		
		self.mid = ko.observable(pmid).extend({logChange: "아이디~"});
		self.mpw = ko.observable().extend({logChange: "비밀번호~"});
		self.mrememberid = ko.observable().extend({logChange: "아이디 저장~"});
		self.madmpw = ko.observable().extend({logChange: "관리자 비번~"});
		self.searcheditems = ko.observableArray();
		self.mainbanner = ko.observableArray();
		
		self.od_id = ko.observable();
		self.odata = ko.observableArray();
		self.odatas = ko.observableArray();
		
		// 아이템 여닫기 기능 추가 - 2014.06.21 bu jhson [시작]
		self.itemCollapse = function(data, event){
			try{
				var jqButton = $(event.target);
				var jqIcon = jqButton;
				
				jqIcon.toggleClass("icon-chevron-down");
				jqIcon.toggleClass("icon-chevron-up");
		
				jqButton.parentsUntil(".collapsible").parent()
						.find(".collapsible-body").toggle(0, function(){
							
						});
			}
			catch(e){}
		};
		// 아이템 여닫기 기능 추가 - 2014.06.21 bu jhson [종료]
	 
		//$("#step1").empty();
		//$("#step2").empty();
		//$("#step3").empty();
		//console.log("bookSearch selected_book = "+  self.selected_book());
		//console.log("bookSearch booksearchname = "+  self.booksearchname());
		//console.log("bookSearch it_id = "+  data.it_id());
		var od_id = self.od_id(1403170652);
		
		var param = {od_id: od_id};	
		//setgetMdata(param,function(){self.mdatas(mappedMdatas)});
		
		$.getJSON("/mobile/mb/order.php",param, function(allData, txtstatus) {
			//console.log("save donegoToMdata=="+txtstatus); 	//console.log("save Data=="+allData);
			console.table(allData.orders);
			//console.log(allData.orders);  
			//self.items.removeAll();
			//self.items(allData.lt);
			self.odata.removeAll();
			self.odatas.removeAll();
			/*$.map(allData.status, function(item) { 
				
				if(item.sqlmsg=="에러" || (!item.atype && !item.mtype)){
					alert('에러가 발생하였습니다. sql='+item.sqlmsg+', sqlitem ='+item.sqlmsgitem+', atype ='+item.atype+', mtype ='+item.mtype);
				}
			});*/
			
			$.map(allData.order, function(item) { self.odata.push(new m.setOdata(item))});
			$.map(allData.orders, function(item) { self.odatas.push(new m.setOdata(item))});
			//self.mdataCollection.sort(function(left, right) { return left.l == right.l ? 0 : (left.l < right.l ? -1 : 1) });
			//self.mdataCollection(mappedMdatas);
		}).fail(function(d, textStatus, error) {
			console.log(error);
			console.log(d);
			console.log(textStatus);
			alert('에러가 발생하였습니다');
		});
			
			                                           
		
	}
	m.MVModel = MVModel;
	
	
	// 초기화
	function Odata() {
		var self = this;
		
		var arrKeys = [
			"authdata",
			"ca_id",
			"ca_qty",
			"ca_status",
			"ca_status2",
			"cat_id",
			"d_status",
			"de_id",
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
			"mb_id",
			"od_admin_memo",
			"od_b_addr1",
			"od_b_addr2",
			"od_b_hp",
			"od_b_name",
			"od_b_tel",
			"od_b_zip1",
			"od_b_zip2",
			"od_bank_date",
			"od_bank_use",
			"od_cash",
			"od_cashreceiptyn",
			"od_chk_datetime",
			"od_coupon",
			"od_coupon_id",
			"od_coupon_use",
			"od_cp",
			"od_d_status",
			"od_datetime",
			"od_delivery",
			"od_delivery_use",
			"od_deposit_name",
			"od_email",
			"od_enuri",
			"od_escrow_no",
			"od_escrow_use",
			"od_hp",
			"od_id",
			"od_invoice",
			"od_invoice_time",
			"od_memo",
			"od_name",
			"od_password",
			"od_reserve",
			"od_s_status",
			"od_settle_log",
			"od_settle_price",
			"od_settle_use",
			"od_status",
			"od_status2",
			"od_tel",
			"od_tid",
			"od_total_price",
			"pa_ca_id",
			"pause_cnt",
			"pause_day",
			"pause_state",
			"s_date",
			"s_status",
			"site",
			"stock_use",
			"tax_use",
			"tempOLDorderID",
			"tempOLDordergoodsID",
			"update_datetime",
			"update_mb_id"
		];
		var iLen = arrKeys.length;
		
		for(var i = 0; i < iLen; i++){
			self[ arrKeys[i] ] = ko.observable("");
		}
	}
	m.Odata = Odata;
	
	// 바인딩 
	function setOdata(data) {
		var self = this;//new m.Odata();
		
		for(var d in data){
			self[d] = ko.observable( data[ d ] );
		}
	}
	m.setOdata = setOdata; 
		

	function App(){
		this.run = function(){
			var vm = new m.MVModel();
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