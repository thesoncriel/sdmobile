<? // 우편번호 찾기 모달폼 [시작] ?>
	<div class="modal fade" id="modal_zipcode" tabindex="-1" role="dialog" aria-labelledby="label_modal_zipcode" aria-hidden="true">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	        <h4 class="modal-title" id="label_modal_zipcode">우편번호 검색</h4>
	      </div>
	      <div class="modal-body">
	        <h5>* 찾고자 하시는 주소의 동(읍/면/리)을 입력하세요.</h5>
	        <em>예) 수유, 두리, 무지 (두글자 이상)</em>
	        <form action="/bbs/zip_json.php" id="form_searchZipcode">
	        	<input type="hidden" name="frm_name"  value="forderform"/>
				<input type="hidden" name="frm_zip1"  value="od_zip1"/>
				<input type="hidden" name="frm_zip2"  value="od_zip2"/>
				<input type="hidden" name="frm_addr1" value="od_addr1"/>
				<input type="hidden" name="frm_addr2" value="od_addr2"/>
				<input type="hidden" name="x" value="0"/>
				<input type="hidden" name="y" value="0"/>
				
				<input type="text" name="addr1"/>
				<button type="submit">검색</button>
	        </form>
	        
	        <div data-bind="with: zipcode">
	        	<h5>검색결과</h5>
	        	<p>총 <span data-bind="text: getCount">0</span>건 가나다순</p>
	        	<ul class="list_zipcode" data-bind="foreach: list">
	        		<li>
	        			<a href="#" data-dismiss="modal" data-bind="click: $parent.onselected">
		        			<span data-bind="text: zip1" class="zip1"></span>-
		        			<span data-bind="text: zip2" class="zip2"></span> : 
		        			<span data-bind="text: addr" class="addr"></span> 
		        			<span data-bind="text: bunji" class="bunji"></span>
	        			</a>
	        		</li>
	        	</ul>
	        </div>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
	      </div>
	    </div>
	  </div>
	</div>
	<? // 우편번호 찾기 모달폼 [종료] ?>