// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "jqueryfinger", "owlcarousel", "mobilebase"], function($, carousel, ko, koutil, json, bootstrap) {

	function BoardModel(pmid, pkword) {
		var self = this;
		
		self.boardHeading ={
			"g4_write_cs_inquery"	: "1:1 문의", 
			"g4_write_cs_notice"	: "공지사항", 
			"g4_write_dcc_notice"	: "최신뉴스",
			"g4_write_dcc_exam"		: "시험공고",
			"g4_write_data_gichul"	: "기출문제", 
			"g4_write_data_law"		: "개정법령", 
			"g4_write_data_err"		: "정오표", 
			"g4_write_event"		: "이벤트",
			"g4_write_cs_faq"		: "FAQ", 
			"g4_write_dcc_sisa"		: "상식"
		};
		
		self.board = {
			jqForm: $("#form_searchBoardList"),
			jqFormDetail: $("#form_searchBoardDetail"),
			heading : ko.observable(),
			list: ko.observableArray(),
			detail: ko.observable(),
			totalRowCount: 1,
			rowNumColName: "rnum",
			
			bo_table: ko.observable("cs_notice"),
			svs: ko.observable("brand"),
			sca: ko.observable("일반"),
			cat_id: ko.observable(""),
			
			
			init: function(){
				this.jqForm.submit(function(event){
					self.board.search();
					window.scrollTo(0, 0);
					return false;
				});
				
				$("#button_gotoBoardList").click(function(){
					self.board.showList();
				});
				//this.search();
			},
			search: function(page){
				var board = this;
				var sParam = "";
				var sTable = "";
				/*var sampleData = {
					totalRowCount: 124,
					list: [
						{
							//rnum: 1,
							wr_id: 111,
							subject: "트리플 할인 이벤트 발표를 하기위한 테스트 사항 입니다.",
							date: "2014-06-28",
							writer: "관리자",
							readCount: 17
						}
					]
				}
				
				var iPage = this.getPage();
				var iRows = this.getRows();
				var iMax = 0;
				
				if (sampleData.totalRowCount > (iPage * iRows)){
					iMax = iRows;
				}
				else{
					iMax = (sampleData.totalRowCount - (iPage * iRows)) % iRows;
				}
				
				
				for(var i = 1; i < iMax; i++){
					sampleData.list[ i ] = {
						subject: sampleData.list[ 0 ].subject,
						date: sampleData.list[ 0 ].date,
						writer: sampleData.list[ 0 ].writer,
						readCount: Math.floor(Math.random() * 100) + 1
					}
				}
				*/
				if(page !== undefined){
					this.setPage(page);
				}
				else{
					this.setPage(1);
				}
				sParam = this.jqForm.serialize();
				
				$.getJSON(this.jqForm.attr("action"), sParam, function(data){
					sTable = board.getTable();
					console.log(data);
					
					
					board.totalRowCount = $.tryParseInt( data.cnt );
					board.heading( self.boardHeading[ sTable ] );
					
					delete data.totalRowCount;
					data.totalRowCount = board.totalRowCount;
					data.page = board.getPage();
					data.rows = board.getRows();
					
					board.generateRowNumber( data.board );
					board.setListData( data.board );
					board.onDataLoaded( data );
					
					board.showList();
				});
				
				/*(function(data){
					board.totalRowCount = $.tryParseInt( data.totalRowCount );
					
					delete data.totalRowCount;
					data.totalRowCount = board.totalRowCount;
					data.page = board.getPage();
					data.rows = board.getRows();
					
					board.generateRowNumber( data.list );
					board.setListData( data.list );
					board.onDataLoaded( data );
				})(sampleData);
				*/	
			},
			searchDetail: function(table, wr_id){
				var mParam = {
					table: table,
					wr_id: wr_id
				};
				$.getJSON(this.jqForm.attr("action"), mParam, function(data){
					console.log(data);
					self.board.setDetailData( data.board[0] );
					self.board.showDetail();
				});
			},
			setListData: function(listData){
				this.list.removeAll();
				
				this.list( listData );
			},
			setDetailData: function(data){
				this.detail( data );
			},
			
			generateRowNumber: function(listData, isAscending){
				var iRows = this.getRows();
				var iPage = this.getPage();
				var iTotalRowCount = this.totalRowCount;
				var iIncVal = 0;
				var iRowNum = 0;
				var iLen = listData.length;
				var sRowCol = this.rowNumColName;
				
				if (isAscending === true){
					iRowNum = 1 + (((iPage - 1)) * iRows);
					iIncVal = 1;
				}
				else{
					iRowNum = iTotalRowCount - (((iPage - 1)) * iRows);
					iIncVal = -1;
				}
				
				for(var i = 0; i < iLen; i++){
					listData[ i ][ sRowCol ] = iRowNum;
					iRowNum = iRowNum + iIncVal;
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
			getTable: function(){
				return this.jqForm.find("[name='table']").val();
			},
			setTable: function(bo_table){
				this.jqForm.find("[name='table']").val(bo_table);
			},
			
			showList: function(){
				m.slideLeft( $(".active-view"), $("#view_boardList") );
			},
			
			showDetail: function(){
				m.slideLeft( $(".active-view"), $("#view_boardDetail") );
			},
			
			onItemClick: function(data, event){
				self.board.searchDetail( self.board.getTable(), data.wr_id );
				//console.log(data);
				//console.log(event);
			},
			onGoToListClick: function(){
				
			},
			
			evt_dataloaded: null,
			dataloaded: function(callback){
				this.evt_dataloaded = callback;
			},
			onDataLoaded: function(data){
				try{
					this.evt_dataloaded(data);
				}
				catch(e){}
			}
		};
		
		self.pagination = {
			list: ko.observableArray(),
			totalRowCount: 1,
			rowLimit: 10,
			navCount: 5,
			page: ko.observable(1),
			lastPage: ko.observable(1),
			moveToLoad: true,
			
			// pagination 초기화 부분[시작]
			init: function(){
				this.isFirstPageGroup = ko.computed(function(){
					var iPage = self.pagination.page();
					var iRowLimit = self.pagination.navCount;
					
					return iPage <= iRowLimit;
				});
				this.isLastPageGroup = ko.computed(function(){
					var iPage = self.pagination.page();
					var iRowLimit = self.pagination.navCount;
					var iLastPage = self.pagination.lastPage();
					var iNavCount = self.pagination.navCount;
					var iMinRange = (iLastPage - iNavCount);
					var bRet = false;
					
					console.log({
						page: iPage,
						rowlimit: iRowLimit,
						lastPage: iLastPage,
						navCount: iNavCount,
						minRange: iMinRange
					});
					
					bRet = ( (iMinRange < iPage) && (iPage <= iLastPage) );
					
					return 	bRet;
				});
				
				this.generate( this.totalRowCount, this.rowLimit, this.navCount, this.page() );
			},// pagination 초기화 부분[종료]
			
			generateByMap: function(mParam){
				this.generate( mParam.totalRowCount, mParam.rows, this.navCount, mParam.page );
			},
			generateByPage: function(page){
				var iPage = parseInt(page); 
				this.generate( this.totalRowCount, this.rowLimit, this.navCount, iPage );
			},
			generate: function(totalRowCount, rowLimit, navCount, page){
				var iLastPage = Math.floor( (totalRowCount / rowLimit) + ( ((totalRowCount % rowLimit) > 0)? 1 : 0) );
				var iBegin = ( Math.floor((page - 1) / navCount) * navCount) + 1;
				var iMaxCount = ((iLastPage - page) < (iLastPage % navCount))? iLastPage % navCount : navCount;
				var iCurrent = iBegin;
				var iaRet = [];
				
				for(var i = 0; i < iMaxCount; ++i){
					iaRet[i] = iCurrent;
					++iCurrent;
				}
				
				this.page( page );
				this.totalRowCount = totalRowCount;
				this.rowLimit = rowLimit;
				this.navCount = navCount;
				this.lastPage( iLastPage );
				this.list( iaRet ); 
			},
			
			evt_pageclick: null,
			pageclick: function(callback){
				this.evt_pageclick = callback;
			},
			onPageClick: function(page, event){
				var iPage = parseInt(page);
				var jqItem = $(event.currentTarget).parent();
				var jqPageContainer = jqItem.parent();
				
				if (iPage === self.pagination.page() ) return;
				
				jqPageContainer.find("li.active").removeClass("active");
				jqItem.addClass("active");
				
				try{
					self.pagination.evt_pageclick({page: iPage});
				}
				catch(e){
					console.log(page);
					console.log(event);
				}
			},
			
			onMovePrevClick: function(data, event){
				var jqPrevBtn = $(event.currentTarget).parent();
				var iPage = 0;
				var iCurrPage = 0;
				var iNavCount = 0;
				var iMod = 0;
				
				if (jqPrevBtn.hasClass("disabled") === true){
					return;
				}
				
				iNavCount = self.pagination.navCount;
				iCurrPage = self.pagination.page();
				iMod = iCurrPage % iNavCount;
				if (iMod === 0){
					iPage = iCurrPage - 1
				}
				else{
					iPage = iCurrPage - iMod - iNavCount + 1
				}
				//self.pagination.page( iPage );
				//self.pagination.generateByPage( iPage );
				
				if (self.pagination.moveToLoad === true){
					event.currentTarget = jqPrevBtn.siblings().eq(0).find("a").get(0);
					self.pagination.onPageClick( iPage, event );
				}
				
				console.log(data);
				console.log(event);
			},
			onMoveNextClick: function(data, event){
				var jqNextBtn = $(event.currentTarget).parent();
				var iPage = 0;
				var iCurrPage = 0;
				var iNavCount = 0;
				var iMod = 0;
				
				if (jqNextBtn.hasClass("disabled") === true){
					return;
				}
				
				iNavCount = self.pagination.navCount;
				iCurrPage = self.pagination.page();
				iMod = iCurrPage % iNavCount;
				if (iMod === 0){
					iPage = iCurrPage + 1
				}
				else{
					iPage = iCurrPage - iMod + iNavCount + 1
				}
				
				//self.pagination.page( iPage );
				//self.pagination.generateByPage( iPage );
				
				if (self.pagination.moveToLoad === true){
					event.currentTarget = jqNextBtn.siblings().eq(1).find("a").get(0);
					self.pagination.onPageClick( iPage, event );
				}
				
				console.log(data);
				console.log(event);
			}
		}
		
		self.board.init();
		self.pagination.init();
		self.board.dataloaded(function(data){
			self.pagination.generateByMap(data);
		});
		self.pagination.pageclick(function(data){
			self.board.search( data.page );
		});
		
		self.board.search();
		
	}
	
	BoardModel.prototype = new m.BaseViewModel();
	BoardModel.prototype.constructor = BoardModel;
	
	
	m.BoardModel = BoardModel;
	
	
	// 게시판 정보 데이터 부분 - 2014.07.16 - by jhson [시작]
	m.boardListDataKeys = [
		"cat_id",
		"bbs_id"
	];
	m.boardListData = function(data){
		var self = this;
		var iLen = m.boardListDataKeys.length;
		var aProp = m.boardListDataKeys;
		
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
	
	m.boardDetailDataKeys = [
		"cat_id",
		"bbs_id"
	];
	m.boardDetailData = function(data){
		var self = this;
		var iLen = m.boardDetailDataKeys.length;
		var aProp = m.boardDetailDataKeys;
		
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
	
	m.paginationData = function(data){
		var self = this;
		
		self.page = 0;
	}
	// 게시판 정보 데이터 부분 - 2014.07.16 - by jhson [종료]
	
	function App(){
		this.run = function(){
			var vm = new m.BoardModel();
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