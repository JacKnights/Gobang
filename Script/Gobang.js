var playerid = 0;
var set = 0;

$(document).ready(function() {
	$("#start").click(function() {
		$("#start").css("background-color", "yellow");
		//alert("Game Start");
		
	});
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			var block = $("<div></div>");
			block.attr('class', 'block');
			block.attr('id', '' + i + '-' + j);
			$("#board").append(block)
		}
	}
	$(".block").click(function() {
		//$(this).append($("<div class='blackgo'></div>"));
		var spliter = $(this).attr('id').split('-');
		var row = spliter[0];
		var col = spliter[1];
		$.post('/', {'row': row, 'col': col, 'pid': $("#playerid").html()}, function(data, status) {}, 'text');
	});
});

// 创建websocket连接  
var socket = io.connect('http://172.18.156.135:3000');  
// 把信息显示到div上  
socket.on('onlinenums', function (data) {
    $("#playernum").html(data.nums);
    
});
socket.on('go', function (data) {
    //$('#0-0').html("<div class='blackgo'></div>");
    var row = data.rows, col = data.cols;
    if (data.player == 0) {
        $('#' + row + '-' + col).html("<div class='blackgo'></div>");
    }
    if (data.player == 1) {
        $('#' + row + '-' + col).html("<div class='whitego'></div>");
    }
});