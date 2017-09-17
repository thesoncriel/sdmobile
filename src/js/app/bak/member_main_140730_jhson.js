// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "jqueryfinger", "owlcarousel", "mobilebase"], function($, carousel, ko, koutil, json, bootstrap, owlcarousel, mobilebase) {

	function MemberModel() {
		var self = this;
		
		self.member = {
			mb_id: ko.observable( m.mb_id ),
			clientip: ko.observable( m.clientip ),
			save_id: ko.observable(false),
			ssl_chk_box: ko.observable(false),
			isAdmin: ko.observable(false),
			hasLogin: ko.observable( (m.mb_id !== undefined) && (m.mb_id !== "") ),
			mb_level: ko.observable( m.mb_level ),
			
			msgFromfindId: ko.observable(""),
			msgFromFindPw: ko.observable(""),
			
			jqFormLogin: $("#form_login"),
			jqLoginErrorMsg: $("#message_login_error"), 
			
			jqFormFindIdByEmail: $("#form_member_findIdByEmail"),
			jqFormFindIdByPhone: $("#form_member_findIdByPhone"),
			jqFormFindPwByEmail: $("#form_member_findPwByEmail"),
			jqFormFindPwByPhone: $("#form_member_findPwByPhone"),
			
			jqFindIdErrorMsg: $(".message_find_id_error"), 
			jqFindPwErrorMsg: $(".message_find_pw_error"),
			
			jqPanelFindIdResult: $("#panel_member_findIdResult"),
			jqPanelFindPwResult: $("#panel_member_findPwResult"),
			
			init: function(){
				var sCookieSaveId = "";
				var sSSLChecked = "";
				
				this.jqFormLogin.submit( this.onLoginSubmit );
				this.jqFormFindIdByEmail.submit( this.onFindId );
				this.jqFormFindIdByPhone.submit( this.onFindId );
				this.jqFormFindPwByEmail.submit( this.onFindId );
				this.jqFormFindPwByPhone.submit( this.onFindId );
				
				$("#button_member_findIdResultClose").click(function(){
					self.member.hideFindIdResult();
				});
				$("#button_member_findPwResultClose").click(function(){
					self.member.hideFindPwResult();
				});
				
				$("#tab_member_findId a").click(function(){
					//self.member.hideFindIdResult();
				});
				$("#tab_member_findPw a").click(function(){
					//self.member.hideFindPwResult();
				});
				
				this.jqFormLogin.find("input[name='mb_id']").focusout( this.onAdminCheck );
				
				sCookieSaveId = m.cookie.get("save_id");
				sSSLChecked = m.cookie.get("ssl_chk_box");
				
				if ((sCookieSaveId !== undefined) && (sCookieSaveId !== "")){
					this.save_id(true);
					this.mb_id( sCookieSaveId );
					this.checkAdmin( sCookieSaveId );
				}
				if ((sSSLChecked !== undefined) && (sSSLChecked !== "")){
					this.ssl_chk_box(true);
				}
				
				//this.hasLogin( this.mb_id() !== "" );
			},
			
			moveViewByParam: function(param){
				if (param.name === "login"){
					this.showLogin();
				}
				else if (param.name === "findid"){
					this.showFindId();
				}
				else if (param.name === "findpw"){
					this.showFindPw();
				}
				else if (param.name === "join"){
					this.showJoin();
				}
				else if (param.name === "modify"){
					this.showModify();
				}
				else if (param.name === "coupon"){
					this.showCoupon();
				}
				else if (param.name === "logout"){
					this.logout();
				}
				
			},
			
			showLogin: function(){
				m.slideLeft( $(".active-view"), $("#view_login") );
			},
			showFindId: function(){
				m.slideLeft( $(".active-view"), $("#view_findId") );
			},
			showFindPw: function(){
				m.slideLeft( $(".active-view"), $("#view_findPw") );
			},
			showJoin: function(){
				var bRet = confirm("회원가입은 (당분간) PC 화면에서만 가능 합니다.\r\nPC버전으로 이동 하시겠습니까?");
				
				if (bRet === true){
					location.href = "/popkon";
				}
			},
			showModify: function(){
				alert("준비중 입니다.");
			},
			showCoupon: function(){
				alert("준비중 입니다.");
			},
			
			showLoginMessage: function(msg){
				/*
				var jqLoginErrorMsg = this.jqLoginErrorMsg;
				
				this.jqLoginErrorMsg.text(msg);
				jqLoginErrorMsg.fadeIn(250);
				m.timer(4000, function(){
					jqLoginErrorMsg.fadeOut(500);
				});
				*/
				if (msg === "") return;
				
				alert(msg);
			},
			showFindIdMessage: function(msg){
				var jqFindIdErrorMsg = this.jqFindIdErrorMsg;
				
				this.jqFindIdErrorMsg.text(msg);
				jqFindIdErrorMsg.stop().fadeIn(250).delay(4000).fadeOut(500);
			},
			showFindPwMessage: function(msg){
				var jqFindPwErrorMsg = this.jqFindPwErrorMsg;
				
				this.jqFindPwErrorMsg.text(msg);
				jqFindPwErrorMsg.stop().fadeIn(250).delay(4000).fadeOut(500);
			},
			showFindIdPwMessage: function(msg, whatFind){
				/*
				if (whatFind === "pw"){
					this.showFindPwMessage(msg);
				}
				else{
					this.showFindIdMessage(msg);
				}
				*/
				if (msg === "") return;
				
				alert(msg);
			},
			
			showFindIdResult: function(){
				m.viewSlider.left("#view_findIdResult");
				//self.member.jqPanelFindIdResult.fadeIn(250);
			},
			hideFindIdResult: function(){
				m.viewSlider.prev();
				//self.member.jqPanelFindIdResult.fadeOut(500);
			},
			showFindPwResult: function(){
				m.viewSlider.left("#view_findPwResult");
				//self.member.jqPanelFindPwResult.fadeIn(250);
			},
			hideFindPwResult: function(){
				m.viewSlider.prev();
				//self.member.jqPanelFindPwResult.fadeOut(500);
			},
			clearUserLoginInput: function(){
				this.jqFormLogin.find("[name='mb_password']").val("");
				this.jqFormLogin.find("[name='adm_password']").val("");
			},
			                                                          
			checkAdmin: function(mb_id){
				var sDomain = m.getDomain();
				var mParam = {
					mb_id: mb_id
				};
				//self.member.showLoginMessage("https://" + sDomain + "/mobile/mb/ajax_adm_check.php");
				
				$.post(/*"https://" + sDomain + */"/mobile/mb/ajax_adm_check.php", mParam,
					function(dataAll){
						var data = $.parseJSON(dataAll);
						console.log(data);
						//self.member.showLoginMessage(data.status.id);
						//alert(data.status.id);
						if (data.status.id === "1"){
							self.member.isAdmin( true );
						}
						else{
							self.member.isAdmin( false );
						}
					}
				).fail(function(e){
					console.log(e);
					self.member.showLoginMessage(e);
				});
			},
			login: function(){
				self.member.jqFormLogin.submit();
			},
			logout: function(){
				if (confirm("로그아웃 하시겠습니까?") === true){
					$.post("/mobile/mb/logout.php", function(data){
						//console.log(data);
						self.member.onLogoutSuccess({mb_id: self.member.mb_id()});
						self.member.mb_id("");
						self.member.mb_level(0);
						m.mb_id = "";
						m.mb_level = 0;
						m.toast("성공적으로 로그아웃 하였습니다.");
						self.member.hasLogin( false );
					});
				}
			},
			onLoginSubmit: function(e){
				var mParam = m.serializeMap( self.member.jqFormLogin );
				var sDomain = m.getDomain();
				//console.log(mParam);
				
				if (mParam.mb_id === ""){
					self.member.showLoginMessage("아이디를 입력하여 주십시요.");
					return false;
				}
				if (mParam.mb_password === ""){
					self.member.showLoginMessage("비밀번호를 입력하여 주십시요.");
					return false;
				}
				if ((self.member.isAdmin() === true) && (mParam.adm_password === "")){
					self.member.showLoginMessage("관리자 비밀번호를 입력하여 주십시요.");
					return false;
				}
				
				$.post(/*"https://" + sDomain + */self.member.jqFormLogin.attr("action"),
					mParam,
					function(dataAll){
						var data = $.parseJSON( dataAll );
						var mStatus = data.status[0];
						var mMb = data.mb[0];
						console.log(data);
						
						if (mStatus.status === "0"){
							self.member.showLoginMessage( mStatus.msg );
						}
						else{
							m.mb_name = mMb.mb_name;
							m.mb_id = mMb.mb_id;
							self.member.mb_id( mMb.mb_id );
							self.member.mb_level( parseInt(mMb.mb_level) );
							self.member.showLoginMessage( "" );
							
							if(mParam.ssl_chk_box === "true"){
								m.cookie.set("ssl_chk_box", mParam.ssl_chk_box, 30*24, sDomain);
							}
							else{
								m.cookie.remove("ssl_chk_box");
							}
							
							self.member.clearUserLoginInput();
							m.toast("로그인 되었습니다.");
							self.member.hasLogin( true );
							self.member.onLoginSuccess(
								{
									mb_id: m.mb_id
								}
							);
							m.viewSlider.prev();
							//m.viewSlider.prevStack.pop();
						}
						
						if (mParam.save_id === "true"){
							m.cookie.set("save_id", mParam.mb_id, 30*24, sDomain);
						}
						else{
							m.cookie.remove("save_id");
						}
					}
				);
				
				return false;
			},
			onAdminCheck: function(e){
				self.member.checkAdmin( $(this).val() );
			},
			onFindId: function(e){
				var jqForm = $(this);
				var sDomain = m.getDomain();
				var mParam = m.serializeMap(jqForm);
				var regexEmail = null;
				var hasError = false;
				var sMsg = "";
				
				//console.log(mParam);
				
				if (mParam.mb_name === ""){
					sMsg = "이름을 정확히 입력하여 주십시요.";
					self.member.showFindIdPwMessage(sMsg, mParam.what_find);
					return false;
				}
				
				if (mParam.what_find === "pw"){
					if ((mParam.mb_id === "") || (mParam.mb_id.length < 4)){
						sMsg = "아이디를 정확히 입력하여 주십시요.";
						self.member.showFindIdPwMessage(sMsg, mParam.what_find);
						return false;
					}
				}
				
				if (mParam.find_type === "email"){
					regexEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
					if ((mParam.mb_email === "") || (regexEmail.test(mParam.mb_email) === false)){
						sMsg = "이메일을 정확히 입력하여 주십시요.";
						self.member.showFindIdPwMessage(sMsg, mParam.what_find);
						return false;
					}
				}
				else if (mParam.find_type === "phone"){
					if (mParam.mb_hp !== undefined){
						mParam.mb_hp = m.mergePhoneInfo( mParam.mb_hp );
					}
					if ((mParam.mb_hp === "") || (mParam.mb_hp.length < 12)){
						sMsg = "휴대폰 번호를 정확히 입력하여 주십시요.";
						self.member.showFindIdPwMessage(sMsg, mParam.what_find);
						return false;
					}
				}
				//console.log(mParam);
				console.log( jqForm.serialize() );
				$.post(/*"https://" + sDomain + */jqForm.attr("action"), mParam,
					function(dataAll){
						console.log(dataAll);
						var data = $.parseJSON(dataAll);
						console.log(data);
						
						if (mParam.what_find === "id"){
							self.member.msgFromfindId( data.status.msg );
							self.member.showFindIdResult();
						}
						else{
							self.member.msgFromFindPw( data.status.msg.replace( /\\n/g, "<br/>") );
							self.member.showFindPwResult();
						}
						//console.log(data.msg);
					}
				);
				
				return false;
			},
			
			evt_loginsuccess: null,
			loginsuccess: function(callback){
				this.evt_loginsuccess = callback;
			},
			onLoginSuccess: function(member){
				try{
					this.evt_loginsuccess(member);
				}
				catch(e){}
			},
			
			evt_logoutsuccess: null,
			logoutsuccess: function(callback){
				this.evt_logoutsuccess = callback;
			},
			onLogoutSuccess: function(member){
				try{
					this.evt_logoutsuccess(member);
				}
				catch(e){}
			}
		};
		self.member.init();
	}
	
	MemberModel.prototype = new m.BaseViewModel();
	MemberModel.prototype.constructor = MemberModel;

	m.MemberModel = MemberModel;
	
	/*
function App(){
		this.run = function(){
			var vmMember = new m.MemberModel();
			var vm = vmMember;
			
				vm.clickboard(function(param){
					//vm.nav.hideMyMenu();
					//vm.nav.hide();
					
					if (param.view_type === "board"){
						vm.board.searchByParam( param );
					}
					else if (param.view_type === "contents"){
						vm.contents.searchByParam( param );
					}
					else if (param.view_type === "member"){
						vm.member.moveViewByParam( param );
					}
				});
			
				m.vm = vm;
				$(".heading-contents").append( 
					$("<a href=\"#\" class=\"_gotoback\"></a>").click(function(){
					m.slidePrev();
				}));
				
				ko.applyBindings(vm);
				//console.log( vm ) ;
			//}
			//catch(e){}
		}
	}
	m.App = App;
	

	$(function(m, $, ko){
		var app = new m.App();
		app.run();
	}(window.m, $, ko));
	*/
});
