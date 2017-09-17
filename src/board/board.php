<?
include_once("./_common.php");
require_once '../../Mobile_Detect.php';
$detect = new Mobile_Detect;
//if( !$detect->isMobile() ) goto_url("/");

$g4['title'] = "●시대에듀";
$navi = " > 모바일 홈 ";

include_once "../item/_search.php"; // 기본검색 모듈-포털 키워드 연동시 바로 처리(화면로딩 후 다시 호출하는 것보다 빠르게 처리)


?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <? include_once("../common_php/common_header.php");?>
    
    <!-- basic styles -->
    <? include_once("../common_php/common_css.php");?>
    
    <link href="../stylesheets/gnb_sprite.css" rel="stylesheet" />
    
    <?// owl caroulse 기능으로 인한 추가 - 2014.07.07 by jhson ?>
	<link href="<?=$mobilehome?>/css/owl.carousel.css" rel="stylesheet" />
	<link href="<?=$mobilehome?>/css/owl.theme.css" rel="stylesheet" />
	<link href="<?=$mobilehome?>/css/contents_m.css" rel="stylesheet" />
    
    <style type="text/css" style="display: none !important;">
    #logindiv {display:<? if(!$member[mb_id]){ ?>block; <? }else{?>none; <? }?>}
    .logoutdiv {display:<? if(!$member[mb_id]){ ?>none; <? }else{?>block; <? }?> }
    </style>
    <? //include_once("./common_php/common_js.php");?>
    <script data-main="../js/app/board_app" src="../js/lib/require.js"></script>
</head>
<body>
    <!-- Fixed navbar -->
    <div class="container-first"></div>
    <? include_once("../common_php/common_nav.php");?>
    <div id="container_main">
    <? include_once("../board/list.php");?>
    <? include_once("../board/detail.php");?>
    <? include_once("../board/edit.php");?>
    </div>
       
    <? include_once("../common_php/common_footer.php");?>
    <? include_once("../common_php/common_js.php");?>
    
    <script>
    /*
		var require = {
			baseUrl : './js/min',
			paths:{
				'$': 'jquery-2.0.3.min',
			}
		};
		
    $(window).load(function(){
		
    });
            
    require([
        //'$',
        //'text!/sdb/subhtml/metaschema.html'
        "/sdb/subhtmljs/metaschema.js"
    ], function (metadatajs){
        //var $metadatalayer = $(metadatahtml);
        //$('#metadataschemalist').append($metadatalayer);
            
            //console.log(metadatahtml);
            
    }); //*/
    
    //require(["/sdb/subhtmljs/metaschema.js"]);

	//define(["jquery"], function($) {	
		window.m = window.m || {};
		//(function (m, $) {
			//$(document).ready(function(){
				//console.log("ready---"+"<?=$member[mb_name]?>");	
				window.m.mb_name = "<?=$member[mb_name]?>";
				window.m.mb_id = "<?=$member[mb_id]?>";
				//m.setMBdata(mb_name, mb_id);					
			//});
		//} (window.m, $));
	//});
    </script>
	
	</body>
</html>