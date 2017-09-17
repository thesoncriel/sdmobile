<?PHP
	include_once("./_common.php");
	require_once '../../Mobile_Detect.php';
	$detect = new Mobile_Detect;
	
	$sql = "SELECT a.tb_id, a.tb_idx, a.tb_dir, a.tb_file, b.tb_server_1, b.tb_server_2
			FROM cm_lecture_item_tb_sample a
				LEFT JOIN cm_lecture_item_tb b ON(a.tb_id = b.tb_id)
				LEFT JOIN cm_lecture_item_tb_content c ON(a.tb_id = c.tb_id)
			where c.tb_dir is not null and a.tb_id = '$tb_id' ORDER BY a.tb_idx ASC LIMIT 1";
	//echo ( $sql );
	$tb_content = sql_fetch($sql); //echo $sql;
	$tb_id_temp = $tb_id;
	$tb_id = $tb_content['tb_id'];  //강의목록 추출용
	$tb_idx = $tb_content['tb_idx'];  //강의목록 재생강의목차, 시간 표시용
	//if(!$tb_content['tb_idx']) alert_close("[해당 강의의 {샘플영상}이 지정되지 않았습니다] \\n\\n불편을 드려 죄송합니다. 1:1문의나 고객센터로 연락주시면 감사하겠습니다. \\n(상품번호:$it_id, 과목번호:$tb_id, 샘플차시:$tb_idx)");
	//$mobile_detect = getUserAgent();
	
	$isEmpty = !$tb_content['tb_server_1'];
	$hasWMV = $isEmpty || ($tb_content['tb_server_1'] == "0");
	
	if (/*$isEmpty || ($hasWMV == true) || */(count($tb_content) == 1)){
		//echo ("{\"status\": \"1\", \"message\": \"영상이 존재하지 않습니다.\"}");
		echo ("1|당분간 PC화면에서만 정상 제공됩니다.<br/>모바일 샘플영상은 추후 제공될 예정입니다.");
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
	if($mobile_detect&& $server['server_method'] =='wmv') {
		//echo ("{\"status\": \"1\", \"message\": \"[해당 강의의 {모바일용 샘플영상}이 지정되지 않았습니다] \\n\\n불편을 드려 죄송합니다. 1:1문의나 고객센터로 연락주시면 감사하겠습니다. \\n(상품번호:$it_id)\"}");
		echo ("1|[해당 강의의 {모바일용 샘플영상}이 지정되지 않았습니다] \\n\\n불편을 드려 죄송합니다. 1:1문의나 고객센터로 연락주시면 감사하겠습니다. \\n(상품번호:$it_id)");
		exit();
	}
	
	if ($clientip=='58.76.45.202' || $member[mb_id]=='polarislee') $sv_ip = $sv_protocol."1.234.47.125";
	
	$userinfo="?u_id=".$member[mb_id]."&user_ip=".$clientip;	
  	//$szVOD = $sv_ip.'/'.$tb_content['tb_dir'].'/'.$tb_content['tb_file'].'.'.$server['server_method'].$userinfo;
  	// mp4로 재생하기 위한 강제 설정 - 2014.06.16 by jhson
  	// 향후 서비스 시 PC/Mobile 경로 차이점을 두기 위해 하위 폴더 접근 경로 추가 - 2014.06.20 by jhson
  	$szVOD = $sv_ip.'/'.$tb_content['tb_dir'].'/2/'.$tb_content['tb_file'].".mp4".$userinfo;
	
	echo ($szVOD);
?>