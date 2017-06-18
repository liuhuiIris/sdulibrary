//引入http模块，进行创建http server
var http = require('http');
//url 模块 将目前请求路径由字符串转换成对象
var utilurl = require('url');
//字符串转换成对象
var qs = require('querystring');
//引入数据模块
var db = require('./bean.js');

http.createServer(function(request,response) {
	response.writeHead('200',
	{'Content-Type':'application/json;charset=utf-8',
	'Access-Control-Allow-Origin':'*'
	});//CORS 给json开放权限


	//1.表示的是获取用户当前请求地址
	var requestUrl=request.url;
	//2.将请求转换成对象
	var urlObj=utilurl.parse(requestUrl);
	//3.获取当前用户具体请求 /username=234&password=345;
	var _url=urlObj.pathname;
	var _text = qs.parse(urlObj.query);
	var param = {
		'type':_text.type?_text.type:'booklist',
		'pagenum':_text.pagenum,
		'pagesize':_text.pagesize,
		'keyword':_text.keyword,
		'id' : _text.id,
		'century' : _text.century,
		'language' : _text.language
	}

	switch(_url){
		case '/query':
			db.getList(param,function(res){
				// console.log(res);
				response.write("{"+res);
				// response.end();
			},function(res){
				response.write(res+"}");
				response.end();
			});
		break;
		case '/type':
			db.getType(function(res){
				response.write("{"+res);
			},function(res){
				response.end(","+res+"}");
			});
		break;
	}
}).listen(3000);
console.log("my server started port is&&&&&&3000");

