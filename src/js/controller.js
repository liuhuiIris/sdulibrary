var _ctrl = app.controller('myCtrl',function($scope,$http,CONFIG) {
	$scope.queryType = {
		booklist : 'booklist',
		search:'search',
		detail:'detail',
		imgs:'imgs',
		cenlist:'cenlist',
		lanlist:'lanlist'
	};

	$scope.curtype = 'booklist';

	$scope.right = './template/list.html';

	$http.get(CONFIG.TYPE_URL).success(function(res) {
		$scope.type = res;
		if($scope.type.cenType[0].century_name=='公元19世纪'){
			$scope.type.cenType[0].century_name='1900年之前';
		}

		if($scope.type.cenType[1].century_name=='公元20世纪'){
			$scope.type.cenType[1].century_name='1901至1949';
		}
	});

	function toList() {
		if($scope.right == './template/detail.html'){
			$scope.right = './template/list.html';
		}
	}

	$scope.getUrl = function(type,param){
		var url = CONFIG.INDEX_URL+'?type='+type+'&pagenum='+(param.pageNum?param.pageNum:1);
		switch(type){
			case 'booklist':
			break;
			case 'search':
				url += '&keyword='+param.keyword;
			break;
			case 'lanlist':
				url += '&language='+param.id;
			break;
			case 'cenlist':
				url += '&century='+param.id;
			break;
			case 'detail':
				url += '&id='+param.bookid;
			break;
			case 'imgs':
				url += '&id='+param.bookid;
			break;
		}
		return url;
	}

	$scope.getList = function(type,param) {
		var url = $scope.getUrl(type,param);
		;
		$http.get(url).success(function(res) {
		//	console.log(res);
			$scope.list = res[type];
			$scope.totalPage = res.totalPage;
			$scope.totalNum = res.totalNum;
			$scope.currPage = res.currPage;
		});
	}

	$scope.getList($scope.curtype,{pageNum:1});

	$scope.getAll = function() {
		$scope.curtype = 'booklist';
		$scope.getList($scope.curtype,{pageNum:1});
		toList();
	}

	$scope.searchBtn = function(key) {
		$scope.key = key;
		$scope.curtype='search';
		$scope.getList($scope.curtype,{pageNum:1,keyword:$scope.key});
		document.getElementsByClassName('searchTxt')[0].value='';
		toList();
	}

	$scope.typeBtn = function(event){
		var flag = event.target.getElementsByTagName('i')[0].innerText;
		var divs = event.target.parentElement.getElementsByTagName('div');
		if(flag == '-'){
			event.target.getElementsByTagName('i')[0].innerText = '+';
			for(var i =0;i< divs.length;i++){
				divs[i].style.display = 'none';
			}
		}else{
			event.target.getElementsByTagName('i')[0].innerText = '-';
			for(var item =0;item< divs.length;item++){
				divs[item].style.display = 'block';
			}
		}

	}

	$scope.firstPage = function() {
		$scope.getList($scope.curtype,{pageNum:1,'id':$scope.id,keyword:$scope.key});
	}

	$scope.prePage = function() {
		if($scope.currPage==1){
			alert("this is first page");
		}else{
			$scope.currPage--;
			$scope.getList($scope.curtype,{pageNum:$scope.currPage,'id':$scope.id,keyword:$scope.key});
		}
	}

	$scope.nextPage = function() {
		if($scope.currPage==$scope.totalPage){
			alert("this is last page");
		}else{
			$scope.currPage++;
			$scope.getList($scope.curtype,{pageNum:$scope.currPage,'id':$scope.id,keyword:$scope.key});
		}
	}

	$scope.lastPage = function() {
		console.log($scope.totalPage);
		$scope.getList($scope.curtype,{pageNum:$scope.totalPage,'id':$scope.id,keyword:$scope.key});
	}

	$scope.typeList = function(event) {
		$scope.id = event.target.getAttribute("title");

		$scope.curtype = event.target.getAttribute("type");
		$scope.getList($scope.curtype,{pageNum:1,'id':$scope.id});
		toList();
	}

	$scope.getDetail = function(event) { 
		$scope.bookid = event.target.getAttribute("bookid");
		$scope.right = './template/detail.html';
		var url = $scope.getUrl('detail',{'bookid':$scope.bookid});
		$http.get(url).success(function(res) {
		//	console.log(res);
			$scope.detail = res['detail'][0];
		});

		$scope.getImgs($scope.bookid);
	}

	$scope.getImgs = function(id) {
		var url = $scope.getUrl('imgs',{'bookid':id});
		$http.get(url).success(function(res) {
			$scope.imgs = res['imgs'].map(function(item) {
				return "../"+item.img_url;
			});
			$scope.picNum = $scope.imgs.length;
		});

		$scope.curPic = 0;
	}

	$scope.prePic = function(){
		var imgList = document.getElementsByClassName('imgList')[0].getElementsByTagName('li');
		if($scope.curPic==0){
			alert('已经是第一张图了');
		}else{
			$scope.curPic--;
			for(var i=0;i<$scope.picNum;i++){
				imgList[i].style.display ='none';
			}
			imgList[$scope.curPic].style.display = 'block';
		}
	}

	$scope.nextPic = function() {
		var imgList = document.getElementsByClassName('imgList')[0].getElementsByTagName('li');
		if($scope.curPic==$scope.picNum-1){
			alert('已经是最后一张图了');
		}else{
			for(var i=0;i<$scope.picNum;i++){
				imgList[i].style.display ='none';
			}
			$scope.curPic++;
			imgList[$scope.curPic].style.display = 'block';
		}
	}
})