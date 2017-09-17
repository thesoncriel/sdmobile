// Define the namespace
window.m = window.m || {};

define(["jquery", "carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "mobilebase" ], function($, carousel, ko, koutil, json, bootstrap, mobilebase) {

// VERSION: 2.2 LAST UPDATE: 13.03.2012
/* 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * 
 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
 * Website: http://code.google.com/p/jqueryrotate/ 
 */
(function(j){for(var d,k=document.getElementsByTagName("head")[0].style,h=["transformProperty","WebkitTransform","OTransform","msTransform","MozTransform"],g=0;g<h.length;g++)void 0!==k[h[g]]&&(d=h[g]);var i="v"=="\v";jQuery.fn.extend({rotate:function(a){if(!(0===this.length||"undefined"==typeof a)){"number"==typeof a&&(a={angle:a});for(var b=[],c=0,f=this.length;c<f;c++){var e=this.get(c);if(!e.Wilq32||!e.Wilq32.PhotoEffect){var d=j.extend(!0,{},a),e=(new Wilq32.PhotoEffect(e,d))._rootObj;
b.push(j(e))}else e.Wilq32.PhotoEffect._handleRotation(a)}return b}},getRotateAngle:function(){for(var a=[],b=0,c=this.length;b<c;b++){var f=this.get(b);f.Wilq32&&f.Wilq32.PhotoEffect&&(a[b]=f.Wilq32.PhotoEffect._angle)}return a},stopRotate:function(){for(var a=0,b=this.length;a<b;a++){var c=this.get(a);c.Wilq32&&c.Wilq32.PhotoEffect&&clearTimeout(c.Wilq32.PhotoEffect._timer)}}});Wilq32=window.Wilq32||{};Wilq32.PhotoEffect=function(){return d?function(a,b){a.Wilq32={PhotoEffect:this};this._img=this._rootObj=
this._eventObj=a;this._handleRotation(b)}:function(a,b){this._img=a;this._rootObj=document.createElement("span");this._rootObj.style.display="inline-block";this._rootObj.Wilq32={PhotoEffect:this};a.parentNode.insertBefore(this._rootObj,a);if(a.complete)this._Loader(b);else{var c=this;jQuery(this._img).bind("load",function(){c._Loader(b)})}}}();Wilq32.PhotoEffect.prototype={_setupParameters:function(a){this._parameters=this._parameters||{};"number"!==typeof this._angle&&(this._angle=0);"number"===
typeof a.angle&&(this._angle=a.angle);this._parameters.animateTo="number"===typeof a.animateTo?a.animateTo:this._angle;this._parameters.step=a.step||this._parameters.step||null;this._parameters.easing=a.easing||this._parameters.easing||function(a,c,f,e,d){return-e*((c=c/d-1)*c*c*c-1)+f};this._parameters.duration=a.duration||this._parameters.duration||1E3;this._parameters.callback=a.callback||this._parameters.callback||function(){};a.bind&&a.bind!=this._parameters.bind&&this._BindEvents(a.bind)},_handleRotation:function(a){this._setupParameters(a);
this._angle==this._parameters.animateTo?this._rotate(this._angle):this._animateStart()},_BindEvents:function(a){if(a&&this._eventObj){if(this._parameters.bind){var b=this._parameters.bind,c;for(c in b)b.hasOwnProperty(c)&&jQuery(this._eventObj).unbind(c,b[c])}this._parameters.bind=a;for(c in a)a.hasOwnProperty(c)&&jQuery(this._eventObj).bind(c,a[c])}},_Loader:function(){return i?function(a){var b=this._img.width,c=this._img.height;this._img.parentNode.removeChild(this._img);this._vimage=this.createVMLNode("image");
this._vimage.src=this._img.src;this._vimage.style.height=c+"px";this._vimage.style.width=b+"px";this._vimage.style.position="absolute";this._vimage.style.top="0px";this._vimage.style.left="0px";this._container=this.createVMLNode("group");this._container.style.width=b;this._container.style.height=c;this._container.style.position="absolute";this._container.setAttribute("coordsize",b-1+","+(c-1));this._container.appendChild(this._vimage);this._rootObj.appendChild(this._container);this._rootObj.style.position=
"relative";this._rootObj.style.width=b+"px";this._rootObj.style.height=c+"px";this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;this._eventObj=this._rootObj;this._handleRotation(a)}:function(a){this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;this._width=this._img.width;this._height=this._img.height;this._widthHalf=this._width/2;this._heightHalf=this._height/2;var b=Math.sqrt(this._height*
this._height+this._width*this._width);this._widthAdd=b-this._width;this._heightAdd=b-this._height;this._widthAddHalf=this._widthAdd/2;this._heightAddHalf=this._heightAdd/2;this._img.parentNode.removeChild(this._img);this._aspectW=(parseInt(this._img.style.width,10)||this._width)/this._img.width;this._aspectH=(parseInt(this._img.style.height,10)||this._height)/this._img.height;this._canvas=document.createElement("canvas");this._canvas.setAttribute("width",this._width);this._canvas.style.position="relative";
this._canvas.style.left=-this._widthAddHalf+"px";this._canvas.style.top=-this._heightAddHalf+"px";this._canvas.Wilq32=this._rootObj.Wilq32;this._rootObj.appendChild(this._canvas);this._rootObj.style.width=this._width+"px";this._rootObj.style.height=this._height+"px";this._eventObj=this._canvas;this._cnv=this._canvas.getContext("2d");this._handleRotation(a)}}(),_animateStart:function(){this._timer&&clearTimeout(this._timer);this._animateStartTime=+new Date;this._animateStartAngle=this._angle;this._animate()},
_animate:function(){var a=+new Date,b=a-this._animateStartTime>this._parameters.duration;if(b&&!this._parameters.animatedGif)clearTimeout(this._timer);else{(this._canvas||this._vimage||this._img)&&this._rotate(~~(10*this._parameters.easing(0,a-this._animateStartTime,this._animateStartAngle,this._parameters.animateTo-this._animateStartAngle,this._parameters.duration))/10);this._parameters.step&&this._parameters.step(this._angle);var c=this;this._timer=setTimeout(function(){c._animate.call(c)},10)}this._parameters.callback&&
b&&(this._angle=this._parameters.animateTo,this._rotate(this._angle),this._parameters.callback.call(this._rootObj))},_rotate:function(){var a=Math.PI/180;return i?function(a){this._angle=a;this._container.style.rotation=a%360+"deg"}:d?function(a){this._angle=a;this._img.style[d]="rotate("+a%360+"deg)"}:function(b){this._angle=b;b=b%360*a;this._canvas.width=this._width+this._widthAdd;this._canvas.height=this._height+this._heightAdd;this._cnv.translate(this._widthAddHalf,this._heightAddHalf);this._cnv.translate(this._widthHalf,
this._heightHalf);this._cnv.rotate(b);this._cnv.translate(-this._widthHalf,-this._heightHalf);this._cnv.scale(this._aspectW,this._aspectH);this._cnv.drawImage(this._img,0,0)}}()};i&&(Wilq32.PhotoEffect.prototype.createVMLNode=function(){document.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{return!document.namespaces.rvml&&document.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),function(a){return document.createElement("<rvml:"+a+' class="rvml">')}}catch(a){return function(a){return document.createElement("<"+
a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}}())})(jQuery);

	m.event = {
		init: function(){
			if (this.isEventDoc() === true){
				this.chuseok140830();
			}
		},
		isEventDoc: function(){
			return $("#event_chuseok_140830").length > 0;
		},
		
		// 추석 이벤트 [시작]
		chuseok140830: function(){
			var self = this;
			var jqEvent = $("#event_chuseok_140830");
			var jqThrowYucht = jqEvent.find(".throw_yucht");
			
			$("#closeHoliResultBtn").click(function(e) {
			    $("#resultAreaMobile").hide();
				$("#holiday_event_popup_background_m").hide();
			});

			$(".holiday-stick-layer a").click(function(){
				$(".holiday-stick-area").fadeOut(function(){
					$(".holiday-stick-area span").rotate(0);
				});
				$(".holiday-stick-layer").fadeOut();
				
			});
			
			if ((m.mb_id === "sd_yotimer") || (m.mb_id === "sd_ohj0213")){
				
			}
			else{
				
			}
			
			jqThrowYucht.click(function(){
				m._eventClicked = m._eventClicked || false;
				
				if (m._eventClicked === false){
					self.go_to_event(31);
					m._eventClicked = true;
				}
				
				setTimeout(function(){
					m._eventClicked = false;
				}, 500);
				
				return false;
			});
			
			this.startHolidayGame(1,1,2,1,1, true);
		},
		
		stick1: null,
		stick2: null,
		stick3: null,
		stick4: null,
		
		/*윷놀이*/
		startHolidayGame : function(r1,r2,r3,r4,resultNum, isTest){
			var $stick1,$stick2,$stick3,$stick4;
			var jqHolidayStickArea = this.jqHolidayStickArea;
			
			//jqHolidayStickArea.append( $("<img src=\"/mobile/images/event/chuseok_event_yucht_motion.gif\" width=\"340\"/>").css({"margin-top": "-20px"}));
			//jqHolidayStickArea.show();
			
			//$("#wrap").append("<div id='holiday_event_popup_background_m'></div>");

			$(".holiday-stick-area").show();
			if(isTest === true){
				$(".holiday-stick-area").css("z-index", "-1");
			}
			else{
				$(".holiday-stick-area").css("z-index", "1");
			}
			//$(".holiday-stick-layer").show();
			
			//$("#start_btn").hide();
			this.stick1 = $("#stick1m");
			this.stick2 = $("#stick2m");
			this.stick3 = $("#stick3m");
			this.stick4 = $("#stick4m");
			
			
			
			if(isTest === true){
				this.changeTestFastStick(this.stick1,1,3,4,2);
				this.changeLeftFastStick(this.stick2,1,3,4,2);
				this.changeLeftFastStick(this.stick3,1,3,4,2);
				this.changeLeftFastStick(this.stick4,1,3,4,2);
				setTimeout(function(){
					$(".holiday-stick-area span").rotate(0);
					$(".holiday-stick-area").hide().css("z-index", "1");
				}, 500);
				return;
			}
			else{
				this.changeLeftFastStick(this.stick1,1,3,4,2);
				this.changeRightFastStick(this.stick2,1,4,3,1);
				this.changeLeftFastStick(this.stick3,1,3,4,2);
				this.changeRightFastStick(this.stick4,1,4,2,1);
			}
			
			if (isTest !== true){
				this.changeCustomStick(this.stick1,1,3,4,1,200,200,200,r1);
				this.changeCustomStick(this.stick2,1,4,3,1,200,400,600,r2);
				this.changeCustomStick(this.stick3,1,3,4,2,200,200,600,r3);
				this.changeCustomStick(this.stick4,1,4,2,1,400,700,800,r4);
			}
			
				
			/*
			this.changeFastStick(this.stick1,1,3,4,2);
			this.changeFastStick(this.stick2,1,4,3,1);
			this.changeFastStick(this.stick3,1,3,4,2);
			this.changeFastStick(this.stick4,1,4,2,1);
			*/
			/*
			this.changeLeftFastStick(this.stick1,1,3,4,2, function(){
				m.event.changeRightFastStick(m.event.stick2,1,4,3,1, function(){
					m.event.changeLeftFastStick(m.event.stick3,1,3,4,2, function(){
						m.event.changeRightFastStick(m.event.stick4,1,4,2,1, function(){});
					});
				});
			});
			
			
			
			
			for(var i=0;i<2;i++){	
				this.changeCustomStick(this.stick1,1,3,4,1,200,200,200,r1, function(){
					m.event.changeCustomStick(m.event.stick2,1,4,3,1,200,400,600,r2, function(){
						m.event.changeCustomStick(m.event.stick3,1,3,4,2,200,200,600,r3, function(){
							m.event.changeCustomStick(m.event.stick4,1,4,2,1,400,700,800,r4, function(){});
						});
					});
				});
				
				
											
			}
			*/
			
			if (isTest !== true){
				$(".holiday-stick-layer").find("img").attr("src", "/mobile/images/event/chuseok_event_20140830_r" + resultNum + "." + "jpg");
			
				setTimeout(function(){
					//jqHolidayStickArea.empty();
					$("#resultAreaMobile").fadeIn('slow');
					$("#holiday_event_popup_background_m").show();
				},5000);
			}
		},
		
		changeFastStick : function(stick,num1,num2,num3,num4){
			stick.css("background-position", (-1 * ((num2 - 1) * 25)) + "px 0px");
			stick.delay(50).animate({opacity: 'show' }, 600, function(){
				stick.css("background-position", (-1 * ((num3 - 1) * 25)) + "px 0px");
				 //stick.removeClass("stick-mode-"+num2).addClass("stick-mode-"+num3);
			}).delay(50).animate({opacity: 'show' }, 600, function(){
				stick.css("background-position", (-1 * ((num4 - 1) * 25)) + "px 0px");
				 //stick.removeClass("stick-mode-"+num3).addClass("stick-mode-"+num4);
			}).delay(50).animate({opacity: 'show' }, 600, function(){
				stick.css("background-position", (-1 * ((num1 - 1) * 25)) + "px 0px");
				 //stick.removeClass("stick-mode-"+num4).addClass("stick-mode-"+num1);
			});
		},
		
		changeTestFastStick: function(stick,num1,num2,num3,num4){
			stick.animate({ opacity: 'show' , "margin-top":"-100px","margin-left":"0px" }, 100, function () {
				stick.removeClass("stick-mode-"+num1).addClass("stick-mode-"+num2+"m").rotate({animateTo:690});
			}).delay(50).animate({opacity: 'show', "margin-top":"0px" , "margin-left":"20px"  }, 100, function(){
				 stick.removeClass("stick-mode-"+num2).addClass("stick-mode-"+num3+"m");
			});
		},
		
		changeLeftFastStick: function(stick,num1,num2,num3,num4){
			//690
			/*
			stick.animate({ "margin-top":"-100px","margin-left":"0px", transform: "rotate(180deg)" }, 100, function () {
				//stick.animate({transform: "rotate(180deg)"});
				stick.css("background-position", (-1 * ((num2 - 1) * 25)) + "px 0px");
			}).delay(100).animate({"margin-top":"0px" , "margin-left":"20px"  }, 600, function(){
				 stick.css("background-position", (-1 * ((num3 - 1) * 25)) + "px 0px");
			}).delay(100).animate({}, 600, function(){
				 stick.css("background-position", (-1 * ((num4 - 1) * 25)) + "px 0px");
			}).delay(100).animate({}, 600, function(){
				 stick.css("background-position", (-1 * ((num1 - 1) * 25)) + "px 0px");
			});
			*/
			stick.animate({ opacity: 'show' , "margin-top":"-100px","margin-left":"0px" }, 100, function () {
				stick.removeClass("stick-mode-"+num1).addClass("stick-mode-"+num2+"m").rotate({animateTo:690});
			}).delay(50).animate({opacity: 'show', "margin-top":"0px" , "margin-left":"20px"  }, 600, function(){
				 stick.removeClass("stick-mode-"+num2).addClass("stick-mode-"+num3+"m");
			}).delay(50).animate({opacity: 'show' }, 600, function(){
				 stick.removeClass("stick-mode-"+num3).addClass("stick-mode-"+num4+"m");
			}).delay(50).animate({opacity: 'show' }, 600, function(){
				 stick.removeClass("stick-mode-"+num4).addClass("stick-mode-"+num1+"m");
			});	
		},
		
		changeRightFastStick: function(stick,num1,num2,num3,num4){
			//530
			/*
			stick.animate({ "margin-top":"-100px","margin-right":"20px", transform: "rotate(170deg)" }, 100, function () {
				//stick.animate({transform: "rotate(180deg)"});
				stick.css("background-position", (-1 * ((num2 - 1) * 25)) + "px 0px");
			}).delay(100).animate({"margin-top":"10px" , "margin-right":"0px"  }, 600, function(){
				stick.css("background-position", (-1 * ((num3 - 1) * 25)) + "px 0px");
			}).delay(100).animate({}, 600, function(){
				stick.css("background-position", (-1 * ((num4 - 1) * 25)) + "px 0px");
			}).delay(100).animate({}, 600, function(){
				stick.css("background-position", (-1 * ((num1 - 1) * 25)) + "px 0px");
			});	
			*/
			stick.animate({ opacity: 'show' , "margin-top":"-100px","margin-right":"20px" }, 100, function () {
				stick.removeClass("stick-mode-"+num1+"m").addClass("stick-mode-"+num2+"m").rotate({animateTo:530});
			}).delay(50).animate({opacity: 'show', "margin-top":"10px" , "margin-right":"0px"  }, 600, function(){
				 stick.removeClass("stick-mode-"+num2+"m").addClass("stick-mode-"+num3+"m");
			}).delay(50).animate({opacity: 'show' }, 600, function(){
				 stick.removeClass("stick-mode-"+num3+"m").addClass("stick-mode-"+num4+"m");
			}).delay(50).animate({opacity: 'show' }, 600, function(){
				 stick.removeClass("stick-mode-"+num4+"m").addClass("stick-mode-"+num1+"m");
			});
		},
		
		/*
		changeLeftFastStick: function(stick,num1,num2,num3,num4){
			stick.animate({ opacity: 'show' , "margin-top":"-100px","margin-left":"0px" }, 100, function () {
				stick.css("background-position", (-1 * ((num2 - 1) * 25)) + "px 0px").rotate({animateTo:690});
			}).delay(50).animate({opacity: 'show', "margin-top":"0px" , "margin-left":"20px"  }, 600, function(){
				 stick.css("background-position", (-1 * ((num3 - 1) * 25)) + "px 0px");
			}).delay(50).animate({opacity: 'show' }, 600, function(){
				 stick.css("background-position", (-1 * ((num4 - 1) * 25)) + "px 0px");
			}).delay(50).animate({opacity: 'show' }, 600, function(){
				 stick.css("background-position", (-1 * ((num1 - 1) * 25)) + "px 0px");
			});	
		},
		
		changeRightFastStick: function(stick,num1,num2,num3,num4){
			stick.animate({ opacity: 'show' , "margin-top":"-100px","margin-right":"20px" }, 100, function () {
				stick.css("background-position", (-1 * ((num2 - 1) * 25)) + "px 0px").rotate({animateTo:530});
			}).delay(50).animate({opacity: 'show', "margin-top":"10px" , "margin-right":"0px"  }, 600, function(){
				stick.css("background-position", (-1 * ((num3 - 1) * 25)) + "px 0px");
			}).delay(50).animate({opacity: 'show' }, 600, function(){
				stick.css("background-position", (-1 * ((num4 - 1) * 25)) + "px 0px");
			}).delay(50).animate({opacity: 'show' }, 600, function(){
				stick.css("background-position", (-1 * ((num1 - 1) * 25)) + "px 0px");
			});	
		},
		 */
		
		changeCustomStick : function(stick,num1,num2,num3,num4,delay1,delay2,delay3,num){		
			/*		
			stick.animate({ opacity: 'show' }, 100, function () {
				stick.removeClass("stick-mode-"+num1+"m").addClass("stick-mode-"+num2+"m");
			}).delay(delay1).animate({opacity: 'show' }, 600, function(){
				 stick.removeClass("stick-mode-"+num2+"m").addClass("stick-mode-"+num3+"m");
			}).delay(delay2).animate({opacity: 'show' }, 600, function(){
				 stick.removeClass("stick-mode-"+num3+"m").addClass("stick-mode-"+num4+"m");
			}).delay(delay3).animate({opacity: 'show' }, 600, function(){
				 stick.removeClass("stick-mode-"+num4+"m").addClass("stick-mode-"+num+"m");
			});*/	
			
			stick.css("background-position", (-1 * ((num2 - 1) * 25)) + "px 0px");		
			stick.delay(delay1).animate({opacity: 'show' }, 600, function(){
				stick.css("background-position", (-1 * ((num3 - 1) * 25)) + "px 0px");
				//stick.removeClass("stick-mode-"+num2).addClass("stick-mode-"+num3);
			}).delay(delay2).animate({opacity: 'show' }, 600, function(){
				stick.css("background-position", (-1 * ((num4 - 1) * 25)) + "px 0px");
				//stick.removeClass("stick-mode-"+num3).addClass("stick-mode-"+num4);
			}).delay(delay3).animate({opacity: 'show' }, 600, function(){
				stick.css("background-position", (-1 * ((num - 1) * 25)) + "px 0px");
				//stick.removeClass("stick-mode-"+num4).addClass("stick-mode-"+num);
			});
			
		},
		
		// 추석 이벤트 [종료]
		
		
		
		
		// 공통 이벤트 메서드 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
		go_to_event: function(event_id,name,hp0,hp1,hp2){
			var self = this;
			var event_cat_id = $("#cat_id").val();
			if(event_id==26){
				//alert(hp0+hp1+hp2);
				$.post('/cm/shop/ajax_event_mock.php',{event_id : event_id,name : name,hp0 : hp0,hp1 : hp1,hp2 : hp2},
						function(rec){ 
						//alert(rec);
						if(event_id==26 && rec==1){
							layer_open('layer1');
						}else{
						switch (rec) {			
							  //case '1'  : alert('신청접수 되었습니다. 1~2일 내 발급예정입니다.');location.reload();break;	
							  case '2'  : alert('이미 신청한 이벤트 입니다.'); break;	
							  case '0'  : alert('진행되지 않은 이벤트 입니다.'); break;			 
							  case '-1'  : alert('죄송합니다! 이미 이벤트 신청자가 꽉 찬 상태입니다.\n\n다음 이벤트를 기약해주세요.'); break;	
							  case '-2'  : alert('죄송합니다! 이벤트 준비중입니다.\n\n이벤트 신청기간에 신청해주세요!.'); break;			 
							  case '-3'  : alert('죄송합니다! 이벤트가 종료되었습니다.\n\n다음 이벤트를 기약해주세요.'); break;
							  case '-4'  : alert('죄송합니다! 이미 수강 중이신 회원입니다.\n\n현재 월에 신규가입하신 비수강회원만 신청가능합니다.'); break;
							  case '100'  : location.href="/member/login.php?svs=popkon&url=/cp/event.php?cat_id=005001"; break;
							  case '11'  : alert('이벤트에 응모 하였습니다.\n\n마이페이지 내 쿠폰함에서 쿠폰을 확인해주세요!.'); 
												var result = confirm('마이페이지로 이동하시겠습니까?');
												if(result){
													location.href = "#mypage/coupon";
												}
												break;					  
							  default   : alert(rec); break;
							}
						}
					});
			}else{
				if(event_id == 29){				
					if($("[name='chkdate_p']").is(":checked") == true){
						var etc = $(":radio[name='chkdate_p']:checked").val();
					}
				}
				//alert(hp0+hp1+hp2);
				if(confirm('이벤트를 신청하시겠습니까?')){
					$.post('/cm/shop/ajax_event_insert.php',{event_id : event_id,name : name,hp0 : hp0,hp1 : hp1,hp2 : hp2, etc: etc, event_cat_id: event_cat_id},
						function(rec){ 
						//alert(rec);
						if(event_id==26 && rec==1){
							layer_open('layer1');
						}else if((event_id==30 || event_id==31 || event_id=='30' || event_id=='31') && (rec=='353' || rec=='354' || rec=='355' || rec=='356' || rec==353 || rec==354 || rec==355 || rec==356)){ //윷놀이 이벤트 예외처리
							switch(rec){
								case '353' : case 353 :	self.startHolidayGame(1,1,2,1,1); 	break;
								case '354' : case 354 : self.startHolidayGame(1,2,2,1,2); 	break;
								case '355' : case 355 : self.startHolidayGame(2,1,2,2,3); 	break;
								case '356' : case 356 : self.startHolidayGame(2,2,2,2,4);  break;
							}
						}else{
						switch (rec) {			
	        				  case '100'  : 
							  	var result = confirm('로그인후 참여하실수 있습니다.\n\r로그인 페이지로 이동하시겠습니까?');							
								var wr_id = $("#wr_id").val();
								var svs = $("#svs").val();
								var cat_id = $("#cat_id").val();
								var sidecode = $("#sidecode").val();
								if(result){
									location.href = "#member/login";
									//location.href="/member/login.php?svs="+svs+"&board_table=event&svs="+svs+"&cat_id="+cat_id+"&sidecode="+sidecode+"&url=/bbs/board.php?bo_table=event&wr_id="+wr_id+"&svs="+svs+"&cat_id="+cat_id+"&sidecode="+sidecode+"&sca=ing&onco=";
								}
							  break;	
							  case '1'  : alert('신청접수 되었습니다.');location.reload();break;	
							  case '9'  : alert('신청이 완료되어 정상적으로 쿠폰이 발급되었습니다.\n\n마이페이지 내 쿠폰함에서 쿠폰을 확인해주세요!.');break;	
							  case '2'  : alert('이미 신청한 이벤트 입니다.'); break;	
							  case '0'  : alert('진행되지 않은 이벤트 입니다.'); break;			 
							  case '-1'  : alert('죄송합니다! 이미 이벤트 신청자가 꽉 찬 상태입니다.\n\n다음 이벤트를 기약해주세요.'); break;	
							  case '-2'  : alert('죄송합니다! 이벤트 준비중입니다.\n\n이벤트 신청기간에 신청해주세요!.'); break;			 
							  case '-3'  : alert('죄송합니다! 이벤트가 종료되었습니다.\n\n다음 이벤트를 기약해주세요.'); break;
							  case '11'  : alert('이벤트에 응모 하였습니다.\n\n마이페이지 내 쿠폰함에서 쿠폰을 확인해주세요!.'); 
												var result = confirm('마이페이지로 이동하시겠습니까?');
												if(result){
													location.href = "#mypage/coupon";
												}
												break;					  
							  default   : alert(rec); break;
							}
						}
					});
				}
			}
		}// go_to_event end ::::::::::::::::::::::::::::::::::::::
	};
});