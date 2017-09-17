<?
$g4_path = ".."; // common.php 의 상대 경로

?>
<link href="/mobile/css/bootstrap.min.css" rel="stylesheet" />
<link href="<?=$mobilehome?>/css/common.min.css" rel="stylesheet" />

<style>


button {
	/* 길게 눌러서 글자가 선택되는 경우 방지 */
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
      
.btn {}
.btn:hover {}
.btn:focus {
	/* The outline parameter surpresses the border 
	color / outline when focused */
	outline: 0;
}
.btn:active {}

/* Webkit / Chrome Specific CSS to remove tap 
      highlight color */
.btn {
	-webkit-tap-highlight-color: transparent;
}
      

/* Firefox Specific CSS to remove button 
      differences and focus ring */
.btn {
	background-image: none;
}

.btn::-moz-focus-inner {
	border: 0;
}

</style>