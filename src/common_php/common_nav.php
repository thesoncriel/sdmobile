<div class="modal fade" id="modal_loading" style="<?= (($view_type == "main"))? "" : "display: none;"?>">
    <div class="loading-area text-center">
    	<div class="text-center"><img src="/mobile/images/loading_64x64_ani.gif" alt="로딩이미지"/></div>
    	<span class="now-loading" id="span_nowLoading">로딩중...</span>
    	<button class="btn btn-warning btn-refresh non-display" id="button_docRefresh" data-bind="click: $root.onRefreshClick" onclick="location.reload(true);">새로고침</button>
    </div>
</div>

<div class="navbar navbar-fixed-top navbar-top" role="navigation">
	<div class="container container-navbar">
		<div class="wrap-top-nav">
    		<h1 class="logo"><a href="/mobile" class="logo-64">합격,시대路! 시대고시기획</a></h1>
	    	<ul class="top-nav">
	    		<li class="non-display" data-bind="text: $root.member.hasLogin()"></li>
	    		<? if(($member['mb_id'] == 'sd_yotimer')/*$_SERVER['REMOTE_ADDR'] == '58.76.45.204'*/) {?>
				<li class="top-nav-right non-display" data-bind="css: {'non-display': $root.member.hasLogin() == false}"><a href="mb/main.php" data-execute="maindata"><i class="glyphicon glyphicon-ok-circle"></i><span class="non-display">메인데이터 생성</span></a></li>
				<? } ?>
				<li class="top-nav-right non-display" data-bind="css: {'non-display': $root.member.hasLogin() == false}"><a href="#" class="icon-40 mypage" data-opener="mymenu">마이페이지</a></li>
	    		<?//<li class="top-nav-right non-display" data-bind="css: {'non-display': $root.member.hasLogin() == false}"><a href="#" id="button_myMenuOpenerTop" class="icon-40 mypage">마이페이지</a></li>?>
	    		<?//<li class="top-nav-right non-display" data-bind="css: {'non-display': $root.member.hasLogin() == false}"><a href="#order/cartlist" class="icon-40 cart" data-bind="click: onClickBoard">장바구니</a></li>?>
	    		<li class="top-nav-right non-display" data-bind="css: {'non-display': $root.member.hasLogin() == true}"><a href="#member/login" class="bg-40 bg-login">로그인</a></li>
	    		<li class="top-nav-left">
	    			<a href="#" id="button_navbarOpener" class="icon-40 menu">메뉴</a>
	    		</li>
	    	</ul>
    	</div>
    	
      <?/*<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="<?=$mobilehome?>">시대교육</a>
	   */?>
    </div>
    <div class="navbar-middle">
    	<div class="container container-navbar">
			<form id="form_topSearch" class="navbar-right row" role="form" action="/mobile/mb/contents.php" method="get">
				
				<div class="non-display">
					<select name="it_type">
		    			<option value="0">도서</option>
		    			<option value="1" selected="selected">동영상</option>
		    			<option value="2">모의고사</option>
		    		</select>
		    		<select name="order_by">
		    			<option value="1">발행일순</option>
		    			<option value="2">상품명순</option>
		    			<option value="3">최저가순</option>
		    		</select>
		    		<select name="content_type">
		    			<option value="">전체</option>
		    			<option value="3">종합반</option>
		    			<option value="1">단과반</option>
		    			<option value="99">무료강좌</option>
		    		</select>
		    		<input type="hidden" name="showall" value="false"/>
		    		<input type="number" name="page" value="2"/>
		    		<input type="number" name="rows" value="5"/>
	    		</div>
	    		<div class="col-lg-6 col-lg-offset-3">
	    			<div class="input-group">
	    				<? if (($member['mb_id'] == 'sd_yotimer') || ($member['mb_id'] == 'sd_ohj0213') || ($member['mb_id'] == 'sunsky0802') ) {?>
						<input type="text" class="form-control" name="stx" placeholder="SSAT"/>
						<?}else{?>
						<input type="text" class="form-control" name="stx" placeholder="검색어를 입력해 주세요."/>
						<?}?>
		    			<span class="input-group-btn">
		    				<button type="submit" class="btn btn-default"><span class="icon-20 search"></span><span class="text-hide">검색</span></button>
		    			</span>
		    		</div>
	    		</div> 
	    	</form>
	    	<? //검색 양식 [시작]
	    	/*
	    	<form id="form_searchContents" action="/mobile/mb/contents.php" method="get" style="display: none;">
	    		<select name="it_type">
	    			<option value="0">도서</option>
	    			<option value="1" selected="selected">동영상</option>
	    		</select>
	    		<select name="order_by">
	    			<option value="1">발행일순</option>
	    			<option value="2">상품명순</option>
	    			<option value="3">최저가순</option>
	    		</select>
	    		<select name="contents_type">
	    			<option value="1">종합반</option>
	    			<option value="2">단과반</option>
	    			<option value="3">무료강좌</option>
	    		</select>
	    		<input type="text" name="stx" value="독학"/>
	    		<input type="number" name="page" value="2"/>
	    		<input type="number" name="rows" value="5"/>
	    		<!--<input type="hidden" name="it_id" value="1401264230"/>-->
	    		<input type="submit" value="검색"/>
	    	</form>*/ //검색 양식 [종료]?>
		</div>
    </div>
</div><? // .navbar-header ?>

<div id="nav_category">
	<div class="wrap-nav-category">
		<h2><i class="glyphicon glyphicon-list"></i>Category</h2>
		<div class="wrap-nav-category-list">
			<div id="nav_categoryMain" class="wrap-category-block">
				<div id="scroller_categoryMain">
					<ul id="accordion_navCategory" class="list-group nav-category" data-bind="foreach: {data: category, as: 'cat'}">
						<li class="list-group-item">
							<a data-toggle="collapse" data-parent="#accordion_navCategory" href="#collapse_nav1" class="" 
														data-bind="text: cat.cat_name, 
														attr: {'href': '#collapse_nav' + cat_id(), 'data-index': $index()}"></a>
							<ul class="list-group panel-collapse collapse" data-bind="foreach: {data: sub_cat, as: 'catsub1'}, attr: {'id': 'collapse_nav' + cat_id(), 'data-index': $index()}">
								<li class="list-group-item"><a href="#" data-bind="text: cat_name, attr: {'data-index': $index(), 'href': '#nav/category/' + $parentContext.$index() + '/' + $index()}"></a></li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
			<div class="wrap-category-block sub">
				<a href="#" class="nav-category-sub-header" data-bind="text: nav.selected.cat_name"></a>
				<div id="nav_categorySub">
					<div id="scroller_categorySub">
						<ul id="list_navCategorySub" class="list-group nav-category sub">
							<li class="list-group-item">
								<ul class="sub-list list-group" data-bind="foreach: nav.selected.sub_cat">
									<li class="list-group-item"><a href="#" data-bind="text: cat_name, attr: {'href': '#contents/all/' + cat_id() + '/' + lec_cat_id + '/' + cat_name() }, css: {'lecture-included': lec_cat_id != ''}"></a></li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
	<a href="#" class="close glyphicon glyphicon-remove"></a>
</div><? // #nav_category ?>

<div id="nav_myMenu">
	<div id="scroller_myMenu">
		<div class="wrap-nav-mymenu">
			<h2 class="login-info">
				<!-- ko if: member.mb_name -->
				<i class="glyphicon glyphicon-user"></i> 
				<span data-bind="text: member.mb_name"></span>
				<!-- /ko -->
				<!-- ko ifnot: member.mb_name -->
				<i class="glyphicon glyphicon-lock"></i> 
				로그인 하세요 
				<!-- /ko -->
				<a href="#member/logout" class="logout" data-bind="visible: member.hasLogin"><i class="glyphicon glyphicon-off"></i><span class="non-display">로그아웃</span></a>
				<a href="#" class="close glyphicon glyphicon-remove"></a>
			</h2>
			<!-- ko ifnot: member.mb_name -->
			<div class="row wrap-login-buttons">           
				<a href="#member/login" class="col-xs-6">로그인</a>
				<a href="#member/join" class="col-xs-6">간편 회원가입</a>
			</div>
			<!-- /ko -->
			<div class="wrap-mymenu-middle">
				<ul class="row wrap-icon wrap-icon-circle-pack">
					<li class="non-display"><a href="#"></a></li>              	
					<li class="col-xs-3"><a href="#order/booklist"><i class="icon-64 circle-book"></i><span>도서</span></a></li>
                    <li class="col-xs-3"><a href="#mypage/mylec"><i class="icon-64 circle-movie"></i><span>동영상</span></a></li>
					<li class="col-xs-3"><a href="#order/cartlist"><i class="icon-64 circle-cart"></i><span>장바구니</span></a></li>
					<li class="col-xs-3"><a href="#order/mocklist"><i class="icon-64 circle-mock"></i><span>모의고사</span></a></li>
					<li class="clearfix"></li> 
					<li class="col-xs-3"><a href="#mypage/coupon"><i class="icon-64 circle-coupon"></i><span>쿠폰</span></a></li>
					<li class="col-xs-3"><a href="#mypage/mileage"><i class="icon-64 circle-cash"></i><span>적립금</span></a></li>
					<li class="col-xs-3"><a href="#board/g4_write_cs_inquery" onclick="alert('준비중입니다.'); return false;"><i class="icon-64 circle-counsel"></i><span>1:1상담</span></a></li>
					<li class="col-xs-3"><a href="#mypage/regbook"><i class="icon-64 circle-reg-book"></i><span>도서등록</span></a></li>
					<?//<li class="col-xs-3"><a href="#board/g4_write_event"><i class="icon-64 circle-event"></i><span>이벤트</span></a></li>?>
				</ul>
				<ul class="row wrap-mymenu-middle-buttons">
					<li class="col-xs-6">
						<a href="#order/list" class="btn btn-default btn-block order-query">주문/배송조회</a>
					</li>
					<li class="col-xs-6">
						<a href="#member/modify" class="btn btn-default btn-block">정보수정</a>
					</li>
				</ul>
				<div class="wrap-mymenu-footer">
					<h2 class="heading-info"><strong>시대 </strong> 회원서비스 안내</h2>
					<ul class="row wrap-icon">
						<li class="col-xs-3"><a href="#board/g4_write_data_err" class="icon"><i class="icon-64 square-errata"></i><span>정오표</span></a></li>
						<li class="col-xs-3"><a href="#board/g4_write_data_gichul" class="icon"><i class="icon-64 square-foregoing"></i><span>기출문제</span></a></li>
						<li class="col-xs-3"><a href="#board/g4_write_data_law" class="icon"><i class="icon-64 square-revised"></i><span>개정법령</span></a></li>
						<li class="col-xs-3"><a href="#contents/freelec" 		class="icon"><i class="icon-64 square-free-lect"></i><span>무료강좌</span></a></li>
						<li class="clearfix"></li>
						<li class="col-xs-3"><a href="#board/g4_write_dcc_exam" class="icon"><i class="icon-64 square-test-notice"></i><span>시험공고</span></a></li>
						<li class="col-xs-3"><a href="#board/g4_write_dcc_sisa" class="icon"><i class="icon-64 square-common-sense"></i><span>일일상식</span></a></li>
						<li class="col-xs-3"><a href="#board/g4_write_cs_faq" class="icon"><i class="icon-64 square-faq"></i><span>FAQ</span></a></li>
						<li class="col-xs-3"><a href="#board/g4_write_event" class="icon"><i class="icon-64 square-event"></i><span>이벤트</span></a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="aside">
	<a href="#" id="button_gotoTop" class="icon-64 square-goto-top">위로</a>
</div>