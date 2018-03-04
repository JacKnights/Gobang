var fs = require('fs');
var url = require("url");
var querystring = require("querystring");

//当前在线人数  
var onlineCount = 0;
var row, col, pid;

var gameblock = new Array();
for (var i = 0; i < 15; i++) {
    gameblock[i] = new Array();
    for (var j = 0; j < 15; j++) {
        gameblock[i][j] = -1;
    }
}

var http = require('http').createServer(function(request, response) {//console.log(request.url);
    var pathname = url.parse(request.url).pathname;
    var ext = pathname.match(/(\.[^.]+|)$/)[0];
    var data;
    
    switch(ext){
        case ".css":
        case ".js": {
            data = fs.readFileSync("./" + request.url, "utf-8");
            response.writeHead(200, {
                "Content-Type": {
                    ".css":"text/css",
                    ".js":"application/javascript",
                }[ext]
            });
            response.write(data);
            response.end();
            break;
        }
        default: {
            data = fs.readFileSync(__dirname + '/index.html', "utf-8");
            data = data.replace(/UNKNOWN/, '' + onlineCount);//console.log(data);
            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            response.write(data);
            response.end();
            break;
        }   
    }

    var postStr = "";
    request.on("data", function(item) {
        postStr += item;
        postStr = querystring.parse(postStr);
        row = postStr['row'];
        col = postStr['col'];
        pid = postStr['pid'];
        console.log(postStr);
    });
});
  
//启动HTTP服务，绑定端口3000  
http.listen(3000, function(){  
    console.log('listening on *:3000');  
});


var io = require('socket.io').listen(http);

//连接事件  
io.sockets.on('connection', function (socket) {  
  
    console.log('有新用户进入...');
    //叠加当前在线人数  
    onlineCount++;  
  
    setInterval(function () {  
        socket.volatile.emit('onlinenums', {nums : onlineCount});
    }, 1000);

    setInterval(function () {  
        socket.volatile.emit('go', {rows : row, cols : col, player : pid});
        //socket.volatile.emit('status', {status : gameblock});
    }, 100);

    console.log('当前用户数量:' + onlineCount);  
    //客户端断开连接  
    socket.on('disconnect', function() {  
  
        if (onlineCount > 0) {  
            //当前在线用户减一  
            onlineCount--;
            console.log('当前用户数量:' + onlineCount);  
        }  
    });  
});  