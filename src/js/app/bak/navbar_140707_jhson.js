// Define the namespace
window.m = window.m || {};
define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap"], function($, carousel, ko, koutil, json, bootstrap) {

	m.NavModel = function(pmid, pkword) {
		var self = this;
		
		self.category = ko.observableArray();
		
		self.nav = {
			selectedIndex : 0,
			selected : new m.NavModelData(),
			init : function(){
				$("#accordion_navCategory>li>a").addClass("collapsed");
				$("#accordion_navCategory>li>ul>li>a").click(self.nav.showSub);
				$("#list_navCategorySub>li>a").click(self.nav.hideSub);
				
				$("body").append( $("<div id=\"wrap_modal\"></div>")
					.click(self.nav.hide)
				);
				
				$("#button_navbarOpener").click(self.nav.show);
				$("#nav_category .close").click(self.nav.hide);
				$("#accordion_navCategory").on("shown.bs.collapse", function(event){
					var jqTarget = $(event.target);
					self.nav.selectedIndex = parseInt( jqTarget.data("index") );
					//var jqSelected = jqAccodion.find(".")
					console.log(event);
				});

			},
			show : function(){
				$("#wrap_modal").fadeIn();
				$("#nav_category").animate({
					left: "0px"
				},function(){
					$("#nav_category").css({
						"box-shadow": "5px 5px 10px #333"
					});
				});
				return false;
			},
			hide : function(){
				$("#wrap_modal").fadeOut();
				$("#nav_category").animate({
					left: "-280px"
				},function(){
					$("#nav_category").css({
						"box-shadow": "none"
					});
				});
				return false;
			},
			showSub : function(data, event){
				var jqItem = $( this );
				var index = parseInt( jqItem.data("index") );
				var obsarrSubCat = self.category()[ self.nav.selectedIndex ].sub_cat()[ index ].sub_cat();
				
				self.nav.selected.cat_id( jqItem.data("cat-id") );
				self.nav.selected.cat_name( jqItem.text() );
				self.nav.selected.sub_cat.removeAll();
				//console.log( self.category()[  );
				
				$.map(obsarrSubCat, function(item, index){
					self.nav.selected.sub_cat.push( item );
				});
				
				//self.nav.selected.sub_cat( self.category()[ self.nav.selectedIndex ].sub_cat());
				
				$(".nav-category").animate({
					"left": "-=280px"
				});
				return false;
			},
			hideSub : function(){
				$(".nav-category").animate({
					"left": "+=280px"
				});
				return false;
			},
			showMyMenu : function(){
				
			},
			hideMyMenu : function(){
				
			}
		};
		
		
		$.getJSON("/mobile/mb/main.php", function(data){
			console.log(data);
			$.map( m.convertToNavModelDataArray(data), function(item, index){
				self.category.push( item );
			} );
			
			self.nav.init();
		});
	}
	
	m.NavModelData = function(item){
		var self = this;
		
		if (item){
			self.cat_id = ko.observable(item.cat_id);
			self.cat_name = ko.observable(item.cat_name);
			self.sub_cat = ko.observableArray( m.convertToNavModelDataArray( item.sub_cat ) );
		}
		else{
			self.cat_id = ko.observable("");
			self.cat_name = ko.observable("");
			self.sub_cat = ko.observableArray();
		}
	}
	
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
	}

	$(function(m, $, ko){
		if (m.binded !== true){
			try{
				var app = new m.App();
				app.run();
				m.binded = true;
			}
			catch(e){}
		}
		//m.setMBdata(m.mb_name, m.mb_id);	
	}(window.m, $, ko));
	
});












