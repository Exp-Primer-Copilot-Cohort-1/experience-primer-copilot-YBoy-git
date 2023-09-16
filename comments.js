// create web server
// 1. load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
// 2. create web server
var server = http.createServer(function(request,response){
    // 2.1 get url
    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;
    console.log('resource='+resource);
    // 2.2 handle POST
    if(request.method=='POST'){
        if(resource=='/comment'){
            addComment(request,response);
        }else{
            console.log('unknown POST:'+resource);
            process.exit();
        }
    }
    // 2.3 handle GET
    else if(request.method=='GET'){
        if(resource=='/comment'){
            getComment(request,response);
        }else{
            fs.readFile('./public'+resource,function(error,data){
                if(error){
                    response.statusCode = 404;
                    response.end('404 Not Found');
                }else{
                    response.end(data);
                }
            });
        }
    }
    else{
        response.statusCode = 404;
        response.end('404 Not Found');
    }
}
);
// 3. start server
server.listen(8080,function(){
    console.log('Server running at http://localhost:8080/');
}
);
// 4. add comment
var commentFilePath = 'comment.json';
function addComment(request,response){
    // 4.1 get post data
    var body = '';
    request.on('data',function(data){
        body += data;
    }
    );
    request.on('end',function(){
        var comment = qs.parse(body);
        console.log('comment='+JSON.stringify(comment));
        // 4.2 read file
        fs.readFile(commentFilePath,function(error,data){
            if(error){
                console.log('read error');
                response.statusCode = 500;
                response.end('Server Internal Error');
            }else{
                var comments = JSON.parse(data);
                comments.unshift(comment);
                // 4.3 write file
                fs.writeFile(commentFilePath,JSON.stringify(comments),function(error){
                    if(error){
                        console.log('write error');
                        response.statusCode = 500;
                        response.end('Server Internal Error');
                    }else{
                        // 4.4 response
                        response.statusCode = 200;
                        response.end();
                    }
                }
                );
            }
        }
        );
    }
    );
}
// 5. get comment
function getComment(request,response){
    fs.readFile(commentFilePath,function(error,data){
        if(error){
            console.log('read error');
            response.statusCode = 500;
            response.end('Server Internal Error');
        }else{
            response.end(data);
        }
    }
    );
}
