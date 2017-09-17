// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap","mobilebase","jqueryfinger"], function($, carousel, ko, koutil, json, bootstrap,mobilebase,jqueryfinger) {

	function FreeLectureModel() {
		
		var self = this;	
				
		self.freeLec = {				
			freeFirstCateList : ko.observableArray(),	//대 카테고리
			freeSubCateList : ko.observableArray(),	//무료 강좌가 있는 상품을 포함한 카테고리							
			init : function(){				
												
			},
			setData : function(data){				
				this.freeFirstCateList.removeAll();					
				$.map(data, function(item){					
					self.freeLec.freeFirstCateList.push(item);								
				});
				self.freeLec.init();
			},			
			setListData : function(data){				
				this.freeSubCateList.removeAll();					
				$.map(data, function(item){					
					self.freeLec.freeSubCateList.push(item);								
				});														
			},
			/*
			load : function(){				
				$.getJSON("/mobile/mb/freelec.php", { mode : 'button'} , function(data){
					//console.log(data);
					self.freeLec.setData(data);		
								
				});				
			},
			*/
			
			load : function(){
				self.freeLec.getSubCateList('001');
			},
			
			onFreeCateClick : function(item , event){
				var jqHash = event.currentTarget.hash;								
				var spHash = jqHash.split('/');
				var cat_id = spHash[1];				
				self.freeLec.getSubCateList(cat_id);
			},
			
			getSubCateList : function(cat_id){
				$.getJSON("/mobile/mb/freelec.php", { mode : 'list' , cat_id : cat_id} , function(data){
					//console.log(data);
					self.freeLec.setListData(data);					
				});
			}
			
			
						
		};		
								
		self.freeLec.load();

		
		
		
	}	
	m.FreeLectureModel = FreeLectureModel;			
		
	function App(){
		this.run = function(){
			var vm = new m.FreeLectureModel();
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