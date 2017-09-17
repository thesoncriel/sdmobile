// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "jqueryfinger", "owlcarousel", "mobilebase"], 
function($, carousel, ko, koutil, json, bootstrap, owlcarousel, mobilebase) {

	function AutoCompleteModel() {
		var self = this;
		
		try{
			self.autocomplete = new m.AutoComplete().init({
				list: "#list_autoComplete",
				panel: "#panel_autoComplete",
				search: "#form_autoComplete",
				input: "#form_topSearch input[name='stx']",
				cookieKey: "autoComplete"
			});
			self.lastsearch = new m.LastSearch().init({
				list: "#list_lastSearch",
				panel: "#panel_lastSearchList"
			});
			
			self.autocomplete.shown(function(){
				self.lastsearch.hide();
			});
			self.lastsearch.shown(function(){
				self.autocomplete.hide();
			});
		}catch(e){
			console.log("오류있다능 조심하라능");
			console.log(e);
		}
		console.log("자동완성 객체 로딩 끗");
	}
	
	AutoCompleteModel.prototype = new m.BaseViewModel();
	AutoCompleteModel.prototype.constructor = AutoCompleteModel;
	m.AutoCompleteModel = AutoCompleteModel; 
	
	
// 최근 검색어 기능 [시작]	::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	m.LastSearch = function(){
		this.expireHour = 24 * 7; //1주일 저장
		this.max = 0;
		this.list = ko.observableArray();
		this.used = ko.observable(true);
	};
	m.LastSearch.prototype = {
		init: function(mOption){
			var self = this;
			var mDefOption = {
				max: 5,
				list: null,
				panel: null,
				cookieKey: "lastSearch",
				name: "최근 검색어"
			};
			
			$.extend(mDefOption, mOption);

			this.checkRequireOption(mDefOption, this._getRequireOptionNames());			
			this.option = mDefOption;
			this.max = this.option.max;
			this.jqList = $( this.option.list );
			this.jqPanel = $( this.option.panel );
			this.jqHeading = this.jqPanel.find(".panel-heading");
			this.jqUsedButton = this.jqPanel.find(".last-search-used");
			this.jqCloseButton = this.jqPanel.find(".close");
			this.used( this.getUsed() );
			
			this.initEvent();
			this.load();
			
			return this;
		},
		
		checkRequireOption: function(option, aReqField){
			var iLenReqField = aReqField.length;
			var sProp = "";
			var objField = undefined;
			
			for(var i = 0; i < iLenReqField; i++){
				sProp = aReqField[i];
				objField = option[ sProp ];
				
				if ((objField === null) || (objField === undefined)){
					throw "LastSearch.checkRequireOption: 오류: " + sProp + " 옵션은 필수 입니다.";
				}
			}
		},
		
		_getRequireOptionNames: function(){
			return ["list", "panel"];
		},
		
		initEvent: function(){
			var self = this;
			this.onUseChange = function(){
				if (self.used() === true){
					if (confirm( self.option.name + " 기능을 끄시겠습니까?" ) === true){
						self.setUsed(false);
						self.used(false);
					}
				}
				else{
					if (confirm( self.option.name + " 기능을 켜시겠습니까?" ) === true){
						self.setUsed(true);
						self.used(true);
					}
				}
			};
			
			this.onCloseClick = function(){
				self.hide();
			};
			
			this.evt_shown = null;
			this.shown = function(callback){
				this.evt_shown = callback;
				
				return this;
			};
			this.onShown = function(controller){
				try{
					this.evt_shown();
				}
				catch(e){}
			};
			
			this.evt_hidden = null;
			this.hidden = function(callback){
				this.evt_hidden = callback;
				
				return this;
			};
			this.onHidden = function(controller){
				try{
					this.evt_hidden();
				}
				catch(e){}
			};
			
			this.jqUsedButton.click( this.onUseChange );
			this.jqCloseButton.click( this.onCloseClick );
		},
		
		put: function(stx){
			var aList = this.list();
			
			
			this.list.unshift(stx);
			if (aList.length > this.max){
				console.log("팝!!!!!");
				this.list.pop();
			}
			
			this.save();
		},
		
		load: function(){
			var iLen = this.getLength();
			
			this.clear();
			for(var i = 0; i < iLen; i++){
				this.list.push( decodeURI(m.cookie.get("m." + this.option.cookieKey + "." + i)) );
			}
		},
		
		save: function(){
			var aList = this.list();
			var iLen = aList.length;
			
			if (iLen > this.max){
				iLen = this.max;
			}
			
			this.setLength(iLen);
			for(var i = 0; i < iLen; i++){
				m.cookie.set("m." + this.option.cookieKey + "." + i, aList[i], this.expireHour);
			}
		},
		
		clear: function(){
			try{
				this.list.removeAll();
			}
			catch(e){}
		},
		removeAll: function(){
			var aList = this.list();
			var iLen = aList.length;
			
			this.setLength(0);
			for(var i = 0; i < iLen; i++){
				m.cookie.remove("m." + this.option.cookieKey + "." + i);
			}
		},
		
		showList: function(){
			this.jqHeading.show();
			this.jqList.slideDown();
		},
		hideList: function(){
			this.jqHeading.hide();
			this.jqList.slideUp();
		},
		
		show: function(){
			var self = this;
			
			if (this.used() === true){
				this.jqHeading.show();
				this.jqList.show();
			}
			this.jqPanel.show(function(){
				self.onShown(self);
			});
		},
		hide: function(){
			this.jqPanel.hide();
			this.onHidden(this);
		},
		
		isVisible: function(){
			return this.jqPanel.css("display") !== "none"; 
		},
			
		getLength: function(){
			return $.tryParseInt( m.cookie.get("m." + this.option.cookieKey + ".length"), 0 );
		},
		setLength: function(length){
			m.cookie.set("m." + this.option.cookieKey + ".length", length, this.expireHour);
		},
		
		getUsed: function(){
			return $.tryParseInt( m.cookie.get("m." + this.option.cookieKey + ".used"), 1 ) === 1;
		},
		setUsed: function(used){
			m.cookie.set("m." + this.option.cookieKey + ".used", ((used)? 1 : 0), this.expireHour);
		}
	};
// 최근 검색어 기능 [종료]	------------------------------------------------------------
	
// 자동완성기능 [시작] ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	m.AutoComplete = function(){
		
	};
	m.AutoComplete.prototype = new m.LastSearch();
	$.extend(m.AutoComplete.prototype, {
		constructor: m.AutoComplete,
		init: function(mOption){
			m.LastSearch.prototype.init.call(this, mOption);
			
			this.option.name = "자동완성";
			this.jqFormSearch = $(this.option.search);
			this.jqSearchText = $(this.option.input);
			
			this.jqFormSearch.submit( this.onSearchSubmit );
			this.jqSearchText.keyup( this.onSearchTextChange );
			
			return this;
		},
		
		initEvent: function(){
			m.LastSearch.prototype.initEvent.call(this);
			
			var self = this;
			
			this.onSearchSubmit = function(e){
				var jqSearch = self.jqFormSearch;
				var mParam = "";
				var aList = [];
				var iMax = self.max;
				var iCnt = 0;
				
				mParam = m.serializeMap( jqSearch );
				
				console.log(mParam);
				$.getJSON(jqSearch.attr("action"), mParam, function(data){
					console.log(data);
					if (data){
						if (data.lec_cate){
							$.map(data.lec_cate, function(item){
								aList.push(item);
							});
						}
						if (data.book_cate){
							$.map(data.book_cate, function(item){
								aList.push(item);
							});
						}
						
						if (aList.length > iMax){
							aList = aList.slice(0, iMax);
						}
					}
					
					self.setList( aList );
					self.show();
				});
				
				return false;
			};
			
			this.onSearchTextChange = function(e){
				var sRequestText = "";
				
				self._isDelay = self._isDelay || false;
				self._beforeRequestText = self._beforeRequestText || "";
				
				setTimeout(function(){
					if (self._isDelay === false){
						sRequestText = $(e.currentTarget).val();
						
						if (self._beforeRequestText !== sRequestText){
							console.log(e);
							console.log( sRequestText );
							
							self._beforeRequestText = sRequestText;
							self.setSearchText( sRequestText );
							self.jqFormSearch.submit();
							
							self._isDelay = true;

							setTimeout(function(){
								self._isDelay = false;
								if (self._beforeRequest === true){
									self.onSearchTextChange(e);
									self._beforeRequest = false;
								}
							}, 200);
						}
						
						
						
						//self.onSearchTextChange(e);
						
					}
					else{
						self._beforeRequest = self._beforeRequest || true;
					}
				}, 1000);
			};
		},
		_getRequireOptionNames: function(){
			return ["list", "panel", "search", "input"];
		},
		
		load: function(){},
		
		setList: function(data){
			var sLecCate = "";
			var alist = this.list;
			
			this.clear();
			if (data){
				$.map(data, function(item){
					if (item.lec_cat_id){
						item.cat_id = m.findBookCateByLecCate( item.lec_cat_id ).book_cate;
					}
					else{
						item.cat_id = item.book_cat_id;
						item.lec_cat_id = "";
					}
					
					alist.push(item);
				});
			}
		},
		setSearchText: function(stx){
			this.jqFormSearch.find("input[type='text']").val(stx);
		}
	});
// 자동완성기능 [종료] ----------------------------------------------------------------
});