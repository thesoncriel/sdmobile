// Define the namespace
window.m = window.m || {};

define(["jquery", "knockout", "knockoututils", "json2.min", "bootstrap", "jqueryfinger",  "mobilebase"/*, "kcaptcha"*/ ], function($, ko, koutil, json, bootstrap, finger, mobilebase/*, kcaptcha*/) {


	function MemberJoin() {
		
		var self = this;		
		
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
			jqFormUpdate: $("#member_join_form"),
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
							self.memJoin.modal_msg("한글만 입력 가능합니다");
							self.memJoin.showMoalMessage();							
							$("#mj_name").val("");
							$("#mj_name").focus();							
							return false;
						}
					}
				});	
				$("#mj_id").keyup(function(event){
					if (!(event.keyCode >=37 && event.keyCode<=40)) {
						var inputVal = $(this).val();
						$(this).val(inputVal.replace(/[^a-z0-9]/gi,''));
					}
				});		
				this.jqFormUpdate.submit( this.onJoinSumit );	
				
				this.loadYear();
				this.loadMonth();
				this.loadDay();
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
				$.getJSON("/mobile/mb/checkMemberId.php",{mb_id: mb_id}, function(data){					
					self.memJoin.msg(data.status.msg);										
					self.memJoin.mjIdchk(1);
					self.memJoin.mjIdchkstatus(data.status.status);
				});
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
				}else{
					var name = $("[name = 'mj_name']").val();				 
					var hp0 = $("#mj_hp0").val();
					var hp1 = $("#mj_hp1").val();
					var hp2 = $("#mj_hp2").val();
					var mode = "alone";
					var user = "회원";
				}
				
				if(!name){
					self.memJoin.modal_msg(user + " 이름을 입력해주세요.");
					self.memJoin.showMoalMessage();
					return false;					
				}else if(!hp0 && !hp1 && !hp2){
					self.memJoin.modal_msg("휴대폰 번호를 입력해주세요.");
					self.memJoin.showMoalMessage();
					return false;
				}else if(!hp0 || !hp1 || !hp2){
					self.memJoin.modal_msg("휴대폰 번호를 올바르게 입력해주세요.");
					self.memJoin.showMoalMessage();
					return false;					
				}else{				
					if(chkcnt > 3){
						self.memJoin.modal_msg("인증번호를 3회 이상 받을수 없습니다. 다시 진행해주세요.");
						self.memJoin.showMoalMessage();
						return false;
					}else{						
						self.memJoin.buttonChk(chkcnt);							
						$.getJSON('/mobile/mb/getAgreeNumber.php',{ hp0: hp0, hp1: hp1, hp2: hp2, mode: mode, mb_name: name},function(data){				
							self.memJoin.sms_msg(data.status.msg);					
							self.memJoin.agreenum(data.status.status);	
							self.memJoin.modal_msg(self.memJoin.sms_msg());									 						
							self.memJoin.showMoalMessage();
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
					self.memJoin.modal_msg("인증번호를 전송받지 못하였습니다.");
					self.memJoin.showMoalMessage();
					return false;
				}else if( !myAgreeNum ){
					self.memJoin.modal_msg("인증번호를 입력해주세요.");
					self.memJoin.showMoalMessage();
					return false;
				}else if( dbAgreeNum != myAgreeNum ){
					self.memJoin.modal_msg("인증번호가 정확하지 않습니다.");
					self.memJoin.showMoalMessage();
					return false;
				}else if( dbAgreeNum == myAgreeNum ){					
					self.memJoin.modal_msg("인증에 성공하였습니다.");
					self.memJoin.mj_name($("[name='mj_name']").val());
					self.memJoin.mj_hp0($("#mj_hp0").val());
					self.memJoin.mj_hp1($("#mj_hp1").val());
					self.memJoin.mj_hp2($("#mj_hp2").val());
					self.memJoin.agreenum(0);
					self.memJoin.showMoalMessage();
					if(chk_p == 1){
						self.memJoin.parentAgreechk(1); //법정대리인 : 다음 단계로 넘어갈수 있는 비교값
					}else{
						self.memJoin.myAgreechk(1);   //자기자신 : 다음 단계로 넘어갈수 있는 비교값
					}
					self.memJoin.showMoalMessage();
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
			
			mjNextStep2 : function(){				
				if(self.memJoin.myAgreechk() === 1){
					if(!$("[name='use_provision']").is(":checked")){
						self.memJoin.modal_msg("이용약관을 읽고 체크해주세요.");
						self.memJoin.showMoalMessage();
						return false;
					}else if(!$("[name='info_provision']").is(":checked")){
						self.memJoin.modal_msg("개인정보 수집·이용동의를 해주세요");
						self.memJoin.showMoalMessage();
						return false;
					}else{						
						m.viewSlider.left("#view_member_join_step2");
					}
				}else{
					self.memJoin.modal_msg("휴대폰 인증후 다음단계로 이동이 가능합니다.");
					self.memJoin.showMoalMessage();
					return false;
				}
				self.memJoin.modal_msg("");								
			},
			
			mjPrev : function(){
				m.viewSlider.prev();
			},
			
			showMoalMessage : function(){
				$("#systemMessage").modal('show');
			},
			
			memJoinCompleted: function(){
				self.memJoin.jqFormUpdate.submit();
			},
			
			onJoinSumit : function(){
				var chkMemIdVa = self.memJoin.mjIdchkstatus();
				var chkMemIdChk = self.memJoin.mjIdchk();
				self.memJoin.modal_msg(""); //모달 메세지 초기화
				var mParam = m.serializeMap( self.memJoin.jqFormUpdate );				
				if(!mParam.mj_id){
					self.memJoin.modal_msg("회원 아이디가 입력되지 않았습니다.");					
				}
				if(chkMemIdChk === 0){
					self.memJoin.modal_msg("아이디 중복 체크를 해주세요.");					
				}
				if(chkMemIdVa === 9){
					self.memJoin.modal_msg("사용할수 없는 아이디 입니다.");					
				}
				if(mParam.mj_id.length < 4 || mParam.mj_id.length > 12){
					self.memJoin.modal_msg("아이디는 6~12자의 영문, 소문자, 숫자 조합만이 가능합니다");										
				}				
				if(!mParam.mj_name){
					self.memJoin.modal_msg("회원 이름이 입력되지 않았습니다.");					
				}
				if(!mParam.mj_hp0 || !mParam.mj_hp1 || !mParam.mj_hp2){
					self.memJoin.modal_msg("휴대폰 번호가 올바르지 않습니다.");					
				}
				if(!mParam.birth_y || !mParam.birth_m || !mParam.birth_d){
					self.memJoin.modal_msg("생년 월 일 이 올바르지 않습니다.");					
				}
				if(!mParam.mj_password){
					self.memJoin.modal_msg("패스워드를 입력해주세요.");					
				}
				if(mParam.mj_password.length < 6 || mParam.mj_password.length >12){
					self.memJoin.modal_msg("비밀번호는 6~12자의 영문, 숫자, 특수문자만 가능합니다");  					
				}else if(mParam.mj_password_chk.length < 6 || mParam.mj_password_chk.length >12){
					self.memJoin.modal_msg("비밀번호는 6~12자의 영문, 숫자, 특수문자만 가능합니다");  					
				}
				if(!mParam.mj_password_chk){
					self.memJoin.modal_msg("패스워드를 확인해주세요.");					
				}
				if(mParam.mj_password != mParam.mj_password_chk){
					self.memJoin.modal_msg("패스워가 일치하지 않습니다.");					
				}
				if(mParam.chk_army === "1"){
					if(!mParam.army_team){
						self.memJoin.modal_msg("소속되었던 사단을 입력해 주세요.");						
					}
					if(!mParam.army_class){
						self.memJoin.modal_msg("전역 계급 입력해 주세요.");						
					}
					if(!mParam.army_number){
						self.memJoin.modal_msg("군번을 입력해 주세요.");						
					}
					if(!mParam.army_f_date || !mParam.army_l_date){
						self.memJoin.modal_msg("전직지원 교육기간을 입력해 주세요.");						
					}					
				}
				if(self.memJoin.chkparent()===1){
					var mj_hp = mParam.mj_hp0 +"-"+mParam.mj_hp1+"-"+mParam.mj_hp2;
					var p_hp = mParam.p_hp0 +"-"+mParam.p_hp1+"-"+mParam.p_hp2;
					if(!mParam.p_name){
						self.memJoin.modal_msg("법정 대리인 이름을 입력해 주세요.");						
					}
					if(mParam.p_name === mParam.mj_name){
						self.memJoin.modal_msg("법정 대리인 이름과 회원 이름은 일치할수 없습니다.");						
					}
					if(!mParam.p_relation){
						self.memJoin.modal_msg("법정 대리인 과의 관계를 입력하세요.");						
					}
					if(!mParam.p_hp0 || !mParam.p_hp1 || !mParam.p_hp2){
						self.memJoin.modal_msg("법정 대리인의 휴대폰 번호를 입력하세요.");						
					}
					
					if(mj_hp === p_hp){
						alert("법정 대리인의 휴대폰 번호와 회원의 휴대폰 번호는 일치할수 없습니다.");
						return false;
					}
					
				}
				
				if(self.memJoin.modal_msg()){
					self.memJoin.showMoalMessage();
					return false;
				}
				
				if($("[name='b1']").is(":checked")===true){					
					$.post(self.memJoin.jqFormUpdate.attr("action"), mParam, function( allData ){						
						try{
							var data = $.parseJSON(allData);							
							if(data){
								if(data.status.status === 1){
									m.viewSlider.left("#view_member_join_step3");	
								}else{
									self.memJoin.modal_msg(data.status.msg);
									self.memJoin.submit_status(data.status.status);
									self.memJoin.showMoalMessage();
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
										m.viewSlider.left("#view_member_join_step3");	
									}else{
										self.memJoin.modal_msg(data.status.msg);
										self.memJoin.submit_status(data.status.status);
										self.memJoin.showMoalMessage();
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
				
				return false;
			}			
			
		};
				
		//self.memJoin.loadYear();
		//self.memJoin.loadMonth();
		//self.memJoin.loadDay();                                   
		//self.memJoin.checkMemberId();
		self.memJoin.init();
	}
	
	MemberJoin.prototype = new m.BaseViewModel();
	MemberJoin.prototype.constructor = MemberJoin;

	m.MemberJoin = MemberJoin;	
	
	function App(){
		this.run = function(){
			var vm = new m.MemberJoin();
			try{
				//$.extend(vm, new m.NavModel());
				m.vm = vm;
				ko.applyBindings(vm);
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
	
});
