// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "jqueryfinger", "owlcarousel", "mobilebase"], function($, carousel, ko, koutil, json, bootstrap, owlcarousel, mobilebase) {

	function BoardModel() {
		var self = this;
		
		self.boardHeading ={
			"g4_write_cs_inquery"	: {
				name: "1:1 문의",
				type: "qna",
				loginNeed: true,
				auth: {
					list: 2,
					write: 2,
					detail: 2
				}
			}, 
			"g4_write_cs_notice"	: {
				name: "공지사항",
				auth: {
					list: 1,
					write: 6,
					detail: 1
				} 
			}, 
			"g4_write_dcc_notice"	: {
				name: "최신뉴스",
				auth: {
					list: 1,
					write: 6,
					detail: 1
				}
			},
			"g4_write_dcc_exam"		: {
				name: "시험공고",
				auth: {
					list: 1,
					write: 6,
					detail: 2
				}
			},
			"g4_write_data_gichul"	: {
				name: "기출문제",
				loginNeed: true,
				auth: {
					list: 1,
					write: 6,
					detail: 2
				}
			}, 
			"g4_write_data_law"		: {
				name: "개정법령",
				loginNeed: true,
				auth: {
					list: 1,
					write: 6,
					detail: 2
				}
			}, 
			"g4_write_data_err"		: {
				name: "정오표",
				loginNeed: true,
				auth: {
					list: 1,
					write: 6,
					detail: 2
				}
			}, 
			"g4_write_event"		: {
				name: "이벤트",
				type: "event",
				comment: true,
				auth: {
					list: 1,
					write: 6,
					detail: 1
				}
			},
			"g4_write_cs_faq"		: {
				name: "FAQ",
				type: "accordion",
				auth: {
					list: 1,
					write: 6,
					detail: 1
				}
			}, 
			"g4_write_dcc_sisa"		: {
				name: "상식",
				auth: {
					list: 1,
					write: 6,
					detail: 1
				}
			}
		};
		
		self.board = {
			jqForm: $("#form_searchBoardList"),
			jqFormDetail: $("#form_searchBoardDetail"),
			jqFormEdit: $("#form_boardEdit"),
			heading : new m.boardInfoData(),
			isWriteMode: ko.observable(false),
			list: ko.observableArray(),
			eventList: ko.observableArray(),
			detail: ko.observable(),
			detailFiles: ko.observableArray(),
			detailReply: ko.observable(),
			detailReplyFiles: ko.observableArray(),
			hasDetailReply: ko.observable(false),
			caNameList: ko.observableArray(),
			writerId: ko.observable(m.mb_id),
			wr_id: ko.observable(""),
			table: ko.observable("g4_write_cs_notice"),
			totalRowCount: 1,
			rowNumColName: "rnum",
			pagination : new m.Pagination(),
			
			init: function(){
				this.jqForm.submit(function(event){
					self.board.search();
					window.scrollTo(0, 0);
					return false;
				});
				
				/*
				this.jqFormEdit.submit(function(){
					
				});
				*/
				
				this.getEditMode = ko.computed(function(){
					if (self.board.isWriteMode() === true){
						return "n";
					}
					else{
						return "u";
					}
				});
				
				this.evt_logincheck = null;
				this.logincheck = function(callback){
					this.evt_logincheck = callback;
				};
				this.onlogincheck = function(){
					try{
						return this.evt_logincheck();
					}
					catch(e){}
					
					return false;
				};
				this.evt_levelcheck = null;
				this.levelcheck = function(callback){
					this.evt_levelcheck = callback;
				};
				this.onlevelcheck = function(){
					try{
						return this.evt_levelcheck();
					}
					catch(e){}
					
					return 0;
				};
				this.hasAuthWrite = ko.computed(function(){
					try{
						var bRet = (self.board.heading.auth.write() <= self.board.onlevelcheck()) && self.board.onlogincheck();
						return bRet;
					}
					catch(e){}
					
					return false;
				});
				
				$("#button_boardList_write").click(this.onWriteClick);
				$(".button_boardEdit_writeComplete").click(this.onWriteCompleteClick);
				$(".button_gotoBoardList").click(this.onGoToListClick);
				$(".button_boardEdit_modify").click(this.onModifyClick);
				
				$(".wrap-ongoing-selector button").click(function(){
					$(this).parent().find("button").removeClass("btn-info").addClass("btn-default");
					$(this).addClass("btn-info");
					
					self.board.setEventOnGoing( $(this).data("ongoing") );
					self.board.search();
				});
				//this.search();
			},
			searchByParam: function(params){
				if(params.view_type){
					if (params.view_type !== "board"){
						console.log("잘못된 파라메터: " + params.view_type);
						console.log(params);
						return;
					}
				}
				
				//if ( === true) return;
				if (this.authCheck(params) === true) return;
				
				this.clearSearchText();
				
				if (params.name){
					if (params.name !== this.getTable()){
						this.list.removeAll();
					}
					this.setTable(params.name);
				}
				
				if (params.bbsId){
					this.searchDetail( params.bbsId );
				}
				else{
					this.search();
				}
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
					board.heading.type( self.boardHeading[ sTable ].type );
					board.heading.auth.list( self.boardHeading[ sTable ].auth.list );
					board.heading.auth.write( self.boardHeading[ sTable ].auth.write );
					board.heading.auth.detail( self.boardHeading[ sTable ].auth.detail );
					board.heading.loginNeed( self.boardHeading[ sTable ].loginNeed );
					
					delete data.totalRowCount;
					data.totalRowCount = board.totalRowCount;
					data.page = board.getPage();
					data.rows = board.getRows();
					
					board.generateRowNumber( data.board );
					
					if (board.heading.type() === "event"){
						board.setEventListData( data.board );
					}
					else{
						board.setListData( data.board );
					}
					
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
			searchDetail: function(wr_id, table){
				var jqTr = null;
				var mParam = {
					table: table || this.getTable(),
					wr_id: wr_id
				};
				var board = this;
				var sTable = mParam.table;
				var mBoardInfo = self.boardHeading[ mParam.table ];
				var sBoardType = this.heading.type();
				
				//if (this.loginNeeded(mParam, wr_id) === true) return;
				
				if (sBoardType === "accordion"){
					jqTr = $("tr[data-wr_id='" + wr_id + "']");
					
					if (this.hasCollapseContent(jqTr) === true){
						jqTr.next().fadeToggle();
						return;
					}
				}
				//jqTr.next().slideToggle();
				$.getJSON(this.jqForm.attr("action"), mParam, function(data){
					console.log(data);
					
					board.wr_id( mParam.wr_id );
					board.heading.name( mBoardInfo.name );
					board.heading.type( mBoardInfo.type );
					board.heading.comment( mBoardInfo.comment );
					board.heading.auth.list( mBoardInfo.auth.list );
					board.heading.auth.write( mBoardInfo.auth.write );
					board.heading.auth.detail( mBoardInfo.auth.detail );
					board.heading.loginNeed( mBoardInfo.loginNeed );
					
					if (sBoardType === "accordion"){
						self.board.makeCollapse( jqTr, data.board[0].wr_content );
						jqTr.next().fadeIn();
					}
					else{
						board.heading.name( mBoardInfo.name );
						board.setDetailData( data.board[0] );
						if (data.comm !== undefined){
							if (board.heading.comment() !== true){
								board.setDetailReplyData( data.comm[0] );
								board.setDetailFiles( data.comm[0].file );
								board.hasDetailReply( true );
								self.comment.setAllData([]);
								//self.comment.list.removeAll();
							}
							else{
								self.comment.setAllData( data.comm );
								self.comment.search();
								board.setDetailReplyData( null );
								board.hasDetailReply( false );
							}
						}
						else{
							self.comment.setAllData([]);
							board.setDetailReplyData( null );
							board.hasDetailReply( false );
							//self.comment.list.removeAll();
						}
						self.comment.search();
						board.showDetail();
					}
				});
			},
			loadCategoryNames: function(){
				var mParam = {
					edit: "yes",
					table: this.getTable()
				};
				$.getJSON(this.jqForm.attr("action"), mParam, function(data){
					console.log(data);
					try{self.board.caNameList.removeAll();}catch(e){}
					
					if (data.ca_name){
						self.board.caNameList( data.ca_name );
					}
					else{
						self.board.caNameList( [] );
					}
				});
			},
			
			setListData: function(listData){
				this.list.removeAll();
				this.list( listData );
			},
			setEventListData: function(listData){
				this.eventList.removeAll();
				this.eventList( listData );
			},
			setDetailData: function(data){
				this.setDetailDataCommon( data );
			},
			setDetailReplyData: function(data){
				this.setDetailDataCommon( data, "reply" );
			},
			
			setDetailDataCommon: function(data, type){
				var mFileData = (data)? data.file : {};
				var aFileData = [];
				var index = 0;
				var mFile = null;
				
				if (mFileData){
					for(var sIndex in mFileData){
						if (sIndex === "count"){
							continue;
						}
						index = parseInt(sIndex);
						mFile = mFileData[ sIndex ];
						mFile.href = mFile.href.replace("./download.php", "download_mobile.php");
						aFileData[ index ] = mFile;
					}
					
					if (data){
						data.file = aFileData;
					}
				}
				else{
					
				}
								
				if (type === "reply"){
					this.detailReply( data );
				}
				else{
					this.detail( data );
				}
							
			},
			setDetailFiles: function(file, type){
				if (type === "reply"){
					this.detailReplyFiles.removeAll();
				}
				else{
					this.detailFiles.removeAll();
				}
				
				if ((file !== undefined) &&
					($.isArray(file) === true) &&
					(file.length > 0)
				){
					if (type === "reply"){
						this.detailReplyFiles(file);
					}
					else{
						this.detailFiles(file);
					}
				}
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
				this.table(bo_table);
				this.jqForm.find("[name='table']").val(bo_table);
				//this.jqFormComment.find("[name='table']").val(bo_table);
			},
			getEventOnGoing: function(){
				return this.jqForm.find("[name='ongoing']").val();
			},
			setEventOnGoing: function(ongoing){
				this.jqForm.find("[name='ongoing']").val(ongoing);
			},
			clearSearchText: function(){
				this.jqForm.find("[name='stx']").val("");
			},
			
			showList: function(){
				m.slideLeft( $(".active-view"), $("#view_boardList") );
			},
			showDetail: function(){
				self.comment.jqFormWrite.find("textarea[name='wr_content']").val("");
				m.viewSlider.left( $("#view_boardDetail") );
			},
			hasCollapseContent: function(jqTr){
				return jqTr.next().hasClass("accordion-collapse-content");
			},
			makeCollapse: function(jqTr, html){
				//var jqTr = jqAnchor.parentsUntil("tr");
				var sCollapseTmpl = "";
				var jqTrCollapse = null;
				sCollapseTmpl = $("#template_boardType_accordion").html();
				jqTr.after(sCollapseTmpl);
				jqTrCollapse = jqTr.next();
				jqTrCollapse.find("td").css("background-color", "#fff");
				jqTrCollapse.find("p").html( html ).find("img").css({
					"width": "100%",
					"height": "auto"
				});;
				//jqTrCollapse = jqTr.next();
				//jqTrCollapse.find("p");
			},
			convertOngoingEvent: function(fromDate, toDate){
				var today = new Date();
				var sDate = new Date(self.dateFormat( fromDate ));
				var eDate = new Date(self.dateFormat( toDate ));
				var bRet = (sDate.getTime() <= today.getTime()) && (today.getTime() <= eDate.getTime());
				
				return (bRet === true)? "진행중" : "완료";
			},
			convertAnswerComplete: function(status){
				return (status === "1")? "답변완료" : "답변중";
			},
			authCheck: function(args){
				var mBoardInfo = self.boardHeading[ args.name ];
				
				if (mBoardInfo.loginNeed === true){
					return self.board.onAuthCheck(args, mBoardInfo);
				}
				else{
					return false;
				}
			},
			
			showModify: function(){
				this.isWriteMode(false);
				this.loadCategoryNames();
				m.slideLeft( $(".active-view"), $("#view_boardEdit") );
			},
			showWrite: function(){
				this.isWriteMode(true);
				this.loadCategoryNames();
				this.setDetailData({
					wr_subject: "",
					wr_content: "",
					ca_name: "",
					wr_id: ""
				});
				m.slideLeft( $(".active-view"), $("#view_boardEdit") );
			},
			showLoading: function(){
				$(".wrap_modal.wrap-modal-boardEdit").show();
			},
			hideLoading: function(){
				$(".wrap_modal.wrap-modal-boardEdit").hide();
			},
			
			onItemClick: function(data, event){
				self.board.searchDetail( data.wr_id, self.board.getTable() );
				//console.log(data);
				//console.log(event);
			},
			onWriteClick: function(){
				self.board.showWrite();
			},
			onWriteCompleteClick: function(){
				var jqEditor = $("#textbox_boardEdit_wrContentEditable");
				var jqWrContent = $("textarea[name='wr_content']");
				var jqFormEdit = self.board.jqFormEdit;
				var oaParams = null;//jqFormEdit.serializeArray();
				var board = self.board;
				//var oaParamsFromList = self.board.jqForm.serializeArray();
				board.showLoading();
				
				jqWrContent.text( jqEditor.html() );
				oaParams = jqFormEdit.serializeArray();
				
				//alert( jqWrContent.text() );
				
				$.post(jqFormEdit.attr("action"), oaParams, function(dataText){
					console.log(dataText);
					
					//var sTable = board.getTable();
					//var data = $.parseJSON( dataText );
					
					//console.log(data);
					
					//board.totalRowCount = $.tryParseInt( data.cnt );
					//board.heading.name( self.boardHeading[ sTable ].name );
					board.hideLoading();
					m.toast("작성 완료 되었습니다.");
					board.search();
					
					//board.showList();
					
					
				});
				
				return false;
			},
			onGoToListClick: function(){
				if (self.board.list().length === 0){
					self.board.search();
				}
				else{
					self.board.showList();
				}
				//self.board.search(self.board.getPage());
			},
			onModifyClick: function(){
				self.board.showModify();
			},
			onToggleComment: function(data, event){
				var jqItem = $(event.currentTarget).parentsUntil(".comment-item").parent().eq(0);
				var jqIcon = jqItem.find(".comment-icon-collapse");
				
				jqItem.find("pre").toggleClass("comment-item-collapsed");
				jqIcon.toggleClass("glyphicon-chevron-down");
				jqIcon.toggleClass("glyphicon-chevron-up");
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
			},
	
			evt_readboardlist: null,
			readboardlist: function(callback){
				evt_readboardlist = callback;
			},
			onReadBoardList : function(boardName){
				try{
					this.evt_readboardlist(boardName);
				}
				catch(e){}
			},
			
			evt_readboarddetail: null,
			readboarddetail: function(callback){
				evt_readboarddetail = callback;
			},
			onReadBoardDetail : function(boardName, boardId){
				try{
					this.evt_readboarddetail(boardName, boardId);
				}
				catch(e){}
			},
			
			evt_authcheck: null,
			authcheck: function(callback){
				this.evt_authcheck = callback;
			},
			onAuthCheck : function(arg1, arg2){
				try{
					return this.evt_authcheck(arg1, arg2);
				}
				catch(e){}
				
				return false;
			},
			
			hideWriterName: function(wr_name){
				var iLen = wr_name.length;
				
				if (this.heading.type() === "qna"){
					return "**" + wr_name.substr(iLen - 1, 1);
				}
				else{
					return wr_name;
				}
			}
		};// board object end::::::::::::::::::::::::::::::::::::::::::
		
		self.comment = {
			jqForm: $("#form_boardComment"),
			jqFormWrite: $("#form_boardCommentWrite"),
			list: ko.observableArray(),
			pagination: new m.Pagination(),
			totalRowCount: 1,
			allData: [],
			
			init: function(){
				this.jqFormWrite.submit( this.onWriteCompleteClick );
			},
			
			
			search: function(page){
				var sParam = this.jqForm.serialize();
				var comment = this;
				var data = {};
				var aList = [];
				var maxRow = 0;
				var minRow = 0;
				var iLen = this.allData.length;
				
				if(page !== undefined){
					this.setPage(page);
				}
				else{
					this.setPage(1); 
				}
				
				data.totalRowCount = iLen;
				data.page = comment.getPage();
				data.rows = comment.getRows();
				maxRow = data.page * data.rows;
				minRow = maxRow - data.rows;
				
				for(var i = minRow; i < maxRow; i++){
					if (i >= iLen){
						break;
					}
					aList.push( this.allData[ i ] );
				}
				
				this.setListData( aList );
				comment.onDataLoaded( data );
				/*
				$.getJSON(this.jqForm.attr("action"), sParam, function(data){				
					comment.totalRowCount = $.tryParseInt( data.cnt );
					
					delete data.totalRowCount;
					data.totalRowCount = comment.totalRowCount;
					data.page = comment.getPage();
					data.rows = comment.getRows();
					
					comment.setListData( data.comm );
					comment.onDataLoaded( data );
				});
				*/
			},
			
			
			
			setAllData: function(comm){
				this.allData = comm;
			},
			setListData: function(data){
				try{this.list.removeAll();}catch(e){}
				this.list(data);
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
			
			setCw: function(cw){
				this.jqForm.find("[name='cw']").val(cw);
			},
			setWrId: function(wr_id){
				this.jqForm.find("[name='wr_id']").val(wr_id);
			},
			
			onWriteCompleteClick: function(event){
				var jqForm = $(this);
				var mParam = m.serializeMap( jqForm );
				var comment = self.comment;
				
				if (comment.onLoginCheck() === false){
					return false;
				}
				
				if (mParam.wr_content === ""){
					alert("댓글 내용을 입력하여 주십시요.");
					return false;
				}
				
				$.post(jqForm.attr("action"), mParam, function(dataAll){
					var data = $.parseJSON(dataAll);
					var jqTextarea = jqForm.find("textarea[name='wr_content']");
					var dateNow = null;
					
					console.log(data);
					
					if (data.status[0].status === "YES"){
						dateNow = new Date();
						mParam.wr_datetime = dateNow.getFullYear() + "-" + dateNow.getMonth() + "-" + dateNow.getDate() + " " + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds();
						jqTextarea.val("");
						comment.allData.unshift(mParam);
						comment.search();
						m.toast("댓글이 작성 되었습니다.");
					}
					
				});

				return false;
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
			},
			
			evt_logincheck: null,
			logincheck: function(callback){
				this.evt_logincheck = callback;
			},
			onLoginCheck: function(){
				try{
					return this.evt_logincheck();
				}
				catch(e){}
				
				return false;
			}
		};/////// comment object end ::::::::::::::::::::::::::::::::::::::::::

		self.board.init();
		self.board.pagination.init();
		self.board.dataloaded(function(data){
			self.board.pagination.generateByMap(data);
		});
		self.board.pagination.pageclick(function(data){
			self.board.search( data.page );
		});
		
		self.comment.init();
		self.comment.pagination.init({pageClickToTop: false});
		self.comment.dataloaded(function(data){
			self.comment.pagination.generateByMap(data);
		});
		self.comment.pagination.pageclick(function(data){
			self.comment.search( data.page );
		});
		
		//self.board.search();
		
	}
	
	BoardModel.prototype = new m.BaseViewModel();
	BoardModel.prototype.constructor = BoardModel;

	m.BoardModel = BoardModel;

	m.boardInfoData = function(){
		var self = this;
		self.name = ko.observable();
		self.caNames = ko.observableArray();
		self.type = ko.observable();
		self.comment = ko.observable(false);
		self.auth = {
			list: ko.observable(),
			write: ko.observable(),
			detail: ko.observable()
		};
		self.loginNeed = ko.observable(false);
	};
	
	// 페이징 컨트롤러 [시작]
	m.Pagination = function(){
		this.list = ko.observableArray();
		this.totalRowCount = 1;
		this.rowLimit = 10;
		this.navCount = 5;
		this.page = ko.observable(1);
		this.lastPage = ko.observable(1);
		this.moveToLoad = true;
		this.option = null;
	};
	
	m.Pagination.prototype = {
		/*
		list: ko.observableArray(),
		totalRowCount: 1,
		rowLimit: 10,
		navCount: 5,
		page: ko.observable(1),
		lastPage: ko.observable(1),
		moveToLoad: true,
		option: null,
		*/
		// pagination 초기화 부분[시작]
		init: function(mOption){
			var self = this;
			
			this.option = {
				pageClickToTop: true
			};
			
			$.extend(this.option, mOption);
			
			this.isFirstPageGroup = ko.computed(function(){
				var iPage = self.page();
				var iRowLimit = self.navCount;
				
				return iPage <= iRowLimit;
			});
			this.isLastPageGroup = ko.computed(function(){
				var iPage = self.page();
				var iRowLimit = self.navCount;
				var iLastPage = self.lastPage();
				var iNavCount = self.navCount;
				var iMinRange = ( Math.floor((iPage - 1) / iNavCount) * iNavCount) + 1;
				var iLastMin = ( Math.floor((iLastPage - 1) / iNavCount) * iNavCount) + 1;
				var bRet = false;
				
				if (iLastMin > iLastPage){
					iLastMin = iMinRange;
				}
				
				console.log({
					page: iPage,
					rowlimit: iRowLimit,
					lastPage: iLastPage,
					navCount: iNavCount,
					minRange: iMinRange,
					lastMin:  iLastMin
				});
				
				bRet = (iPage <= iLastPage) && (iMinRange === iLastMin);//( (iMinRange < iPage) && (iPage <= iLastPage) && ((iLastPage - iPage) <= iRowLimit) );
				
				return 	bRet;
			});
			
			this.initEvent();
			this.generate( this.totalRowCount, this.rowLimit, this.navCount, this.page() );
			
			return this;
		},// pagination 초기화 부분[종료]
		
		// 이벤트 초기화 부분 [시작]
		initEvent: function(){
			var self = this;
			this.evt_pageclick = null;
			this.pageclick = function(callback){
				this.evt_pageclick = callback;
			};
			this.onPageClick = function(page, event){
				var iPage = parseInt(page);
				var jqItem = $(event.currentTarget).parent();
				var jqPageContainer = jqItem.parent();
				
				if (iPage === self.page() ) return;
				
				jqPageContainer.find("li.active").removeClass("active");
				jqItem.addClass("active");
				
				try{
					self.evt_pageclick({page: iPage});
					if (self.option.pageClickToTop === true){
						$(window).scrollTop(0, 0);
					}
				}
				catch(e){
					console.log(page);
					console.log(event);
				}
			};
			
			this.onMovePrevClick = function(data, event){
				var jqPrevBtn = $(event.currentTarget).parent();
				var iPage = 0;
				var iCurrPage = 0;
				var iNavCount = 0;
				var iMod = 0;
				
				if (jqPrevBtn.hasClass("disabled") === true){
					return;
				}
				
				iNavCount = self.navCount;
				iCurrPage = self.page();
				iMod = iCurrPage % iNavCount;
				if (iMod === 0){
					iPage = iCurrPage - 1;
				}
				else{
					iPage = iCurrPage - iMod - iNavCount + 1;
				}
	
				if (self.moveToLoad === true){
					event.currentTarget = jqPrevBtn.siblings().eq(0).find("a").get(0);
					self.onPageClick( iPage, event );
				}
				
				console.log(data);
				console.log(event);
			};
			this.onMoveNextClick = function(data, event){
				var jqNextBtn = $(event.currentTarget).parent();
				var iPage = 0;
				var iCurrPage = 0;
				var iNavCount = 0;
				var iMod = 0;
				
				if (jqNextBtn.hasClass("disabled") === true){
					return;
				}
				
				iNavCount = self.navCount;
				iCurrPage = self.page();
				iMod = iCurrPage % iNavCount;
				if (iMod === 0){
					iPage = iCurrPage + 1;
				}
				else{
					iPage = iCurrPage - iMod + iNavCount + 1;
				}
	
				if (self.moveToLoad === true){
					event.currentTarget = jqNextBtn.siblings().eq(1).find("a").get(0);
					self.onPageClick( iPage, event );
				}
				
				console.log(data);
				console.log(event);
			};
		},// 이벤트 초기화 부분 [종료]
		
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
		}
	};
	// 페이징 컨트롤러 [종료]
/*
	$(function(m, $, ko){
		try{
			var app = new m.App();
			app.run();
		}
		catch(e){}
		//m.setMBdata(m.mb_name, m.mb_id);	
	}(window.m, $, ko));
	*/
});
