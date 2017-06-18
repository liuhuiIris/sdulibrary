var mysql = require('mysql');

var limit;

var curPage;

var conn;


function handleError () {
    conn = mysql.createConnection({
        'host' : '123.206.53.51',
		'port' : '3306',
		'user' : 'root',
		'password' : '255437Lh',
		'database' : 'books'
    });

    //连接错误，2秒重试
    conn.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError , 1000);
        }
    });

    conn.on('error', function (err) {
        console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}

handleError();




function getList(param,getlist,getcount){
	var _type = param.type;
	limit = param.pagesize?param.pagesize:10;
	curPage = param.pagenum?param.pagenum:1;
	var start = (curPage-1)*limit;

	var sql = {
		'booklist':{
			'list':'SELECT ancientworks.book_num,ancientworks.book_name,ancientworks.book_year FROM ancientworks LIMIT '+ start +','+limit,
			'count' : "select count(*) from ancientworks"
		},
		'search':{
			'list' : "SELECT ancientworks.book_num,ancientworks.book_name,ancientworks.book_year FROM ancientworks where ancientworks.book_name like '%"+param.keyword+"%' LIMIT "+ start +","+limit,
			'count' : "select count(*) from ancientworks where ancientworks.book_name like '%"+param.keyword+"%'"
		},
		'detail' :{
			'list' : "SELECT  savecondition.con_name, massunit.unit_name, bookorigin.origin_name, booklanguage.language_name,bookcomplete.com_name,bookclass.class_name,bookcentury.century_name,ancientworks.num_type,ancientworks.save_time,saverantime.rantime_name,ancientworks.storage_volume,ancientworks.book_version,ancientworks.book_author,ancientworks.book_comstate,ancientworks.book_quality,ancientworks.book_height,ancientworks.book_width,ancientworks.book_length,ancientworks.book_quantity,ancientworks.book_character,ancientworks.book_character2,ancientworks.book_character1,ancientworks.book_year,ancientworks.book_type,ancientworks.book_times,ancientworks.book_name,ancientworks.book_num FROM ancientworks ,bookcentury ,bookclass ,bookcomplete ,booklanguage ,bookorigin ,massunit ,saverantime ,savecondition WHERE saverantime.rantime_id =  ancientworks.save_rantime AND massunit.unit_id =  ancientworks.book_massunit AND bookorigin.origin_id =  ancientworks.book_origin AND booklanguage.language_id =  ancientworks.book_language AND savecondition.con_id =  ancientworks.save_condition AND bookcomplete.com_id =  ancientworks.book_complete AND bookclass.class_id =  ancientworks.book_class AND bookcentury.century_id =  ancientworks.book_century AND ancientworks.book_num =  '"+param.id+"'"
		},
		'imgs' : {
			'list' : "select  img_id,img_url from book_img where img_id='"+param.id+"'"
		},
		'cenlist' :{
			'list' : 'SELECT ancientworks.book_num,ancientworks.book_name,ancientworks.book_year FROM ancientworks where ancientworks.book_century = '+param.century+' LIMIT '+ start +','+limit,
			'count': 'SELECT count(*) FROM ancientworks where ancientworks.book_century = '+param.century
		},
		'lanlist' :{
			'list' : 'SELECT ancientworks.book_num,ancientworks.book_name,ancientworks.book_year FROM ancientworks where ancientworks.book_language = '+param.language+' LIMIT '+ start +','+limit,
			'count': 'SELECT count(*) FROM ancientworks where ancientworks.book_language = '+param.language
		}
	};

	query(sql[_type].list,_type,getlist);
	getCount(sql[_type].count,getcount);
}

function getType(start,end){
	var type  = {
		'lanType':"SELECT booklanguage.language_name,booklanguage.language_id FROM booklanguage WHERE booklanguage.language_id IN  (SELECT book_language FROM ancientworks)",
		'cenType' : "SELECT bookcentury.century_id,bookcentury.century_name FROM bookcentury WHERE bookcentury.century_id IN (SELECT book_century FROM ancientworks )"
	};
	query(type.lanType,'lanType',start);
	query(type.cenType,'cenType',end);
}


function query(sql,type,fn) {
	
	conn.query(sql,function(err,result){
		if(err){
			console.log(err);
		}else{
			var str = '"'+type+'":['+toString(result) +']';
			fn(str);
		}
	});

}

function toString(res) {
	var data = '';
	res.forEach(function(item){ 
		data += '{';
		for(var key in item){
			data += '"'+key+'":"'+item[key]+'",';
		}
		data=data.substring(0,data.length-1);
		data += '},'
	});
	data=data.substring(0,data.length-1);
	return data;
}

function getCount(sql,fn) {
		conn.query(sql,function(err,result) {
			if(err){
				fn("");
				console.log(err);
			}else{
				var  totalNum = parseInt(result[0]['count(*)']);
				var  totalaPage = Math.ceil(totalNum/limit);
				var str = ',"totalNum":"'+totalNum+'","totalPage":"'+totalaPage+'","currPage":"'+curPage+'"';
				console.log(str);
				fn(str);
			}
		
		});

}


module.exports = {'getList':getList,'getType':getType,'query':query,'toString':toString,'getCount':getCount};

// var db = function(){
// 	this.init = function(){
// 		// var _this = this;
// 		this.data = '';
// 		this.client = mysql.createPool({
// 			'host' : '123.206.53.51',
// 			'port' : '3306',
// 			'user' : 'root',
// 			'password' : '255437Lh',
// 			'database' : 'books'
// 		});

// 		return this;
// 	}

	
// 	this.getList = function(param,getlist,getcount){
// 		var _type = param.type;
// 		this.limit = param.pagesize?param.pagesize:10;
// 		var _this = this;
// 		this.curPage = param.pagenum?param.pagenum:1;
// 		var start = (this.curPage-1)*this.limit;

// 		var sql = {
// 			'booklist':{
// 				'list':'SELECT ancientworks.book_num,ancientworks.book_name,ancientworks.book_year FROM ancientworks LIMIT '+ start +','+this.limit,
// 				'count' : "select count(*) from ancientworks"
// 			},
// 			'search':{
// 				'list' : "SELECT ancientworks.book_num,ancientworks.book_name,ancientworks.book_year FROM ancientworks where ancientworks.book_name like '%"+param.keyword+"%' LIMIT "+ start +","+this.limit,
// 				'count' : "select count(*) from ancientworks where ancientworks.book_name like '%"+param.keyword+"%'"
// 			},
// 			'detail' :{
// 				'list' : "SELECT  savecondition.con_name, massunit.unit_name, bookorigin.origin_name, booklanguage.language_name,bookcomplete.com_name,bookclass.class_name,bookcentury.century_name,ancientworks.num_type,ancientworks.save_time,saverantime.rantime_name,ancientworks.storage_volume,ancientworks.book_version,ancientworks.book_author,ancientworks.book_comstate,ancientworks.book_quality,ancientworks.book_height,ancientworks.book_width,ancientworks.book_length,ancientworks.book_quantity,ancientworks.book_character,ancientworks.book_character2,ancientworks.book_character1,ancientworks.book_year,ancientworks.book_type,ancientworks.book_times,ancientworks.book_name,ancientworks.book_num FROM ancientworks ,bookcentury ,bookclass ,bookcomplete ,booklanguage ,bookorigin ,massunit ,saverantime ,savecondition WHERE saverantime.rantime_id =  ancientworks.save_rantime AND massunit.unit_id =  ancientworks.book_massunit AND bookorigin.origin_id =  ancientworks.book_origin AND booklanguage.language_id =  ancientworks.book_language AND savecondition.con_id =  ancientworks.save_condition AND bookcomplete.com_id =  ancientworks.book_complete AND bookclass.class_id =  ancientworks.book_class AND bookcentury.century_id =  ancientworks.book_century AND ancientworks.book_num =  '"+param.id+"'"
// 			},
// 			'imgs' : {
// 				'list' : "select  img_id,img_url from book_img where img_id='"+param.id+"'"
// 			},
// 			'cenlist' :{
// 				'list' : 'SELECT ancientworks.book_num,ancientworks.book_name,ancientworks.book_year FROM ancientworks where ancientworks.book_century = '+param.century+' LIMIT '+ start +','+this.limit,
// 				'count': 'SELECT count(*) FROM ancientworks where ancientworks.book_century = '+param.century
// 			},
// 			'lanlist' :{
// 				'list' : 'SELECT ancientworks.book_num,ancientworks.book_name,ancientworks.book_year FROM ancientworks where ancientworks.book_language = '+param.language+' LIMIT '+ start +','+this.limit,
// 				'count': 'SELECT count(*) FROM ancientworks where ancientworks.book_language = '+param.language
// 			}
// 		};

// 		this.query(sql[_type].list,_type,getlist);
// 		this.getCount(sql[_type].count,getcount);
// 	}

// 	this.getType = function(start,end){
// 		var type  = {
// 			'lanType':"SELECT booklanguage.language_name,booklanguage.language_id FROM booklanguage WHERE booklanguage.language_id IN  (SELECT book_language FROM ancientworks)",
// 			'cenType' : "SELECT bookcentury.century_id,bookcentury.century_name FROM bookcentury WHERE bookcentury.century_id IN (SELECT book_century FROM ancientworks )"
// 		};
// 		this.query(type.lanType,'lanType',start);
// 		this.query(type.cenType,'cenType',end);
// 	}

// 	this.query = function(sql,type,fn) {
// 		var _this = this;
// 		this.client.getConnection(function(err,connection) {
// 			connection.query(sql,function(err,result){
// 				var str = '"'+type+'":['+_this.toString(result) +']';
// 				fn(str);
// 				// connection.end();
// 			});
// 		});
// 	}

// 	this.toString = function(res) {
// 		var data = '';
// 		res.forEach(function(item){ 
// 			data += '{';
// 			for(var key in item){
// 				data += '"'+key+'":"'+item[key]+'",';
// 			}
// 			data=data.substring(0,data.length-1);
// 			data += '},'
// 		});
// 		data=data.substring(0,data.length-1);
// 		return data;
// 	}

// 	this.getCount = function(sql,fn) {
// 		var _this = this;
// 		this.client.getConnection(function(err,connection) {
// 			connection.query(sql,function(err,result) {
// 				var  totalNum = parseInt(result[0]['count(*)']);
// 				var  totalaPage = Math.ceil(totalNum/_this.limit);
// 				var str = '"totalNum":"'+totalNum+'","totalPage":"'+totalaPage+'","currPage":"'+_this.curPage+'"';
// 				console.log(str);
// 				fn(str);
// 				// connection.end();
// 			});
// 		});
// 	}

// }

