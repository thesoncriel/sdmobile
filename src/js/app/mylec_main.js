// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap","mobilebase","jqueryfinger"], function($, carousel, ko, koutil, json, bootstrap,mobilebase,jqueryfinger) {

	function MyLectureModel() {
		
		var self = this;	
						
		var _PLAYSTORE_URL = "market://details?id=kr.imgtech.zoneplayer";				
		var _APP_INSTALL_URL_ANDROID = _PLAYSTORE_URL;
		
		self.myLecture = {		
			loginNow : false,
			itemList : ko.observableArray(),
			tbList : ko.observableArray(),
			init : function(){
				$(".phead a").addClass("collapsed");
				$(".subjecttitle a").addClass("collapsed");				
				/*$("body").append( $("<div id=\"wrap_modal\"></div>")
					.click(function(){
						self.myLecture.hide4dep();	
						self.myLecture.hideMessage();		 			
						return false;
					})                                                
				);
				$("body").append( $("<div id=\"message_layer\"></div>")
					.click(function(){
						self.myLecture.hideMessage();										
						return false;
					}) 
				);*/	
				if(!m.mb_id){
					$("#login_error").modal('show');		
					self.myLecture.showModalBackground();	
					return false;
				}
				
				$("#login_error").on("hide.bs.modal", function(e){
					console.log(e);
					if(self.myLecture.loginNow === false){
						m.viewSlider.prev();
					}
					self.myLecture.loginNow = false;
				});
			},
			setData : function(data){				
				this.itemList.removeAll();					
				$.map(data, function(item){					
					self.myLecture.itemList.push(item);								
				});
				self.myLecture.init();											
			},
			setTbData : function(data){
				this.tbList.removeAll();
				$.map(data, function(item){					
					self.myLecture.tbList.push(item);							
				});									
			},
			load: function(){
				$.getJSON("/mobile/mb/mypage_lecture.php",{mb_id: m.mb_id}, function(data){
					console.log(data);
					self.myLecture.setData(data);
					self.myLecture.loadContentData(0, 0);
				});
			},
			loadContentData : function(tb_id,it_id){	
				console.log(tb_id + "," + it_id);
				self.showLoadingModal();
				$.getJSON("/mobile/mb/tbcontentlist.php",{tb_id: tb_id, it_id: it_id},function(data){
					console.log(data);								
					self.myLecture.setTbData(data);
					self.hideLoadingModal();													
				});							
			},
			showByParam: function(param){
				if (param.bbsId){
					self.myLecture.loadContentData(param.bbsId, param.subId/*it_id*/);
					m.viewSlider.left( "#view_lectureContentList" );
				}
				else{
					this.show();
				}
			},
			show: function(){
				self.myLecture.load();
				m.viewSlider.left( "#view_lectureContent" );
			},
			show4dep : function(item, event){
				var mParam = m.parseParam( $(event.currentTarget).attr("href") );
				
				self.myLecture.loadContentData(item.tb_id, mParam.bbsId/*it_id*/);
				m.viewSlider.left( "#view_lectureContentList" );
				/*
				var tbId = item.tb_id;
				var tb_name = item.tb_name;
				var it_id = item.it_id;
				var width = $("#view_lectureContent").width();
				var height = $("#view_lectureContent").height();				
				if(event.bubbles===true){
					$("#tbContent").css({						
						"position":"absolute",
						"background":"#FFF",
						"margin-left":"-"+width+"px",						
						"display":"block",
						"z-index":"1039",
						"border":"1px solid #CCC",					
						"top":"0",
						"width":width+"px",
						"box-shadow": "5px 5px 10px #333",
						"padding-bottom":"30px"						
					});
					
					$("#tbName").text(tb_name);										
					self.myLecture.loadContentData(tbId,it_id);
					$("#tbContent").animate({
						"margin-left":"0px"						
					},500,function(){
						$(window).scrollTop(0);						
						self.myLecture.showModalBackground();
					});													
				}
				*/
			},
			hide4dep : function(){
				/*
				var width = $("#view_lectureContent").width();				
				$("#tbContent").animate({
					"margin-left":"-"+width+"px"									
				},500).animate({
					"display":"none"						
				},100, function(){
					self.myLecture.hideModalBackground();										
					$("#tbContent").css({
						"box-shadow": "none"
					});
				});
				*/
			},	
			showMessage : function(message){				
				if(event.bubbles === true){
					self.myLecture.showModalBackground();
					$("#message_layer p").remove();
					$("#message_layer").append("<p>"+message+"</p>");
					$("#message_layer").fadeIn();
					$("#message_layer").css({
						"box-shadow": "5px 5px 10px #333"
					});
				}
			},
			hideMessage : function(){						
				$("#message_layer").fadeOut();
				self.myLecture.hideModalBackground();
				$("#message_layer").css({
					"box-shadow": "none"
				});
			},
			showModalBackground : function(){
				//$("#wrap_modal").fadeIn();
			},
			hideModalBackground : function(){
				//$("#wrap_modal").fadeOut();
			},		
			set_ad_app : function(){ //앱 설치(Android only)				
				var result=confirm("Zone@Player 앱을 설치하거나\n업데이트하시면\n이용할 수 있습니다.\n설치 하시겠습니까?");
				if(result){					
					location.href=_APP_INSTALL_URL_ANDROID;
				}
			},
			startZonePlayer : function(target){
				if(event.bubbles===true){					
					document.appframe.location = target;
        			setTimeout(self.myLecture.callback(), 500);
				}
			},
			callback : function() { 								
				try {
					var s = document.appframe.document.body;							
					var resultDiv = document.getElementById("applinkDiv");
					resultDiv.innerHTML = "Installed!<p>" + s;					
				} catch (e) {					
					if (confirm("앱이 설치 되어 있지 않습니다.\n\n앱을 설치하시겠습니까?\n\n이미 설치하신경우 새로고침 해주세요!")) {
						alert("설치후 반드시 새로고침을 해주세요.");
						location.href = _APP_INSTALL_URL_ANDROID;
						return false;
					}
				}
			},
			executeApp : function(target) {	
				if(event.bubbles===true){							
					$(location).attr('href',target);
				}				
			},
			/*
			onLoginClick: function(data , event){
				//$("#login_error").modal('hide');
				//self.myLecture.hideModalBackground();
				self.myLecture.loginNow = true;	
				self.onClickBoard(data , event);				
			},
			show_android_m : function(){				
				$("#android_m").modal('show');
			},
			show_iOS_m : function(){				
				$("#iOS_m").modal('show');
			}*/
						
		};
	}
	
	MyLectureModel.prototype = new m.BaseViewModel();
	MyLectureModel.prototype.constructor = MyLectureModel;
	
	m.MyLectureModel = MyLectureModel;			
	/*	
	function App(){
		this.run = function(){
			var vm = new m.MyLectureModel();
			try{
				$.extend(vm, new m.NavModel());
				m.vm = vm;
				ko.applyBindings(vm);
				m.binded = true;
			}
			catch(e){}
		};
	}
	m.App = App;


	$(function(m, $, ko){
		var app = new m.App();
		app.run();
		//m.setMBdata(m.mb_name, m.mb_id);	
	}(window.m, $, ko));
	
	*/
});