// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "jqueryfinger", "owlcarousel", "mobilebase"], function($, carousel, ko, koutil, json, bootstrap) {

	function BoardModel(pmid, pkword) {
		var self = this;
		
		self.boardHeading ={
			"g4_write_cs_inquery"	: {
				name: "1:1 문의"
			}, 
			"g4_write_cs_notice"	: {
				name: "공지사항"
			}, 
			"g4_write_dcc_notice"	: {
				name: "최신뉴스"
			},
			"g4_write_dcc_exam"		: {
				name: "시험공고"
			},
			"g4_write_data_gichul"	: {
				name: "기출문제"
			}, 
			"g4_write_data_law"		: {
				name: "개정법령"
			}, 
			"g4_write_data_err"		: {
				name: "정오표"
			}, 
			"g4_write_event"		: {
				name: "이벤트"
			},
			"g4_write_cs_faq"		: {
				name: "FAQ"
			}, 
			"g4_write_dcc_sisa"		: {
				name: "상식"
			}
		};
		
		self.board = {
			jqForm: $("#form_searchBoardList"),
			jqFormDetail: $("#form_searchBoardDetail"),
			jqFormEdit: $("#form_boardEdit"),
			heading : new m.boardInfoData(),
			isWriteMode: ko.observable(false),
			list: ko.observableArray(),
			detail: ko.observable(),
			caNameList: ko.observableArray(),
			writerId: ko.observable(m.mb_id),
			table: ko.observable("g4_write_cs_notice"),
			totalRowCount: 1,
			rowNumColName: "rnum",
			
			init: function(){
				this.jqForm.submit(function(event){
					self.board.search();
					window.scrollTo(0, 0);
					return false;
				});
				
				this.jqFormEdit.submit
				
				$("#button_boardList_write").click(this.onWriteClick);
				$(".button_boardEdit_writeComplete").click(this.onWriteCompleteClick);
				$(".button_gotoBoardList").click(this.onGoToListClick);
				$(".button_boardEdit_modify").click(this.onModifyClick);
				
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
					board.heading.name( self.boardHeading[ sTable ].name );
					
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
			setCategoryName: function(listData){
				this.caNameList( listData );
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
			showModify: function(){
				this.isWriteMode(false);
				m.slideLeft( $(".active-view"), $("#view_boardEdit") );
			},
			showWrite: function(){
				this.isWriteMode(true);
				this.setDetailData({
					wr_subject: "",
					wr_content: "",
					ca_name: ""
				})
				m.slideLeft( $(".active-view"), $("#view_boardEdit") );
			},
			
			onItemClick: function(data, event){
				self.board.searchDetail( self.board.getTable(), data.wr_id );
				//console.log(data);
				//console.log(event);
			},
			onWriteClick: function(){
				self.board.showWrite();
			},
			onWriteCompleteClick: function(){
				$(".wrap_modal").show();
			},
			onGoToListClick: function(){
				self.board.showList();
			},
			onModifyClick: function(){
				self.board.showModify();
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

	m.boardInfoData = function(){
		var self = this;
		self.name = ko.observable();
		self.caNames = ko.observableArray();
	};

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
