<?
include_once("./_common.php");
$g4['title'] = "●시대에듀-장바구니";
$navi = " > 모바일 홈>장바구니 ";


if (!trim($member[mb_id]) || $member[mb_level]<2 ) alert("로그온이 필요합니다.($mb_id, $mb[mb_level])", '/mobile/');


	
		
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <? include_once("../common_php/common_header.php");?>
    
    <!-- basic styles -->
    <? include_once("../common_php/common_css.php");?>
    
    <link href="../stylesheets/gnb_sprite.css" rel="stylesheet" />
    <style type="text/css" style="display: none !important;">
    #logindiv {display:<? if(!$member[mb_id]){ ?>block; <? }else{?>none; <? }?>}
    .logoutdiv {display:<? if(!$member[mb_id]){ ?>none; <? }else{?>block; <? }?> }
    </style>
    <script data-main="/mobile/js/app/min/mycart.min" src="/mobile/js/lib/require.js"></script>
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
            <form class="form-inline" role="form" onSubmit="return false;" data-bind="submit: searchkword">
                <div class="form-group"><input name=varkword data-bind="value: skword, valueUpdate: 'afterkeydown'" placeholder="강의명 도서명 등 검색" class="form-control" focus required min="2" /></div>
                <!--button type="button" class="btn btn-xs btn-success" data-bind="click: searchkword">검색</button-->
                <h7 data-bind="if: searcheditems" >총 : <span  data-bind="text: $root.searcheditems().length "></span>건　
            </form>
            
            <div id="carousel_mainbanner" class="carousel slide" data-ride="carousel">
              <!-- Indicators -->
              <ol class="carousel-indicators" data-bind="foreach: mainbanner">
                <li data-target="#carousel_mainbanner" data-bind="attr { 'data-slide-to':i}" class="active" ></li>
              </ol>
            
              <!-- Wrapper for slides -->
              <div class="carousel-inner" data-bind="foreach: mainbanner">
                <div class="item">
                  <img data-bind="attr {src: bn_file} " src="/data/cm_shop/banner/banner_871_0.jpg">
                </div>
              </div>
            
              <!-- Controls -->
              <a class="left carousel-control" href="#carousel_mainbanner" data-slide="prev">
                <span class="glyphicon glyphicon-chevron-left"></span>
              </a>
              <a class="right carousel-control" href="#carousel_mainbanner" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right"></span>
              </a>
            </div>    
                    
            <ul data-bind="foreach: searcheditems">
                <li><button type="button" class="btn btn-success" data-bind="text: it_name">Success</button>
                </li>
            </ul>
        </div>
    </div>
    
   <!--pre !data-bind="text: ko.toJSON($root, null, 2)"></pre-->
   
   
   
   
   
   
   
   
   
    <? include_once("../common_php/common_footer.php");?>
    
    <script>
	
	
    </script>
	
	</body>
</html>
    