// Define the namespace
window.m = window.m || {};
define(["jquery","carousel", "knockout", "knockoututils", "json2.min", "bootstrap", "mobilebase"], function($, carousel, ko, koutil, json, bootstrap, mobilebase) {
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

	"004005001" : { "name": "독학사1단계 기본서", "lec_cate": "005001" },

	"004005002" : { "name": "독학사1단계 문제집", "lec_cate": "005001" },

	"007001" : { "name": "학점인정", "lec_cate": "005002" },

	"007001001" : { "name": "~ 10학점", "lec_cate": "005002" },

	"007001002" : { "name": "30학점 이상", "lec_cate": "005002" },

	"007001003" : { "name": "~20학점", "lec_cate": "005002" },

	"008001020" : { "name": "농협인적성", "lec_cate": "004001" },

	"008002001" : { "name": "최신 이슈&상식(월간지)", "lec_cate": "004005" },

	"008002002" : { "name": "일반상식", "lec_cate": "004006" },

	"008003002" : { "name": "날아라 스튜어디스", "lec_cate": "004004" }

};

	m.NavModel = function(pmid, pkword) {
		var self = this;
		
		self.category = ko.observableArray();
		
		self.nav = {
			hasMyMenuShowed : false,
			hasGnbShowed : false,
			selectedIndex : 0,
			selected : new m.NavModelData(),
			init : function(){
				$("#accordion_navCategory>li>a").addClass("collapsed");
				//$("#accordion_navCategory>li>ul>li>a").click(self.nav.showSub);
				$("#list_navCategorySub>li>a").click(self.nav.hideSub);
				
				$("body").append( $("<div id=\"wrap_modal\"></div>")
					.click(function(){
						self.nav.hide();
						self.nav.hideMyMenu();
						
						return false;
					})                                                
				);
				$("#button_navbarOpener").click(self.nav.show);
				$("#nav_category .close").click(self.nav.hide);
				$("#button_myMenuOpener").click(function(){
					if (self.nav.hasMyMenuShowed === true){
						self.nav.hideMyMenu();
					}
					else if (self.nav.hasGnbShowed === true){
						self.nav.hide();
						self.nav.showMyMenu();
						
					}
					else{
						self.nav.showMyMenu();
					}
					
					return false;
				});
				$("#nav_myMenu .close").click(self.nav.hideMyMenu);
				$("#accordion_navCategory").on("shown.bs.collapse", function(event){
					var jqTarget = $(event.target);
					self.nav.selectedIndex = parseInt( jqTarget.data("index") );
					//var jqSelected = jqAccodion.find(".")
					//console.log(event);
				});
				

			},
			show : function(){
				self.nav.showModalBackground();
				$("#nav_category").animate({
					left: "+=280px"
				},function(){
					$("#nav_category").css({
						"box-shadow": "5px 5px 10px #333"
					});
					self.nav.hasGnbShowed = true;
				});
				return false;
			},
			hide : function(){
				self.nav.hideModalBackground();
				$("#nav_category").animate({
					left: "-280px"
				},function(){
					$("#nav_category").css({
						"box-shadow": "none"
					});
					self.nav.hasGnbShowed = false;
				});
				return false;
			},
			showSub : function(data, event){
				var jqItem = $(this);
				var mParam = m.parseParam( jqItem.attr("href") );
				
				self.nav.showNavByParam(mParam);
				return false;
			},
			showNavByParam: function(param){
				if (param.name === "category"){
					var obsCat = self.category()[ parseInt(param.bbsId) ].sub_cat()[ parseInt(param.subId) ];
					var obsarrSubCat = obsCat.sub_cat();
				
					self.nav.selected.cat_id( obsCat.cat_id() );
					self.nav.selected.cat_name( obsCat.cat_name() );
					self.nav.selected.sub_cat.removeAll();
					//console.log( self.category()[  );
					
					$.map(obsarrSubCat, function(item, index){
						var sCatId = item.cat_id();
						
						if ( m.lecCateInfo[ sCatId ] !== undefined ){
							item.lec_cat_id = m.lecCateInfo[ sCatId ].lec_cate;
						}
						else{
							item.lec_cat_id = "";
						}
						self.nav.selected.sub_cat.push( item );
					});
					
					//self.nav.selected.sub_cat( self.category()[ self.nav.selectedIndex ].sub_cat());
					
					$(".nav-category").animate({
						"left": "-=280px"
					});
				}
			},
			hideSub : function(){
				$(".nav-category").animate({
					"left": "+=280px"
				});
				return false;
			},
			showMyMenu : function(){
				self.nav.showModalBackground();
				$("#nav_myMenu").animate({
					left: "+=280px"
				},function(){
					$("#nav_myMenu").css({
						"box-shadow": "5px 5px 10px #333"
					});
					self.nav.hasMyMenuShowed = true;
				});
				return false;
			},
			hideMyMenu : function(){
				self.nav.hideModalBackground();
				$("#nav_myMenu").animate({
					left: "-280px"
				},function(){
					$("#nav_myMenu").css({
						"box-shadow": "none"
					});
					self.nav.hasMyMenuShowed = false;
				});
				return false;
			},
			
			showModalBackground : function(){
				$("#wrap_modal").fadeIn();
			},
			hideModalBackground : function(){
				$("#wrap_modal").fadeOut();
			},
			
			setData : function(data){
				var mFilterTarget = {
					"009" : "",
					"010" : "", 
					"011" : "", 
					"012" : "", 
					"013" : ""
				};
				
				$.map( m.convertToNavModelDataArray(data), function(item, index){
					if ( mFilterTarget.hasOwnProperty( item.cat_id() ) === true ){
						return;
					}
					self.category.push( item );
				} );
				
				self.nav.init();
			}
		};
	};
	
	m.NavModel.prototype = new m.BaseViewModel();
	m.NavModel.prototype.constructor = m.NavModel;
	
	m.NavModelData = function(item){
		var self = this;
		
		if (item){
			self.cat_id = ko.observable(item.cat_id);
			self.cat_name = ko.observable(item.cat_name);
			self.sub_cat = ko.observableArray( m.convertToNavModelDataArray( item.sub_cat ) );
		}
		else{
			self.cat_id = ko.observable("");
			self.cat_name = ko.observable("");
			self.sub_cat = ko.observableArray();
		}
	};
	
	m.convertToNavModelDataArray = function(data){
		var arr = [];
		var i = 0;
		
		if (data){
			for(var d in data){
				arr[ i ] = new m.NavModelData( data[ d ] );
				i++;
			}
		}
		
		return arr;
	};
	
});












