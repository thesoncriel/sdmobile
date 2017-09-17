window.m = window.m || {};

window.m.nav = {
	jqModalBack : null,
	jqAccordion : null,
	
	init : function(){
		$("#accordion_navCategory>li>a").addClass("collapsed");
		$("#accordion_navCategory>li>ul>li>a").click(m.nav.showSub);
		$("#list_navCategorySub>li>a").click(m.nav.hideSub);
		
		$("body").append( $("<div id=\"wrap_modal\"></div>")
			.click(m.nav.hide)
		);
		
		$("#button_navbarOpener").click(m.nav.show);
		$("#nav_category .close").click(m.nav.hide);
		
		$.getJSON("/mobile/mb/main.php", function(data){
			console.log(data);
		});
	},
	show : function(){
		$("#wrap_modal").fadeIn();
		$("#nav_category").animate({
			left: "0px"
		},function(){
			$("#nav_category").css({
				"box-shadow": "5px 5px 10px #333"
			});
		});
		return false;
	},
	hide : function(){
		$("#wrap_modal").fadeOut();
		$("#nav_category").animate({
			left: "-280px"
		},function(){
			$("#nav_category").css({
				"box-shadow": "none"
			});
		});
		return false;
	},
	showSub : function(){
		$(".nav-category").animate({
			"left": "-=280px"
		});
		return false;
	},
	hideSub : function(){
		$(".nav-category").animate({
			"left": "+=280px"
		});
		return false;
	}
}

$(function(){
	m.nav.init();
});
