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
			
			
		self.collapse = function(){
			
		}
	}
	m.MVModel = MVModel;
	
	
	// 초기화
	function Odata() {
		var self = this;
		self.authdata = ko. observable("");
		self.ca_id = ko. observable("");
		self.ca_qty = ko. observable("");
		self.ca_status = ko. observable("");
		self.ca_status2 = ko. observable("");
		self.cat_id = ko. observable("");
		self.d_status = ko. observable("");
		self.de_id = ko. observable("");
		self.e_date = ko. observable("");
		self.ex_price = ko. observable("");
		self.it_cash = ko. observable("");
		self.it_coupon = ko. observable("");
		self.it_coupon_use = ko. observable("");
		self.it_cp = ko. observable("");
		self.it_delivery = ko. observable("");
		self.it_delivery_use = ko. observable("");
		self.it_enuri = ko. observable("");
		self.it_id = ko. observable("");
		self.it_name = ko. observable("");
		self.it_opt = ko. observable("");
		self.it_price = ko. observable("");
		self.it_res_price = ko. observable("");
		self.it_settle_price = ko. observable("");
		self.it_type = ko. observable("");
		self.life_e_date = ko. observable("");
		self.life_s_date = ko. observable("");
		self.mb_id = ko. observable("");
		self.od_admin_memo = ko. observable("");
		self.od_b_addr1 = ko. observable("");
		self.od_b_addr2 = ko. observable("");
		self.od_b_hp = ko. observable("");
		self.od_b_name = ko. observable("");
		self.od_b_tel = ko. observable("");
		self.od_b_zip1 = ko. observable("");
		self.od_b_zip2 = ko. observable("");
		self.od_bank_date = ko. observable("");
		self.od_bank_use = ko. observable("");
		self.od_cash = ko. observable("");
		self.od_cashreceiptyn = ko. observable("");
		self.od_chk_datetime = ko. observable("");
		self.od_coupon = ko. observable("");
		self.od_coupon_id = ko. observable("");
		self.od_coupon_use = ko. observable("");
		self.od_cp = ko. observable("");
		self.od_d_status = ko. observable("");
		self.od_datetime = ko. observable("");
		self.od_delivery = ko. observable("");
		self.od_delivery_use = ko. observable("");
		self.od_deposit_name = ko. observable("");
		self.od_email = ko. observable("");
		self.od_enuri = ko. observable("");
		self.od_escrow_no = ko. observable("");
		self.od_escrow_use = ko. observable("");
		self.od_hp = ko. observable("");
		self.od_id = ko. observable("");
		self.od_invoice = ko. observable("");
		self.od_invoice_time = ko. observable("");
		self.od_memo = ko. observable("");
		self.od_name = ko. observable("");
		self.od_password = ko. observable("");
		self.od_reserve = ko. observable("");
		self.od_s_status = ko. observable("");
		self.od_settle_log = ko. observable("");
		self.od_settle_price = ko. observable("");
		self.od_settle_use = ko. observable("");
		self.od_status = ko. observable("");
		self.od_status2 = ko. observable("");
		self.od_tel = ko. observable("");
		self.od_tid = ko. observable("");
		self.od_total_price = ko. observable("");
		self.pa_ca_id = ko. observable("");
		self.pause_cnt = ko. observable("");
		self.pause_day = ko. observable("");
		self.pause_state = ko. observable("");
		self.s_date = ko. observable("");
		self.s_status = ko. observable("");
		self.site = ko. observable("");
		self.stock_use = ko. observable("");
		self.tax_use = ko. observable("");
		self.tempOLDorderID = ko. observable("");
		self.tempOLDordergoodsID = ko. observable("");
		self.update_datetime = ko. observable("");
		self.update_mb_id = ko. observable("");	
	}
	m.Odata = Odata;
	
	// 바인딩 
	function setOdata(data) {
		var self = new m.Odata();
		self.authdata = ko. observable(data.authdata);
		self.ca_id = ko. observable(data.ca_id);
		self.ca_qty = ko. observable(data.ca_qty);
		self.ca_status = ko. observable(data.ca_status);
		self.ca_status2 = ko. observable(data.ca_status2);
		self.cat_id = ko. observable(data.cat_id);
		self.d_status = ko. observable(data.d_status);
		self.de_id = ko. observable(data.de_id);
		self.e_date = ko. observable(data.e_date);
		self.ex_price = ko. observable(data.ex_price);
		self.it_cash = ko. observable(data.it_cash);
		self.it_coupon = ko. observable(data.it_coupon);
		self.it_coupon_use = ko. observable(data.it_coupon_use);
		self.it_cp = ko. observable(data.it_cp);
		self.it_delivery = ko. observable(data.it_delivery);
		self.it_delivery_use = ko. observable(data.it_delivery_use);
		self.it_enuri = ko. observable(data.it_enuri);
		self.it_id = ko. observable(data.it_id);
		self.it_name = ko. observable(data.it_name);
		self.it_opt = ko. observable(data.it_opt);
		self.it_price = ko. observable(data.it_price);
		self.it_res_price = ko. observable(data.it_res_price);
		self.it_settle_price = ko. observable(data.it_settle_price);
		self.it_type = ko. observable(data.it_type);
		self.life_e_date = ko. observable(data.life_e_date);
		self.life_s_date = ko. observable(data.life_s_date);
		self.mb_id = ko. observable(data.mb_id);
		self.od_admin_memo = ko. observable(data.od_admin_memo);
		self.od_b_addr1 = ko. observable(data.od_b_addr1);
		self.od_b_addr2 = ko. observable(data.od_b_addr2);
		self.od_b_hp = ko. observable(data.od_b_hp);
		self.od_b_name = ko. observable(data.od_b_name);
		self.od_b_tel = ko. observable(data.od_b_tel);
		self.od_b_zip1 = ko. observable(data.od_b_zip1);
		self.od_b_zip2 = ko. observable(data.od_b_zip2);
		self.od_bank_date = ko. observable(data.od_bank_date);
		self.od_bank_use = ko. observable(data.od_bank_use);
		self.od_cash = ko. observable(data.od_cash);
		self.od_cashreceiptyn = ko. observable(data.od_cashreceiptyn);
		self.od_chk_datetime = ko. observable(data.od_chk_datetime);
		self.od_coupon = ko. observable(data.od_coupon);
		self.od_coupon_id = ko. observable(data.od_coupon_id);
		self.od_coupon_use = ko. observable(data.od_coupon_use);
		self.od_cp = ko. observable(data.od_cp);
		self.od_d_status = ko. observable(data.od_d_status);
		self.od_datetime = ko. observable(data.od_datetime);
		self.od_delivery = ko. observable(data.od_delivery);
		self.od_delivery_use = ko. observable(data.od_delivery_use);
		self.od_deposit_name = ko. observable(data.od_deposit_name);
		self.od_email = ko. observable(data.od_email);
		self.od_enuri = ko. observable(data.od_enuri);
		self.od_escrow_no = ko. observable(data.od_escrow_no);
		self.od_escrow_use = ko. observable(data.od_escrow_use);
		self.od_hp = ko. observable(data.od_hp);
		self.od_id = ko. observable(data.od_id);
		self.od_invoice = ko. observable(data.od_invoice);
		self.od_invoice_time = ko. observable(data.od_invoice_time);
		self.od_memo = ko. observable(data.od_memo);
		self.od_name = ko. observable(data.od_name);
		self.od_password = ko. observable(data.od_password);
		self.od_reserve = ko. observable(data.od_reserve);
		self.od_s_status = ko. observable(data.od_s_status);
		self.od_settle_log = ko. observable(data.od_settle_log);
		self.od_settle_price = ko. observable(data.od_settle_price);
		self.od_settle_use = ko. observable(data.od_settle_use);
		self.od_status = ko. observable(data.od_status);
		self.od_status2 = ko. observable(data.od_status2);
		self.od_tel = ko. observable(data.od_tel);
		self.od_tid = ko. observable(data.od_tid);
		self.od_total_price = ko. observable(data.od_total_price);
		self.pa_ca_id = ko. observable(data.pa_ca_id);
		self.pause_cnt = ko. observable(data.pause_cnt);
		self.pause_day = ko. observable(data.pause_day);
		self.pause_state = ko. observable(data.pause_state);
		self.s_date = ko. observable(data.s_date);
		self.s_status = ko. observable(data.s_status);
		self.site = ko. observable(data.site);
		self.stock_use = ko. observable(data.stock_use);
		self.tax_use = ko. observable(data.tax_use);
		self.tempOLDorderID = ko. observable(data.tempOLDorderID);
		self.tempOLDordergoodsID = ko. observable(data.tempOLDordergoodsID);
		self.update_datetime = ko. observable(data.update_datetime);
		self.update_mb_id = ko. observable(data.update_mb_id);
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