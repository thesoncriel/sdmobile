// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "jqueryfinger", "owlcarousel", "mobilebase"], function($, carousel, ko, koutil, json, bootstrap, owlcarousel, mobilebase) {

	function MemberModel() {
		var self = this;
		
		self.member = {
			mb_id: ko.observable( m.mb_id ),
			mb_name: ko.observable( m.mb_name ),
			clientip: ko.observable( m.clientip ),
			save_id: ko.observable(false),
			ssl_chk_box: ko.observable(false),
			isAdmin: ko.observable(false),
			hasLogin: ko.observable( (m.mb_id !== undefined) && (m.mb_id !== "") ),
			mb_level: ko.observable( m.mb_level ),
			
			msgFromfindId: ko.observable(""),
			msgFromFindPw: ko.observable(""),
			
			toOtherView: "",
			isJoinNow: false,
			
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
					if (param.bbsId){
						this.toOtherView = param.bbsId;
						this.showLogin();
					}
					else{
						this.showLogin();
					}
					
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
				m.viewSlider.left( "#view_login" );
			},
			showFindId: function(){
				m.slideLeft( $(".active-view"), $("#view_findId") );
			},
			showFindPw: function(){
				m.slideLeft( $(".active-view"), $("#view_findPw") );
			},
			showJoin: function(){
				self.memJoin.showJoin();
				/*
				if ((this.clientip() === "58.76.45.204")){
					self.memJoin.showJoin();
					
					return;
				}
				var bRet = confirm("회원가입은 (당분간) PC 화면에서만 가능 합니다.\r\nPC버전으로 이동 하시겠습니까?");
				
				if (bRet === true){
					location.href = "http://www.edusd.co.kr/member/mem_favorite.php?svs=book";
				}
				*/
			},
			showModify: function(){
				self.memUpdate.showUpdate();
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
						self.member.mb_name("");
						self.member.mb_level(1);
						m.mb_id = "";
						m.mb_level = 1;
						m.toast("성공적으로 로그아웃 하였습니다.");
						self.member.hasLogin( false );
					});
				}
			},
			onLoginSubmit: function(e){
				var mParam = m.serializeMap( self.member.jqFormLogin );
				var sDomain = m.getDomain();
				var sOtherView = self.member.toOtherView;
				//console.log(mParam);
				
				if (mParam.mb_id === ""){
					self.member.showLoginMessage("아이디를 입력하여 주십시오.");
					return false;
				}
				if (mParam.mb_password === ""){
					self.member.showLoginMessage("비밀번호를 입력하여 주십시오.");
					return false;
				}
				if ((self.member.isAdmin() === true) && (mParam.adm_password === "")){
					self.member.showLoginMessage("관리자 비밀번호를 입력하여 주십시오.");
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
							self.member.mb_name( mMb.mb_name );
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
							
							if (self.member.isJoinNow === true){
								sOtherView = "main";
								self.member.isJoinNow = false;
							}
							
							self.member.onLoginSuccess(
								{
									mb_id: m.mb_id
								},
								{
									toOtherView: sOtherView
								}
							);
							
							if ((sOtherView !== "")){
								console.log("otherview:" + sOtherView);
								self.member.toOtherView = "";
								//m.viewSlider.left("#view_main");
							}
							else{
								//m.viewSlider.prev();
								history.back();
							}
							
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
					sMsg = "이름을 정확히 입력하여 주십시오.";
					self.member.showFindIdPwMessage(sMsg, mParam.what_find);
					return false;
				}
				
				if (mParam.what_find === "pw"){
					if ((mParam.mb_id === "") || (mParam.mb_id.length < 4)){
						sMsg = "아이디를 정확히 입력하여 주십시오.";
						self.member.showFindIdPwMessage(sMsg, mParam.what_find);
						return false;
					}
				}
				
				if (mParam.find_type === "email"){
					regexEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
					if ((mParam.mb_email === "") || (regexEmail.test(mParam.mb_email) === false)){
						sMsg = "이메일을 정확히 입력하여 주십시오.";
						self.member.showFindIdPwMessage(sMsg, mParam.what_find);
						return false;
					}
				}
				else if (mParam.find_type === "phone"){
					if (mParam.mb_hp !== undefined){
						mParam.mb_hp = m.mergePhoneInfo( mParam.mb_hp );
					}
					if ((mParam.mb_hp === "") || (mParam.mb_hp.length < 12)){
						sMsg = "휴대폰 번호를 정확히 입력하여 주십시오.";
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
			onLoginSuccess: function(member, data){
				try{
					this.evt_loginsuccess(member, data);
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
		};// member object end :::::::::::::::::::::::::::::::::::::::::::::::
		
		self.memJoin = {
			mjYear : ko.observableArray(),
			mjMonth : ko.observableArray(),
			mjDay : ko.observableArray(),
			msg : ko.observable(""),
			sms_msg : ko.observable(""),
			modal_msg : ko.observable(""),
			submit_status : ko.observable(0),
			status : ko.observable(0),
			agreenum : ko.observable(0),
			mj_name : ko.observable(""),
			mj_hp0 : ko.observable(""),
			mj_hp1 : ko.observable(""),
			mj_hp2 : ko.observable(""),
			mjIdchk : ko.observable(0),
			mjIdchkstatus : ko.observable(0),
			buttonChk : ko.observable(0),
			chkparent : ko.observable(0),
			myAgreechk : ko.observable(0),
			parentAgreechk : ko.observable(0),
			mjMode : ko.observable(""),
			mjId : ko.observable(""),
			mjName : ko.observable(""),
			
			isModify : ko.observable(false),
									
			jqFormUpdate: $("#form_memberJoin"),
			init : function(){				
				$(".cate-title a").addClass("collapsed");				
				$("[name='chk_army']").click(function(e) {
					if($("[name='chk_army']").is(":checked")===true){
						$("#army_info_area").show();
					}else{
						$("#army_info_area").hide();
					}
                });
				$("[name='provision_all_agree']").click(function(e) {
                    if($("[name='provision_all_agree']").is(":checked")===true){
						$("[name='use_provision']").prop('checked',true);
						$("[name='info_provision']").prop('checked',true);
					}
                });
				$("[name='b1']").click(function(e) {
                 	var fav = $(":radio[name='b1']:checked").val();
					$("[name='memfav']").val(fav);	   					
                });	
				$("#mj_name").on('keyup',function(){
					 for (i=0; i<$("#mj_name").val().length; i++){
						var CodeNum = $("#mj_name").val().charCodeAt(i);
						if (CodeNum < 128) {
							alert("한글만 입력 가능합니다");							
							$("#mj_name").val("");
							$("#mj_name").focus();							
							return false;
						}
					}
				});
				
				$("#p_name").on('keyup',function(){
					 for (i=0; i<$("#p_name").val().length; i++){
						var CodeNum = $("#p_name").val().charCodeAt(i);
						if (CodeNum < 128) {
							alert("한글만 입력 가능합니다");							
							$("#p_name").val("");
							$("#p_name").focus();							
							return false;
						}
					}
				});
				
				$("#p_relation").on('keyup',function(){
					 for (i=0; i<$("#p_relation").val().length; i++){
						var CodeNum = $("#p_relation").val().charCodeAt(i);
						if (CodeNum < 128) {
							alert("한글만 입력 가능합니다");							
							$("#p_relation").val("");
							$("#p_relation").focus();							
							return false;
						}
					}
				});	
				
				$("#mj_id").on('keyup',function(){
					 for (i=0; i<$("#mj_id").val().length; i++){
						var CodeNum = $("#mj_id").val().charCodeAt(i);
						if (CodeNum >= 128) {
							alert("영문과 숫자만 입력 가능합니다");							
							$("#mj_id").val("");
							$("#mj_id").focus();							
							return false;
						}
					}
				});
				
				$("#mj_email").on('keyup',function(){
					 for (i=0; i<$("#mj_email").val().length; i++){
						var CodeNum = $("#mj_email").val().charCodeAt(i);
						if (CodeNum >= 128) {
							alert("영문과 숫자만 입력 가능합니다");							
							$("#mj_email").val("");
							$("#mj_email").focus();							
							return false;
						}
					}
				});
				/*
				$("#mj_id").keyup(function(event){
					if (!(event.keyCode >=37 && event.keyCode<=40)) {
						var inputVal = $(this).val();
						$(this).val(inputVal.replace(/[^a-z0-9]/gi,''));
					}
				});		
				*/
				this.jqFormUpdate.submit( this.onJoinSumit );	
				
				this.loadYear();
				this.loadMonth();
				this.loadDay();
				
				//this.includeKcaptcha();
			},
			
			checkModify : function(){
				var checkMd = self.memJoin.isModify();				
				if(checkMd === true){
					$.getJSON("/mobile/mb/member_info.php",{mb_id: self.member.mb_id}, function(data){																	
						self.memJoin.mj_name(data[0].mb_name);
						self.memJoin.mjId(data[0].mb_id);
						/*
						var mbBirth = data[0].mb_birth;
						if(mbBirth){
							birthArray = mbBirth.split("-");
							self.memJoin.mjYear(birthArray[0]);
							self.memJoin.mjMonth(birthArray[1]);
							self.memJoin.mjDay(birthArray[2]);							
						}
						*/
						$("#mj_id").attr("readonly" , true);						
						$("[name='mj_password']").attr("required" , false);
						$("[name='mj_password_chk']").attr("required" , false);
						$("#mj_name").attr("readonly" , true);
						$("[name='w']").val("u");
					});
					self.memJoin.mjMode("정보수정");
				}else{
					self.memJoin.mj_name("");
					self.memJoin.mjId("");
					$("#mj_id").attr( "readonly" , false );
					$("#mj_name").attr( "readonly" , false );
					$("[name='w']").val("");
					self.memJoin.mjMode("회원가입");
				}
			},
			
			makeYearArray: function(min, max){
				var aData = [];
				
				for(var i = max; i >= min; i--){
					aData.push(i);
				}
				
				return aData;
			},
						
			makeMonthDayArray: function(min, max){
				var aData = [];
				
				for(var i = min; i <= max; i++){
					if(i < 10){
						i = '0'+i;
					}
					aData.push(i);
				}
				
				return aData;
			},
			
			includeRecaptcha: function(){
				var jqKcaptcha = $("#recaptcha_join");
				
				if (jqKcaptcha.children().length === 0){
					require(["recaptcha"], function(Recaptcha){
						window.Recaptcha.create("6LdlfPgSAAAAAPtMMtOIblkvZBEPS7nnMROEhTWJ", "recaptcha_join", {
							theme: "white"
						});
					});
					/*
					$.get("/mobile/member/kcaptcha_include.php", function(html){
						console.log(html);
						jqKcaptcha.append(html);
					});
					*/
				}
			},
			
			loadYear: function(){
				var iMin = 1900;
				var iMax = new Date().getFullYear();
				
				this.mjYear( this.makeYearArray( iMin, iMax ) );
			},
			loadMonth: function(){
				var iMin = 1;
				var iMax = 12;
				
				this.mjMonth( this.makeMonthDayArray( iMin, iMax ) );
			},
			loadDay: function(){
				var iMin = 1;
				var iMax = 31;
				
				this.mjDay( this.makeMonthDayArray( iMin, iMax ) );
			},
						
			checkMemberId : function(){
				var mb_id = $("[name = 'mj_id']").val();		
				if(mb_id.length < 4 || mb_id.length > 12){
					alert("아이디는 6~12자의 영문, 소문자, 숫자 조합만이 가능합니다");										
					return false;
				}else{			
					$.getJSON("/mobile/mb/checkMemberId.php",{mb_id: mb_id}, function(data){					
						self.memJoin.msg(data.status.msg);										
						self.memJoin.mjIdchk(1);
						self.memJoin.mjIdchkstatus(data.status.status);
					});
				}
			},
			
			getAgreeNum : function(){																	
				var cnt = self.memJoin.buttonChk();
				var chkcnt = cnt+1;
				var chk_p = self.memJoin.chkparent();				
				if(chk_p == 1){
					self.memJoin.buttonChk(0);
					var name = $("[name = 'p_name']").val();				 
					var hp0 = $("#p_hp0").val();
					var hp1 = $("#p_hp1").val();
					var hp2 = $("#p_hp2").val();
					var mode = "parent";
					var user = "법정대리인";
					var memHp = $("#mj_hp0").val()+"-"+$("#mj_hp1").val()+"-"+$("#mj_hp2").val();
					var p_Hp = hp0+"-"+hp1+"-"+hp2;
					//console.log(memHp , p_Hp);
					if(memHp === p_Hp){
						alert("법정 대리인의 휴대폰 번호와 회원의 휴대폰 번호는 일치할수 없습니다.");
						return false;
					}
				}else{
					var name = $("[name = 'mj_name']").val();				 
					var hp0 = $("#mj_hp0").val();
					var hp1 = $("#mj_hp1").val();
					var hp2 = $("#mj_hp2").val();
					var mode = "alone";
					var user = "회원";
				}
				
				if(!name){
					alert(user + " 이름을 입력해주세요.");					
					return false;					
				}else if(!hp0 && !hp1 && !hp2){
					alert("휴대폰 번호를 입력해주세요.");					
					return false;
				}else if(!hp0 || !hp1 || !hp2){
					alert("휴대폰 번호를 올바르게 입력해주세요.");					
					return false;					
				}else{				
					if(chkcnt > 3){
						alert("인증번호를 3회 이상 받을수 없습니다. 다시 진행해주세요.");						
						return false;
					}else{						
						self.memJoin.buttonChk(chkcnt);							
						$.getJSON('/mobile/mb/getAgreeNumber.php',{ hp0: hp0, hp1: hp1, hp2: hp2, mode: mode, mb_name: name},function(data){				
							self.memJoin.sms_msg(data.status.msg);					
							self.memJoin.agreenum(data.status.status);	
							alert(self.memJoin.sms_msg());									 													
						});
						
					}
					name = "";	
					hp0 = "";	
					hp1 = "";	
					hp2 = "";	
					mode	 = "";	
					user = "";
					self.memJoin.modal_msg("");	
				}									
			},
			
			chkAgreeNum : function(){
				self.memJoin.modal_msg("");				
				var chk_p = self.memJoin.chkparent();
				var dbAgreeNum = self.memJoin.agreenum();
				if(chk_p == 1){
					var myAgreeNum = $("[name='p_agrere_num']").val();
				}else{
					var myAgreeNum = $("[name='mj_agrere_num']").val();
				}				
				if( dbAgreeNum == 0 ){
					alert("인증번호를 전송받지 못하였습니다.");					
					return false;
				}else if( !myAgreeNum ){
					alert("인증번호를 입력해주세요.");					
					return false;
				}else if( dbAgreeNum != myAgreeNum ){
					alert("인증번호가 정확하지 않습니다.");					
					return false;
				}else if( dbAgreeNum == myAgreeNum ){					
					alert("인증에 성공하였습니다.");
					self.memJoin.mj_name($("[name='mj_name']").val());
					self.memJoin.mj_hp0($("#mj_hp0").val());
					self.memJoin.mj_hp1($("#mj_hp1").val());
					self.memJoin.mj_hp2($("#mj_hp2").val());
					self.memJoin.agreenum(0);					
					if(chk_p == 1){
						self.memJoin.parentAgreechk(1); //법정대리인 : 다음 단계로 넘어갈수 있는 비교값
					}else{
						self.memJoin.myAgreechk(1);   //자기자신 : 다음 단계로 넘어갈수 있는 비교값
					}					
				}									
			},
			
			chkBirth : function(){
				var mj_y = $("[name = 'birth_y']").val();
				var mj_m = $("[name = 'birth_m']").val();
				var mj_d = $("[name = 'birth_d']").val();
				if(mj_y && mj_m && mj_d){					
					var birthday = new Date(mj_m+'/'+mj_d+'/'+mj_y);	
					var today = new Date();	
					var years = today.getFullYear() - birthday.getFullYear();	
					birthday.setFullYear(today.getFullYear());
					if (today < birthday){
						years--;
					}
					if(years<14){
						$("#parent_info").show();						
						self.memJoin.chkparent(1);
					}else{
						$("#parent_info").hide();	
						self.memJoin.chkparent(0);					
					}	
				}				
			},
			
			onClickToStep2 : function(){				
				if(self.memJoin.myAgreechk() === 1){
					if(!$("[name='use_provision']").is(":checked")){
						alert("이용약관을 읽고 체크해주세요.");						
						return false;
					}else if(!$("[name='info_provision']").is(":checked")){
						alert("개인정보 수집·이용동의를 해주세요");						
						return false;
					}else{						
						self.memJoin.showJoinStep2();
					}
				}else{
					alert("휴대폰 인증후 다음단계로 이동이 가능합니다.");					
					return false;
				}
				self.memJoin.modal_msg("");								
			},
			
			mjPrev : function(){
				m.viewSlider.prev();
			},
			
			showJoin: function(){
				this.isModify(false);
				self.member.isJoinNow = true;
				this.showJoinStep1();
				this.checkModify();
			},
			showModify: function(){
				this.isModify(true);
				this.showJoinStep1();
				this.checkModify();				
			},
			
			showJoinStep1: function(){
				this.includeRecaptcha();
				m.viewSlider.left("#view_memberJoinStep1");			
			},
			showJoinStep2: function(){
				m.viewSlider.left("#view_memberJoinStep2");
			},
			showJoinStep3: function(){
				m.viewSlider.left("#view_memberJoinStep3");
			},
			
			showMoalMessage : function(){
				$("#modal_memberJoinMessage").modal('show');
			},
			
			memJoinCompleted: function(){
				self.memJoin.jqFormUpdate.submit();
			},
			
			onJoinSumit : function(){
				var chkMemIdVa = self.memJoin.mjIdchkstatus();
				var chkMemIdChk = self.memJoin.mjIdchk();
				var member = self.memJoin;
				var parentChk = self.memJoin.parentAgreechk();
				var mParam = m.serializeMap( self.memJoin.jqFormUpdate );
				
				self.memJoin.modal_msg(""); //모달 메세지 초기화	
				var checkMd = self.memJoin.isModify();				
				if(checkMd === true){
														
					if(!mParam.mj_name){
						alert("회원 이름이 입력되지 않았습니다.");					
						return false;;
					}
					if(!mParam.mj_hp0 || !mParam.mj_hp1 || !mParam.mj_hp2){
						alert("휴대폰 번호가 올바르지 않습니다.");					
						return false;
					}
					if(!mParam.birth_y || !mParam.birth_m || !mParam.birth_d){
						alert("생년 월 일 이 올바르지 않습니다.");					
						return false;									
					}					
					
					if(mParam.mj_password){
						if(mParam.mj_password != mParam.mj_password_chk){
							alert("패스워가 일치하지 않습니다.");					
							return false;
						}
						if(mParam.mj_password.length < 6 || mParam.mj_password.length >12){
							alert("비밀번호는 6~12자의 영문, 숫자, 특수문자만 가능합니다");  					
							return false;
						}else if(mParam.mj_password_chk.length < 6 || mParam.mj_password_chk.length >12){
							alert("비밀번호는 6~12자의 영문, 숫자, 특수문자만 가능합니다");  					
							return false;
						}
						if(!mParam.mj_password_chk){
							alert("패스워드를 확인해주세요.");					
							return false;
						}
					}
					
					$.post(self.memJoin.jqFormUpdate.attr("action"), mParam, function( allData ){						
						try{
							var data = $.parseJSON(allData);							
							if(data){
								if(data.status.status === 2){
									member.showJoinStep3();	
								}else{
									alert(data.status.msg);
									self.memJoin.submit_status(data.status.status);
									return false;									
								}
							}
						}catch(e){
							console.log(e);
							console.log(allData);
							alert("error");
						}						
					});			
				
				}else{
					if(!mParam.mj_id){
						alert("회원 아이디가 입력되지 않았습니다.");					
						return false;
					}
					if(chkMemIdChk === 0){
						alert("아이디 중복 체크를 해주세요.");					
						return false;
					}
					if(chkMemIdVa === 9){
						alert("사용할수 없는 아이디 입니다.");					
						return false;
					}
					if(mParam.mj_id.length < 4 || mParam.mj_id.length > 12){
						alert("아이디는 6~12자의 영문, 소문자, 숫자 조합만이 가능합니다");										
						return false;
					}				
					if(!mParam.mj_name){
						alert("회원 이름이 입력되지 않았습니다.");					
						return false;;
					}
					if(!mParam.mj_hp0 || !mParam.mj_hp1 || !mParam.mj_hp2){
						alert("휴대폰 번호가 올바르지 않습니다.");					
						return false;
					}
					if(!mParam.birth_y || !mParam.birth_m || !mParam.birth_d){
						alert("생년 월 일 이 올바르지 않습니다.");					
						return false;									
					}
					if(!mParam.mj_password){
						alert("패스워드를 입력해주세요.");					
						return false;
					}
					if(mParam.mj_password.length < 6 || mParam.mj_password.length >12){
						alert("비밀번호는 6~12자의 영문, 숫자, 특수문자만 가능합니다");  					
						return false;
					}else if(mParam.mj_password_chk.length < 6 || mParam.mj_password_chk.length >12){
						alert("비밀번호는 6~12자의 영문, 숫자, 특수문자만 가능합니다");  					
						return false;
					}
					if(!mParam.mj_password_chk){
						alert("패스워드를 확인해주세요.");					
						return false;
					}
					if(mParam.mj_password != mParam.mj_password_chk){
						alert("패스워가 일치하지 않습니다.");					
						return false;
					}
					if(mParam.chk_army === "1"){
						if(!mParam.army_team){
							alert("소속되었던 사단을 입력해 주세요.");						
							return false;
						}
						if(!mParam.army_class){
							alert("전역 계급 입력해 주세요.");						
							return false;
						}
						if(!mParam.army_number){
							alert("군번을 입력해 주세요.");						
							return false;
						}
						if(!mParam.army_f_date || !mParam.army_l_date){
							alert("전직지원 교육기간을 입력해 주세요.");						
							return false;
						}					
					}
					if(self.memJoin.chkparent()===1){
						var mj_hp = mParam.mj_hp0 +"-"+mParam.mj_hp1+"-"+mParam.mj_hp2;
						var p_hp = mParam.p_hp0 +"-"+mParam.p_hp1+"-"+mParam.p_hp2;
						if(!mParam.p_name){
							alert("법정 대리인 이름을 입력해 주세요.");						
							return false;
						}
						if(mParam.p_name === mParam.mj_name){
							alert("법정 대리인 이름과 회원 이름은 일치할수 없습니다.");						
							return false;
						}
						if(!mParam.p_relation){
							alert("법정 대리인 과의 관계를 입력하세요.");						
							return false;
						}
						if(!mParam.p_hp0 || !mParam.p_hp1 || !mParam.p_hp2){
							alert("법정 대리인의 휴대폰 번호를 입력하세요.");						
							return false;
						}
						
						if(mj_hp === p_hp){
							alert("법정 대리인의 휴대폰 번호와 회원의 휴대폰 번호는 일치할수 없습니다.");
							return false;
						}
						if(parentChk !== 1){
							alert("법정 대리인 휴대폰 인증 성공에 실패했습니다.\n\r인증후 진행하실수 있습니다.");
							return false;
						}
					}
								
					if($("[name='b1']").is(":checked")===true){					
						$.post(self.memJoin.jqFormUpdate.attr("action"), mParam, function( allData ){						
							try{
								var data = $.parseJSON(allData);							
								if(data){
									if(data.status.status === 1){
										member.showJoinStep3();	
									}else{
										alert(data.status.msg);
										self.memJoin.submit_status(data.status.status);
										return false;									
									}
								}
							}catch(e){
								console.log(e);
								console.log(allData);
								alert("error");
							}						
						});
					}else{
						var result = confirm("관심분야 미 체크시 적립금이 지급되지 않습니다.\n\r그래도 이대로 가입하시겠습니까?");
						if(result){						
							$.post(self.memJoin.jqFormUpdate.attr("action"), mParam, function( allData ){
								try{
									var data = $.parseJSON(allData);								
									if(data){
										if(data.status.status === 1){
											member.showJoinStep3();	
										}else{
											alert(data.status.msg);
											self.memJoin.submit_status(data.status.status);
											return false;
										}									
									}
								}catch(e){
									console.log(e);
									console.log(allData);
									alert("error");
								}
							});						
						}else{
							return false;
						}
					}
				}
				return false;
			}			
			
		};// memberJoin 객체 종료 ::::::::::::::::::::::::::::::::::::::::::::::::
		
		self.memUpdate = {			
		
			hp0 : ko.observable(0),
			hp1 : ko.observable(0),
			hp2 : ko.observable(0),
			mb_id : ko.observable(""),
			mb_name : ko.observable(""),
			mb_email : ko.observable(""),
			mb_hp : ko.observable(""),			
			mb_sms : ko.observable(false),
			mb_mailling : ko.observable(false),
			mb_fav : ko.observable(""),
			mb_zip1 : ko.observable(0),
			mb_zip2 : ko.observable(0),
			mb_addr1 : ko.observable(""),
			mb_addr2 : ko.observable(""),
			sms_msg : ko.observable(""),
			modal_msg : ko.observable(""),
			agreenum : ko.observable(0),
			buttonChk : ko.observable(0),		
			myAgreechk : ko.observable(0),		
			jqFormCheck : $("#form_memberCheck"),
			jqFormUpdate: $("#form_memberUpdate"),
			init : function(){
				$(".cate-title a").addClass("collapsed");				
				
				$("[name='b1']").click(function(e) {
                 	var fav = $(":radio[name='b1']:checked").val();
					$("[name='memfav']").val(fav);	   					
                });	
				
				$("[name='mb_email']").on('keyup',function(){
					 for (i=0; i<$("[name='mb_email']").val().length; i++){
						var CodeNum = $("[name='mb_email']").val().charCodeAt(i);
						if (CodeNum >= 128) {
							alert("영문과 숫자만 입력 가능합니다");							
							$("[name='mb_email']").val("");
							$("[name='mb_email']").focus();							
							return false;
						}
					}
				});
								
				this.jqFormCheck.submit( this.onCheckSumit );					
				this.jqFormUpdate.submit( this.onUpdateSumit );					
				
			},
			loadMemberInfo : function(){								
				$.getJSON("/mobile/mb/member_info.php",{mb_id: m.mb_id}, function(data){																	
					console.log(data);
					
					if ((data === undefined) || (data === null)){
						return ;
					}
					
					self.memUpdate.mb_id(data[0].mb_id);
					self.memUpdate.mb_name(data[0].mb_name);							
					self.memUpdate.mb_email(data[0].mb_email);					
					self.memUpdate.mb_zip1(data[0].mb_zip1);					
					self.memUpdate.mb_zip2(data[0].mb_zip2);					
					self.memUpdate.mb_addr1(data[0].mb_addr1);					
					self.memUpdate.mb_addr2(data[0].mb_addr2);
					if(data[0].mb_sms==="1"){ //문자 수신여부						
						self.memUpdate.mb_sms(true);
					}
					if(data[0].mb_mailling==="1"){ //메일 수신여부
						self.memUpdate.mb_mailling(true);
					}					
					if(data[0].mb_hp){ //휴대폰 번호
						var hp = data[0].mb_hp.split("-");
						self.memUpdate.hp0(hp[0]);					
						self.memUpdate.hp1(hp[1]);					
						self.memUpdate.hp2(hp[2]);					
					}
					if(data[0].fav!==null){ //관심분야 체크
						$("[name='b1']").each(function(i) {
                            if($("[name='b1']").eq(i).val() === data[0].fav){
								$("[name='b1']").eq(i).prop("checked",true);
								$("[name='memfav']").val(data[0].fav);
							}
                        });
					}						
				});				
			},
			
			changePhoneNum : function(){
				var result = confirm("휴대폰 번호를 변경하시려면 인증 절차를 거쳐야 합니다.");
				if(result){
					$("#pAgreeButton").show();
					$("#pAgreeArea").show();
					$("#pChangeButton").hide();
					$("[name='mb_hp0']").prop("readonly",false);
					$("[name='mb_hp1']").prop("readonly",false);
					$("[name='mb_hp2']").prop("readonly",false);
					self.memUpdate.myAgreechk(9); //변경하길 원하면서 미인증인 상태;
					
				}
			},
						
			getAgreeNum : function(){																	
				var cnt = self.memUpdate.buttonChk();
				var chkcnt = cnt+1;			
				var name = $("#update_mb_name").val();				 
				var hp0 = $("[name = 'mb_hp0']").val();
				var hp1 = $("[name = 'mb_hp1']").val();
				var hp2 = $("[name = 'mb_hp2']").val();
				var mode = "alone";
				var user = "회원";								
				if(!hp0 && !hp1 && !hp2){
					alert("휴대폰 번호를 입력해주세요.");					
					return false;
				}else if(!hp0 || !hp1 || !hp2){
					alert("휴대폰 번호를 올바르게 입력해주세요.");					
					return false;					
				}else{				
					if(chkcnt > 3){
						alert("인증번호를 3회 이상 받을수 없습니다. 다시 진행해주세요.");						
						return false;
					}else{						
						self.memUpdate.buttonChk(chkcnt);													
						$.getJSON('/mobile/mb/getAgreeNumber.php',{ hp0: hp0, hp1: hp1, hp2: hp2, mode: mode, mb_name: name},function(data){				
							self.memUpdate.sms_msg(data.status.msg);					
							self.memUpdate.agreenum(data.status.status);	
							alert(self.memUpdate.sms_msg());									 													
						});
						
					}
					name = "";	
					hp0 = "";	
					hp1 = "";	
					hp2 = "";	
					mode	 = "";	
					user = "";
					self.memUpdate.modal_msg("");	
				}									
			},
			
			chkAgreeNum : function(){
				self.memUpdate.modal_msg("");								
				var dbAgreeNum = self.memUpdate.agreenum();
				var myAgreeNum = $("[name='mb_agrere_num']").val();
				
				if( dbAgreeNum == 0 ){
					self.memUpdate.modal_msg("인증번호를 전송받지 못하였습니다.");
					self.memUpdate.showModalMessage();
					return false;
				}else if( !myAgreeNum ){
					self.memUpdate.modal_msg("인증번호를 입력해주세요.");
					self.memUpdate.showModalMessage();
					return false;
				}else if( dbAgreeNum != myAgreeNum ){
					self.memUpdate.modal_msg("인증번호가 정확하지 않습니다.");
					self.memUpdate.showModalMessage();
					return false;
				}else if( dbAgreeNum == myAgreeNum ){						
					self.memUpdate.modal_msg("인증에 성공하였습니다.");										
					self.memUpdate.agreenum(0);
					self.memUpdate.showModalMessage();
					$("#pAgreeButton").hide();
					$("#pAgreeArea").hide();					
					$("[name='mb_hp0']").prop("readonly",true);
					$("[name='mb_hp1']").prop("readonly",true);
					$("[name='mb_hp2']").prop("readonly",true);					
					self.memUpdate.myAgreechk(1);   //자기자신 : 다음 단계로 넘어갈수 있는 비교값			
					self.memUpdate.showModalMessage();
					$("[name='check_phone']").val("ok");
				}									
			},
			
			showUpdate: function(){
				if (this.onLoginCheck() === true){
					this.clearInput();
					this.loadMemberInfo();
					m.viewSlider.left("#view_memberUpdateStep1");
				}
				else{
					self.member.showLogin();
				}
			},
			
			showUpdateStep2: function(){
				m.viewSlider.left("#view_memberUpdateStep2");
				self.memUpdate.includeRecaptcha();
			},
			
			showUpdateStep3: function(){
				m.viewSlider.left("#view_memberUpdateStep3");				
			},
			
			mbUpdatePrev : function(){
				m.viewSlider.prev();
			},
			
			showModalMessage : function(){
				$("#modal_memberUpdateMessage").modal('show');
			},
			
			memUpdateCompleted: function(){
				self.memUpdate.jqFormUpdate.submit();
			},
			
			memCheckCompleted: function(){
				self.memUpdate.jqFormCheck.submit();
			},
			
			clearInput: function(){
				this.jqFormCheck.find("input[name='mb_password']").val("");
				this.jqFormUpdate.find("input[name='recaptcha_response_field']").val("");
				this.jqFormUpdate.find("input[name='mb_password']").val("");
				this.jqFormUpdate.find("input[name='mb_password_chk']").val("");
			},	
			
			onCheckSumit : function(){
				var mParam = m.serializeMap( self.memUpdate.jqFormCheck );							
				$.post(self.memUpdate.jqFormCheck.attr("action"), mParam, function( allData ){						
					try{
						var data = $.parseJSON(allData);													
						if(data.status.status===1){
							self.memUpdate.showUpdateStep2();
						}else{
							if(data.status.status===2){
								self.memUpdate.modal_msg("회원 정보에 문제가 있습니다.");
							}else if(data.status.status===9){
								self.memUpdate.modal_msg("아이디와 비밀번호가 일치하지 않습니다.");								
							}
							self.memUpdate.showModalMessage();
						}
					}catch(e){
						console.log(e);
						console.log(allData);
						alert("error");
					}						
				});
				
				
				return false;
			},			
			
			onUpdateSumit : function(){
				var mParam = m.serializeMap( self.memUpdate.jqFormUpdate );										
				var myAgreeCheck = self.memUpdate.myAgreechk();
				if(mParam.mb_password){
					if(mParam.mb_password != mParam.mb_password_chk){
						alert("패스워가 일치하지 않습니다.");					
						return false;
					}
					if(mParam.mb_password.length < 6 || mParam.mb_password.length >12){
						alert("비밀번호는 6~12자의 영문, 숫자, 특수문자만 가능합니다");  					
						return false;
					}else if(mParam.mb_password_chk.length < 6 || mParam.mb_password_chk.length >12){
						alert("비밀번호는 6~12자의 영문, 숫자, 특수문자만 가능합니다");  					
						return false;
					}
					if(!mParam.mb_password_chk){
						alert("패스워드를 확인해주세요.");					
						return false;
					}
				}
				if(myAgreeCheck===9){					
					alert("휴대폰 번호 변경을 원하였으나 미인증 되었습니다.\n\r기존 휴대폰 번호로 유지됩니다.");					
				}
				var result = confirm("현재 작성하신 내용으로 수정 하시겠습니까?");
				if(result){					
					$.post(self.memUpdate.jqFormUpdate.attr("action"), mParam, function( allData ){												
						try{
							var data = $.parseJSON(allData);							
							if(data){
								if(data.status.status === 2){
									self.memUpdate.showUpdateStep3();	
								}else{
									alert(data.status.msg);									
									return false;	
								}
							}
						}catch(e){
							console.log(e);
							console.log(allData);
							alert("error");
						}						
					});
										
					return false;
					
				}else{
					
					return false;
					
				}
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
			},
				
			includeRecaptcha: function(){
				var jqKcaptcha = $("#recaptcha_update");
				
				if (jqKcaptcha.children().length === 0){
					require(["recaptcha"], function(Recaptcha){
						window.Recaptcha.create("6LdlfPgSAAAAAPtMMtOIblkvZBEPS7nnMROEhTWJ", "recaptcha_update", {
							theme: "white"
						});
					});					
				}
			},
			
			isVisible: function(){
				return $("#view_memberUpdateStep2").hasClass("active-view");
			}
		}; // memUpdate 객체 종료 ::::::::::::::::::::::::::::::::::::::::::::::::::::
		
		self.member.init();
		self.memJoin.init();
		self.memUpdate.init();
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
