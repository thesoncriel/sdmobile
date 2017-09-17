    <?//게시판 상세보기 [시작]?>
    <div id="view_boardDetail" class="<?= (($view_type == "board") && ($bbsId != ""))? "active-view" : "non-display"?>">
    	<h1 class="heading-contents"><span data-bind="text: board.heading.name"></span> 확인</h1>
    	
    	<div class="panel panel-info" data-bind="with: board.detail">
			<h2 class="panel-heading">
				<span data-bind="text: wr_subject"></span><br/>
				<span data-bind="visible: $root.board.heading.type() == 'qna'"><small>작성자 : <span data-bind="text: $root.board.hideWriterName(wr_name)"></span> | 작성일 : <span data-bind="text: $root.cutDate( wr_datetime )"></span></small></span>
			</h2>
    		<div class="panel-body">
    			<ul class="list-group" data-bind="foreach: file, visible: $root.board.heading.type() != 'event'">
    				<li class="list-group-item"><a data-bind="text: source, attr: {'href': '/bbs/' + href + '&amp;svs=brand'}" target="_blank"></a> (<span data-bind="text: size"></span>)</li>
    			</ul>
    			<p class="wrap-wr-content" data-bind="html: wr_content"></p>
	    	</div>
    	</div>
    	
    	<div class="panel panel-warning" data-bind="with: board.detailReply, visible: board.hasDetailReply">
    		<h2 class="panel-heading">
    			<strong>시대교육</strong> <span data-bind="text: wr_datetime"></span>
    		</h2>
    		<div class="panel-body">
    			<ul class="list-group" data-bind="foreach: $root.board.detailReplyfile, visible: $root.board.heading.type() == 'qna'">
    				<li class="list-group-item"><a data-bind="text: source, attr: {'href': '/bbs/' + href + '&amp;svs=brand'}" target="_blank"></a> (<span data-bind="text: size"></span>)</li>
    			</ul>
    			<pre class="wrap-wr-content" data-bind="html: wr_content"></pre>
    		</div>
    	</div>
    	
    	<form id="form_boardComment" action="mb/board_comment.php" method="get" class="non-display">
    		<input type="text" name="page" value="1"/>
    		<input type="text" name="rows" value="5"/>
    		<input type="text" name="table" data-bind="value: board.table"/>
    		<input type="text" name="wr_id" data-bind="value: board.wr_id"/>
    		<select name="cw">
    			<option value="">댓글보기</option>
    			<option value="n">댓글달기</option>
    			<option value="u">댓글업데이트</option>
    			<option value="d">댓글삭제</option>
    			<option value="r">댓글달기</option>
    		</select>
    	</form>
    	<div data-bind="visible: board.heading.comment">
    		<h4>의견 덧글 달기</h4>
	    	<form id="form_boardCommentWrite" action="mb/board_comment.php" method="post" class="row">
	    		
	    		<div class="col-md-10">
	    			<input type="hidden" name="mb_id" data-bind="value: member.mb_id"/>
	    			<input type="hidden" name="wr_id" data-bind="value: board.wr_id"/>
	    			<input type="hidden" name="table" data-bind="value: board.table"/>
	    			<input type="hidden" name="cw" value="n"/>
	    			<textarea name="wr_content" class="form-control" rows="3"></textarea>
	    		</div>
	    		<div class="col-md-2 text-center">
	    			<button type="submit" class="btn btn-primary">덧글쓰기</button>
	    		</div>
	    	</form>
    	</div>
    	
    	<ul class="list-group comment-list" data-bind="foreach: comment.list">
    		<li class="list-group-item comment-item">
    			<div>
    				<strong data-bind="text: b_mb_id"></strong>
					<span class="comment-date" data-bind="text: wr_datetime"></span>
					<pre class="comment-item-collapsed" data-bind="html: wr_content, click: $root.board.onToggleComment"></pre>
					<a href="#" class="comment-icon-collapse glyphicon glyphicon-chevron-down" data-bind="click: $root.board.onToggleComment"></a>
    			</div>
    		</li>
    	</ul>
    	
    	<div class="wrap-pagination" data-bind="visible: comment.list().length > 0">
	    	<ul class="pagination">
	    		<li data-bind="css: {disabled: $root.comment.pagination.isFirstPageGroup() == true }"><a href="#" class="" data-bind="click: $root.comment.pagination.onMovePrevClick">&#8678;</a></li>
	    		<!-- ko foreach: comment.pagination.list -->
	    		<li data-bind="css: {active: $root.comment.pagination.page() == $data}"><a href="#" data-bind="text: $data, click: $root.comment.pagination.onPageClick">1</a></li>
	    		<!-- /ko -->
	    		<li data-bind="css: {disabled: $root.comment.pagination.isLastPageGroup() == true }"><a href="#" class="" data-bind="click: $root.comment.pagination.onMoveNextClick">&#8680;</a></li>
	    	</ul>
    	</div>
    	
    	<ul class="pager">
			<li class="next">
				<a href="#" class="button_gotoBoardList">목록</a>
				<a href="#" class="button_boardEdit_modify" data-bind="visible: board.hasAuthWrite">수정</a>
			</li>
		</ul>
    </div><?//게시판 상세보기 [종료]?> 