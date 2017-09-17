<?
include_once("./_common.php");
$g4['title'] = "●시대에듀-내강의실";
$navi = " > 모바일 홈>내강의실 ";


if (!trim($member[mb_id]) || $member[mb_level]<2 ) alert("로그온이 필요합니다.($mb_id, $mb[mb_level])", '/mobile/');


	
		
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <? include_once("../common_php/common_header.php");?>
    
    <!-- basic styles -->
    <? include_once("../common_php/common_css.php");?>
    
    <link href="<?=$mobilehome?>/stylesheets/gnb_sprite.css" rel="stylesheet" />
    <style type="text/css" style="display: none !important;">
    #logindiv {display:<? if(!$member[mb_id]){ ?>block; <? }else{?>none; <? }?>}
    .logoutdiv {display:<? if(!$member[mb_id]){ ?>none; <? }else{?>block; <? }?> }
    </style>
    
    <script data-main="/mobile/js/app/min/mystudy.min" src="/mobile/js/lib/require.js"></script>
</head>
<body>
    <!-- Fixed navbar -->
    <? include_once("../common_php/common_nav.php");?>
    
    <!-- Begin page content -->
    <div class="container">
		
        
        <div id="logindiv">
                <form class="form-inline" role="form">
                    <div class="form-group"><input name=varid data-bind="value: mid" placeholder="아이디" class="form-control" focus /></div>
                    <div class="form-group"><input name=varpw type="password" data-bind="value: mpw" placeholder="비밀번호" class="form-control" /></div>
                    <div class="form-group"><input name=adm_password type="password" data-bind="value: madmpw" placeholder="관리자 비밀번호" class="form-control" /></div>
                    <div class="checkbox"><label><input type="checkbox" data-bind="value: mrememberid"> 아이디 저장</label></div>
                    <button type="button" class="btn btn-xs btn-success" data-bind="click: loginme">로그인</button>
                </form>
        </div>
        
        <div class="page-header">
	        <h1>Sticky footer with fixed navbar</h1>
        </div>
        <div>
        
        </div>
    </div>
    
   <!--pre !data-bind="text: ko.toJSON($root, null, 2)"></pre-->
   
   
   
   
   
   
   
   
   
    <? include_once("../common_php/common_footer.php");?>
    <? //include_once("./common_php/common_js.php");?>	
    
    <script>
	
	
    </script>
	
	</body>
</html>
    