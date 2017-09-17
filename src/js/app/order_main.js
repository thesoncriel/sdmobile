// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "mobilebase" ], function($, carousel, ko, koutil, json, bootstrap, mobilebase) {

	function OrderModel(pmid, pkword) {
		var self = this;
		/*self.mnamehello = (window.m.mb_name) ?  ko.observable(window.m.mb_name+"님! 안녕하세요."):ko.observable();
		self.mname = ko.observable(window.m.mb_name).extend({logChange: "회원성명~"});
		self.skword = ko.observable(pkword).extend({logChange: "검색어~"});		
		self.mid = ko.observable(pmid).extend({logChange: "아이디~"});
		self.mpw = ko.observable().extend({logChange: "비밀번호~"});
		self.mrememberid = ko.observable().extend({logChange: "아이디 저장~"});
		self.madmpw = ko.observable().extend({logChange: "관리자 비번~"});
		
		self.searcheditems = ko.observableArray();
		self.mainbanner = ko.observableArray();
		*/
		self.order = {
			jqFormCartList: $("#form_cartList"),
			jqFormOrderInfo: $("#form_orderInfo"),
			od_id : ko.observable(),
			odata : ko.observableArray(),
			//odatas : ko.observableArray(),
			myorder : new m.Odata(), 
			
			member : new m.setMember(),
			coupons : ko.observableArray(),
			coupon : new m.setCoupon(),
			
			isBuy: ko.observable(false),
						
			init: function(){
				// 장바구니에서 전체선택 시 아래의 모든 아이템 선택/해제 하는 기능
				$("#checkbox_selectAllCartItem").change(function(){
					var isChecked = this.checked;
					var jqCartItems = $("#list_cart .item_cart");
					$.map(self.order.odata(), function(item, index){
						//jqCartList
						// TODO: 애니메이션 넣기
						item.it_checked( isChecked );
					});
				});
				
				this.jqFormCartList.submit(function(){
					var jqOrderInfo = $("#view_orderInfo");
					var jqCartList = jqOrderInfo.prev();
					
					if (self.order.hasCheckedItem() === true){
						self.order.isBuy( true );
						self.order.showInfo();
						//$(document).scrollTop( jqCartList.outerHeight() + 20 );
						$(document).scrollTop( 0 );
					}
					else{
						alert("선택된 상품이 없습니다.");
					}
					
					
					return false;
				});
				this.jqFormOrderInfo.parent().hide();
				
				// 슬라이드 이벤트 바인딩
				/*
				$("#container_orderView").on("flick", function(e){
					//console.log(e);
					if (e.direction === 1){
						m.slidePrev();
					}
				});
				*/
				
				$("#list_cart").tooltip({
					trigger: "manual"
				})
				.on("shown.bs.tooltip", function(){
					m.timer(2000, function(){
						$("#list_cart").tooltip("hide");
					});
				});
				
				$("#button_orderInfo_cancel").click(function(){
					//self.order.hideInfo();
					//self.order.isBuy(false);
					m.viewSlider.prev();
				});
				
				// 서버 전송 전 Validation Check 부분 추가 - 2014.06.27 by jhson [시작]
				this.jqFormOrderInfo.submit(function(){
					var jqForm = $(this);
					var jqEmail = jqForm.find("input[type='email']");
					var jqRequiredInput = jqForm.find("*[required]");
					var jqRequiredGroup = jqForm.find("*[data-required]");
					var isOK = true;
					var isGroupCheck = false;
					var regexEmail = /^([0-9a-zA-Z_-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
					var sMsg = "";
					var jqValidTarget = null;
					
					//radio 그룹에 대한 유효성 확인
					jqRequiredGroup.each(function(index){
						if (isOK === false) return;
						
						var jqInputs = $(this).find("input[type='radio']");
						var isAnyChecked = false;
						var sLabel = "";
						
						jqInputs.each(function(index){
							isAnyChecked = isAnyChecked || this.checked;
						});
						
						if (isAnyChecked === false){
							isOK = false;
							isGroupCheck = true;
							sLabel = $(this).prev().text();
							sMsg = sLabel + " 항목을 체크하여 주십시오.";
							jqValidTarget = $(this);
						}
					});
					
					// 필수 요소에 대한 유효성 확인
					jqRequiredInput.each(function(index){
						if (isOK === false) return;
						
						var jqInput = $(this);
						var sLabel = "";
						
						if (jqInput.val() === ""){
							isOK = false;
							sLabel = jqInput.parentsUntil(".form-group").parent().find("label").text();
							if ((sLabel === undefined) || (sLabel === "")){
								sLabel = jqInput.attr("placeholder");
								
								if ((sLabel === undefined) || (sLabel === "")){
									sLabel = jqInput.parentsUntil("[data-placeholder]").parent().data("placeholder");
								}
							}
							sMsg = sLabel + " 항목을 정확히 기재해 주십시오.";
							jqValidTarget = jqInput;
						}
					});
					
					// 이메일 부분에 대한 유효성 확인
					jqEmail.each(function(index){
						if (isOK === false) return;
						
						var jqEmail = $(this);
						
						if (regexEmail.test( jqEmail.val() ) === false){
							isOK = false;
							sMsg = "이메일을 정확히 기재해 주십시오.";
							jqValidTarget = jqEmail;
							return;
						}
					});
					
					if (isOK === true){
						var jqSettleUseChecked = $("input[name='od_settle_use']:checked");
						if (jqSettleUseChecked.length !== 1){
							isOK = false;
							sMsg = "결제방법을 선택하여 주십시오.";
							jqValidTarget = $("input[name='od_settle_use']").eq(0);
						}
					}
					
					// 유효성 검증 후 최종 사용자 알림 부분
					if (isOK === false){
						alert(sMsg);
						if (isGroupCheck === false){
							jqValidTarget.focus();
							//location.assign( "#panel_orderPriceInfo" );
						}
						else{
							
						}
					}
					
					if (m.mb_id === "sd_yotimer"){
						alert("isOK: " + isOK);
					}
					
					return isOK;
				});// #form_orderInfo validation check end :::::::::::::::::::::
				// 서버 전송 전 Validation Check 부분 추가 - 2014.06.27 by jhson [종료]
				
				this.totalDiscount = ko.computed(function(){
					try{
						//var iCoupon 	= ($.isNumeric( self.coupon.cp_price() )) ?  parseInt( self.coupon.cp_price() ) : 0;
						var iCoupon 	= $.tryParseInt( self.order.myorder.od_coupon() );
						var iCash 		= $.tryParseInt( self.order.myorder.od_cash() );
						var iAhn 		= 0; // 임시로 적용
						var iTotalEnuri = $.tryParseInt( self.order.myorder.od_enuri() );
						//var iTotalPrice	= $.tryParseInt( self.myorder.od_total_price() );
						//var sCouponType = self.coupon.cp_type();
						
						// 쿠폰이 할인율 적용 된다면 전체 가격에 대비하여 차감 시킨다.
						// if (sCouponType === "1"){
							// iCoupon = Math.floor( iTotalPrice * (iCoupon / 100) );
						// }
						
						return iCoupon + iCash + iAhn + iTotalEnuri;
					}
					catch(e){
						return 0;
					}
				});
				this.totalPrice = ko.computed(function(){
					try{
						var aOdata = self.order.odata();
						var iLen = aOdata.length;
						var iSum = 0;
						
						for(var i = 0; i < iLen; i++){
							if (aOdata[ i ].it_name() === "배송비"){
								continue;
							}
							console.log( aOdata[ i ].it_checked() );
							if (aOdata[ i ].it_checked() === true){
								iSum += $.tryParseInt( aOdata[ i ].it_settle_price() );
							}
						}
						
						return iSum;
					}
					catch(e){
						return 0;
					}
				});
				this.delivery = ko.computed(function(){
					try{
						/*
						if (self.order.totalPrice() > 10000){
							return 0;
						}
						else{
							return 2500;
						}
						*/
						return self.order.odata()[0].od_delivery();
					}
					catch(e){
						return 0;
					}
				});
				this.excludingShippingPrice = ko.computed(function(){
					try{
						return self.order.totalPrice() + self.order.delivery();
					}
					catch(e){
						return 0;
					}
				});
				this.itemCount = ko.computed(function(){
					try{
						var iCount = 0;
						var aOdata = self.order.odata();
						var iLen = aOdata.length;
						
						for (var i = 0; i < iLen; i++){
							if ( aOdata[ i ].it_checked() === true){
								iCount++;
							}
						}
						
						return iCount;
					}
					catch(e){
						return 0;
					}
				});
				this.totalSettlePrice = ko.computed(function(){
					try{
						var iTotalPrice		= self.order.totalPrice();
						var iTotalDiscount	= self.order.totalDiscount();
						var iDelivery		= self.order.delivery();
						
						return iTotalPrice - iTotalDiscount + iDelivery;
					}
					catch(e){
						return 0;
					}
				});
				this.orderName = ko.computed(function(){
					try{
						return self.order.odata()[0].od_name();
					}
					catch(e){
						return "상품없음";
					}
				});
				this.totalItemName = ko.computed(function(){
					try{
						var aObsOdata = self.order.odata();
						var sFirstItemName = aObsOdata[0].it_name();
						var iLen = aObsOdata.length;
						
						if (iLen > 1){
							return sFirstItemName + " (외 " + (iLen - 1)+ "종)";
						}
						else{
							return sFirstItemName;
						}
					}
					catch(e){
						return "상품없음";
					}
					 
				});
				this.orderCouponUse = ko.computed(function(){
					try{
						var sId = self.order.coupon.id();
						if ((sId !== undefined) && (sId !== "")){
							return 1;
						}
					}
					catch(e){}
					
					return 0;
				});
				
				// 상품이 없을 때 툴팁 알림 메시지 부분 추가
			
			},// init method ends ::::::::::::::::::::::::::::::			
			
			// 현재 적용 시키려는 할인가가 구매금액을 넘어가는지의 여부 확인
			isOverDiscount : function(type, value){
				if ((type === undefined) || (value === undefined)) return false;
				
				var bRet = false;
				var iTemp = "";
				var iTotalDiscount = this.totalDiscount();
				var iVal = parseInt( value );
				var iTotalPrice = $.tryParseInt( this.totalPrice() );
				
				if ( type === "coupon" ){
					iTemp = $.tryParseInt( this.coupon.cp_price() );
				}
				if ( type === "cash" ){
					iTemp = $.tryParseInt( this.myorder.od_cash() );
				}
				
				bRet = (iTotalPrice - ( iTotalDiscount - iTemp + iVal )) < 0;
				
				return bRet;
			},
			hasCheckedItem : function(){
				var aOdata = this.odata();
				var iLen = aOdata.length;
				var iCount = 0;
				
				for (var i = 0; i < iLen; i++){
					if (aOdata[i].it_checked() === true){
						iCount++;
					}
				}
				
				return iCount > 0;
			},
			// 아이템 여닫기 기능 추가 - 2014.06.21 by jhson [시작]
			itemCollapse : function(data, event){
				try{
					var jqButton = $(event.target);
					var jqIcon = jqButton;
					var jqParent = jqButton.parentsUntil(".collapsible").parent();
					
					jqIcon.toggleClass("glyphicon-chevron-down");
					jqIcon.toggleClass("glyphicon-chevron-up");
			
					jqParent.find(".collapsible-body").toggle(0, function(){
					});
					
					jqParent.find(".sub-item.badge").text(
						jqParent.find(".list-group-item").length
					);
					
				}
				catch(e){}
			},
			// 아이템 여닫기 기능 추가 - 2014.06.21 by jhson [종료]
			
			// 구입내역을 하단 form 으로 복사하는 기능 추가 - 2014.08.13 by jhson [시작]
			copyItemsToOrderInfo : function(){
				var mParam = m.serializeMapByCheckedItem( 
					this.jqFormCartList, 
					["it_id", "it_qty", "it_settle_price"],
					",", "ca_id", ".item_cart");
				
				console.log(mParam);
				
				this.jqFormOrderInfo.find("[name='it_id']").val( mParam.it_id );
				this.jqFormOrderInfo.find("[name='it_qty']").val( mParam.it_qty );
				this.jqFormOrderInfo.find("[name='it_settle_price']").val( mParam.it_settle_price );
			},
			// 구입내역을 하단 form 으로 복사하는 기능 추가 - 2014.08.13 by jhson [종료]
			
			// 쿠폰정보 바인딩 기능 - 2014.06.24 by jhson [시작]
			initCouponInfo : function(){
				if (self.order.myMemberInfo === undefined) return;
				
				$.getJSON("/popkon/ajax_get_coupon_list_json.php", {"mb_id": self.order.myMemberInfo.mb_id}, function(data){
					self.order.coupons.removeAll();
					$.map(data, function(item, index){
						var coupon = new m.setCoupon(item, index);
						self.order.coupons.push( coupon );
					});
				});
			},
			removeCoupon : function(){
				this.coupon.set();
				this.myorder.od_coupon(0);
				this.myorder.od_coupon_id( 0 );
				this.myorder.od_coupon_use( 0 );
			},
			changeCoupon : function(data, event){
				if (data === undefined) return;
				try{
					//alert(event.target.selectedIndex);
					
					var elemSelect = event.target;
					var jqSelect = $(elemSelect);
					var index = elemSelect.selectedIndex - 1;
					
					console.log("selectedIndex:" + index + 1);
					
					if (index < 0){
						data.removeCoupon();
						/*
						$.post("/mypage/ajax_order_coupon_comp_stest.php", {
							id: "",
							cp_id: ""
						}, function(){
							
						});
						*/
					}
					else{
						/* */
					
						console.log(data.coupons()[ index ].id());
						console.log(data.coupons()[ index ].cp_id());
						$.post("/mobile/mb/ajax_order_coupon_comp_stest.php", {
							id: data.coupons()[ index ].id(),
							cp_id: data.coupons()[ index ].cp_id()
						}, function(response){
							if (response === "n"){
								m.toast("적용할 수 없는 쿠폰입니다.");
								data.removeCoupon();
								return;
							}
							
							var saResponse = response.split( ":" );
							var coupon = data.coupons()[ index ];
							var iCouponPrice = parseInt( saResponse[1] );
							
							if ( data.isOverDiscount( "coupon", iCouponPrice ) === true ){
								alert("총 할인금액이 결제 금액보다 큽니다.");
								data.removeCoupon();
							}
							else{
								m.toast("쿠폰이 적용 되었습니다.");
								data.coupon.set( coupon );
								data.myorder.od_coupon( iCouponPrice );
								data.myorder.od_coupon_id( data.coupon.id );
								data.myorder.od_coupon_use( data.coupon.cp_type );
							}
						});
						
						//data.coupon.set( data.coupons()[ index ] );
					}
				}
				catch(e){}
			},
			applyCash : function(data, event, isNotUseCash){
				if (data === undefined) return;
				try{
					var iMbCash = $.tryParseInt( data.member.mb_cash() );
					var iDspCash = $.tryParseInt( data.member.dsp_cash() );
					var iTotalDiscount = $.tryParseInt( data.totalDiscount() );
					var iTotalPrice = $.tryParseInt( data.myorder.od_total_price() );
									
					if (iMbCash < 5000){
						alert("적립금은 5000원 이상부터 사용 가능합니다.");
						return;
					}
					
					if ((iMbCash === 0) ){
						alert("사용할 적립금이 없습니다.");
						return;
					}
					
					if (iDspCash > iMbCash){
						alert("현재 보유한 적립금보다 많습니다.");
						data.member.dsp_cash( iMbCash );
						return;
					}
					
					if (iDspCash < 5000){
						alert("적립금은 5000원 이상 부터 사용 가능합니다.");
						return;
					}
					
					if (data.isOverDiscount( "cash", iDspCash ) === true){
						alert("적용할 적립금이 결제 금액보다 많습니다.");
						return;
					}
					
					self.order.sendDiscountInfo(
						self.order.od_id(),
						(isNotUseCash)? data.myorder.od_cash() : data.member.dsp_cash(),
						0, // 임시 적용
						data.myorder.od_total_price(),
						iTotalDiscount + iDspCash
					);
				}
				catch(e){}
			},
			sendDiscountInfo : function( od_id, od_cash, od_ahn, total_price, dscountval ){
				if (self.order.odata().length === 0) return;
				
				$.post("/mobile/mb/ajax_order_cash_comp.php", {
					od_id: od_id,
					od_cash: od_cash,
					od_ahn: od_ahn, 
					total_price: total_price,
					dscountval: dscountval
				}, function(data){
					data = "1"; // FIXME: 테스트 후 삭제할 것
					var iResponse = parseInt( data );
					if (iResponse !== 100){
						self.order.myorder.od_cash( od_cash );
						m.toast("금액을 적용 하였습니다.");
					}
				});
			},
			// 쿠폰정보 바인딩 기능 - 2014.06.24 by jhson [종료]
			
			// 배송지 정보 입력 기능 - 2014.06.24 by jhson [시작]
			initMemberInfo : function(){
				$.getJSON("/bbs/member_json.php", function(data){
					//var data = $.parseJSON(text);
					//console.log(text);
					self.order.myMemberInfo = data;
					self.order.applyMemberInfo(true);
					self.order.initCouponInfo();
				});
			},
			chooseAddress : function(data, event){
				try{
					var jqRadio = $(event.target);
					
					if (jqRadio.prop("tagName") !== "INPUT"){
						jqRadio = jqRadio.find("input");
					}
				
					if (jqRadio.val() === "1"){
						self.order.applyMemberInfo();
					}
					else{
						self.order.removeMemberInfo();
					}
				}
				catch(e){}
			},
			applyMemberInfo : function(isMbCachOnly){
				if (self.order.myMemberInfo === undefined) return;
				
				if (isMbCachOnly ===  true){
					self.order.member.mb_cash( self.order.myMemberInfo.mb_cash );
					self.order.member.dsp_cash( 0/*self.order.myMemberInfo.mb_cash*/ );
					return;
				}
				
				console.log( self.order.myMemberInfo );
				
				var saMbHp = null;
				
				for(var prop in self.order.member){
					if ((prop === "mb_cash") || (prop === "dsp_cash") || (prop === "mergeMbHp")) continue;
					
					//console.log(prop);
					self.order.member[prop]( self.order.myMemberInfo[ prop ] );
				}
				
				try{
					saMbHp = self.order.myMemberInfo.mb_hp.split("-");
				}
				catch(e){}
				
				if (saMbHp.length === 3){
					self.order.member.mb_hp0( saMbHp[0] );
					self.order.member.mb_hp1( saMbHp[1] );
					self.order.member.mb_hp2( saMbHp[2] );
				}
			},
			removeMemberInfo : function(){
				if (this.myMemberInfo === undefined) return;
				
				for(var prop in self.order.member){
					if ((prop === "mb_cash") || (prop === "dsp_cash")) continue;
					this.member[prop]( "" );
				}
			},
			// 배송지 정보 입력 기능 - 2014.06.24 by jhson [종료]
			
			// 수량 변경에 따른 판매가 수정 추가 - 2014.06.23 by jhson [시작]
			caQtyChange : function(data, event){
				try{
					var jqInput = $(event.target);
					self.order.copyItemsToOrderInfo();
				}
				catch(e){}
			},
			// 수량 변경에 따른 판매가 수정 추가 - 2014.06.23 by jhson [종료]
			
			deleteCartItem : function(data, event){
				if (event === undefined) return;
				
				try{
					if (confirm("선택한 내역을 삭제 하시겠습니까?") === true){
						var jqFormCartList = self.order.jqFormCartList;
						//var saCaId = [];
						var iCnt = 0;
						var mParam = {
							order_type : "del"
						};
						var sAppdCaId = "";
						
						this.odata.remove(function(item){
							var isChecked = item.it_checked();
							
							if (isChecked === true){
								if (iCnt === 0){
									sAppdCaId += item.ca_id();
								}
								else{
									sAppdCaId += "," + item.ca_id();
								}
								
								iCnt++;
							}         
							 
							return isChecked === true;
						});
				
						mParam.ca_id = sAppdCaId;
						//TODO: 서버에 삭제 내용 전달 하는 것 구현.
						
						console.log(mParam);
						
						$.post( jqFormCartList.attr("action"), mParam, function(data){
							console.log(data);
						} );
						
						if (self.order.odata().length < 1){
							self.order.hideInfo();
						}
						
						self.order.copyItemsToOrderInfo();
					}
					
				}
				catch(e){}
			},
			setData : function(allData){
				self.order.odata.removeAll();
				//self.order.odatas.removeAll();
				/*$.map(allData.status, function(item) { 
					
					if(item.sqlmsg=="에러" || (!item.atype && !item.mtype)){
						alert('에러가 발생하였습니다. sql='+item.sqlmsg+', sqlitem ='+item.sqlmsgitem+', atype ='+item.atype+', mtype ='+item.mtype);
					}
				});*/
				
				if ((allData.order !== undefined) &&
					(allData.order.length > 0) ){
					self.order.od_id( allData.order[0].od_id ); 
				}
				else{
					//m.toast("장바구니 내역이 존재하지 않습니다.", 3000);
				}
				
				//FIXME: 추후 개선 방안에 대하여 논의 필요.
				if (allData.order){
					$.map(allData.order, function(item) { self.order.odata.push(new m.setOdata(item)); });
				}
				
				/*
				if (m.mb_id === "sd_yotimer"){
					self.order.odata( self.createTreeItem( allData.order, "ca_id", "pa_ca_id", m.setOdata ) );
				}
				else{
					$.map(allData.order, function(item) { self.order.odata.push(new m.setOdata(item)); });
				}
				*/
				
				
				
				//$.map(allData.orders, function(item) { self.order.odatas.push(new m.setOdata(item)); });
				//self.mdataCollection.sort(function(left, right) { return left.l == right.l ? 0 : (left.l < right.l ? -1 : 1) });
				//self.mdataCollection(mappedMdatas);
				
				self.order.initMemberInfo();// 사용자 정보 읽어오기 추가 - 2014.06.24 by jhson
			},
			
			load : function(sendData, callback){
				//var od_id = self.order.od_id(1403170652);
				//var param = {od_id: od_id};
				var param = {};	
				//setgetMdata(param,function(){self.mdatas(mappedMdatas)});
				
				if (sendData !== undefined){
					self.order.setData( sendData );
					/*
					if (isBuy === true){
						self.order.showWithInfo();
					}
					else{
						self.order.show();
					}*/
					return;
				}
				
				//console.log(param);
				$.getJSON("/mobile/mb/order.php",param, function(allData, txtstatus) {
					//console.log("save donegoToMdata=="+txtstatus); 	//console.log("save Data=="+allData);
					//console.table(allData.order);
					console.log(allData.order);
					//self.items.removeAll();
					//self.items(allData.lt);
					self.order.setData( allData );
					
					if (callback !== undefined){
						callback();
					}
				}).fail(function(d, textStatus, error) {
				
					console.log(error);
					console.log(d);
					console.log(textStatus);
					alert('에러가 발생하였습니다');
				});
			},
			isVisible: function(){
				return $("#container_orderView").hasClass("active-view");
			},
			show : function(isBuyShortCut){
				self.order.isBuy( isBuyShortCut === true );
				
				if (isBuyShortCut === true){
					self.order.showInfo();
				}
				else{
					self.order.hideInfo();
				}
				m.slideLeft( ".active-view", "#container_orderView" );
			},
			/*showViewByParam: function(param){
				if (param.view === "cartlist"){
					this.show();
				}
				else if (param.view === "booklist"){
					this.showOrderList();
				}
			},*/
			hide : function(){
				m.slidePrev();
				//this.hideInfo();
			},
			showWithInfo : function(){
				self.order.show(true);
			},
			showInfo : function(){
				self.order.copyItemsToOrderInfo();
				
				if (self.order.odata().length > 0){
					this.jqFormCartList.parent().next().show();
				}
				else{
					$("#list_cart").tooltip("show");
				}
				self.order.onInfoShown();
			},
			hideInfo : function(){
				this.jqFormCartList.parent().next().hide();
			},
			
			onCartItemChanged: function(){
				self.order.copyItemsToOrderInfo();
			},
			
			evt_infoshown: null,
			infoshown: function(callback){
				this.evt_infoshown = callback;
			},
			onInfoShown: function(){
				try{
					this.evt_infoshown();
				}
				catch(e){}
			}
			
		};// order namespace end ::::::::::::::::::::::::::::::::
		
		// 우편번호 검색 기능 추가 - 2014.06.23 by jhson [시작]
		self.zipcode = {
			list : ko.observableArray(),
			init : function(){
				$("#form_searchZipcode").submit(function(){
					var jqSelf = $(this);
					var mParams = jqSelf.serialize();
					
					$.getJSON( jqSelf.attr("action"), mParams, function(data){
						self.zipcode.list.removeAll();
						console.log(data);
						$.map(data, function(item){
							self.zipcode.list.push( item );
						});
					});
					
					return false;
				});
				$("#modal_zipcode").on("shown.bs.modal", function(e){
					var jqInput = $("#form_searchZipcode input[name='addr1']");
					jqInput[0].focus();
				});
				$("#button_searchZipcode").click(function(){
					var jqInput = $("#form_searchZipcode input[name='addr1']");
					jqInput.val("");
					self.zipcode.list.removeAll(); 
				});
			},
			getCount : ko.computed(function(){
				try{
					return self.zipcode.list().length;
				}
				catch(e){
					return 0;
				}
			}),
			evt_selected: [],
			selected: function(callback){
				this.evt_selected.push(callback);
			},
			onselected : function(data, event){
				if (data === undefined) return;
				try{
					var jqThis = $(event.target);
					
					var iEventLen = self.zipcode.evt_selected.length;
					//var jqForm = self.order.jqFormOrderInfo;
					
					if (jqThis.prop("tagName") !== "A"){
						jqThis = jqThis.parent();
					}
					
					try{
						for(var i = 0; i < iEventLen; i++){
							self.zipcode.evt_selected[i](data);
						}
					}
					catch(e){}
					/*
					self.order.member.mb_zip1( jqThis.find(".zip1").text() );
					self.order.member.mb_zip2( jqThis.find(".zip2").text() );
					self.order.member.mb_addr1( jqThis.find(".addr").text() );
					self.order.member.mb_addr2( "" );
					*/
				}
				catch(e){}
			}
		};
		// 우편번호 검색 기능 추가 - 2014.06.23 by jhson [종료]

		
		
		
		self.order.init();
		self.zipcode.init();
	 
		//$("#step1").empty();
		//$("#step2").empty();
		//$("#step3").empty();
		//console.log("bookSearch selected_book = "+  self.selected_book());
		//console.log("bookSearch booksearchname = "+  self.booksearchname());
		//console.log("bookSearch it_id = "+  data.it_id());
		
		
		
	}
	
	OrderModel.prototype = new m.BaseViewModel();
	OrderModel.prototype.constructor = OrderModel;
	
	m.OrderModel = OrderModel;
	
	m.OrderDataProps = [
		"authdata",
		"ca_id",
		"ca_qty",
		"ca_status",
		"ca_status2",
		"cat_id",
		"d_status",
		"de_id",
		"e_date",
		"ex_price",
		"it_cash",
		"it_coupon",
		"it_coupon_use",
		"it_cp",
		"it_delivery",
		"it_delivery_use",
		"it_enuri",
		"it_id",
		"it_name",
		"it_names",
		"it_opt",
		"it_price",
		"it_res_price",
		"it_settle_price",
		"it_type",
		"life_e_date",
		"life_s_date",
		"mb_id",
		"od_admin_memo",
		"od_b_addr1",
		"od_b_addr2",
		"od_b_hp",
		"od_b_name",
		"od_b_tel",
		"od_b_zip1",
		"od_b_zip2",
		"od_bank_date",
		"od_bank_use",
		"od_cash",
		"od_cashreceiptyn",
		"od_chk_datetime",
		"od_coupon",
		"od_coupon_id",
		"od_coupon_use",
		"od_cp",
		"od_d_status",
		"od_datetime",
		"od_delivery",	//배송비
		"od_delivery_use",
		"od_deposit_name",
		"od_email",
		"od_enuri",
		"od_escrow_no",
		"od_escrow_use",
		"od_hp",
		"od_id",
		"od_invoice",
		"od_invoice_time",
		"od_memo",
		"od_name",
		"od_password",
		"od_reserve",
		"od_s_status",
		"od_settle_log",
		"od_settle_price",//총 구매 금액
		"od_settle_use",
		"od_status",
		"od_status2",
		"od_tel",
		"od_tid",
		"od_total_price", //상품가격
		"pa_ca_id",
		"pause_cnt",
		"pause_day",
		"pause_state",
		"s_date",
		"s_status",
		"site",
		"stock_use",
		"tax_use",
		"tempOLDorderID",
		"tempOLDordergoodsID",
		"update_datetime",
		"update_mb_id"
	];
	
	
	// 초기화
	/*
	m.OrderData = function(data){
		var self = this;
		var arrKeys = m.OrderDataProps;
		var iLen = arrKeys.length;
		
		if (data){
			if (arrKeys[i] === "it_names"){
				continue;
			}
			if (arrKeys[i] === "it_settle_price"){
				continue;
			}
			self[ arrKeys[i] ] = ko.observable( data[ arrKeys[i] ] );
		}
		else{
			if (arrKeys[i] === "it_names"){
				continue;
			}
			if (arrKeys[i] === "it_settle_price"){
				continue;
			}
			self[ arrKeys[i] ] = ko.observable("");
		}
		
		self.od_coupon(0);
		
		self.od_delivery( 0 );
		self.it_checked = ko.observable(true);
		self.it_names = ko.observableArray();
		self.it_settle_price = ko.computed(function(){
			return $.tryParseInt( self.it_price() ) * $.tryParseInt( self.ca_qty() );
		});
		
		self.set = function(data){
			if (data){
				
			}
			else{
				
			}
		};
	};
	*/
	function Odata() {
		var self = this;
		var arrKeys = m.OrderDataProps;
		var iLen = arrKeys.length;
		
		for(var i = 0; i < iLen; i++){
			if (arrKeys[i] === "it_names"){
				continue;
			}
			if (arrKeys[i] === "it_settle_price"){
				continue;
			}
			self[ arrKeys[i] ] = ko.observable("");
		}
		
		self.od_coupon(0);
		
		self.od_delivery( $.tryParseInt(self.od_delivery()) );
		self.it_checked = ko.observable(true);
		self.it_names = ko.observableArray();
		self.it_settle_price = ko.computed(function(){
			return $.tryParseInt( self.it_price() ) * $.tryParseInt( self.ca_qty() );
		});
	}
	m.Odata = Odata;
	
	// 바인딩 
	function setOdata(data) {
		var self = this;//new m.Odata();
		var arrKeys = m.OrderDataProps;
		var iLen = arrKeys.length;
		var iSubLen = 0;
		var aSubData = null;
		
		for(var i = 0; i < iLen; i++){
			if (arrKeys[i] === "it_names"){
				self[ "it_names" ] = ko.observableArray();
				aSubData = data[ "it_names" ] ;
				
				if (aSubData){
					$.map( aSubData, function(item){ self.it_names.push( item ); } );
				/*
					for(var j = 0; j < iSubLen; j++){
						self.it_names.push
					}
					*/
				}
				continue;
			}
			else if (arrKeys[i] === "ca_qty"){
				if ((data.ca_qty === "") || ( parseInt(data.ca_qty) < 1 )){
					self.ca_qty = ko.observable(1);
				}
				else{
					self.ca_qty = ko.observable(data.ca_qty);
				}
				continue;
			}
			if (arrKeys[i] === "it_settle_price"){
				continue;
			}
			self[ arrKeys[i] ] = ko.observable( data[ arrKeys[i] ] );
		}
		
		self.od_delivery( $.tryParseInt(self.od_delivery()) );
		self.it_checked = ko.observable(true);
		self.it_settle_price = ko.computed(function(){
			return $.tryParseInt( self.it_price() ) * $.tryParseInt( self.ca_qty() );
		});
	}
	m.setOdata = setOdata;
	
	function setZipcode(data){
		var self = this;
		
		for(var d in data){
			self[d] = ko.observable( data[ d ] );
		}
	}
	m.setZipcode = setZipcode;
	
	function setMember(data){
		var self = this;
		var saProp = [
			"mb_name",
			"mb_zip1",
			"mb_zip2",
			"mb_addr1",
			"mb_addr2",
			"mb_tel0",
			"mb_tel1",
			"mb_tel2",
			"mb_hp",
			"mb_email",
			//"dsp_cash", // 기존 데이터엔 포함되어 있지 않음.
			"mb_cash",
			"mb_9"
		];
		var iLen = saProp.length;
		var saMbHp = null;
		
		if (data){
			for(var i = 0; i < iLen; i++){
				self[ saProp[i] ] = ko.observable( data[ saProp[ i ] ] );
			}
			//self.dsp_cash = ko.observable( 0 );
		}
		else{
			for(var i = 0; i < iLen; i++){
				self[ saProp[i] ] = ko.observable( "" );
			}
			//self.dsp_cash = ko.observable( 0 );
		}
		
		self.mb_id = ko.observable( m.mb_id );
		self.dsp_coupon = ko.observable( 0 );
		self.mb_cash( $.tryParseInt( self.mb_cash() ) );
		self.dsp_cash = ko.observable( "" );
		
		try{
			saMbHp = data.mb_hp.split("-");
			console.log( saMbHp );
		}
		catch(e){}
		
		if (data && saMbHp.length === 3){
			self.mb_hp0 = ko.observable( saMbHp[0] );
			self.mb_hp1 = ko.observable( saMbHp[1] );
			self.mb_hp2 = ko.observable( saMbHp[2] );
		}
		else{
			self.mb_hp0 = ko.observable( "" );
			self.mb_hp1 = ko.observable( "" );
			self.mb_hp2 = ko.observable( "" );
		}
		
		self.mergeMbHp = ko.computed(function(){
			return m.mergePhoneInfo( [ self.mb_hp0(), self.mb_hp1(), self.mb_hp2() ] );
		});
		
		/*self.clear = function(){
			for(var i = 0; i < iLen; i++){
				self[ saProp[i] ]("");
			}
		};
		*/
	}
	m.setMember = setMember;
	
	function setCoupon(data){
		var self = this;
		var saProp = [
			"cp_cnt",
			"cp_datetime",
			"cp_doc",
			"cp_end_days",
			"cp_id",
			"cp_img_type",
			"cp_item_use",
			"cp_max_price",
			"cp_name",
			"cp_pass_type",
			"cp_period_days",
			"cp_period_edate",
			"cp_period_sdate",
			"cp_period_use",
			"cp_price",
			"cp_price_type",
			"cp_type",
			"id",
			"mc_date"
		];
		var iLen = saProp.length;
		
		if (data){
			for(var i = 0; i < iLen; i ++){
				self[ saProp[i] ] = ko.observable( data[ saProp[i] ] );
			}
			self.cp_id_val = data.cp_id;
		}
		else{
			for(var i = 0; i < iLen; i ++){
				self[ saProp[i] ] = ko.observable( "" );
			}
			//self.cp_id_val = "";
		}
		
		self.cp_price_result = ko.observable( 0 );
		self.set = function(observableObject){
			if (observableObject){
				for(var i = 0; i < iLen; i ++){
					self[ saProp[i] ]( observableObject[ saProp[i] ]() );
				}
			}
			else{
				for(var i = 0; i < iLen; i ++){
					self[ saProp[i] ]( null );
				}
			}
		};
	}
	m.setCoupon = setCoupon;
/*	
	$(function(m, $, ko){
		try{
			var app = new m.App();
			app.run();
		}
		catch(e){}
	}(window.m, $, ko));
	*/
/*
	function App(){
		this.run = function(){
			var vm = new m.OrderModel();
			vm.initZipcode();
			ko.applyBindings(vm);
				
		}
	}
	m.App = App;


	$(function(m, $, ko){
		var app = new m.App();
		app.run();
		//m.setMBdata(m.mb_name, m.mb_id);	
	}(window.m, $, ko));
*/
	
});