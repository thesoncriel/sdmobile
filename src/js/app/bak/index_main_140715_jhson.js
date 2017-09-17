// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "owlcarousel"], function($, carousel, ko, koutil, json, bootstrap) {

	function MVModel(pmid, pkword) {
		var self = this;
		self.mnamehello = (window.m.mb_name) ?  ko.observable(window.m.mb_name+"님! 안녕하세요."):ko.observable();
		//console.log( self.mnamehello() );
		self.mname = ko.observable(window.m.mb_name).extend({logChange: "회원성명~"});
		self.skword = ko.observable(pkword).extend({logChange: "검색어~"});		
		self.mid = ko.observable(pmid).extend({logChange: "아이디~"});
		self.mpw = ko.observable().extend({logChange: "비밀번호~"});
		self.mrememberid = ko.observable().extend({logChange: "아이디 저장~"});
		self.madmpw = ko.observable().extend({logChange: "관리자 비번~"});
		self.searcheditems = ko.observableArray();
		self.mainbanner = ko.observableArray();
		
		// 메인화면 데이터 바인딩 객체 초기화 - 2014.07.07 by jhson
		self.main = {
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
			setData : function(data){
				var owl = self.main.jqAd.data("owlCarousel");
				var sTags = "";
				$.map(data.bn, function(item){
					owl.addItem( self.makeOwlcaItem( 
						"/data/cm_shop/banner/" + item.bn_file, 
						item.bn_url/*,
						self.getViewButton( item.type )*/
						 ) );
				});
				
				owl = self.main.jqBooks.data("owlCarousel");
	
				$.map(data.best, function(item){
					var iDcRate = self.dcRate(item.it_price, item.it_sug_price);
					
					owl.addItem( self.makeOwlcaItem( 
						"/data/cm_shop/book/" + item.it_id + "/" + item.it_file_l, 
						"/book/item.php?it_id=" + item.it_id + "&cat_id=" + item.cat_id,
						"<br/><span><b>" + item.it_name + "<br/>" +
						"</b><br/>" +
						"<strong class=\"text-danger\">￦" + self.numberFormat(item.it_price) + "(" + iDcRate + "%할인)</strong></span>"
						 ) );
				});
				
				self.main.event.set( data.event );
				self.main.exam.removeAll();
				$.map(data.exam, function(item){
					self.main.exam.push( new m.examListData( item ) );
				});
				
				self.main.notice.set( data.notice );
				self.main.news.set( data.news );
				
			}
		};
		// owl carousel initialize //////////////////////////
		self.main.jqAd.owlCarousel({
			autoPlay: 3000,
			
			items: 3,
			itemsDesktop : [ 1199, 3 ],
			itemsDesktopSmall : [ 979, 3 ],
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
				//console.log(r);
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
		};
		self.clickSearchItem = function(pitem) {
			//self.searcheditems.remove(pitem)
			console.table(pitem);
			
		};
		 
		 		
		$.getJSON("/mobile/mb/main.php", function(data){
			console.log(data);
			if(self.nav){
				self.nav.setData( data.cate );
			}
			
			self.main.setData(data);
		});
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
	}
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
			return 
		}
	}
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
	}
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
	}
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
	}
	// 시험 정보 데이터 부분 - 2014.07.08 - by jhson [종료]

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