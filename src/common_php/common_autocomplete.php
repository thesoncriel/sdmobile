	<?// 자동완성 부분 [시작]?>
	<div id="panel_autoComplete" class="panel panel-default panel-autocomplete non-display">
		<form id="form_autoComplete" action="/mobile/mb/search_cate.php" method="post" class="non-display">
			<input type="hidden" name="rows" value="5"/>
			<input type="text" name="stx" value="" autocapitalize="off" autocomplete="off" autocorrect="off"/>
		</form>
		<ul class="list-group" id="list_autoComplete" data-bind="foreach: autocomplete.list, visible: autocomplete.used">
			<li class="list-group-item"><a href="#" data-bind="text: cat_name, attr: {'href': '#contents/all/' + cat_id + '/' + lec_cat_id + '/' + cat_name}"></a></li>
		</ul>
		<div class="panel-footer">
			<a href="#" class="last-search-used">자동완성 <!-- ko ifnot: autocomplete.used -->켜기<!-- /ko --><!-- ko if: autocomplete.used -->끄기<!-- /ko --></a>
			<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span> <span class="close-x-text">닫기</span></button>
		</div>
	</div>
	<?// 자동완성 부분 [종료]?>
	<?// 최근 검색어 부분 [시작]?>
	<div id="panel_lastSearchList" class="panel panel-default panel-autocomplete non-display">
		<div class="panel-heading" data-bind="visible: lastsearch.used">
			<h2 class="heading-last-search">최근 찾아보신 검색어들 입니다.</h2>
			<?//<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span> <span class="close-x-text">닫기</span></button>?>
		</div>
		<ul class="list-group" id="list_lastSearch" data-bind="foreach: lastsearch.list, visible: lastsearch.used">
			<li class="list-group-item"><a href="#" data-bind="text: $data, attr: {'href': '#contents////' + $data}"></a></li>
		</ul>
		<div class="panel-footer">
			<a href="#" class="last-search-used">검색어저장 <!-- ko ifnot: lastsearch.used -->켜기<!-- /ko --><!-- ko if: lastsearch.used -->끄기<!-- /ko --></a>
			<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span> <span class="close-x-text">닫기</span></button>
		</div>
	</div>
	<?// 최근 검색어 부분 [종료]?>