<?PHP
	include_once("./_common.php");
	require_once '../../../../Mobile_Detect.php';
	$detect = new Mobile_Detect;  //https://github.com/serbanghita/Mobile-Detect/wiki/Code-examples 참조

    ////////////////////////////////////////////////////////////////////////////////////
 	//echo "fire=".
	$ARMcheck = $detect->is('SurfaceTablet'); //$ARMcheck = $detect->match('regex.*ARM'); //'SurfaceTablet'     => 'Windows NT [0-9.]+; ARM;',	
	if($ARMcheck || getUserAgent()=='ARM') // ARM 윈도우8은 지원되지 않습니다.
		alert_close("[윈도우8 ARM 코어는 동영상 재생이 지원되지 않습니다]. \\n\\n일반 윈도우 컴퓨터나 아이폰/안드로이드 모바일을 지원합니다.");
	
	if( $tb_idx=='' || $tb_idx == 'undefined' ) {
		$tbidxsql = " SELECT tb_idx FROM cm_player_latestplay WHERE mb_id='$szID' AND  tb_id = '$tb_id' order by tb_idx desc  LIMIT 1 ";
		$tb_content = sql_fetch($tbidxsql);
		$tb_idx = $tb_content['tb_idx'];
		
		$sSqlPartIdx = "";
		$hasParams = false;
		$sSqlPartSample = "";
		
		if (($it_id != "undefined") && ($it_id != "") ){
			$sSqlPartIdx = " it_id = '$it_id'";
			$hasParams = true;
		}
		
		if (($tb_id != "undefined") && ($tb_id != "") ){
			if ($hasParams == true){
				$sSqlPartIdx = $sSqlPartIdx  . " and tb_id = '$tb_id' ";
			}
			else{
				$sSqlPartIdx = " tb_id = '$tb_id' ";
			}
			$hasParams = true;
		}
		
		if ($hasParams == true){
			$sSqlPartIdx = " and " . $sSqlPartIdx;
		}

		$tbidxsql = " SELECT tb_idx FROM cm_lecture_item_tb_sample where true $sSqlPartIdx ORDER BY tb_idx ASC LIMIT 1 ";
		if( $tb_idx=='' || $tb_idx == 'undefined' ) {
			$tb_content = sql_fetch($tbidxsql);  //시작차시가 0~1로 차이가 있어 학습한 경우가 아니면 새로 추출한다. 
			$tb_idx = $tb_content['tb_idx'];
		}
	}
	
	// 샘플 플레이어 중 강사 코드만으로 플레이 요청을 하는 경우가 많기에 
	/*if( //!$member[mb_id] ||
		!$tb_id || ($tb_idx == '') || ($tb_idx == 'undefined') ) {		
		alert("로그인 되지 않았거나 [강의 차시정보]에 문제가 있습니다. \\n\\n불편을 드려 죄송합니다. 1:1문의나 고객센터로 [강의정보]를 알려주시면 바로 조치하겠습니다. \\n\\n 아이디 : $member[mb_id] , 강의번호 : $tb_id , 강의차시 : $tb_idx");
	}*/
	
	// 강의 정보 가져오는 부분 
	$hasParams = false;
	$sPathDesktop = "1/";
	$sPathMobile = "2/";
	$hasWMV = false;
	
	if (($it_id != "undefined") && ($it_id != "") ){
		$sSqlPartSample = "a.it_id = '$it_id'";
		$hasParams = true;
	}
	
	if (($tb_id != "undefined") && ($tb_id != "") ){
		if ($hasParams == true){
			$sSqlPartSample = $sSqlPartSample . " and c.tb_id = '$tb_id'";
		}
		else{
			$sSqlPartSample = " c.tb_id = '$tb_id' ";
		}
		$hasParams = true;
	}
	
	if ($hasParams == true){
		$sSqlPartSample = " and " . $sSqlPartSample;
	}
	
	if($tb_id){
		//$sql_tb_id = " AND c.tb_id = '$tb_id'";
	}else{
		//$tb_id=$tb_idx="";
	}
	
	$sql = "SELECT a.tb_id, c.tb_idx,tb_dir, tb_file, b.tb_server_1, b.tb_server_2
			FROM cm_lecture_item_relation_tb a
				LEFT JOIN cm_lecture_item_tb b ON(a.tb_id = b.tb_id)
				LEFT JOIN cm_lecture_item_tb_sample c ON(a.tb_id = c.tb_id)
			where c.tb_dir is not null $sSqlPartSample ORDER BY a.tb_ord ASC LIMIT 1";
	//echo ( $sql );
	$tb_content = sql_fetch($sql); //echo $sql;
	$tb_id_temp = $tb_id;
	$tb_id = $tb_content['tb_id'];  //강의목록 추출용
	$tb_idx = $tb_content['tb_idx'];  //강의목록 재생강의목차, 시간 표시용
	//if(!$tb_content['tb_idx']) alert_close("[해당 강의의 {샘플영상}이 지정되지 않았습니다] \\n\\n불편을 드려 죄송합니다. 1:1문의나 고객센터로 연락주시면 감사하겠습니다. \\n(상품번호:$it_id, 과목번호:$tb_id, 샘플차시:$tb_idx)");
	//$mobile_detect = getUserAgent();
	
	$isEmpty = !$tb_content['tb_server_1'];
	$hasWMV = $isEmpty || ($tb_content['tb_server_1'] == "0");
	
	if ($isEmpty || ($hasWMV == true)){
		$tb_id = $tb_id_temp;
		header("Location: http://www.edusd.co.kr/sdplayer/IMGTech/ZPlayer/sidaegosi/Player_samp.php?it_id=$it_id&tb_id=$tb_id");
		exit();
	}
	
	$mobile_detect = $detect->isMobile();
	$orderby = " server_quality asc ";  //echo $mobile_detect ;
	if( $mobile_detect ) $orderby = " server_quality desc"; //모바일이면 고속화질을 가져오고 없으면 있는 것으로 가져온다
	$sql = " SELECT * FROM cm_server_config WHERE server_state=1 and server_idx in ( '".$tb_content["tb_server_1"]."', '".$tb_content["tb_server_2"]."')  order by $orderby limit 1";			
	$server = sql_fetch($sql);	//echo $sql;
		
	$sv_ip = ($server['server_state']) ? $server['server_ip'] : $server['server_e_ip'];  //대체서버 설정 미사용 중이라 현재까지는 의미없음 20140424
	$sv_protocol = 'http://'; //($server['server_method'] =='wmv') ? 'zhttp://' : 'http://';
	//$sv_ip = $sv_protocol.$sv_ip;
	$sv_ip = "http://1.234.47.125";
	if($mobile_detect&& $server['server_method'] =='wmv') alert_close("[해당 강의의 {모바일용 샘플영상}이 지정되지 않았습니다] \\n\\n불편을 드려 죄송합니다. 1:1문의나 고객센터로 연락주시면 감사하겠습니다. \\n(상품번호:$it_id, 과목번호:$tb_id, 샘플차시:$tb_idx)");
	
	if ($clientip=='58.76.45.202' || $member[mb_id]=='polarislee') $sv_ip = $sv_protocol."1.234.47.125";
	
	$userinfo="?u_id=".$member[mb_id]."&user_ip=".$clientip;	
  	//$szVOD = $sv_ip.'/'.$tb_content['tb_dir'].'/'.$tb_content['tb_file'].'.'.$server['server_method'].$userinfo;
  	// mp4로 재생하기 위한 강제 설정 - 2014.06.16 by jhson
  	// 향후 서비스 시 PC/Mobile 경로 차이점을 두기 위해 하위 폴더 접근 경로 추가 - 2014.06.20 by jhson
  	$szVOD = $sv_ip.'/'.$tb_content['tb_dir'].'/'.$sPathDesktop.$tb_content['tb_file'].".mp4".$userinfo;
	if($member['mb_id']=='test' || $member['mb_id']=='sd_ssajae'){
	//alert($szVOD);
	}
	
	
	//강사+과목 1:N구조변경에 따라 수정 9/9 polarislee
	$sql = "SELECT l.lec_id, l.mb_id lec_mb_id, getlec_names(i.tb_id) lec_name, lec_tag, t.it_id, i.tb_id, tb_name , it_name 
			FROM cm_lecturer l 
				JOIN cm_lecture_tb_lecturer i ON i.lec_id=l.lec_id 
				JOIN cm_lecture_item_relation_tb t ON t.tb_id=i.tb_id 
				JOIN cm_lecture_item e ON e.it_id=t.it_id 
				JOIN cm_lecture_item_tb b ON b.tb_id=i.tb_id 
			WHERE (1) and t.it_id='$it_id' GROUP BY t.tb_id ";		//#and t.tb_id='$tb_id' 
	$rs=sql_query($sql);
	//if ($member[mb_id]=='sd_ghlee' || $member[mb_id]=='polarislee') echo $sql;
	//$rs=sql_query(" SELECT b.tb_id, b.tb_name, b.lec_name FROM cm_lecture_item_relation_tb a left join cm_lecture_item_tb b on(a.tb_id=b.tb_id) WHERE a.it_id = '$lec[it_id]' ");
	while($row=sql_fetch_array($rs)) { 
		$tb_rel_list[]=$row;
		if($row['tb_id']==$tb_id){
			$lec['it_name'] = $row['it_name'];
			$lec['lec_name'] = $row['lec_name'];
			$lec['tb_name'] = $row['tb_name'];
		}
	}
	//echo $tb_id;
	//echo print_r2($tb_rel_list);


/*	echo $szVOD."~".file_exists($szVOD);
	if ( file_exists($szVOD) ) {	
		//echo do_shortcode("[audio mp3=$mp3_url][/audio]");	
	} else {
		//alert_close("[해당 강의의 파일이 없습니다] \\n\\n불편을 드려 죄송합니다. 1:1문의나 고객센터로 연락주시면 감사하겠습니다. \\n(상품번호:$it_id, 과목번호:$tb_id, 샘플차시:$tb_idx)");
	}
*/	

// 최종 수강시점 추출
	$play_tb_curtime=0;
	$sql = " 	SELECT lp_currtime  FROM cm_player_latestplay WHERE tb_id = '$tb_id' and tb_idx = '$tb_idx' and mb_id = '$member[mb_id]' 	";
	$play_tb_curtime=sql_fetch($sql);  	//if ($member[mb_id]=='sd_ghlee' || $member[mb_id]=='polarislee') echo $sql;

//개인별 수강이력 추가 작성 
if($member[mb_id] && $tb_id && $tb_idx){
	//setLecturePlayHistory('i', $member[mb_id], $tb_id, $tb_idx, 0, 'sdplayer_lesson', $clientip);
	//setLecturePlayProgress($member[mb_id], $tb_id, $tb_idx, 0, 0, 'sdplayer_lesson'); //유료회원이 아니라서 
}

?>
<!DOCTYPE html>
<html lang="ko">
<head>
<title>시대교육</title>
<link rel="shortcut icon" type="image/x-icon" href="/_skin/sidae/images/favicon.ico" />

<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta http-equiv="Cache-Control" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
<script type="text/javascript" src="<?=$g4['path']?>/js/common.js"></script>
<!--[if lt IE 9]>
<script src="<?=$g4['path']?>/js/IEjs/IE9.js"></script>
<script src="<?=$g4['path']?>/js/IEjs/ie7-squish.js"></script>
<script src="<?=$g4['path']?>/js/html5shiv.js"></script>
<![endif]-->

<link rel="stylesheet" type="text/css" href="css/common.css" />
<link rel="stylesheet" type="text/css" href="css/tab.css" />
<!--[if lt IE 8]>
<link rel="stylesheet" href="css/ie7.css" />
<![endif]-->
<link rel="stylesheet" href="/sdplayer/mediaelement/build/mediaelementplayer.css" />
<script src="/sdplayer/mediaelement/build/mediaelement-and-player.min.js"></script>


<script>
var player = null;
$(document).ready(function() {
	// JavaScript object for later use
	//var player = new MediaElementPlayer('#v1player' ); //,/* Options */);
	//var player = $('video').mediaelementplayer();
	// ... more code ...
	//player.pause();
	//player.setSrc('mynewfile.mp4');
	//player.play();
	
	/*  //소스를 2개 지정하고 첫 소스가 잘못된 경우 2번째 소스가 재생되도록 하는 방법, http.status 값을 먼저 체크 필요!!!~ 아래에서 사용하는 부분 확인
	var http = jQuery.ajax({
		type:"HEAD",
		url: $('source:first').attr('src'),
		async: false
	});
	//alert($('source:first').attr('src')+http.status);
	var vidsrc = ( http.status == 200 ) ? $('source:first').attr('src') : $('source:eq(1)').attr('src'); 
	*/
	
	player = $("#v1player").mediaelementplayer({
		success: function (mediaElement, domObject) {
			
		},
		// fires when a problem is detected
		error: function () {
			alert("플레이어에 오류가 발생하였습니다. 고객센터로 전화나 1:1게시판으로 문의주시면 확인 후 바로 조치하겠습니다.");
			if(confirm("플래시 플레이어의 설치가 필요합니다(http://get.adobe.com/flashplayer)\n확인을 누르시면 해당 설치페이지로 이동합니다. \n\n(상단의 팝업을 허용하여 주십시요.)\n\n※ 설치 완료 하였음에도 본 알림글이 보인다면 인터넷브라우저를 종료하고 다시 열어 주십시요.")){
				window.open("http://get.adobe.com/flashplayer", "installflash","","");
			};
		}
	});
	
	//player = $('video,audio').mediaelementplayer(/* Options */); 
	//player.pause();
	//player.setSrc('mynewfile.mp4');
	//player.play();
	
	
	//플레이어 크기 조정 ///  http://webtonio.com/40/
	//$('.mejs-mediaelement').css('color', '#FFFF00').html('NAME of your audio');
	
	$('#v1player').bind('contextmenu', function(e) { //마우스 우측버튼 차단
		//return false;
	}); 
	
	
	//마우스 진입시 강의창 크기 조정
	$('video').mouseenter(function() {
		//$(this)[0].setVideoSize(500, 250)
	}).mouseleave(function() {
		//$(this)[0].setVideoSize(200, 115)
	});
		
	$('#fullsc').click(function() {  //전체화면

		//player.setFullscreen(true);
		player[0].enterFullScreen();
	});
	
});


</script>
</head>
<style>

#tabs-1 { display: block; }
#tabs-2 { display: none; }
#tabs-3 { display: none; }
#tabs-4 { display: none; }

/*.mejs-controls .mejs-time {visibility:hidden !important;display:none !important;} /* 재생시간을 숨길때*/

.mejs-container {
  /* Create some space below the player for the controls to move into. */
  /*margin-bottom: 30px;*/  /* 콘트롤을 영상 밑으로 분리할때 */
}
.mejs-container .mejs-controls {
  /* Move the controls into the space below the player. */
  /*bottom: -30px;*/  		/* 콘트롤을 영상 밑으로 분리할때 */
}

.me-cannotplay { /*플래시 설치안된경우 등 재생 오류시*/
            color: white;
            font-size: 80%;
            margin: 5px;
}


</style>
<body style=" background-color:#363c4a;" bottommargin="0" leftmargin="0" rightmargin="0" topmargin="0" scroll="no">
<!-- Save for Web Slices (player_sidaegosi_1.psd) -->
<div id="wrap">
	<!-- 좌측영역 -->
	<div id="content">
		<!-- header -->
		<div class="header">
			<h1><img src="images2/logo.png" alt="시대에듀" /></h1>
			<? // TODO: 급한거 끝나면 조사 해 보기
			 /*<div class="right_btn">
				<ul>
					<!--li><a href="#" id="topbutton" class="topbutton0" onclick='setPlayerTopWindow()'><!--img id='topbuttonimg' src="images2/btn_top_over.jpg" alt="항상위" /--></a></li-->
					<li><img id="fullsc" src="images2/btn_full.png" alt="전체화면" style="cursor:pointer;"/></li>
					<li><!--<a href="#"><img src="images2/btn_help.png" alt="HELP" /></a>--></li>
				</ul>
			</div>*/ ?>
		</div>
		<!-- //header -->

		<!-- 좌측영역 -->
		<div class="play_info">
			<!-- 플레이 화면 -->
			<div class="picture" style="width:730px; height:420px;"><table width="99%" height="100%" border="0" cellpadding="0" cellspacing="0" style="position:relative; top:0px; ">
                    <tr>
                        <td width="100%" height="100%" id="AxLayerMPlayerX" style="background-color:#000000">
                        		<video id="v1player" !class="mejs-ted" width="730" height="420" !poster="player/shot.png" preload="metadata" controls autoPlay="true">
                                    <?// mp4로 재생하기 위한 강제 설정 - 2014.06.16 by jhson?>
                                    <source src="<?=$szVOD?>" type="video/mp4" />
                                    <source src="<?=$szVOD?>" type="video/mp4" />
                                    
                                    <!-- <track kind="subtitles" src="player/mediaelement/mediaelement.srt" srclang="en"></track> -->
                                    <object width="730" height="420" type="application/x-shockwave-flash" data="/sdplayer/mediaelement/build/flashmediaelement.swf" autostart="true">
                                      <param name="movie" value="/sdplayer/mediaelement/build/flashmediaelement.swf" />
                                      <param name="allowFullScreen" value="true" /> 
                                      <param name="flashvars" value="autoPlay=true&controls=true&autostart=true&!poster=/sdplayer/mediaelement/build/shot.png&file=<?=$szVOD?>" />
                                      <img !src="/sdplayer/mediaelement/build/shot.png" width="730" height="360" title="No video playback capabilities" />
                                    </object>
                                </video></td>
                    </tr>
                    <tr>
                        <td width="100%" height="110px" style="background-image:url('images2/sampleplayer_controls.png');background-repeat:no-repeat; ">
                        </td>
                    </tr>
                </table>

			</div>
			<!-- //플레이 화면 -->
			<div class="list" style="margin-top:118px;">
				<table style=" width: 100%; padding-top: 10px; margin-top:10px; line-height: 24px; border:solid white 0px; ">
					<tr>
						<td><img src="images2/info_title4.jpg" alt="수강과목리스트" /><div id="tb_name" style="color: white;  margin-left: 85px; width: 370px;margin-top:-24px; padding-top:2px;  height:30px; line-height: 12px; overflow: hidden; "><select id=tb_id name="tb_id" class="selectMenu1" style="width: 100%;" 
                        	onchange="javascript:if(this.options[this.selectedIndex].value) { location.href = '?wh=<?=$wh?>&it_id=<?=$it_id?>&tb_id='+this.options[this.selectedIndex].value; }"><?	
							for($i=0,$cnt=count($tb_rel_list);$i<$cnt;$i++) { 
								$tb = $tb_rel_list[$i];
								echo "<option value='{$tb['tb_id']}' ".($tb_id==$tb['tb_id']?'selected':'').">{$tb['tb_name']}</option>"; 	                        
							} ?></select></div></td>
						<td width="200"><img src="images2/info_title1.jpg" alt="강사명" /><span id="lec_name" style=" color: white; "><?=$lec['lec_name']?></span></td>
					</tr>
					<tr>
						<td><img src="images2/info_title3.jpg" alt="상품명" /><div id="tb_name" style=" color: white; margin-left: 50px;  width: 100%; margin-top:-24px; overflow: hidden; "><?=$lec['it_name']?></div></td>
						<td><!--img src="images2/info_title2.jpg" alt="과목명" /><span id="it_name" style=" color: white; "><?=$lec['tb_name']?></span--></td>
					</tr>
				</table>
			</div>
            
            
		</div>
		<!-- //좌측영역 -->

		<!-- 우측영역 -->
		<div id="study" style="position:absolute; top:40px; left:740px; z-index:99;">
			<div class="gnb">
				<div class="menu">
					<ul>
						<li><a href="#tabs-1" class="tbutton1" onclick='setTabtoggle("tabs-1")' alt="목차"></a></li>
						<li><a href="#tabs-2" class="tbutton2" onclick='setTabtoggle("tabs-2")' alt="학습진도"></a></li>
						<li><a href="#tabs-3" class="tbutton3" onclick='setTabtoggle("tabs-3")' alt="북마크노트"></a></li>
						<li><a href="#tabs-4" class="tbutton4" onclick='setTabtoggle("tabs-4")' alt="질문답볍"></a></li>
					</ul>
                    
                    <div id="tabs-1">
                        <p class="text_title">수강중인 과목의 목차입니다.</p>
                        <p class="line_icon"><img src="images2/list_line.jpg" alt="구분아이콘" /></p>
                        <p class="list_title"><strong><?=$lec['tb_name']?></strong></p>
                        <div class="tab1_content">
                            <!-- 수강목차 --><? 
                        $rs=sql_query(" SELECT l.mb_id, c.tb_id, c.tb_idx, c.tb_content, c.tb_time
											, IFNULL(l.lp_playtime,'') lp_playtime, IFNULL(l.lp_currtime,'0') lp_currtime, IFNULL(date_format(l.lp_updatetime,'%Y-%m-%d'),'') lp_updatetime 
										FROM cm_lecture_item_tb_content c 
											LEFT JOIN cm_player_latestplay l ON l.mb_id='$member[mb_id]' and l.tb_id=c.tb_id and l.tb_idx=c.tb_idx
										WHERE  c.tb_id = '$tb_id' ");
						$thistime = 0;
                        for($i=0;$row=sql_fetch_array($rs);$i++) { 
							if($row['tb_idx']==$tb_idx) $thistime = $row['tb_time'];?>	
                            <p <? if($row['tb_idx']==$tb_idx) echo "id='playthis'" ?> class="list_start" style=" cursor: pointer;" onClick="javascript:goView('<?=$it_id?>', '<?=$row['tb_id']?>', '<?=$row['tb_idx']?>', '<?=$wh?>');"><? if($row['tb_idx']==$tb_idx) echo "<strong style='color:#83a9fb;'>" ?><?=($row['lp_updatetime']) ? "★ ":"☆ ";  ?><?=$row['tb_idx']?>. <?=$row['tb_content']?><? if($row['tb_idx']==$tb_idx) echo "</strong>" ?></p>                    
                        <? } ?>
                    	</div>
                        <!-- //수강목차 -->
                        <p class="time">*강의시간 : <strong><span id="el_nVODDurationTime"><?=$thistime?></span></strong></p>                    
                    
                    </div>
                    
                    <div id="tabs-2">                    
                        <!-- 학습진도 -->
                        <p class="text_title">수강중인 강좌의 학습진도 현황 입니다.<br>(정규과정에서 제공되는 기능으로 아래는 참고용입니다)</p>
                        <p class="line_icon"><img src="images2/list_line.jpg" alt="구분아이콘" /></p>
                        <p class="list_title"><strong><?=$lec['tb_name']?></strong></p>
                        <p class="list_start"><strong><span class="number"><?=$member[mb_name]?>님의 학습진도</span></strong></p>
                        <p class="list_start"><span>전체 강의수 : <strong><?=$play_tb[cnt]?>강</strong></span></p>
                        <p class="list_start"><span>수강 강의수 : <strong><?=$play_tb[pcnt]?>강</strong></span></p>
                        <p class="list_start"><span>나의 진도 : <strong><?=$play_tb[per]?>%</strong></span></p>
                        <!-- //학습진도 --><?
							if($play_tb[pcnt] < 2){ //수강강의수가 1개이하일경우
								//시작
								$avs_msg=$member['mb_name']." 회원님 반갑습니다. 시대에듀와 함께 열심히 공부해보아요^^ 우리 같이 열심히 해서 원하는 목표를 이루어 보아요~~^^.";
							}
							else {
								if($play_tb[per] < 30){
									//분발
									$avs_msg=$member['mb_name']." 회원님 조금만 더 분발해 주세요. 시작은 느려도 열심히 노력하시면 목표에 한걸음 더 다가 서실수 있을꺼에요.";
								} else if($play_tb[per] >= 30 && $play_tb[per] < 70)
								{
									//보통
									$avs_msg=$member['mb_name']." 회원님 수강진도가 평균치 입니다. 조금만 더 노력하셔서 복습할 시간을 만드시면 원하시는 목표를 이루실꺼에요.";
								} else if( $play_tb[per] >= 70){
									//열심
									$avs_msg=$member['mb_name']." 회원님 정말 열심히 공부하시네요. 수강기간내에 강의를 한번 더 복습하시면 회원님이 원하시는 목표를 꼭 이루실꺼에요.";
								}
							}	?>
                     
                        <p class="text"><?=$avs_msg ?></p>
                    </div>
                
                    
                    
                    <div id="tabs-3"> 
                        <!-- 북마크 -->
                        <p class="text_title">중요한 부분을 저장하는 북마크(책갈피)/노트입니다.<br>(정규과정에서 제공되는 기능으로 아래는 참고용입니다)</p>
                        <p class="line_icon"><img src="images2/list_line.jpg" alt="구분아이콘" /></p>
                        <p class="list_title"><a href="#"><img src="images2/bookmark.jpg" alt="북마크"  onClick="getEmptybmIdx();" /></a><span class="text">동영상 하단의 책갈피 번호 또는 <br>북마크 버튼 클릭 후 내용 입력</span></p>
                        <div id='bmarkform'>
                            <ul style="margin-left: 0px;">
                                <li><input name="bmarktitle" id="bmarktitle" title="제목" class="i_text" style="width:214px;"  type="text" placeholder="제목을 입력하세요" value=""></li>
                                <li><!--textarea name="bmarknote" id="bmarknote" class="i_text_area" rows="3" cols="35" placeholder="북마크/노트 내용을 입력하세요"></textarea-->
                                	<div contenteditable="true"  name="bmarknote" id="bmarknote" class="i_text_area" style="width:212px;"  placeholder="북마크/노트 내용을 입력하세요"></div></li>
                                <input type=hidden name="bmarknIdx" id="bmarknIdx">
                                <input type=hidden name="bmarklTime" id="bmarklTime">
                                <input type=hidden name="bmarkbInsert" id="bmarkbInsert">
                                <div class="saveimg"  style="">
                                	<img src="images2/btn_save.jpg" onclick='bt_saveBMark(true );'>
                                	<img src="images2/btn_cancel.jpg" onclick='clsBmarkForm();'>
                                    <img src="images2/btn_bm_del.jpg" onclick='bt_saveBMark(false);'>
								</div>
                            </ul>
                        </div>
                        <div id="bmarklist" class="tab1_content">
                            <ul>
                            </ul>
                        </div>
                        <!-- //북마크 -->
                    </div>
                
                    
                    <div id="tabs-4">   
                        <!-- 학습질답 -->
                        <p class="text_title">재생시간(시점) 캡쳐를 통해 질문할 수 있습니다.<br>(정규과정에서 제공되는 기능으로 아래는 참고용입니다)</p>
                        <p class="line_icon"><img src="images2/list_line.jpg" alt="구분아이콘" /></p>
                        <!--p class="list_title"><span>상담방법 : </span><input type="radio" name="pay_method" /> <span>텍스트</span> &nbsp;&nbsp;<input type="radio" name="pay_method" /> <span>재생시점 캡쳐</span></p-->
                        <p class="coustomer_text"><span>재생시간(시점) 캡쳐를 이용하시면 선생님께 질문하실 부분이 있는 정확한 재생시점을 전달할 수 있습니다.</span></p>
                        <div class="photo">
                            <ul style=" height:20px; vertical-align:bottom; margin-left: 0px;">
                                <li style=" margin-top: -5px;">※시간 캡쳐 : </li>
                                <li><input name="lec_time" id="lec_time" class="txttime" style="width:40px; height:20px; font-size:12px; line-height:20px;" type="text" readonly value=""></li>
                                <li class="btn" style=" margin-left: 0;margin-top: 0px; padding-left:3px;"><a href="#"><img src="images2/btn_capture.jpg" alt="캡쳐" onClick="alert('정규과정에서 제공되는 기능입니다.');"/></a></li>
                                <li class="btn" style=" margin-left: 0;margin-top: 0px; padding-left:3px;"><a href="#"><img src="images2/btn_del.jpg" alt="삭제" onClick="$('#lec_time').val('');" /></a></li>
                            </ul>
                            <div>
                                <ul style="margin-left: 0px;">
                                    <li><input name="wr_title" id="wr_title" title="질문 제목" required placeholder="질문 제목을 입력하세요." class="i_text" type="text" value="" ></li>
                                    <li><textarea name="wr_content" id="wr_content" title="질문 내용" required placeholder="질문 내용을 입력하세요.  과정정보는 자동으로 입력됩니다. " class="i_text_area" rows="8" cols="34"></textarea></li>
                                </ul>
                            </div>
                            <div class="saveimg" >
                                <img src="images2/btn_save.jpg" onclick='bt_saveinquery();'>
                                <img src="images2/btn_cancel.jpg" onclick='resetInqueryform();'>
                            </div>
                        </div>
                        <div class="photo_close">
                           
                        </div>
                        <div id="anotherInqueryelm"  ><br>

                            <img src="images2/btn_addwriting.jpg" title="추가질문작성하기" onclick='resetInqueryform();'>
                        </div>
                        <!-- //학습질답 -->
                    </div>
                
				</div>
			</div>
		</div>
		<!-- //우측영역 -->
	</div>

</div>
<!-- End Save for Web Slices -->
<script>

	function setTabtoggle(tid){
		var i=1; 
		var selid = tid.substr(5,1); 
		while(i<5) { 
			if( i==selid) {
				$('.tbutton'+i).css('background','url(./images2/r_tabover_0'+i+'.jpg) no-repeat');
				$('#tabs-'+i).show(); //Trace(selid);
			}else {
				$('.tbutton'+i).css('background','url(./images2/r_tabout_0'+i+'.jpg) no-repeat');
				$('#tabs-'+i).hide();
			}
			i=i+1;
		}; 	//$("#"+tid).show();
	}
function getEmptybmIdx(){
		$("#bmarkform").show();

}
function bt_saveBMark(pbInsert){
	alert("정규과정에서 제공되는 기능입니다.");
}
function saveBMark(pbInsert, pnIndex, plTime, pszText, pszDesc){
	//Trace('저장/삭제 처리~~saveBMark...pbInsert='+pbInsert+', pnIndex='+pnIndex+', pszText='+pszText);	
	if ( pbInsert ) ZonePlayer.PlayerChangeBookMark(pnIndex, pbInsert, plTime);	
	else ZonePlayer.PlayerChangeBookMark(pnIndex, pbInsert, 0);	//OnPlayerGetInitBookMark(pnIndex);	
}
function getBMark(){	
}
function setBMark(){
	alert("정규과정에서 제공되는 기능입니다.");
}
function resetBMark(){
	//Trace('북마크 초기화~~resetBMark.......');
	//alert(bookmarkarr.length);
	if(typeof ZonePlayer.GetPlayerDurationTime != "undefined" ) {
		var i=0; 
		while (i<10){ 
			Trace('clear='+i);
			ZonePlayer.PlayerChangeBookMark(i, false, 0);	i++; 
		}
	}
}

function clsBmarkForm(){
	//Trace('clsBmarkForm.......');
	$("#bmarknIdx").val('');
	$("#bmarklTime").val('');
	$("#bmarkbInsert").val('');
	$("#bmarktitle").val('');
	$("#bmarknote").html('');
	$("#bmarkform").hide();
}

function goBmark( pnIndex, plTime ){
	//Trace('goBmark.......pnIndex='+pnIndex);
	$("#bmarkform").show();
	ZonePlayer.PlayerChangeBookMark(pnIndex, true, plTime);
	$("#bmarknIdx").val(pnIndex);
	$("#bmarklTime").val(plTime);
	$("#bmarkbInsert").val(false);
	$("#bmarktitle").val($("#bm_title_"+pnIndex).val());
	$("#bmarknote").html($("#bm_content_"+pnIndex).val());
	
}
///////////////////////////////////////////////////////////////////////////////////////////////////

function bt_saveinquery(){	
	alert("정규과정에서 제공되는 기능입니다.");
}
function resetInqueryform(){
	$("#lec_time").val('');
	$("#wr_title").val('');
	$("#wr_content").val('');
	$(".photo").show();
	$(".photo_close").hide();
}


	function goView(it_id, tb_id, tb_idx, gubun){
		alert("정규과정에서 제공되는 기능입니다.");
	}
	function movetotitle(position){
		location.hash="title"+position;
	}
	function TitleActive(no){
		var list_cnt = 1;	
	}	
</script>
</body>
</html>