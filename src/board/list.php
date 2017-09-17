    <div id="view_boardList" class="non-display">
    	<h1 class="heading-contents">
    		<span data-bind="text: board.heading.name">제목</span>
    	</h1>
    	
    	<? //검색 양식 [시작]?>
    	<form id="form_searchBoardList" action="/mobile/mb/board.php" method="post" role="form" class="form-group" data-bind="visible: board.heading.type() != 'event'">
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
    		<input type="hidden" name="ongoing" value="1"/>
    	</form><? //검색 양식 [종료]?>
    	
    	<?//게시판 리스트 [시작]?>
    	<div class="panel panel-default">
    		<div class="panel-body">
    			<?// 일반 게시판 [시작]?>
		    	<table class="board-list table table-striped" data-bind="visible: board.heading.type() != 'event'">
		    		<thead>
		    			<tr>
		    				<th class="num hidden-xs hidden-sm">번호</th>
		    				<th class="subject">제목</th>
		    				<th class="writer hidden-xs">작성자</th>
		    				<th class="date hidden-xs">작성일</th>
		    				<th class="reply-status" data-bind="visible: board.heading.type() == 'qna'">답변상태</th>
		    				<th class="count hidden-xs hidden-sm">조회수</th>
		    			</tr>
		    		</thead>
		    		<tbody data-bind="foreach: board.list">
		    			<tr data-bind="attr: {'data-wr_id': wr_id}">
		    				<td class="num hidden-xs hidden-sm" data-bind="text: rnum">1</td>
		    				<td class="subject"><a href="#" data-bind="text: wr_subject, attr:{'href': '#board/' + $root.board.table() + '/' + wr_id}"></a></td>
		    				<td class="writer hidden-xs" data-bind="text: $root.board.hideWriterName(wr_name)">관리자</td>
		    				<td class="date hidden-xs" data-bind="text: $root.cutDate( wr_datetime )">2014-06-28</td>
		    				<td class="reply-status" data-bind="visible: $root.board.heading.type() == 'qna'"><span class="reply-status-icon" data-bind="text: $root.board.convertAnswerComplete( wr_7 )"></span></td>
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
		    	<?// 일반 게시판 [종료]?>
		    	
		    	<?// 이벤트 게시판 [시작]?>
		    	<? if (($member['mb_id'] == 'sd_yotimer') || ($member['mb_id'] == 'sd_ohj0213') || ($member['mb_id'] == 'sunsky0802') ) {?>
			    <div data-bind="visible: board.heading.type() == 'event'" class="wrap-ongoing-selector row">
			    	<button class="col-xs-6 col-sm-3 col-sm-offset-3 btn btn-info" data-ongoing="1">진행중 이벤트</button>
			    	<button class="col-xs-6 col-sm-3 btn btn-default" data-ongoing="0">완료 이벤트</button>
			    </div>
				<? } ?>
		    	<div class="board-list-event" data-bind="visible: board.heading.type() == 'event', foreach: board.eventList">
		    		<div class="row">
		    			<div class="col-md-6 col-md-push-6">
			    			<h4><a data-bind="text: wr_subject, attr: {'href': '#board/' + $root.board.table() + '/' + wr_id}">제목</a></h4>
			    			<dl class="board-list-event-status">
			    				<dt>기간 :</dt><dd><span data-bind="text: $root.dateFormat( wr_1 )"></span> ~ <span data-bind="text: $root.dateFormat( wr_3 )"></span></dd>
			    				<dt>진행상태 :</dt><dd><span class="event-status" data-bind="text: $root.board.convertOngoingEvent( wr_1, wr_3 )"></span></dd>
			    			</dl>
		    			</div>
		    			<a class="col-md-6 col-md-pull-6" data-bind="attr: {'href': '#board/' + $root.board.table() + '/' + wr_id}"><img data-bind="attr: {'src': '/data/file/event/' + file['0'].file}" src="/mobile/images/none.png" alt="이벤트 이미지"/></a>
		    		</div>
		    	</div>
		    	<?// 이벤트 게시판 [종료]?>
		    	
		    	<ul class="pager">
		    		<li class="next">
		    			<a href="#" id="button_boardList_write" data-bind="visible: board.hasAuthWrite">글쓰기</a>
		    		</li>
		    	</ul>
		    	<div class="wrap-pagination">
			    	<ul class="pagination">
			    		<li data-bind="css: {disabled: $root.board.pagination.isFirstPageGroup() == true }"><a href="#" class="" data-bind="click: $root.board.pagination.onMovePrevClick">&#8678;</a></li>
			    		<!-- ko foreach: board.pagination.list -->
			    		<li data-bind="css: {active: $root.board.pagination.page() == $data}"><a href="#" data-bind="text: $data, click: $root.board.pagination.onPageClick">1</a></li>
			    		<!-- /ko -->
			    		<li data-bind="css: {disabled: $root.board.pagination.isLastPageGroup() == true }"><a href="#" class="" data-bind="click: $root.board.pagination.onMoveNextClick">&#8680;</a></li>
			    	</ul>
		    	</div>
	    	</div>
    	</div><?//게시판 리스트 [종료]?>
    </div>