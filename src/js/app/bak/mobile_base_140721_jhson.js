// Define the namespace
window.m = window.m || {};

// 화면 슬라이드 애니메이션 기능 [시작]
(function(m){
	m.slidePrevStack = [];
	m.slideNextStack = [];
	
	$(window).bind("m.slidechanged")
	
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
				$(window).trigger("m.slidechanged", {
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
	}
	m.slidePrev = function(){
		try{
			var jqPop = m.slidePrevStack.pop();
		
			if ((jqPop !== undefined) && (jqPop.length > 0)){
				m.slideMove( ".active-view", jqPop, "+" );
			}
		}
		catch(e){}
	}
	$(window).on("m.slidechanged", function(empty, event){
		//console.log(empty);
		//console.log(event);
	});
	// 화면 슬라이드 애니메이션 기능 [종료]
	
	// 공통 유틸 기능[시작]
	m.timer = function(time, callback){
		//var m._timer = m._timer || {};
		
		var timerId = setTimeout(function(){
			callback();
			clearTimeout( timerId );
		}, time);
	}
	
	m.parseParam = function(href){
		var mParam = {};
		try{
			var saHrefRight = href.split("#")[1].split("/");
			var iLen = saHrefRight.length;
			
			if (iLen > 0) 	mParam.view_type = saHrefRight[0];
			if (iLen > 1) 	mParam.name = saHrefRight[1];
			if (iLen > 2) 	mParam.bbsId = saHrefRight[2];
		}
		catch(e){}
		
		return mParam;
	}
	// 공통 유틸 기능[종료]
})(window.m);


m.BaseViewModel = function(pmid, pkword){
	
}
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
}
