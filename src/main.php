<div id="view_main" class="<?= (($view_type == "main") && ($cat_id == ""))? "active-view" : "non-display"?>">
	<div class="wrap-headline-roller">
		<div>
			<div id="headline_topLecture" class="headline-roller display-table">
				<div class="display-row">
					<strong class="heading">인기강좌</strong>
					<div class="headline">
						<ul class="roller" data-bind="foreach: headline.lecList">
							<li><a href="#" data-bind="attr: {'href': '#contents/all/' + cat_id + '/' + lec_cat_id + '/' + cat_name_enc}"><span class="nth" data-bind="text: nth"> </span><span data-bind="text: cat_name"> </span></a></li>
						</ul>
					</div>
					<a href="#" class="btn-collapse"><i class="glyphicon glyphicon-chevron-down"></i><span class="non-display">더보기</span></a>
				</div>
			</div>
		</div>
	</div>
	<div class="wrap-headline-tab non-display">
		<ul class="nav nav-tabs" role="tablist">
			<li class="active"><a href="#content_topLec" role="tab" data-toggle="tab">인기강좌</a></li>
			<li><a href="#content_topBook" role="tab" data-toggle="tab">인기도서 top10</a></li>
		</ul>

		<div class="tab-content">
			<div class="tab-pane active" id="content_topLec">
			  	<ol class="top-content-list" data-bind="foreach: headline.lecList">
			  		<li><a href="#" data-bind="text: cat_name, attr: {'href': '#contents/all/' + cat_id + '/' + lec_cat_id + '/' + cat_name_enc}"> </a></li>
			  	</ul>
			</div>
			<div class="tab-pane" id="content_topBook">
			  	<ol class="top-content-list" data-bind="foreach: headline.bookList">
			  		<li><a href="#" data-bind="text: cat_name, attr: {'href': '#contents/all/' + cat_id + '//' + cat_name_enc}"> </a></li>
			  	</ol>
			</div>
		</div>
		
		<a href="#" class="btn-collapse-close"><i class="glyphicon glyphicon-chevron-up"></i><span class="non-display">닫기</span></a>
	</div>

	<div id="owlca_ad">   
		<div class="loading-area text-center"><img src="/mobile/images/loading_64x64_ani.gif" alt="로딩이미지"/></div>
	</div>
	<?/*
	<div id="wrap_adViewButtons" style="display: none">
		<a href="#" class="btn btn-xs btn-small-black btn-movie">동영상보기 <i class="glyphicon glyphicon-chevron-right"></i></a>
		<a href="#" class="btn btn-xs btn-small-black btn-book">도서보기 <i class="glyphicon glyphicon-chevron-right"></i></a>
	</div>
	*/?>
	
	<div class="container more-with underline overline">
		<h2 class="heading-info tight"><strong>도서</strong> 추천상품</h2>
		<a href="#contents/book" class="view-more">전체보기 <i class="glyphicon glyphicon-plus"></i></a>
	</div>
	<div class="container">
		<div class="wrap-owlca-navigation-enabled">
			<div id="owlca_books">
				<div class="loading-area text-center"><img src="/mobile/images/loading_64x64_ani.gif" alt="로딩이미지"/></div>
			</div>
			<a href="#" class="owlca-nav-btn prev icon-64 circle-caret-left"></a>
			<a href="#" class="owlca-nav-btn next icon-64 circle-caret-right"></a>
		</div>
	</div>
    
    <a href="#doc/member_event/시대에듀의%20회원%20혜택" class="sdedu-event-member"><img src="/mobile/images/event_so_bn1.png" width="320" alt="시대에듀의 막강한 회원 혜택!"/></a>
    
    <div class="footer">
		<div class="container">
			<h2 class="heading-info"><strong>시대</strong> 회원서비스 안내</h2>
			<ul class="row wrap-icon">
				<li class="col-xs-3 col-sm-2 col-md-1 col-md-offset-3"><a href="#contents/freelec" class="icon"><i class="icon-64 square-free-lect"></i><span>무료강좌</span></a></li>
				<li class="col-xs-3 col-sm-2 col-md-1"><a href="#board/g4_write_data_gichul" class="icon"><i class="icon-64 square-foregoing"></i><span>기출문제</span></a></li>
				<li class="col-xs-3 col-sm-2 col-md-1"><a href="#board/g4_write_data_law" class="icon"><i class="icon-64 square-revised"></i><span>개정법령</span></a></li>
				<li class="col-xs-3 col-sm-2 col-md-1"><a href="#board/g4_write_data_err" class="icon"><i class="icon-64 square-errata"></i><span>정오표</span></a></li>
				<li class="hidden-xs col-sm-2 col-md-1"><a href="#board/g4_write_event" class="icon"><i class="icon-64 square-event"></i><span>이벤트</span></a></li>
				<li class="hidden-xs col-sm-2 col-md-1"><a href="#board/g4_write_cs_faq" class="icon"><i class="icon-64 square-faq"></i><span>FAQ</span></a></li>
			</ul>
		</div>
	</div>
    
    <!-- Begin page content -->
    <div class="bg-pattern">
    	<div class="container more-with">
			<h2 class="heading-info"><strong>이벤트 </strong>ZONE</h2>
			<a href="#board/g4_write_event" class="view-more">전체보기 <i class="glyphicon glyphicon-plus"></i></a>
			<div class="loading-area text-center" data-bind="visible: main.event.wr_id() == ''"><img src="/mobile/images/loading_64x64_ani.gif" alt="로딩이미지"/></div>
			<a href="#" class="sdedu-event-zone" data-bind="attr: {'href': '#board/g4_write_event/'+ main.event.wr_id()}"><img data-bind="attr: {'src': main.event.bf_file(), 'alt': main.event.wr_subject, visible: main.event.wr_id() != ''}" width="295" alt="speed 개념완성 특강" style="max-width: 590px;" src="/mobile/images/none.png"/></a>
		</div>
    </div>
    <div class="bg-pattern wrap-main-exam-list">
    	<div class="container more-with">
			<h2 class="heading-info"><strong>시험임박 </strong>최신 시험일정</h2>
			<a href="#board/g4_write_dcc_exam" class="view-more">전체보기 <i class="glyphicon glyphicon-plus"></i></a>
			<ol class="list-group" data-bind="foreach: main.exam">
				<li class="list-group-item"><a data-bind="attr: {'href': '#board/g4_write_dcc_exam/' + wr_id() }"><em data-bind="text: ES_wrsdate"></em> <span data-bind="text: wr_subject"><span class="loading-area"><img src="/mobile/images/loading_64x64_ani.gif" alt="로딩이미지"/></span></span></a></li>
			</ol>
		</div>
    </div>
    <div class="bg-pattern">
    	<div class="container">
    		<div class="main-notice-item">
    			<a data-bind="attr: {'href': '#board/g4_write_cs_notice/' + main.notice.wr_id() }"><strong class="foreword notice">공지사항</strong> <span data-bind="text: main.notice.wr_subject"><span class="loading-area"><img src="/mobile/images/loading_64x64_ani.gif" alt="로딩이미지"/></span></span></a>
    		</div>
    	</div>
    </div>
    <div class="bg-pattern">
    	<div class="container">
    		<div class="main-notice-item">
    			<a data-bind="attr: {'href': '#board/g4_write_dcc_notice/' + main.news.wr_id() }"><strong class="foreword news">새소식</strong> <span data-bind="text: main.news.wr_subject"><span class="loading-area"><img src="/mobile/images/loading_64x64_ani.gif" alt="로딩이미지"/></span></span></a>
    		</div>
    	</div>
    </div>
    
	<? 	/*
        <div id="logindiv">
                <form class="form-inline" role="form">
                    <div class="form-group"><input name=varid data-bind="value: mid" placeholder="아이디" class="form-control" focus /></div>
                    <div class="form-group"><input name=varpw type="password" data-bind="value: mpw" placeholder="비밀번호" class="form-control" /></div>
                    <div class="form-group"><input name=adm_password type="password" data-bind="value: madmpw" placeholder="관리자 비밀번호" class="form-control" /></div>
                    <div class="checkbox"><label><input type="checkbox" data-bind="value: mrememberid"> 아이디 저장</label></div>
                    <button type="button" class="btn btn-xs btn-success" data-bind="click: loginme">로그인</button>
                </form>
        </div>
        
       
					<!-- ko ifnot: mnamehello --><? if("{$member[mb_name]}"!='') {?><div class="form-group"><?=$member[mb_name]?>님! 안녕하세요.</div><? }?><!-- /ko -->
					<!-- ko if: mnamehello --><div class="form-group" data-bind="text: mnamehello"></div><!-- /ko -->
        
       
        
        <div class="page-header"> 
	        <h1>사재훈
	        ㅎ </h1>
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
   
   
   
   */ ?>
</div>