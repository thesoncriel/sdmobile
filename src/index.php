<?
include_once("./_common.php");
require_once '../Mobile_Detect.php';
$detect = new Mobile_Detect;
//if( !$detect->isMobile() ) goto_url("/");

$g4['title'] = "●시대에듀";
$navi = " > 모바일 홈 ";
$offset = 60 * 15;
 // 실서버 시간이 9시간 정도 늦음 + 15분 유효기간 설정
//header("Expires: " . gmdate("D, d M Y H:i:s", time() + $offset + (3600 * 9)) . " GMT");
//header("Cache-Control: max-age=$offset, must-revalidate");
//header("Pragma: cache");

set_session("tomobile", "");
//if(!isset($_COOKIE['site'])) 
setCookie('site', 'mobile', 0,'mobile');


include_once "./item/_search.php"; // 기본검색 모듈-포털 키워드 연동시 바로 처리(화면로딩 후 다시 호출하는 것보다 빠르게 처리)

// 내강의실 코드 추가 - 2014.07.25 by jhssa [시작]
$ios_agent = '/(iPod|iPhone|iPad)/';
$android_agent = '/(Android)/';
$view_type = "main";
$name = "";
$bbsId = "";
$stx = "";
$cat_id = "";
$it_type = "";
$gal3 = '/(SHV-E210S)/';


if ($_GET['view_type']){
	$view_type = $_GET['view_type'];
}
if ($_GET['name']){
	$name = $_GET['name'];
}
if ($_GET['bbsId']){
	$bbsId = $_GET['bbsId'];
}
if ($_GET['stx']){
	$stx = $_GET['stx'];
}
if ($stx != ""){
	$view_type = "contents";
	$name = "lec";
}
$cat_id = $_GET['cat_id'];
$it_type = $_GET['it_type'];


if(preg_match($ios_agent, $_SERVER['HTTP_USER_AGENT'])) {
    $type='ios';
} else if(preg_match($android_agent, $_SERVER['HTTP_USER_AGENT'])){
    $type='android';
} 

if(preg_match($gal3, $_SERVER['HTTP_USER_AGENT'])){
	$gal3 = true;
}else{
	$gal3 = false;
}

$mobilehome = "http://css.sdedu.co.kr/mobile";
$jshome = "http://js.sdedu.co.kr/mobile/js";

// 내강의실 코드 추가 - 2014.07.25 by jhssa [종료]
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <? include_once("./common_php/common_header.php");?>
    
    <!-- basic styles -->
    <? include_once("./common_php/common_css.php");?>
   
    <?// owl caroulse 기능으로 인한 추가 - 2014.07.07 by jhson ?>
	<link href="<?=$mobilehome?>/css/owl.carousel.min.css" rel="stylesheet" />
	<link href="<?=$mobilehome?>/css/owl.theme.min.css" rel="stylesheet" />
	<link href="<?=$mobilehome?>/css/main.min.css" rel="stylesheet" />
	<link rel="stylesheet" type="text/css" href="/mobile/css/autocomplete.min.css"/>
	<link href="<?=$mobilehome?>/css/contents.min.css" rel="stylesheet" />
	
	<link href="<?=$mobilehome?>/css/order.min.css" rel="stylesheet" />
    <script data-main="<?=$jshome?>/app/min/mobile_app.min" src="<?=$jshome?>/lib/min/require.min.js"></script>
    <? //브라우져 체크하는 스크립트 추가 2014 08 08 ssajae?>
	<script type="text/javascript" src="<?=$jshome?>/lib/min/css_browser_selector.min.js"></script>
</head>
<body>	
    <!-- Fixed navbar -->
    <div class="container-first"></div>
    <? include_once("./common_php/common_nav.php");?>

    <div id="container_main">
    <? include_once("./common_php/common_autocomplete.php");?>
    <!--<div class="loading-area"><img src="/mobile/images/loading_126x126.png"/></div>-->
    <? if($member['mb_id']=='sd_qkdnsjel') echo $gal3 ?>
    <? include_once("./main.php");?>
    <? include_once("./contents/list.php");?>
    <? include_once("./contents/detail.php");?>
    <? include_once("./contents/freelec.php");?>
    <? include_once("./board/list.php");?>
    <? include_once("./board/detail.php");?>
    <? include_once("./board/edit.php");?>
	    <div id="container_orderView" class="<?= ($name == "cartlist")? "active-view" : "non-display"?>">
		<? include_once("./order/order00_cart.php");?>
		<? include_once("./order/order01_info.php");?>
	    </div>
	<? include_once("./member/login.php");?>
	<? include_once("./member/findidpw.php");?>
	<? include_once("./member/join.php");?>
	<? include_once("./member/update.php");?>
	<? if($_SERVER['REMOTE_ADDR'] == '58.76.45.204') {?>
	
	<? } ?>
	<? if($member['mb_id'] == 'sd_yotimer') {?>
	<? } else { ?>
	<? } ?>
	<? include_once("./order/mybook_list.php");?>
	<? include_once("./order/myorder_list.php");?>
	<? include_once("./mypage/mypage_lecture.php");?>
	<? include_once("./mypage/coupon.php");?>
	<? include_once("./doc/_doc.php");?>
	<? include_once("./common_php/common_view.php");?>
	</div><!-- #container_main :::::: -->

    <? //$main = "main";
    	include_once("./common_php/common_footer.php");?>
    <? //include_once("./common_php/common_popup.php");?>
    
    <? include_once("./common_php/common_js.php");?>	
    <script>
		window.m = window.m || {};
		window.m.mb_name = "<?=$member[mb_name]?>";
		window.m.mb_id = "<?=$member[mb_id]?>";
		window.m.clientip = "<?=$_SERVER['REMOTE_ADDR']?>";
		window.m.mb_level = <?=$member[mb_level]?>;
		window.m.web_param = {
			view_type : "<?=$view_type?>",
			name: "<?=$name?>",
			bbsId: "<?=$bbsId?>",
			stx: "<?=$stx?>",
			cat_id: "<?=$cat_id?>",
			it_type: "<?=$it_type?>"
		};
		window.m.uri = "#<?=$view_type?>/<?=$name?>/<?=$bbsId?>";
		//document.location.hash = "#<?=$view_type?>/<?=$name?>/<?=$bbsId?>";
	
		setTimeout(function(){
			var elemSpan = document.getElementById("span_nowLoading");
			var elemRefresh = document.getElementById("button_docRefresh");
			
			elemSpan.style.display = "none";
			elemRefresh.style.display = "inline-block";
		}, 15000);
    </script>
	
	</body>
</html>
    