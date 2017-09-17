// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "owlcarousel"], function($, carousel, ko, koutil, json, bootstrap) {

	function ContentsModel(pmid, pkword) {
		var self = this;
				
		// 메인화면 데이터 바인딩 객체 초기화 - 2014.07.07 by jhson
		self.contents = {
			jqForm: $("#form_topSearch"),
			canRequest: true,
			bn: {
				bn_file: ko.observable(""),
				bn_subject: ko.observable(""),
				bn_url: ko.observable("")
			},
			book: {
				cache: [],
				count: ko.observable(0),
				list: ko.observableArray(),
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
				}
			},
			lec: {
				cache: [],
				count: ko.observable(0),
				list: ko.observableArray(),
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
				});
				$(".contents-ten-filters").click(function(e){
					var jqSelected = $( e.target );
					var jqFilter = $( e.currentTarget );
					
					jqFilter.find("a").removeClass("btn-primary").addClass("btn-gray");
					jqSelected.removeClass("btn-gray").addClass("btn-primary");
					self.contents.setContentsType( jqSelected.attr("rel") );
					self.contents.search();
				});
				
				$(window).scroll(function(){
					if (self.contents.canRequest === true){
						self.contents.requestTimer = setInterval(function(){
							clearInterval(self.contents.requestTimer);
							self.contents.canRequest = true;
						}, 500);
						self.contents.canRequest = false;
					}
					
					var jqWin = $(window);
					var iScrollHeight = jqWin.scrollTop() + jqWin.height();
					var iDocHeight = $(document).height();
					
					if (iScrollHeight + 320 >= iDocHeight){
						self.contents.searchNext();
					}
				})
				
				self.contents.search();
			},
			getPage: function(){
				return parseInt(self.contents.jqForm.find("[name='page']").val());
			},
			setPage: function(page){
				self.contents.jqForm.find("[name='page']").val( page );
			},
			getItemType: function(){
				return parseInt(self.contents.jqForm.find("[name='it_type']").val());
			},
			setItemType: function(type){
				self.contents.jqForm.find("[name='it_type']").val( type );
			},
			getOrderBy: function(){
				return parseInt(self.contents.jqForm.find("[name='order_by']").val());
			},
			setOrderBy: function(orderBy){
				self.contents.jqForm.find("[name='order_by']").val( orderBy );
			},
			getContentsType: function(){
				return parseInt(self.contents.jqForm.find("[name='contents_type']").val());
			},
			setContentsType: function(ContentsType){
				self.contents.jqForm.find("[name='contents_type']").val( ContentsType );
			},
			
			search: function(page){
				var mParam = null;
				var jqForm = self.contents.jqForm;
				var iItemType = self.contents.getItemType();
				var iPage = self.contents.getPage();
				
				if (page){
					self.contents.setPage( page );
					iPage = page;
				}
				else{
					self.contents.setPage( 1 );
					iPage = 1;
				}
				
				mParam = jqForm.serialize();
				$.getJSON(jqForm.attr("action"), mParam, function(data){
					console.log(data);
					
					self.contents.book.count( parseInt( data.book ) );
					self.contents.lec.count( parseInt( data.lec ) );
					
					if(iItemType === 0){
						if (self.contents.book.page > 1){
							self.contents.book.addData(data.list);
						}
						else{
							self.contents.book.setData(data.list);
						}
						self.contents.book.page = iPage;
					}
					else{
						if (self.contents.lec.page > 1){
							self.contents.lec.addData(data.list);
						}
						else{
							self.contents.lec.setData(data.list);
						}
						self.contents.lec.page = iPage;
					}
					
					if (data.bn){
						self.contents.bn.bn_file( data.bn[0].bn_file );
						self.contents.bn.bn_subject( data.bn[0].bn_subject );
						self.contents.bn.bn_url( data.bn[0].bn_url );
					}
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
			}
		};//contents object end:::::
		
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
	m.lecDetailData = function(data){
		var self = this;
		var iLen = m.lecDetailDataKeys.length;
		var aProp = m.lecDetailDataKeys;
		
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