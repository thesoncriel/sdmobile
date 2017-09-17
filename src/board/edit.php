    <?//게시판 작성하기 [시작]?>
    <div id="view_boardEdit" class="non-display">
    	<h1 class="heading-contents"><span data-bind="text: board.heading.name"></span>
    		<!-- ko if: board.isWriteMode() == true -->작성<!-- /ko -->
    		<!-- ko if: board.isWriteMode() == false -->수정<!-- /ko -->
    	</h1>
    	
    	<div class="panel panel-info">
			<h2 class="panel-heading">
				<!-- ko if: board.isWriteMode() == true -->글쓰기<!-- /ko -->
    			<!-- ko if: board.isWriteMode() == false -->글수정<!-- /ko -->
			</h2>
    		<div class="panel-body">
    			<form id="form_boardEdit" action="/mobile/mb/board.php" class="form-horizontal" role="form" method="post" data-bind="with: board.detail">
    				<input type="hidden" name="table" data-bind="value: $root.board.table"/>
    				<input type="hidden" name="wr_id" data-bind="value: wr_id"/>
    				<input type="hidden" name="w" data-bind="value: $root.board.getEditMode"/>
    				<input type="hidden" name="page" value="1"/>
    				<input type="hidden" name="rows" value="10"/>
    				
    				<div class="form-group" data-bind="visible: ($root.board.caNameList() != undefined) && ($root.board.caNameList().length > 0)">
    					<label for="select_boardEdit_caName" class="col-sm-2">분류</label>
    					<div class="col-sm-10">
    						<select name="ca_name" id="select_boardEdit_caName" class="form-control" 
    							data-bind="options: $root.board.caNameList,
    										optionsText: 'ca_name',
    										optionsValue: 'ca_name',
    										value: ca_name,
    										optionsCaption: '선택하세요'">
	    					</select>
    					</div>
    				</div>
    				<div class="form-group">
    					<label for="textbox_boardEdit_wrSubject" class="col-sm-2">제목</label>
    					<div class="col-sm-10">
    						<input type="text" id="textbox_boardEdit_wrSubject" class="form-control" name="wr_subject" data-bind="value: wr_subject"/>
    					</div>
    				</div>
    				<div class="form-group">
    					<label class="col-sm-2">작성내용</label>
    					<div class="col-sm-10">
    						<div id="textbox_boardEdit_wrContentEditable" class="form-control" contenteditable="true" data-bind="html: wr_content"></div>
    						<textarea id="textbox_boardEdit_wrContent" class="form-control" name="wr_content" rows="4" data-bind="text: wr_content"></textarea>
    					</div>
    				</div>
    			</form>
	    	</div>
    	</div>
    	<ul class="pager">
    		<li>
    			<button type="submit" class="button_boardEdit_writeComplete btn btn-success">작성완료</button>
    		</li>
			<li class="next">
				<a href="#" class="button_gotoBoardList">목록</a>
			</li>
		</ul>
    </div><?//게시판 작성하기 [종료]?>
    <div class="wrap_modal wrap-modal-boardEdit">
		<div class="wrap-loading">
			<div class="loading-area text-center">
				<img src="/mobile/images/loading_64x64_ani.gif" width="64" height="64" alt="로딩중..."/>
			</div>
		</div>
	</div>