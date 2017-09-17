    <div id="view_boardList">
    	<h1 class="heading-contents">
    		<span data-bind="text: board.heading.name"></span>
    	</h1>
    	
    	<? //검색 양식 [시작]?>
    	<form id="form_searchBoardList" action="/mobile/mb/board.php" method="get" role="form" class="form-group">
    		<div class="input-group">
    			<?/*<!--<div class="input-group-btn">
	    			<select name="sfl" class="form-control">
		    			<option value="wr_subject">제목</option>
		    			<option value="wr_content">내용</option>
		    			<option value="wr_subject||wr_content">제목+내용</option>
		    			<option value="mb_id">회원아이디</option>
		    			<option value="wr_name">글쓴이</option>
		    		</select>
	    		</div>-->*/?>
    			<input type="text" class="form-control" name="stx" value=""/>
	    		<span class="input-group-btn">
	    			<button type="submit" class="btn btn-primary form-control">검색</button>
	    		</span>
    		</div>
    		<input type="hidden" name="table" value="g4_write_cs_notice"/>
    		<?
    		/*		
1:1 g4_write_cs_inquery 
공지 g4_write_cs_notice 
최신뉴수 g4_write_dcc_notice 
시험공고 g4_write_dcc_exam 
기출 g4_write_data_gichul 
개정법령 g4_write_data_law 
정오표 g4_write_data_err 
이벤 g4_write_event 
FAQ g4_write_cs_faq 
상식 g4_write_dcc_sisa
			 * 
			 */
    		?>
    		<input type="hidden" name="page" value="1"/>
    		<input type="hidden" name="rows" value="10"/>
    		<input type="hidden" name="sop" value="and"/><?// or ?>
    	</form><? //검색 양식 [종료]?>
    	
    	<?//게시판 리스트 [시작]?>
    	<div class="panel panel-default">
    		<div class="panel-body">
		    	<table class="board-list table table-striped">
		    		<thead>
		    			<tr>
		    				<th class="num hidden-xs hidden-sm">번호</th>
		    				<th class="subject">제목</th>
		    				<th class="writer hidden-xs">작성자</th>
		    				<th class="date">작성일</th>
		    				<th class="count hidden-xs hidden-sm">조회수</th>
		    			</tr>
		    		</thead>
		    		<tbody data-bind="foreach: board.list">
		    			<tr data-bind="attr: {'data-wr_id': wr_id}">
		    				<td class="num hidden-xs hidden-sm" data-bind="text: rnum">1</td>
		    				<td class="subject"><a href="#" data-bind="text: wr_subject, click: $root.board.onItemClick, attr:{'href': '#' + $root.board.table() + '/' + wr_id}">[일반] 트리플 할인 이벤트 발표를 하며 테스트 하게 됩니다.</a></td>
		    				<td class="writer hidden-xs" data-bind="text: wr_name">관리자</td>
		    				<td class="date" data-bind="text: $root.cutDate( wr_datetime )">2014-06-28</td>
		    				<td class="count hidden-xs hidden-sm" data-bind="text: wr_hit">23</td>
		    			</tr>
		    		</tbody>
		    	</table>
		    	<script type="text/html" id="template_boardType_accordion">
		    		<tr class="accordion-collapse-content non-display">
	    				<td colspan="5"><p></p></td>
	    			</tr>
	    			<tr class="non-display">
	    				<td colspan="5"></td>
	    			</tr>
		    	</script>
		    	<ul class="pager">
		    		<li class="next"><a href="#" id="button_boardList_write">글쓰기</a></li>
		    	</ul>
		    	<div class="wrap-pagination">
			    	<ul class="pagination">
			    		<li data-bind="css: {disabled: $root.pagination.isFirstPageGroup() == true }"><a href="#" class="" data-bind="click: $root.pagination.onMovePrevClick">&#8678;</a></li>
			    		<!-- ko foreach: pagination.list -->
			    		<li data-bind="css: {active: $root.pagination.page() == $data}"><a href="#" data-bind="text: $data, click: $root.pagination.onPageClick">1</a></li>
			    		<!-- /ko -->
			    		<li data-bind="css: {disabled: $root.pagination.isLastPageGroup() == true }"><a href="#" class="" data-bind="click: $root.pagination.onMoveNextClick">&#8680;</a></li>
			    	</ul>
		    	</div>
	    	</div>
    	</div><?//게시판 리스트 [종료]?>
    </div>