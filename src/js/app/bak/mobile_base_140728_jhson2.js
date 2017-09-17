// Define the namespace
window.m = window.m || {};

define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "owlcarousel", "jqueryfinger"],
function($, carousel, ko, koutil, json, bootstrap, owlcarousel, jqueryfinger) {
// 화면 슬라이드 애니메이션 기능 [시작]
(function($, m){
	m.slidePrevStack = [];
	m.slideNextStack = [];
	
	$(window).bind("m.slidechanged");
	
	m.slideMove = function(fromTarget, toTarget, oper, doNotPop){
		var jqFrom = $(fromTarget);	
		var jqTo = $(toTarget);
		var iScreenWidth  = $(window).width();
		var iLeftViewHeight = jqFrom.height();
		
		if (jqFrom.get(0) === jqTo.get(0)){
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
				toTarget.trigger("m.slidechanged", {
					target: this
				});
				window.scrollTo(0, 0);
			}
		});
		
		try{
			if (oper === "-"){
				m.slidePrevStack.push( jqFrom );
				//if (doNotPop !== true) m.slideNextStack.pop();
			}
			else{
				m.slideNextStack.push( jqFrom );
				//if (doNotPop !== true) m.slidePrevStack.pop();
			}
		}
		catch(e){}
	},
	m.slideLeft = function(fromTarget, toTarget){
		m.slideMove(fromTarget, toTarget, "-");
		m.slideNextStack.pop();
	};
	m.slideRight = function(fromTarget, toTarget){
		m.slideMove(fromTarget, toTarget, "+");
		m.slidePrevStack.pop();
	};
	m.slidePrev = function(){
		try{
			var jqPop = m.slidePrevStack.pop();
		
			if ((jqPop !== undefined) && (jqPop.length > 0)){
				m.slideMove( ".active-view", jqPop, "+" );
			}
		}
		catch(e){}
	};
	// 화면 슬라이드 애니메이션 기능 [종료]
	
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
	
	m.serializeMap = function( jqElem ){
    	var mData = {};
    	var jqInput = null;
    	var sName = "";
    	var sValue = "";
    	var sType = "";
    	var sTmp = "";
    	
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
    			if ($.isArray(mData[ sName ]) === false){
    				sTmp = mData[ sName ];
    				mData[ sName ] = [];
    				mData[ sName ][0] = sTmp;
    			}
    			mData[ sName ][ mData[ sName ].length ] = sValue;
    		}
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
		
		    for (i=0; i<= document.cookie.length; i++)
		    {
		        start = i;
		        end = start + name.length;
		
		        if(document.cookie.substring(start, end) == name) {
		            find_sw = true;
		            break;
		        }
		    }
		
		    if (find_sw == true){
		        start = end + 1;
		        end = document.cookie.indexOf(";", start);
		
		        if(end < start){
		            end = document.cookie.length;
		        }
		
		        return document.cookie.substring(start, end);
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
	// 공통 유틸 기능[종료]
	
	m.BaseViewModel = function(pmid, pkword){
	
	};
	m.BaseViewModel.prototype = {
		// FIXME: 메인 결합 시 삭제. [시작]
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
		dateFormat : function(strDate){
			return strDate.substring(0, 4) + "-" + strDate.substring(4, 6) + "-" + strDate.substring(6, 8);
		},
				
		callMethod : function(ctrlName, methodName, params){
			//console.log( this[ctrlName] );
		},
		
		evt_clickboard: null,
		clickboard: function(callback){
			this.evt_clickboard = callback;
		},
		onClickBoard : function(data, event){
			var sHref = $(event.currentTarget).attr("href");
			var mParam = m.parseParam(sHref);
	
			m.vm.evt_clickboard( mParam );
		}
		
		// FIXME: 메인 결합 시 삭제. [종료]
	};
})($, window.m);
});