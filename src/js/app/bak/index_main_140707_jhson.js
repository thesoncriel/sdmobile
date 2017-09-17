// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap"], function($, carousel, ko, koutil, json, bootstrap) {

	function MVModel(pmid, pkword) {
		var self = this;
		self.mnamehello = (window.m.mb_name) ?  ko.observable(window.m.mb_name+"님! 안녕하세요."):ko.observable();
		console.log( self.mnamehello() );
		self.mname = ko.observable(window.m.mb_name).extend({logChange: "회원성명~"});
		self.skword = ko.observable(pkword).extend({logChange: "검색어~"});		
		self.mid = ko.observable(pmid).extend({logChange: "아이디~"});
		self.mpw = ko.observable().extend({logChange: "비밀번호~"});
		self.mrememberid = ko.observable().extend({logChange: "아이디 저장~"});
		self.madmpw = ko.observable().extend({logChange: "관리자 비번~"});
		self.searcheditems = ko.observableArray();
		self.mainbanner = ko.observableArray();
		
		
			
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
			
		}	
		
		
		self.searchkword = function(data,event) {
			//event.preventDefault();
			if(self.skword()=='' || self.skword().length<2) {alert("강의, 도서, 저자, 강사 등의 검색어를 2자 이상 입력하시기 바랍니다"); return;}
			var param = {crudtype: 'R', keywd: self.skword };
			var jqxhr = $.getJSON("./item/searchItem.php",param, function(r, txtstatus) {
				//console.table(r);
				if(r[0].result!=1) alert(r[0].msg);
				self.mainbanner.removeAll();
				$.map(r[0].mainbanner.list, function(item) {self.mainbanner.push(item)}); //new mdataapp.setMdata(item))});
				
				//self.searcheditems = ko.observableArray(r[0].b_list);
				self.searcheditems.removeAll();
				$.map(r[0].b_list, function(item) {self.searcheditems.push(item)}); //new mdataapp.setMdata(item))});
				

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
		}
		self.clickSearchItem = function(pitem) {
			//self.searcheditems.remove(pitem)
			console.table(pitem);
			
		}	
		 
		 		
		
	}
	m.MVModel = MVModel;

	function setMBdata(mbname, mbid) {
		console.log("setMbdata---"+mbname);		
        var self = new m.MVModel();
		self.mname = ko.observable(mbname);
		self.mid = ko.observable(mbid);	
		console.log("setMbdata-------"+mbname);		
	}
	m.setMBdata = setMBdata;
		

	function App(){
		this.run = function(){
			var vm = new m.MVModel();
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