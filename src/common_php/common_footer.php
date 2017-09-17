<!--//footer start-->

<div class="footer" data-bind="visible: main.isMain() == false">
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

<div class="footer navbar-footer">
	<div class="container">
		<ul>
			<!-- ko if: (member.hasLogin() == false) -->
			<li><a href="#member/login">로그인</a></li>
			<li><a href="#member/join">회원가입</a></li>
			<!-- /ko -->
			<!-- ko if: member.hasLogin() == true -->
			<li><a href="#member/logout">로그아웃</a></li>
			<!-- /ko -->
			<li><a href="/popkon?from=mobile">PC버전</a></li>
			<li><a href="/m/?from=mobileV2">기존 모바일</a></li>
		</ul>
	</div>
</div>
<div class="footer">
	<div class="container buttons-footer">
		<ul>
			<li><a href="#doc/company_info/회사소개">회사소개</a></li>
			<li><a href="#doc/terms_conditions/이용약관">이용약관</a></li> 
			<li><a href="#doc/customer_info_policy/개인정보취급방침">개인정보취급방침</a></li>
			<li><a href="tel:1600-3600" class="anchor_callCustomerCenter"><i class="glyphicon glyphicon-earphone"></i> 고객센터(<span class="phone-number">1600-3600</span>)</a></li>
		</ul>
		<div class="company-info">
			<small>
				copyright SIDAEGOSI All rights reserved<br/>
				(주)시대에듀 사업자등록번호:1O5-2O-44714<br/>
				주소:서울시 마포구 큰우물로 75 (도화동 538) 성지B/D 9F<br/>
				통신판매신고:제2013-서울마포-0772호<br/>
				대표이사: 이해욱
			</small>
		</div>
	</div>
</div>

<div id="toast_message"></div>

<div class="modal fade" id="modal_message_backdrop" data-backdrop="true" role="dialog" aria-hidden="true">
    
</div>

<div class="footer-float-nav-margin"></div>
<div class="footer-float-nav text-center">
	<a id="button_footerNavCloser" href="#" class="bg-32 bg-f-nav-close">닫기/열기</a>
	<div class="footer-float-nav-icons">
		<div class="container">
			<ul class="row wrap-icon">
				<li class="col-xs-3 col-sm-2 col-md-1 col-sm-offset-2 col-md-offset-4"><a href="#home" class="icon-64 outline-home">홈</a></li>
				<?//<li class="col-xs-3 col-sm-2 col-md-1"><a href="#mypage/mylec" class="icon-64 outline-mypage">마이페이지</a></li>?>
				<li class="col-xs-3 col-sm-2 col-md-1"><a href="#" class="icon-64 outline-mypage" data-opener="mymenu">마이페이지</a></li>
				<li class="col-xs-3 col-sm-2 col-md-1"><a href="#order/cartlist" class="icon-64 outline-cart">장바구니</a></li>
				<li class="col-xs-3 col-sm-2 col-md-1"><a href="tel:1600-3600" class="icon-64 outline-phone">고객센터</a></li>
			</ul>
		</div>
	</div>
</div>

<!--//footer-->
