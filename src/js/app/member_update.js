// Define the namespace
window.m = window.m || {};

define(["jquery", "knockout", "knockoututils", "json2.min", "bootstrap", "jqueryfinger",  "mobilebase"], function($, ko, koutil, json, bootstrap, finger, mobilebase ) {


	function MemberUpdate() {
		
		var self = this;		
		
		
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
			jqFormCheck : $("#member_check_form"),
			jqFormUpdate: $("#member_update_form"),
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
				this.getMemberInfo();
				
			},
			getMemberInfo : function(){								
				$.getJSON("/mobile/mb/member_info.php",{mb_id: m.mb_id}, function(data){																	
					console.log(data);
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
				var name = $("[name = 'mb_name']").val();				 
				var hp0 = $("[name = 'mb_hp0']").val();
				var hp1 = $("[name = 'mb_hp1']").val();
				var hp2 = $("[name = 'mb_hp2']").val();
				var mode = "alone";
				var user = "회원";					
				if(!hp0 && !hp1 && !hp2){
					self.memUpdate.modal_msg("휴대폰 번호를 입력해주세요.");
					self.memUpdate.showModalMessage();
					return false;
				}else if(!hp0 || !hp1 || !hp2){
					self.memUpdate.modal_msg("휴대폰 번호를 올바르게 입력해주세요.");
					self.memUpdate.showModalMessage();
					return false;					
				}else{				
					if(chkcnt > 3){
						self.memUpdate.modal_msg("인증번호를 3회 이상 받을수 없습니다. 다시 진행해주세요.");
						self.memUpdate.showModalMessage();
						return false;
					}else{						
						self.memUpdate.buttonChk(chkcnt);							
						$.getJSON('/mobile/mb/getAgreeNumber.php',{ hp0: hp0, hp1: hp1, hp2: hp2, mode: mode, mb_name: name},function(data){				
							self.memUpdate.sms_msg(data.status.msg);					
							self.memUpdate.agreenum(data.status.status);	
							self.memUpdate.modal_msg(self.memUpdate.sms_msg());									 						
							self.memUpdate.showModalMessage();
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
				$("#systemMessage").modal('show');
			},
			
			memUpdateCompleted: function(){
				self.memUpdate.jqFormUpdate.submit();
			},
			
			memCheckCompleted: function(){
				self.memUpdate.jqFormCheck.submit();
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
								console.log(data);
								self.memUpdate.showUpdateStep3();	
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
			
			
			
		};
		
		self.memUpdate.init();
		
		
	}
	
	MemberUpdate.prototype = new m.BaseViewModel();
	MemberUpdate.prototype.constructor = MemberUpdate;

	m.MemberUpdate = MemberUpdate;	
});
