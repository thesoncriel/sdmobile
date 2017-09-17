<?
include_once("_common.php");
//$keywd       = $_GET[keywd];
//$site       = $_GET[site];

//error_reporting(E_ALL);
//error_reporting(E_ERROR );
error_reporting(E_ALL ^ E_NOTICE);
//error_reporting(E_ALL & ~E_NOTICE );
//error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT );
//define('DEBUG', true);

// php환경 설정 
ini_set('display_errors', 0); // 에러 화면에 출력 안되게 
ini_set('ignore_repeated_errors', 1); // 반복되는 중복 에러는 무시 
ini_set('ignore_repeated_source', 1); // 반되는 중복 소스는 무시 
ini_set('html_errors', 0); // 에러를 HTML형식으로 안나타나게
include_once "../../_error_handler.php"; 

ob_start('ErrorHandler');
// 커스텀 예외처리 및 에러 핸들러 정의를 위한 구성 
//set_error_handler("error_handler0");
//set_exception_handler( "error_exception" );

set_error_handler("ErrorHandler"); // 사용자 에러 핸들러 정의 
set_exception_handler("ExceptionHandler"); // 사용자 예외처리 정의 

//*** 사용자가 예외를 발생 시키거나 어떤 부분에서 예외 발생시 의도적으로 실행을 중단하고, 에러화면을 출력해야 할때, 
//trigger_error('에러 타이틀(제목)', E_USER_ERROR) 식으로 사용하거나, 
//trigger_error('에러 타이틀(제목)', '에러내용~');


include_once "../item/_search.php"; 

$total = $bannerlist = $b_list = $l_list = $c_list = $m_list = $t_list = array();
$msg  = "검색이 완료되었습니다";

if (iconv("UTF-8","UTF-8",$_GET['keywd']) != $_GET['keywd']) {
	$keywd = urlencode(iconv('euc-kr', 'utf-8',$_GET['keywd']));
	if(substr($keywd,0,1)=='%') $keywd = urldecode($keywd);
}
if($site && $keywd){
	//$keywd = urldecode($keywd);
	setSearchHistory($keywd, $member[mb_id], $_SERVER[HTTP_REFERER], $_SERVER["SCRIPT_NAME"], session_id(), $site);
}

if($site=='book'){
	$b_list = GetSearchBookList($keywd);
}elseif($site=='lecture'){
	$l_list = GetSearchLectureList($keywd);
	$c_list = GetSearchLectureListCP($keywd);
}elseif($site=='mocktest'){
	$m_list = GetSearchMocktestList($keywd);	
}elseif($site=='teacher'){
	$t_list = GetSearchLecturerList($keywd);	
}else{
	$b_list = GetSearchBookList($keywd);
	$l_list = GetSearchLectureList($keywd);
	$c_list = GetSearchLectureListCP($keywd);
	$m_list = GetSearchMocktestList($keywd);	
	$t_list = GetSearchLecturerList($keywd);	
}
$bannerlist = GetCategoryBannerSearch2($keywd, 0, '');

//$total['b_cnt'] = count($b_list);  //템플릿에서 자체처리
//$total['l_cnt'] = count($l_list);
//$total['m_cnt'] = count($m_list);
$total['b_cnt'] = count($b_list);
$total['l_cnt'] = count($l_list);
$total['c_cnt'] = count($c_list);
$total['m_cnt'] = count($m_list);
$total['t_cnt'] = count($t_list);
$total['all_cnt'] = $total['b_cnt'] + $total['l_cnt'] + $total['c_cnt'] + $total['m_cnt'] + $total['t_cnt'];

$result = ($total['all_cnt']>0) ? 1: 0;


$err = $errmsg; //echo "err==".$err;

$msg  = ($err)? "에러발생~".$errmsg : (($total['all_cnt']>0) ? "검색이 완료되었습니다":"검색 결과가 없습니다. 다른 키워드 또는 하나의 키워드로 검색하시기 바랍니다.");


$response[] = array(
	'result' => $result,
	'msg' => "$msg",
	'keywd' => "$keywd",
	'total' => $total,
	'mainbanner' => $bannerlist,
	'b_list' => $b_list,
	'l_list' => $l_list,
	'c_list' => $c_list,
	'm_list' => $m_list,
	't_list' => $t_list,
);

echo json_encode($response);

?>