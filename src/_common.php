<?
$g4_path = ".."; // common.php 의 상대 경로
include_once ("$g4_path/common.php");
 

// 자바스크립트에서 go(-1) 함수를 쓰면 폼값이 사라질때 해당 폼의 상단에 사용하면
// 캐쉬의 내용을 가져옴. 완전한지는 검증되지 않음
header("Content-Type: text/html; charset=$g4[charset]");
header("Expires: ".date("Y-m-d H:i:s", strtotime ("+0 minutes"))); // rfc2616 - Section 14.21
header("Last-Modified: " . date("Y-m-d H:i:s"));
header("Cache-Control: no-store, no-cache, must-revalidate"); // HTTP/1.1
header("Cache-Control: pre-check=0, post-check=0, max-age=0"); // HTTP/1.1
header("Pragma: no-cache"); // HTTP/1.0
//*/
?>
