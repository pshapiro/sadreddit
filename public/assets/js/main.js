function getData(keyword, page) {
    var searchData = {
	"keyword": keyword,
	"resType": "json",
	"page": page
    };

    $.ajax({
	url: '/search',
	type: 'POST',
	contentType: 'application/json',
	data: JSON.stringify( searchData )
    }).done(function( data ) {
	var html = '<ul id="output">';
	$.each(data, function(key, val) {
	    html += '<li>';
	    html += '<a href="' + val['url'] + '">' + val['url'] + '</a></li>';
	    html += '</li>';
	});
	html += '</ul>';
	if (page >= 1) {
	    html += '<a href="javascript:;" class="pager" data-page="'+(page - 1)+'">Prev.</a>';
	}
	html += '<a href="javascript:;" class="pager" data-page="'+(page + 1)+'">Next</a>';

	$(' #output-container ').html(html);
    }).fail(function( jqXHR, textStatus ) {
	$(' #output-container ').html('<ul id="output"><li>' + jqXHR.responseText + '</li></ul>');
    });
}

$( document ).ready(function() {
    var page = 0;
    var keyword;
    var $pageNum = $("#page-num");
    $("#output-container").on("click", ".pager", function(event) {
	page = $(event.target).data("page");
	$pageNum.val(page);
	getData(keyword, page);
    });
	
    $( '#start' ).click(function( event ) {
        event.preventDefault();
        keyword = $(' #keyword ').val();
	page = 0;
	$pageNum.val(0);
	getData(keyword, page);
    });
});
