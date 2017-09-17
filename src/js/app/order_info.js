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
			
			this.initZipcode();
		}
		
		
	}
	m.App = App;


	$(function(m, $, ko){
		var app = new m.App();
		app.run();
		//m.setMBdata(m.mb_name, m.mb_id);	
	}(window.m, $, ko));
	
	
});