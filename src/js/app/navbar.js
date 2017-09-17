// Define the namespace
window.m = window.m || {};
define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "iscroll", "mobilebase"], 
function($, carousel, ko, koutil, json, bootstrap, iScroll, mobilebase) {

	m.NavModel = function(pmid, pkword) {
		var self = this;
		
		self.category = ko.observableArray();
		
		self.nav = {
			hasMyMenuShowed : false,
			hasGnbShowed : false,
			selectedIndex : 0,
			selected : new m.NavModelData(),
			init : function(){
				$("#accordion_navCategory>li>a").addClass("collapsed");
				//$("#accordion_navCategory>li>ul>li>a").click(self.nav.showSub);
				$(".nav-category-sub-header").click(self.nav.hideSub);
				
				$("body").append( $("<div id=\"wrap_modal\"></div>")
					.click(function(e){
						//self.nav.hide();
						if (e.currentTarget === e.target){
							self.nav.hideMyMenu();
							self.nav.hide();
						}
						
						return false;
					})                                                
				);
				
				$("#wrap_modal").get(0).addEventListener("touchmove", function(e){
					e.preventDefault();
					return false;
				}, false);
				
				$("#button_navbarOpener").click(self.nav.show);
				$("#nav_category .close").click(self.nav.hide);
				$("#button_myMenuOpener, #button_myMenuOpenerTop, [data-opener='mymenu']").click(function(){
					if (self.nav.hasMyMenuShowed === true){
						self.nav.hideMyMenu();
					}
					else if (self.nav.hasGnbShowed === true){
						self.nav.hide();
						self.nav.showMyMenu();
						
					}
					else{
						self.nav.showMyMenu();
					}
					
					return false;
				});
				$("[data-execute]").click(function(e){
					var sData = $(this).data("execute");
					
					$.getJSON($(this).attr("href"), function(data){
						alert( data.status.msg );
					});
					
					return false;
				});
				$("#nav_myMenu .close").click(self.nav.hideMyMenu);
				$("#accordion_navCategory").on("shown.bs.collapse", function(event){
					var jqTarget = $(event.target);
					self.nav.selectedIndex = parseInt( jqTarget.data("index") );
					//var jqSelected = jqAccodion.find(".")
					//console.log(event);
				});
				
				/*
				self.nav.categoryScroll = new window.iScroll("wrap_nav_category_list", {
					hScrollbar: false, vScrollbar: false
				});
				*/
				self.nav.myMenuScroll = new window.iScroll("nav_myMenu", {
					hScrollbar: false, vScrollbar: false
				});
				self.nav.cateScrollMain = new window.iScroll("nav_categoryMain", {
					hScrollbar: false, vScrollbar: false
				});
				self.nav.cateScrollSub = new window.iScroll("nav_categorySub", {
					hScrollbar: false, vScrollbar: false
				});
				
				$("#accordion_navCategory").on("shown.bs.collapse", function(){
					self.nav.cateScrollMain.refresh();
				});
				$("#accordion_navCategory").on("hidden.bs.collapse", function(){
					self.nav.cateScrollMain.refresh();
				});
				
				$("#nav_categoryMain .list-group-item a").click(function(){
					
				});
				
				$(window).resize(function(){
					var iWinHeight = $(window).height();
					var iCateHeadHeight = $("#nav_category>div>h2").height();
					var jqWrapNavChildren = $(".wrap-nav-category-list").children();
				});
				
				// FIXME: 삭제 예정
				/*
				if (m.mb_id !== "sd_yotimer"){
					var fnCirclePackIconClick = function(e){
						//console.log("이벤트?");
						
						self.onClickBoard({}, e);
						
						return false;
					};
					
					$(".wrap-mymenu-middle .wrap-icon-circle-pack a").click( fnCirclePackIconClick );
				}
				*/
				//$(".wrap-mymenu-middle .wrap-icon-circle-pack a").first().off("click", fnCirclePackIconClick);
				//$(".wrap-mymenu-middle .wrap-icon-circle-pack a").first().on("click", fnCirclePackIconClick);
				
				/*document.addEventListener("touchmove", function(e){
					e.preventDefault();
				}, false);*/
			},
			show : function(){
				self.nav.showModalBackground();
				$("#nav_category").animate({
					left: "+=280px"
				},function(){
					$("#nav_category").css({
						"box-shadow": "5px 5px 10px #333"
					});
					self.nav.hasGnbShowed = true;
				});
				return false;
			},
			hide : function(){
				self.nav.hideModalBackground();
				$("#nav_category").animate({
					left: "-280px"
				},function(){
					$("#nav_category").css({
						"box-shadow": "none"
					});
					self.nav.hasGnbShowed = false;
				});
				return false;
			},
			showSub : function(data, event){
				var jqItem = $(this);
				var mParam = m.parseParam( jqItem.attr("href") );
				
				self.nav.showNavByParam(mParam);
				
				return false;
			},
			isSubVisible: function(){
				return $.tryParseInt( $(".wrap-category-block").eq(1).css("left").replace("px", "") ) === 0;
			},
			showNavByParam: function(param){
				if (param.name === "category"){
					var obsCat = self.category()[ parseInt(param.bbsId) ].sub_cat()[ parseInt(param.subId) ];
					var obsarrSubCat = obsCat.sub_cat();
				
					self.nav.selected.cat_id( obsCat.cat_id() );
					self.nav.selected.cat_name( obsCat.cat_name() );
					self.nav.selected.sub_cat.removeAll();
					//console.log( self.category()[  );
					
					$.map(obsarrSubCat, function(item, index){
						var sCatId = item.cat_id();
						
						if ( m.lecCateInfo[ sCatId ] !== undefined ){
							item.lec_cat_id = m.lecCateInfo[ sCatId ].lec_cate;
						}
						else{
							item.lec_cat_id = "";
						}
						self.nav.selected.sub_cat.push( item );
					});
					
					//self.nav.selected.sub_cat( self.category()[ self.nav.selectedIndex ].sub_cat());
					if (self.nav.isSubVisible() === false){
						$(".wrap-category-block").animate({
							"left": "-=280px"
						}, function(){
	
						});
					}

					self.nav.cateScrollSub.refresh();

				}
			},
			hideSub : function(){
				$(".wrap-category-block").animate({
					"left": "+=280px"
				});
				
				return false;
			},
			showMyMenu : function(){
				self.nav.showModalBackground();
				$("#nav_myMenu").animate({
					left: "+=280px"
				},function(){
					$("#nav_myMenu").css({
						"box-shadow": "5px 5px 10px #333"
					});
					self.nav.hasMyMenuShowed = true;
				});
				
				self.nav.showModalBackground();
				return false;
			},
			hideMyMenu : function(){
				self.nav.hideModalBackground();
				$("#nav_myMenu").animate({
					left: "-280px"
				},function(){
					$("#nav_myMenu").css({
						"box-shadow": "none"
					});
					self.nav.hasMyMenuShowed = false;
				}); 
				
				self.nav.hideModalBackground();
				return false;
			},
			
			showModalBackground : function(){
				$("#wrap_modal").fadeIn();
			},
			hideModalBackground : function(){
				$("#wrap_modal").fadeOut();
			},
			
			setData : function(data){
				/*
				var mFilterTarget = {
					"009" : "",
					"010" : "", 
					"011" : "", 
					"012" : "", 
					"013" : ""
				};*/
				//"001009": 비서
				/*data["001"].sub_cat["001004"].sub_cat[25] = {
					cat_id: "001004031",
					cat_name: "한국사능력검정시험"
				};
				*/
				delete data["004"].sub_cat["004004"]; //중입검정고시 삭제
				
				$.map( m.convertToNavModelDataArray(data), function(item, index){
					/*if ( mFilterTarget.hasOwnProperty( item.cat_id() ) === true ){
						return;
					}*/
					self.category.push( item );
				} );
				
				self.nav.init();
			}
		};
	};
	
	m.NavModel.prototype = new m.BaseViewModel();
	m.NavModel.prototype.constructor = m.NavModel;
	
	m.NavModelData = function(item){
		var self = this;
		
		if (item){
			self.cat_id = ko.observable(item.cat_id);
			
			if (item.cat_name){
				self.cat_name = ko.observable(item.cat_name);
			}
			else{
				self.cat_name = ko.observable("공무원 교육학");
			}
			
			self.sub_cat = ko.observableArray( m.convertToNavModelDataArray( item.sub_cat ) );
		}
		else{
			self.cat_id = ko.observable("");
			self.cat_name = ko.observable("");
			self.sub_cat = ko.observableArray();
		}
	};
	
	m.convertToNavModelDataArray = function(data){
		var arr = [];
		var i = 0;
		
		if (data){
			for(var d in data){
				arr[ i ] = new m.NavModelData( data[ d ] );
				i++;
			}
		}
		
		return arr;
	};
	
});












