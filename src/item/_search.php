<?

//메인 베너 선택
function GetCategoryBannerSearch2($opt, $z=0, $sq='')  //Template_에서 사용되는 함수를 가져옴
{
	$sql_common = "SELECT cat_id, bn_type, bn_file, bn_sort, bn_subject, bn_cnt, bn_url, cat_name, salesfocus
					FROM cm_banner b JOIN (
						select concat('3_', c.cat_id)  cat_id, cat_name, c.salesfocus
						FROM cm_lecture_item a
							JOIN cm_lecture_item_cat b ON  (a.it_id=b.it_id and a.it_buy_use=1 and a.it_period_1<>'0')
							JOIN cm_lecture_category c ON (b.cat_id=c.cat_id)
							/*JOIN cm_banner n ON (concat('3_', b.cat_id)=n.bn_type and bn_sort = '$i')*/
							JOIN cm_lecture_item_relation_tb r ON a.it_id=r.it_id
							JOIN cm_lecture_item_tb t ON t.tb_id=r.tb_id
							JOIN cm_lecturer l ON r.lec_id=l.lec_id
							JOIN cm_lecture_item_relation i ON (i.it_id=a.it_id and (i.b_type=0 or i.b_type=1))
							JOIN cm_book_item bi ON (bi.it_id=i.re_it_id)";
	
	$sql_where = "a.it_name like '%$opt%' or l.lec_name like '%$opt%' or l.lec_tag like '%$opt%' 
					or c.cat_name like '%$opt%' or t.tb_name like '%$opt%' or a.it_tag like '%$opt%'  
					or bi.it_name like '%$opt%'	";
    $sql_search = " WHERE left(b.cat_id,3)<>'007' 
						and (	$sql_where ) ";
	$sql_order = " group by b.cat_id) c ON (c.cat_id=b.bn_type and bn_sort = '$i'  and bn_subject like '%메인롤링%')
					ORDER BY c.salesfocus desc, b.bn_updatetime desc, bn_cnt desc limit 1";
	$sql = $sql_common.$sql_search.$sql_order;
	//echo $sql;
	$bn =sql_fetch($sql);
	
	if($sq) {
		if(preg_match('/\?/', $sq)) $sq = '&'.$sq;
		else					  $sq = '?'.$sql; 
	}		
	if($bn){		 
		$bn_urls=explode('|',$bn['bn_url']);
		$bn_files=explode('|',$bn['bn_file']);	 
	}
	$bannerlist['cnt']=count($bn_files);
	
	if($bn['cnt']==0){
		$opt =preg_split("/[\s,]+/",$opt);			
		$sql_where = "";
		for($i=0;$i<count($opt);$i++){		
			($sql_where)? $sql_where .= " or ":"";
			$sql_where .= " a.it_name like '%$opt[$i]%' or l.lec_name like '%$opt[$i]%' or l.lec_tag like '%$opt[$i]%' 
							or c.cat_name like '%$opt[$i]%' or t.tb_name like '%$opt[$i]%' or a.it_tag like '%$opt[$i]%'  
							or bi.it_name like '%$opt[$i]%' ";
		}	
		$sql_search = " WHERE left(b.cat_id,3)<>'007' 
							and (	$sql_where ) ";
		$sql = $sql_common.$sql_search.$sql_order;	
		$bn =sql_fetch($sql);	
		if($sq) {
			if(preg_match('/\?/', $sq)) $sq = '&'.$sq;
			else					  $sq = '?'.$sql; 
		}		
		if($bn){		 
			$bn_urls=explode('|',$bn['bn_url']);
			$bn_files=explode('|',$bn['bn_file']);	 
		}
		$bannerlist['cnt']=count($bn_files);	
	}  
	//echo $sql;
	$bannerlist['list']=array();	
	for($i=0,$cnt=count($bn_files);$i<$cnt;$i++) {
		$row = array();
		//$row['url']=set_http($bn_urls[$i]);
		$row['i']=$i;
		$row['bn_subject']=$bn['bn_subject'];
		$row['bn_cat_name']=$bn['cat_name'];
		$row['bn_url']=$bn_urls[$i];
		$row['bn_href']="<a href='".$row['url'].$sq."' target='$bn[bn_target]' onclick=\"javascript:hit_banner('{$bn['bn_id']}');\">";
		$row['bn_file']="/data/cm_shop/banner/".$bn_files[$i];
		//$row['img']=$cm->GetFileLink($bn_files[$i], '705', $bn['bn_height'], 'banner', $bn['bn_id'], $bn['bn_ratio']);	
		$bannerlist['list'][]=$row;
	}
	
	
   return $bannerlist;
}
 
// 도서 서치
function GetSearchBookList($keywd) {	
	global $cm;
	$list = array();	
	$sql_common = "SELECT it_id,it_sug_price,it_res_price, it_name, it_price,it_status, (SELECT cat_id FROM cm_book_item_cat WHERE it_id = c.it_id limit 0, 1) as cat_id FROM cm_book_item c ";
	$sql = "$sql_common WHERE it_buy_use=1 and it_status=0 and (it_name like '%$keywd%' or it_tag like '%$keywd%' or it_isbn like '%$keywd%') ORDER BY it_update DESC"; //echo $sql;
	$rs=sql_query($sql);
	while($row=sql_fetch_array($rs)) {
 		//$row['img']=$cm->GetItemImg($row['it_id'], 0, 'l', 106, 106);
		$list[]=$row;
	}
	if(!$list){
		//첫번째 검색에서 결과가 없을때
		//$keywd 에 띄어쓰기가 있을시 .2개의 키워드로 나눠주기 위한 explode.
		$keywd =preg_split("/[\s,]+/",$keywd);	
		$sql_f = "AND (";
		$sql_where = "";
		$sql_l = ")";
		for($i=0;$i<count($keywd);$i++){		
			($sql_where)? $sql_where .= " OR ":"";
			$sql_where .= "it_name like '%$keywd[$i]%' or it_tag like '%$keywd[$i]%' or it_isbn like '%$keywd[$i]%'";
		}	
		if($sql_where){
			$sql_where = $sql_f.$sql_where.$sql_l;
		}
		$rs=sql_query("$sql_common WHERE it_buy_use=1 and it_status=0 $sql_where ORDER BY it_update DESC");	
		while($row=sql_fetch_array($rs)) {
			//$row['img']=$cm->GetItemImg($row['it_id'], 0, 'l', 106, 106);
			$list[]=$row;
		}
	}
	return $list;
	
}

// 동영상 서치-온라인
function GetSearchLectureList($keywd) {
	global $cm;	
	$list = array();
	$sql_common = "SELECT a.it_id, a.it_tb_cnt, a.it_name, a.it_price_1 as it_price, a.it_period_1, a.it_period_2, a.it_period_3,b.cat_id, l.lec_name 
					FROM cm_lecture_item a 
						left JOIN cm_lecture_item_cat b ON  (a.it_id=b.it_id  and a.it_buy_use=1 and a.it_period_1<>'0') 
						left JOIN cm_lecture_item_relation_tb r ON a.it_id=r.it_id 
						left JOIN cm_lecturer l ON r.lec_id=l.lec_id ";
	$rs=sql_query("$sql_common WHERE left(b.cat_id,3)<>'007' and (a.it_name like '%$keywd%'  or l.lec_name like '%$keywd%' or l.lec_tag like '%$keywd%')
					group by  a.it_id
					ORDER BY a.it_datetime desc");
	while($row=sql_fetch_array($rs)) {
 		//$row['img']=$cm->GetItemImg($row['it_id'], 0, 'l', 106, 106);
		$list[]=$row;
	}
	if(!$list){
		//$keywd 에 띄어쓰기가 있을시 .2개의 키워드로 나눠주기 위한 explode.
		$keywd =preg_split("/[\s,]+/",$keywd);	
		$sql_f = "AND (";
		$sql_where = "";
		$sql_l = ")";
		for($i=0;$i<count($keywd);$i++){		
			($sql_where)? $sql_where .= " OR ":"";
			$sql_where .= "a.it_name like '%$keywd[$i]%'  or l.lec_name like '%$keywd[$i]%' or l.lec_tag like '%$keywd[$i]%'";
		}	
		if($sql_where){
			$sql_where = $sql_f.$sql_where.$sql_l;
		}
		$rs=sql_query(" $sql_common WHERE left(b.cat_id,3)<>'007' $sql_where
						group by  a.it_id
						ORDER BY a.it_datetime desc ");  //left join 추가 13/8/26 polarislee 강사, 분류안된거도 노출(평생교육)
	
		while($row=sql_fetch_array($rs)) {
			//$row['img']=$cm->GetItemImg($row['it_id'], 1, 'l', 106, 106);
			$list[]=$row;
		}
	}
	return $list;	
}

// 오프라인
function GetSearchLectureListCP($keywd) {
	global $cm;	
	$list = array();
	$sql_common = "SELECT a.it_id, a.it_name, a.it_price_1 as it_price, a.it_period_1,b.cat_id, l.lec_name 
					FROM cm_lecture_item a 
						left JOIN cm_lecture_item_cat b ON  (a.it_id=b.it_id  and a.it_buy_use=1 and a.it_period_1<>'0') 
						left JOIN cm_lecture_item_lecturer r ON a.it_id=r.it_id 
						left JOIN cm_lecturer l ON r.lec_id=l.lec_id";
	$rs=sql_query(" $sql_common WHERE b.cat_id = '007002' and a.it_name like '%$keywd%'  or l.lec_name like '%$$keywd%' or l.lec_tag like '%$keywd%' ORDER BY a.it_datetime desc ");		
	while($row=sql_fetch_array($rs)) {
 		//$row['img']=$cm->GetItemImg($row['it_id'], 1, 'l', 106, 106);
		$list[]=$row;
	}
	if(!$list){			
		$keywd =preg_split("/[\s,]+/",$keywd);	
		$sql_f = "AND (";
		$sql_where = "";
		$sql_l = ")";
		for($i=0;$i<count($keywd);$i++){		
			($sql_where)? $sql_where .= " OR ":"";
			$sql_where .= "a.it_name like '%$keywd[$i]%'  or l.lec_name like '%$keywd[$i]%' or l.lec_tag like '%$keywd[$i]%'";
		}	
		if($sql_where){
			$sql_where = $sql_f.$sql_where.$sql_l;
		}
		
		$rs=sql_query(" $sql_common WHERE b.cat_id = '007002' $sql_where ORDER BY a.it_datetime desc ");  //left join 추가 13/8/26 polarislee 강사, 분류안된거도 노출(평생교육)
	
		while($row=sql_fetch_array($rs)) {
			//$row['img']=$cm->GetItemImg($row['it_id'], 1, 'l', 106, 106);
			$list[]=$row;
		}
	}
	return $list;	
}
//
function GetSearchMocktestList($keywd) {
	global $cm;
	$list = array();
	$sql_common = "SELECT it_id, it_name, it_price FROM cm_mocktest_item";
	$rs=sql_query("$sql_common  WHERE it_buy_use=1 and it_name like '%$keywd%' ORDER BY it_datetime DESC ");
	while($row=sql_fetch_array($rs)) {
		//$row['img']=$cm->GetItemImg($row['it_id'], 2, 'l', 106, 106);
		$list[]=$row;
	}
	if(!$list){
		$keywd =preg_split("/[\s,]+/",$keywd);	
		$sql_f = "AND (";
		$sql_where = "";
		$sql_l = ")";
		for($i=0;$i<count($keywd);$i++){		
			($sql_where)? $sql_where .= " OR ":"";
			$sql_where .= "it_name like '%$keywd[$i]%'";
		}	
		if($sql_where){
			$sql_where = $sql_f.$sql_where.$sql_l;
		}
		
		$rs=sql_query("$sql_common WHERE it_buy_use=1 $sql_where ORDER BY it_datetime DESC ");
		while($row=sql_fetch_array($rs)) {
			//$row['img']=$cm->GetItemImg($row['it_id'], 2, 'l', 106, 106);
			$list[]=$row;
		}
	}
	return $list;	
}


//강사 정보 검색
function GetSearchLecturerList($keywd) {
	global $cm;
	$list = array();
	$sql_common = "SELECT lec_id, lec_name, lec_tag, lec_file FROM cm_lecturer";
	$rs=sql_query("$sql_common WHERE lec_name like '%$keywd%' or lec_tag like '%$keywd%' "); 	
	while($row=sql_fetch_array($rs)) {
		//$row['img']=$cm->GetLecturerImg($row['lec_id'], $t='l', $width='106', $height='106', $ratio=true);//  GetItemImg($row['lec_id'], 2, 'l', 106, 106);
		$row['href']="/popkon/lecturer_view.php?lec_id=".$row['lec_id'];
		$list[]=$row;
	}
	if(!$list){
		$keywd =preg_split("/[\s,]+/",$keywd);	
		$sql_f = "AND (";
		$sql_where = "";
		$sql_l = ")";
		for($i=0;$i<count($keywd);$i++){		
			($sql_where)? $sql_where .= " OR ":"";
			$sql_where .= "lec_name like '%$keywd[$i]%' or lec_tag like '%$keywd[$i]%'";
		}	
		if($sql_where){
			$sql_where = $sql_f.$sql_where.$sql_l;
		}	
		$rs=sql_query("$sql_common WHERE(1) $sql_where "); 	
		while($row=sql_fetch_array($rs)) {
			//$row['img']=$cm->GetLecturerImg($row['lec_id'], $t='l', $width='106', $height='106', $ratio=true);//  GetItemImg($row['lec_id'], 2, 'l', 106, 106);
			$row['href']="/popkon/lecturer_view.php?lec_id=".$row['lec_id'];
			$list[]=$row;
		}
	}
	return $list;	
}


function GetSearchDataList($keywd) {
}

?>