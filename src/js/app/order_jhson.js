
$(function(){
	// 장바구니에서 각 구입 목록을 열고 닫아주는 기능 - 2014.06.16 bu jhson [시작]
	var jqCollapsible = $(".collapsible");
	
	jqCollapsible.find("*[data-action='collapse']").click(function(){
		var jqButton = $(this);
		var jqIcon = jqButton.find("i");
		
		jqIcon.toggleClass("icon-chevron-down");
		jqIcon.toggleClass("icon-chevron-up");
		/*
		if (jqIcon.hasClass("icon-chevron-down") === true){
			jqIcon.addClass("icon-chevron-up");
			jqIcon.removeClass("icon-chevron-down");
		}
		else{
			jqIcon.addClass("icon-chevron-down");
			jqIcon.removeClass("icon-chevron-up");
		}
		*/
		jqButton.parentsUntil(".collapsible").parent()
				.find(".collapsible-body").toggle(0, function(){
					
				});
	});
	// 장바구니에서 각 구입 목록을 열고 닫아주는 기능 - 2014.06.16 bu jhson [종료]
	
	// 장바구니에서 전체선택 시 아래의 모든 아이템 선택/해제 하는 기능
	$("#checkbox_selectAllCartItem").change(function(){
		var isChecked = $(this).get(0).checked;
		var jqCartItem = $(".checkbox_cartItem");
		
		jqCartItem.each(function(){
			this.checked = isChecked;
		}) 
	});
	
	// 스피너 생성 및 설정부
	$(".spinner_goodsQty").ace_spinner({
		min:1,
		max:99,
		step:1, 
		touch_spinner: true, 
		icon_up:'icon-caret-up', 
		icon_down:'icon-caret-down'
	}).change(function(){
		// TODO: 자릿수 쉼표 필요
		var jqWidgetBody = $(this).parentsUntil(".widget-body");
		jqWidgetBody.find(".total-goods-price").text(
			parseInt( jqWidgetBody.find(".goods-price").text().replace(",", "") ) *
			parseInt( $(this).val() )
		);
	});
	
	// 삭제하기 눌렀을 때 체크된 아이템들에 대하여 삭제 하는 기능.
	$("#button_deleteCartItem").click(function(){
		if (confirm("선택한 내용을 삭제 하시겠습니까?") === true){
			$(".item_cart").each(function(){
				var jqCheckbox = $(this).find("input[name='cart_item_checked']:checked");
				
				if (jqCheckbox.length > 0){
					$(this).fadeOut(300, function(){
						$(this).remove();
					});
				}
			});
		}
	});

	
	// 마크업에 설정된 연도부터 현재 까지 자동으로 만들어주는 기능 - 2014.06.13 by jhson [시작]
	var jqYearSelect = $("select[data-year-min]");
	
	if (jqYearSelect.length > 0){
		var iYearMin = parseInt( jqYearSelect.data("year-min") );
		var sOptionTags = "";
		var iNowYear = new Date().getFullYear();
		
		for(var i = iNowYear; i >= iYearMin; i--){
			sOptionTags += "<option value\"=" + i + "\">" + i + "</option>"
		}
		
		jqYearSelect.append( sOptionTags );
		
	}
	// 마크업에 설정된 연도부터 현재 까지 자동으로 만들어주는 기능 - 2014.06.13 by jhson [종료]
	
	// 주문,배송내역 검색 시 유효성 검사 [시작]
	$("#selector_searchRange label").click(function(){
		var jqThis = $(this);
		var jqForm = jqThis.parentsUntil("form").parent("form");
		var jqYearSelect = jqForm.find("select[data-year-min]");
		var elemCheckbox = jqThis.find("input").get(0);
		var jqSearchRange = null;
		
		if (jqYearSelect.val() === ""){
			if (elemCheckbox.checked === true){
				elemCheckbox.checked = false;
				return;
			}
			
			alert("연도를 선택 해 주십시오");
			return;
		}
		
		if (elemCheckbox.checked === true){
			jqThis.siblings().removeClass("btn-primary");
			jqThis.addClass("btn-primary");
			jqSearchRange = $(".search-range");
			jqSearchRange.text( jqThis.find("span").text() );
			
			// Ajax 이벤트 처리 부분
			// jqForm.submit()
		}
	});
	// 주문,배송내역 검색 시 유효성 검사 [종료]
});