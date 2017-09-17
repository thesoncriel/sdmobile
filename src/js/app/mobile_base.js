// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "owlcarousel", "jqueryfinger", "sammy"],
function($, carousel, ko, koutil, json, bootstrap, owlcarousel, jqueryfinger, sammy) {
// 화면 슬라이드 애니메이션 기능 [시작]
(function($, m){
	m.lecCateInfo = {

	"001001001" : { "name": "증권투자상담사", "lec_cate": "003001" },

	"001001002" : { "name": "유통관리사", "lec_cate": "001003" },

	"001001007" : { "name": "전산회계/세무회계", "lec_cate": "001031" },

	"001001008" : { "name": "펀드투자/파생상품투자", "lec_cate": "003003" },

	"001001011" : { "name": "외환전문역", "lec_cate": "003007" },

	"001001015" : { "name": "물류관리사", "lec_cate": "001004" },

	"001001020" : { "name": "재경관리사", "lec_cate": "003006" },

	"001001021" : { "name": "변액보험판매관리사", "lec_cate": "003005" },

	"001003003" : { "name": "영양사", "lec_cate": "001024" },

	"001003007" : { "name": "국제의료관광코디네이터", "lec_cate": "001016" },

	"001003008" : { "name": "임상심리사", "lec_cate": "001013" },

	"001004001" : { "name": "직업상담사", "lec_cate": "001001" },

	"001004002" : { "name": "텔레마케팅관리사", "lec_cate": "001005" },

	"001004003" : { "name": "경비지도사", "lec_cate": "001002" },

	"001004004" : { "name": "관광통역(국내여행)안내사", "lec_cate": "001014" },

	"001004005" : { "name": "사회복지사", "lec_cate": "001006" },

	"001004006" : { "name": "농산물품질관리사", "lec_cate": "001019" },

	"001004007" : { "name": "문화재수리", "lec_cate": "001015" },

	"001004017" : { "name": "CS리더스관리사", "lec_cate": "001008" },

	"001004018" : { "name": "공인행정사", "lec_cate": "001011" },

	"001004022" : { "name": "비서자격증", "lec_cate": "001009" },

	"001004023" : { "name": "CS Master", "lec_cate": "001035" },

	"001004025" : { "name": "청소년상담사/청소년지도사", "lec_cate": "001007" },

	"001004026" : { "name": "정책분석평가사", "lec_cate": "001026" },

	"001004031" : { "name": "한국사능력검정시험", "lec_cate": "001017" },

	"001005001" : { "name": "공인중개사", "lec_cate": "001010" },

	"001005002" : { "name": "주택관리사", "lec_cate": "001012" },

	"001008001" : { "name": "조리기능사", "lec_cate": "001022" },

	"001008002" : { "name": "제과/제빵 기능사", "lec_cate": "001022" },

	"001008003" : { "name": "미용기능사", "lec_cate": "001023" },

	"001008004" : { "name": "조주기능사", "lec_cate": "001033" },

	"001011002" : { "name": "국어능력인증시험", "lec_cate": "001021" },

	"001011007" : { "name": "한국어교육능력검정시험", "lec_cate": "001020" },

	"001011008" : { "name": "KBS한국어능력시험", "lec_cate": "001034" },

	"001013001" : { "name": "Win-Q 시리즈", "lec_cate": "001036" },

	"001015001" : { "name": "건축물에너지평가사", "lec_cate": "001030" },

	"002001002" : { "name": "취업성공패키지상담원", "lec_cate": "002005" },

	"002002" : { "name": "일반직 전환", "lec_cate": "002004" },

	"002002001" : { "name": "행정학개론", "lec_cate": "002004" },

	"002002002" : { "name": "사회", "lec_cate": "002004" },

	"002002003" : { "name": "국사", "lec_cate": "002004" },

	"002002004" : { "name": "교육학개론", "lec_cate": "002004" },

	"002002005" : { "name": "단기완성", "lec_cate": "002004" },

	"002002006" : { "name": "관리운영직(동영상)", "lec_cate": "002004" },

	"002003006" : { "name": "운전직 공무원", "lec_cate": "002015" },

	"002003007" : { "name": "시설관리/방호직 공무원", "lec_cate": "002017" },

	"002003008" : { "name": "간호직/보건직", "lec_cate": "002018" },

	"002003009" : { "name": "9급사회복지직", "lec_cate": "002003" },

	"002007001" : { "name": "PSAT", "lec_cate": "002009" },

	"002007002" : { "name": "5급민간경력자", "lec_cate": "002009" },

	"002009002" : { "name": "청원경찰", "lec_cate": "002012" },

	"002010001" : { "name": "우정사업본부 계리직", "lec_cate": "002002" },

	"002011002" : { "name": "부사관", "lec_cate": "004002" },

	"002011003" : { "name": "ROTC", "lec_cate": "004003" },

	"002015001" : { "name": "교정학/교정직", "lec_cate": "002014" },

	"004001001" : { "name": "대검 기본서", "lec_cate": "005001" },

	"004001002" : { "name": "대검 문제집", "lec_cate": "005001" },

	"004002001" : { "name": "고검 기본서", "lec_cate": "005001" },

	"004002002" : { "name": "고검 문제집", "lec_cate": "005001" },

	"004003001" : { "name": "독학사2단계", "lec_cate": "005002" },

	"004003002" : { "name": "독학사1/2단계", "lec_cate": "005002" },

	"004004" : { "name": "중입검정고시", "lec_cate": "005001" },

	"004004001" : { "name": "중입검정고시", "lec_cate": "005001" },

	"004005001" : { "name": "독학사1단계 기본서", "lec_cate": "005002" },

	"004005002" : { "name": "독학사1단계 문제집", "lec_cate": "005002" },

	"007001" : { "name": "학점인정", "lec_cate": "005002" },

	"007001001" : { "name": "~ 10학점", "lec_cate": "005002" },

	"007001002" : { "name": "30학점 이상", "lec_cate": "005002" },

	"007001003" : { "name": "~20학점", "lec_cate": "005002" },

	"008001020" : { "name": "농협인적성", "lec_cate": "004001" },

	"008002001" : { "name": "최신 이슈&상식(월간지)", "lec_cate": "004005" },

	"008002002" : { "name": "일반상식", "lec_cate": "004006" },

	"008003002" : { "name": "날아라 스튜어디스", "lec_cate": "004004" },
	
	/////////////////////////////////////////////////
	// 추가 카테고리 - 2014.08.04 by jhson
	"001004031" : { "name": "한국사능력검정시험", "lec_cate": "001017"},
	
	"001001005" : { "name": "은행텔러", "lec_cate": "003008"},
	
	"002003002" : { "name": "교정학/교정직"/* 일반행정직 */, "lec_cate": "002014,002001" },
	
	"008001001" : { "name": "삼성그룹(SSAT)", "lec_cate": "004007" },
	
	"008001002" : { "name": "SK그룹(SKCT)", "lec_cate": "004011" },
	
	"008001021" : { "name": "현대(HMAT)", "lec_cate": "004013" },
	
	"008001006" : { "name": "LG전자", "lec_cate": "004015" },
	
	"008001014" : { "name": "CJ", "lec_cate": "004012" },
	
	
	// 추가 카테고리 - 2014.11.06 by jhson
	"001013004" : { "name": "네일아트", "lec_cate": "001040"},
	"001015006" : { "name": "샵마스터", "lec_cate": "001039"},
	"001004009" : { "name": "사회조사분석사", "lec_cate": "001038"},
	"001013010" : { "name": "온실가스관리(산업)기사", "lec_cate": "001037"},
	"001009008" : { "name": "GTQ", "lec_cate": "001029"},
	"001013006" : { "name": "소방자격증", "lec_cate": "001028"},
	"001011004" : { "name": "TOPIK", "lec_cate": "001027"},
	
	"002003002" : { "name": "견습직원(9급)", "lec_cate": "002006"},
	"002007002" : { "name": "민간경력자", "lec_cate": "002011"},
	"002009001" : { "name": "PMAT", "lec_cate": "002013"},
	"017008001" : { "name": "일반행정직(9급)", "lec_cate": "002016"},
	"002005001" : { "name": "국가정보원", "lec_cate": "002019"},
	"008004020" : { "name": "시간선택제(9급)", "lec_cate": "002021"},
	
	"001001005" : { "name": "자산관리사", "lec_cate": "003004"},
	
	"008001001" : { "name": "취업적성", "lec_cate": "004008"},
	"008001003" : { "name": "DCAT", "lec_cate": "004014"},
	"008001011" : { "name": "KT그룹", "lec_cate": "004016"},
	"008001022" : { "name": "한국전력공사", "lec_cate": "004017"},
	
	"005001004" : { "name": "사관학교", "lec_cate": "006001"} 
	
};

m.findBookCateByLecCate = function(lecCate){
	var item = null;
	
	if (lecCate === "003002"){
		return {
			book_cate: "001001008"
		};
	}
	if (lecCate === "002008"){
		return {
			book_cate: "002003002"
		};
	}
	if (lecCate === "002001"){
		return{
			book_cate: "002003002"
		};
	}
	
	for(var prop in m.lecCateInfo){
		item = m.lecCateInfo[prop];
		
		if (item.lec_cate === lecCate){
			return {
				book_cate: prop,
				name: item.name,
				lec_cate: item.lec_cate
			};
		}
	}
	
	return "";
};

m.SubItemSelector = function(maOption){
	var self = this;
	
	self.length = maOption.length;
	self.names = {};
	
	for(var i = 0; i < self.length; i++){
		self[ maOption[ i ].name || i ] = new m.SubItemInfo( maOption[ i ] );
		self.names[maOption[ i ].name || i] = "";
	}
	
	self.getTotalValue = ko.computed(function(){
		var iSum = 0;
		for(var sProp in self.names){
			iSum += self[ sProp ].getTotalValue();
		}
		
		return iSum;
	});
};

m.SubItemSelector.prototype = {
	clear: function(){
		for(var sProp in this.names){
			this[ sProp ].clear();
		}
	},
	showList: function(){
		for(var sProp in this.names){
			this[ sProp ].showList();
		}
	},
	hideList: function(){
		for(var sProp in this.names){
			this[ sProp ].hideList();
		}
	}
};

m.SubItemInfo = function(mOption){
	var self = this;
	
	self.option = {
		trigger: null,
		placeHolder: "선택하세요",
		optionText: "it_name",
		optionName: "it_book",
		optionValue: "it_settle_price",
		optionValueType: "function", //function | numeric
		groupParent: ".product-info",
		groupList: ".sub-product-list",
		qtyName: "it_qty",
		qtyType: "function" //function | numeric
	};
	
	$.extend(self.option, mOption);
	
	self.jqTrigger = $( self.option.trigger );
	self.list = ko.observableArray();
	self.selectedList = ko.observableArray();
	self.selectedItem = ko.observable( self.option.placeHolder );
	
	self.jqTrigger.click( self.option, self.onToggleList );
	
	self.onSelect = function(item, event){
		if (self.selectedList.indexOf( item ) < 0 ){
			self.selectedList.push( item );
		}
		
		self.selectedItem( item[ self.option.optionText ] );
		event.data = self.option;
		self.onToggleList( event );
		
		
	};
	
	self.onRemove = function(item, event){
		self.selectedList.remove( item );
	};
	
	self.onClickSpinnerMinus = function(item, event){
		var iQty = 0;
		var sProp = self.option.qtyName;
		
		if (self.option.qtyType === "function"){
			iQty = parseInt( item[ sProp ]() );
			
			if (iQty > 1){
				item.it_qty( iQty - 1 );
			}
		}
		else{
			iQty = parseInt( item[ sProp ] );
			
			if (iQty > 1){
				item.it_qty = iQty - 1;
			}
		}
	};
	self.onClickSpinnerPlus = function(item, event){
		var iQty = 0;
		var sProp = self.option.qtyName;
		
		if (self.option.qtyType === "function"){
			iQty = parseInt( item[ sProp ]() );
			item.it_qty( iQty + 1 );
		}
		else{
			iQty = parseInt( item[ sProp ] );
			item.it_qty = iQty + 1;
		}
	};
	
	self.getTotalValue = ko.computed(function(){
		var iSum = 0;
		var aItems = self.selectedList();
		var iLen = (aItems)? aItems.length : 0;
		var sProp = self.option.optionValue;
	
		if (self.option.optionValueType === "function"){
			for(var i = 0; i < iLen; i++){
				iSum += aItems[ i ][ sProp ]();
			}
		}
		else{
			for(var i = 0; i < iLen; i++){
				iSum += parseInt( aItems[ i ][ sProp ] );
			}
		}
		
		return iSum;
	});
	
	self.hasList = ko.computed(function(){
		try{
			return self.list().length > 0;
		}
		catch(e){}
		
		return false;
	});
};

m.SubItemInfo.prototype = {
	clear: function(){
		this.selectedItem( this.option.placeHolder );
		try{
			this.selectedList.removeAll();
		}
		catch(e){}
	},
		
	setList: function(data){
		this.list(data);
	},
	
	showList: function(){
		$(this.option.groupList).eq(0).show();
	},
	hideList: function(){
		$(this.option.groupList).eq(0).hide();
	},
	
	onToggleList: function(e){
		var jqButton = $(e.currentTarget);
		var jqGroup = jqButton.parentsUntil( e.data.groupParent ).parent().eq(0).find( e.data.groupList ).eq(0);
		
		//jqGroup.slideToggle();
		jqGroup.toggle();
		
		return false;
	}
};
	
	//m.slidePrevStack = [];
	//m.slideNextStack = [];
	
	$(window).bind("m.slidechanged");
	
	m.viewSlider = {
		prevStack : [],
		nextStack : [],
		currView : null,
		prevParam: null,
		moveBack: false,
		
		move : function(fromTarget, toTarget, oper, doNotPush){
			var jqFrom = $(fromTarget);	
			var jqTo = $(toTarget);
			var iScreenWidth  = $(window).width();
			var iLeftViewHeight = jqFrom.height();
			
			if ((jqFrom.get(0) === jqTo.get(0)) ||
				( (this.currView !== null) && (this.currView.get(0) === jqTo.get(0)) )
				){
				jqTo.trigger("m.sameslidefound", {
					target: this
				});
				
				//console.log("mobilebase.viewslide.move.sameslidefound");
				//console.log(jqTo);
				//console.log(jqFrom);
				return;
			}
			
			jqFrom.css({
				position: "relative",
				display: "block"
			});
			
			jqTo.css({
				position: "absolute",
				top: "0px",
				left: ((oper === "-")? "" : "-") + iScreenWidth + "px",
				display: "block",
				width: iScreenWidth + "px"
			});
			
			jqFrom.animate({
				left: oper + "=" + iScreenWidth + "px"
			}, {
				complete: function(){
					$(this).css({
						position: "absolute",
						display: "none"
					})
					.removeClass("active-view");
				}	
			});
			
			jqTo.animate({
				left: oper + "=" + iScreenWidth + "px"
			}, {
				complete: function(){
					$(this).css({
						position: "relative",
						width: "100%"
					})
					.addClass("active-view");
					jqTo.trigger("m.slidechanged", {
						target: this
					});
					window.scrollTo(0, 0);
				}
			});
			
			try{
				if (oper === "-"){
					if (doNotPush !== true){
						this.prevStack.push( jqFrom );
					}
					//if (doNotPop !== true) m.slideNextStack.pop();
				}
				else{
					if (doNotPush !== true){
						this.nextStack.push( jqFrom );
					}
					//if (doNotPop !== true) m.slidePrevStack.pop();
				}
			}
			catch(e){}
			
			this.currView = jqTo;
			
			//console.log("mobilebase.viewslide.move");
			//console.log(jqTo);
			//console.log(jqFrom);
		},
		change : function(toTarget, isMoveRight, doNotPush){
			this.move( $(".active-view"), toTarget, (isMoveRight === true)? "+" : "-", doNotPush );
		},
		left : function(fromTarget, toTarget, doNotPush){
			if (this.moveBack === true){
				this.right(fromTarget, toTarget, doNotPush);
				this.moveBack = false;
			}
			else{
				if (toTarget !== undefined){
					this.move(fromTarget, toTarget, "-");
				}
				else{
					this.move( $(".active-view"), fromTarget, "-", doNotPush);
				}
			}

			this.nextStack.pop();
		},
		right : function(fromTarget, toTarget){
			if (toTarget !== undefined){
				this.move(fromTarget, toTarget, "+");
			}
			else{
				this.move( $(".active-view"), fromTarget, "+");
			}
			this.prevStack.pop();
		},
		pass : function(fromTarget, toTarget){
			if (toTarget !== undefined){
				this.move(fromTarget, toTarget, "-", true);
			}
			else{
				this.move( $(".active-view"), fromTarget, "-", true);
			}
			this.nextStack.pop();
		},
		prev : function(){
			try{
				if (this.prevParam !== null){
					m.vm.doClickBoard(this.prevParam);
					this.prevStack.pop();
					this.prevParam = null;
				}
				else{
					var jqPop = this.prevStack.pop();
			
					if ((jqPop !== undefined) && (jqPop.length > 0)){
						this.move( ".active-view", jqPop, "+" );
					}
				}
			}
			catch(e){}
		},
		push: function(arg){
			if (arg instanceof jQuery){
				this.prevStack.push( arg );
			}
			else{
				this.prevParam = arg;
			}
		}
	};
	
	
	m.slideMove = function(fromTarget, toTarget, oper, doNotPush){
		m.viewSlider.move(fromTarget, toTarget, oper, doNotPush);
	},
	m.slideLeft = function(fromTarget, toTarget){
		m.viewSlider.left(fromTarget, toTarget);
	};
	m.slideRight = function(fromTarget, toTarget){
		m.viewSlider.right(fromTarget, toTarget);
	};
	m.slidePrev = function(){
		m.viewSlider.prev();
	};
	// 화면 슬라이드 애니메이션 기능 [종료]
	
	// Sammy 기능 구현 [시작]
	 
	// Sammy 기능 구현 [종료]
	
	// 공통 유틸 기능[시작]
	m.timer = function(time, callback){
		//var m._timer = m._timer || {};
		
		var timerId = setTimeout(function(){
			callback();
			clearTimeout( timerId );
		}, time);
	};
	
	m.parseParam = function(href){
		var mParam = {};
		try{
			var saHrefRight = href.split("#")[1].split("/");
			var iLen = saHrefRight.length;
			
			if (iLen > 0) 	mParam.view_type = saHrefRight[0];
			if (iLen > 1) 	mParam.name = saHrefRight[1];
			if (iLen > 2) 	mParam.bbsId = saHrefRight[2];
			if (iLen > 3) 	mParam.subId = saHrefRight[3];
			if (iLen > 4) 	mParam.keyword = saHrefRight[4];
		}
		catch(e){}
		
		return mParam;
	};
	
	m.serializeMap = function( jqElem, arrToOneStr, delimiter ){
    	var mData = {};
    	var jqInput = null;
    	var sName = "";
    	var sValue = "";
    	var sType = "";
    	var sTmp = "";
    	var isArrToOneStr = $.isArray(arrToOneStr);
    	var sDelimiter = delimiter || ",";
    	
    	jqElem.find("input[type!='button'][type!='submit'][type!='image'], select, textarea").each(function(index){
    		jqInput = $(this);
    		
    		if (jqInput.attr("disabled") !== undefined) return;
    		
    		sType = jqInput.attr("type");
    		
    		sName = jqInput.attr("name");
    		sValue = jqInput.val();
    		
    		if (mData.hasOwnProperty( sName ) === false){
    			if ((sType === "checkbox") || (sType === "radio")){
    				if (this.checked === true){
    					mData[ sName ] = sValue;
    				}
    			}
    			else{
    				mData[ sName ] = sValue;
    			}
    		}
    		else{
    			if (isArrToOneStr === true){
    				if (arrToOneStr.indexOf( sName ) >= 0){
    					mData[ sName ] = mData[ sName ] + sDelimiter + sValue;
    				}
    			}
    			else{
    				if ($.isArray(mData[ sName ]) === false){
	    				sTmp = mData[ sName ];
	    				mData[ sName ] = [];
	    				mData[ sName ][0] = sTmp;
	    			}
	    			mData[ sName ][ mData[ sName ].length ] = sValue;
    			}
    		}
    	});
    	
    	return mData;
	};
	
	m.serializeMapByCheckedItem = function( jqElem, arrToOneStr, delimiter, targetCheckBoxName, targetItem ){
    	var mData = {};
    	var jqInput = null;
    	var sName = "";
    	var sValue = "";
    	var sType = "";
    	var sTmp = "";
    	var isArrToOneStr = $.isArray(arrToOneStr);
    	var sDelimiter = delimiter || ",";
    	var jqItemList = jqElem.find("[name='" + targetCheckBoxName + "']:checked");
    	var jqItem = null;
    	
    	jqItemList.each(function(){
    		jqItem = $(this).parentsUntil( targetItem ).parent().eq(0);
    		
    		jqItem.find("input[type!='button'][type!='submit'][type!='image'], select, textarea").each(function(index){
	    		jqInput = $(this);
	    		
	    		if (jqInput.attr("disabled") !== undefined) return;
	    		
	    		sType = jqInput.attr("type");
	    		
	    		sName = jqInput.attr("name");
	    		sValue = jqInput.val();
	    		
	    		if (mData.hasOwnProperty( sName ) === false){
	    			if ((sType === "checkbox") || (sType === "radio")){
	    				if (this.checked === true){
	    					mData[ sName ] = sValue;
	    				}
	    			}
	    			else{
	    				mData[ sName ] = sValue;
	    			}
	    		}
	    		else{
	    			if (isArrToOneStr === true){
	    				if (arrToOneStr.indexOf( sName ) >= 0){
	    					mData[ sName ] = mData[ sName ] + sDelimiter + sValue;
	    				}
	    			}
	    			else{
	    				if ($.isArray(mData[ sName ]) === false){
		    				sTmp = mData[ sName ];
		    				mData[ sName ] = [];
		    				mData[ sName ][0] = sTmp;
		    			}
		    			mData[ sName ][ mData[ sName ].length ] = sValue;
	    			}
	    		}
	    	});
    	});
    	
    	
    	
    	return mData;
	};
	
	m.mergePhoneInfo = function(arr){
		var iLen = arr.length;
		var sPhone = "";
		
		if (iLen > 0){
			sPhone = arr[0];
		}
		if ((iLen > 1) && ( $.isNumeric( arr[1] ) )){
			sPhone += "-" + arr[1];
		}
		if ((iLen > 2) && ( $.isNumeric( arr[2] ) )){
			sPhone += "-" + arr[2];
		}
		
		return sPhone;
	};
		
	m._domain = "";
	m.getDomain = function(){
		if (m._domain === ""){
			m._domain = document.location.href.match(/http[s]*:\/\/([a-zA-Z0-9\-\.]*)/)[1];
		}
		return m._domain;
	};
   
	m.cookie = {
		set: function(name, value, expirehours, domain) {
	        var today = new Date();
	        today.setTime(today.getTime() + (60*60*1000*expirehours));
	        document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + today.toGMTString() + ";";
	        if (domain) {
	            document.cookie += "domain=" + domain + ";";
	        }
	   },
	   get: function(name){
		    var find_sw = false;
		    var start, end;
		    var i = 0;
		    var sTmp = unescape(document.cookie);
		
		    for (i=0; i<= sTmp.length; i++)
		    {
		        start = i;
		        end = start + name.length;
		
		        if(sTmp.substring(start, end) == name) {
		            find_sw = true;
		            break;
		        }
		    }
		
		    if (find_sw == true){
		        start = end + 1;
		        end = sTmp.indexOf(";", start);
		
		        if(end < start){
		            end = sTmp.length;
		        }
		
		        return sTmp.substring(start, end);
		    }
		    return "";
		},
		remove: function(name){
	        var today = new Date();
	
	        today.setTime(today.getTime() - 1);
	        var value = m.cookie.get(name);
	        if(value != ""){
	        	document.cookie = name + "=" + value + "; path=/; expires=" + today.toGMTString();
	        }
	            
	    }
	};
    	
	m.toast = function(message, showDelay){
		var jqToast = $("#toast_message");// 요소는 footer에 위치 하고 있음
		var iShowDelay = showDelay || 1500;
		var iFadeDelay = 500;
		
		jqToast.text(message);
		jqToast.stop().fadeIn(iFadeDelay).delay(iShowDelay).fadeOut(iFadeDelay);
		/*m.timer(iFadeDelay + iShowDelay, function(){
			jqToast.fadeOut(iFadeDelay);
		});
		*/
	};
	
	m.showModalLoginNeed = function(){
		var jqModal = $("#modal_loginNeed");
		
		jqModal.modal("show");
	};
	
	m.isGingerbread = function(){
		if (m._isGingerbread === undefined){
			var sUserAgent = navigator.userAgent;
	      	
	      	m._isGingerbread = sUserAgent.indexOf( "Android 2.3" ) > -1;
		}
		
		return m._isGingerbread;
    };
	
	m.img = {
		none: "/mobile/images/none.png"
	};
	
	(function($, sammy){
		m.sammy = sammy(function(){
			this.prevStack = [];
			this.position = -1;
			
			this.evt_urichange = null;
			this.urichange = function(callback){
				this.evt_urichange = callback;
			};
			this.onURIChange = function(params){
				try{
					params.isBack = false;
					this.evt_urichange(params);
				}
				catch(e){
					console.log(e);
					console.log("onURIChange 실패! 재시도~");
					var self = this;
					
					setTimeout(function(){
						self.onURIChange(params);
					}, 500);
				}
			};
			
			/*this.evt_backdetect = null;
			this.backdetect = function(callback){
				this.evt_backdetect = callback;
			};*/
			this.onBackDetect = function(params){
				try{
					console.log("backdetecting !!");
					m.viewSlider.moveBack = true;
					this.evt_urichange(params);
				}
				catch(e){}
			};
			
			
			
			this.get("#/:view_type/:name/:bbsId", function(context){
				context.app.applyParams(context.params);
			});
			this.get("#:view_type", function(context){
				context.app.applyParams(context.params);
			});
			this.get("#:view_type//", function(context){
				context.app.applyParams(context.params);
			});
			this.get("#:view_type/:name", function(context){
				context.app.applyParams(context.params);
			});
			this.get("#:view_type/:name/:bbsId", function(context){
				console.log("view_type|name|bbsId");
				console.log(context.params);
				context.app.applyParams(context.params);
			});
			this.get("#:view_type/:name/:bbsId/:subId", function(context){
				context.app.applyParams(context.params);
			});
			this.get("#:view_type/:name/:bbsId/:subId/:keyword", function(context){
				context.app.applyParams(context.params);
			});
			this.get("#:view_type/:name/:bbsId//:keyword", function(context){
				context.app.applyParams(context.params);
			});
			this.get("#:view_type/:name//:subId/:keyword", function(context){
				context.app.applyParams(context.params);
			});
			
			this.get("#:view_type/:name/:bbsId/:subId/:keyword/:keyword2", function(context){
				context.app.applyParams(context.params);
			});
			this.get("#:view_type/:name/:bbsId//:keyword/:keyword2", function(context){
				context.app.applyParams(context.params);
			});
			this.get("#:view_type/:name//:subId/:keyword/:keyword2", function(context){
				context.app.applyParams(context.params);
			});
			this.get("#:view_type/:name/:bbsId/:subId/:keyword/:keyword2", function(context){
				context.app.applyParams(context.params);
			});
			
			this.get("#:view_type////:stx", function(context){
				context.app.applyParams(context.params);
			});
			
			this.applyParams = function(params){
				m.sammy.params = params;
				if (this.isPrev(params) === true){
					this.backUsed = true;
					this.onBackDetect(params);
					
					if (this.position > 0){
						this.position--;
					}
					
					this.prevStack.pop();
				}
				else{
					this.position++;
					this.onURIChange(params);
					//this.prevStack
					this.prevStack.push(params);
				}
				console.log("position: " + this.position);
				console.log("length: " + this.prevStack.length);
			};
			
			this.isPrev = function(params){
				var iLen = 0;
				var mPrevParams = null;
				var bRet = true;
				var iLocVal = 2;
				
				try{
					iLen = this.prevStack.length;
				
					if (iLen > 0){
						mPrevParams = this.prevStack[ /*this.position +*/ iLen - 2 ];
						
						for(var prop in params){
							if (params[prop] !== mPrevParams[prop]){
								bRet = false;
								break;
							}
						}
					}
					else{
						bRet = false;
					}
				
				}
				catch(e){
					return false;
				}

				return bRet;
			};
			
			if (m.isGingerbread() === true){
				this.disable_push_state = true;
			}
		});
		
		$(function(){
			if ((m.view_type !== "main") && (m.view_type !== "home")){
				m.sammy.run( m.uri );
				console.log(m.uri);
			}
			else{
				m.sammy.run("#home");
			}
		});
	})(jQuery, sammy);
	
	// 공통 유틸 기능[종료]
	
	m.BaseViewModel = function(pmid, pkword){
	
	};
	m.BaseViewModel.prototype = {
		numberFormat : function(num) {
			var pattern = /(-?[0-9]+)([0-9]{3})/;
			var sNum = num + "";
			
			while(pattern.test(sNum)) {
				sNum = sNum.replace(pattern,"$1,$2");
			}
			return sNum;
		},
		cutDate : function(dateTime){
			return dateTime.split(" ")[0];
		},
		dcRate : function(price, sugPrice){
			var iSugPrice = parseInt( sugPrice );
			var iPrice = parseInt( price );
			return Math.floor( ((iSugPrice - iPrice) / iSugPrice) * 100 );
		},
		earnRate : function(price, resPrice){
			var iResPrice = parseInt( resPrice );
			var iPrice = parseInt( price );
			return Math.floor( ((iResPrice / iPrice) * 100) );
		},
		dateFormat : function(date){
			return $.dateFormat( date );
		},
				
		callMethod : function(ctrlName, methodName, params){
			//console.log( this[ctrlName] );
		},
		
		createTreeItem: function(list, selfKey, parentKey, instanceClass){
			var aTreeData = [];
			var mTreeInfo = {};
			var mItem = null;
			var mParentItem = null;
			var iLen = list.length;
			var iParentIndex = 0;
			var sPaCaId = "";
			var sCaId = "";
			
			if (instanceClass){
				for(var i = 0; i < iLen; i++){
					mItem = list[i];
					sCaId = mItem[ selfKey ];
					sPaCaId = mItem[ parentKey ];
					
					if (sCaId === sPaCaId){
						aTreeData.push( new instanceClass(mItem) );
						mTreeInfo[ sCaId ] = iParentIndex;
						iParentIndex++;
					}
					else{
						mParentItem = aTreeData[ mTreeInfo[ sPaCaId ] ];
						if (mItem.it_type === "0"){
							mParentItem.book = mParentItem.book || [];
							mParentItem.book.push( new instanceClass(mItem) );
						}
						else{
							mParentItem.mock = mParentItem.mock || [];
							mParentItem.mock.push( new instanceClass(mItem) );
						}
					}
				}
			}
			else{
				for(var i = 0; i < iLen; i++){
					mItem = list[i];
					sCaId = mItem[ selfKey ];
					sPaCaId = mItem[ parentKey ];
					
					if (sCaId === sPaCaId){
						aTreeData.push( mItem );
						mTreeInfo[ sCaId ] = iParentIndex;
						iParentIndex++;
					}
					else{
						mParentItem = aTreeData[ mTreeInfo[ sPaCaId ] ];
						if (mItem.it_type === "0"){
							mParentItem.book = mParentItem.book || [];
							mParentItem.book.push( mItem );
						}
						else{
							mParentItem.mock = mParentItem.mock || [];
							mParentItem.mock.push( mItem );
						}
					}
				}
			}
			
			
			
			console.log(aTreeData);
			
			return aTreeData;
		},
		
		showLoadingModal: function(){
			var jqModal = $("#modal_loading");
			var jqNowLoading = jqModal.find(".now-loading");
			var jqBtnRefresh = jqModal.find(".btn-refresh");
			
			jqBtnRefresh.get(0).onclick = this.onRefreshClick;
			
			jqBtnRefresh.hide();
			jqNowLoading.show();
			jqModal.show();
			
			jqNowLoading.delay(15000).fadeOut(function(){
				jqBtnRefresh.fadeIn();
			});
		},
		hideLoadingModal: function(){
			var jqModal = $("#modal_loading");
			
			jqModal.hide();
		},
		onRefreshClick: function(data, event){
			location.reload(true);
		},
		
		onPopupOpenerClick: function(data, event){
			var jqOpener = $(event.currentTarget);
			
			m.vm.showPopup(jqOpener.data("title"), jqOpener.find(".non-display").html());
		},
		showPopup: function(title, html){
			var jqModal = $("#modal_popup");
			
			//jqModal.find(".modal-title").text( title );
			//jqModal.find(".message").html( html );
			jqModal.modal("show");
		},
		
		evt_clickboard: null,
		clickboard: function(callback){
			this.evt_clickboard = callback;
		},
		onClickBoard : function(data, event){
			var sHref = $(event.currentTarget).attr("href");
			var mParam = m.parseParam(sHref);
			
			m.vm.doClickBoard( mParam );
		},
		doClickBoard: function(mParam){
			//console.log("mobilebase.doClickBoard:::");
			//console.log(mParam);
			this.evt_clickboard( mParam );
		}
	};
	/*
	$(function(){
		var jqLoading = $(".loading-area img");
		var deg = 360;
	
		function loadingRotate(){
			jqLoading.css({
				"-webkit-transform": "rotate(" + deg + "deg)",
				"transform": "rotate(" + deg + "deg)"
			});
			deg -= 45;
			deg = deg % 360;
			setTimeout(loadingRotate, 200);
		}
		loadingRotate();
	});
	*/
})($, window.m);
});