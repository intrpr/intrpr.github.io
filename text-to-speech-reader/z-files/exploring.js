$(function(){
	var locationSearch = location.search,
		endIndex = locationSearch.indexOf('&info'),
		getIndex = locationSearch.substring(7, endIndex);
	
	//根据地址栏传递的参数，显示对应的内容
	$('.topTabs a').eq(getIndex).addClass('active').siblings().removeClass('active');
	$('.tabsPanel').eq(getIndex).addClass('active').siblings().removeClass('active');
	
	//顶部标签切换
	$('.topTabs a').click(function(){
		if($(this).hasClass("active")){
			return false;
		};
		var _thisIndex = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.tabsPanel').eq(_thisIndex).addClass('active').siblings().removeClass('active');
	});
	
	$('.leftInfo h5, .leftInfo p').each(function(){
		$(this).attr('title', $(this).text());
	});
	
	$('.subTabs a').click(function(){
		var $this = $(this),
			_index = $this.index();
		if(!$this.hasClass('active')){
			$this.addClass('active').siblings().removeClass('active');
			$('.tabsDialog').eq(_index).addClass('active').siblings().removeClass('active');
			//动态生成分页页码
			var testimonialsPageLen = Math.ceil($('.testimonialsPanel .tabsDialog.active .tabsInfo').length/5);
			$('.testimonialsPagination').html('');
			if(testimonialsPageLen == 1){
				$('.testimonialsPagination').append('<li class="disabled prev"><a href="javascript:;" aria-label="Previous"><span class="glyphicon glyphicon-menu-left"></span></a></li><li class="active"><a href="javascript:;">1</a></li><li class="disabled next"><a href="javascript:;" aria-label="Next"><span class="glyphicon glyphicon-menu-right"></span></a></li>');
			}
			if(testimonialsPageLen > 1){
				for(var i=1; i<=testimonialsPageLen; i++){
					if(i == 1){
						$('.testimonialsPagination').append('<li class="disabled prev"><a href="javascript:;" aria-label="Previous"><span class="glyphicon glyphicon-menu-left"></span></a></li><li class="active"><a href="javascript:;">' + i + '</a></li>');
					}else if(i == testimonialsPageLen){
						$('.testimonialsPagination').append('<li><a href="javascript:;">' + i + '</a></li><li class="next"><a href="javascript:;" aria-label="Next"><span class="glyphicon glyphicon-menu-right"></span></a></li>');
					}else{
						$('.testimonialsPagination').append('<li><a href="javascript:;">' + i + '</a></li>');
					}
				};
			}
		}
	//点击数字翻页
	$('.testimonialsPagination li:not(.prev):not(.next)').click(function(){
		if($(this).hasClass('active')){
			return false;
		}
		var _thisIndex = $(this).index();
		if(_thisIndex == 1){
			$(this).siblings().removeClass('disabled').end().prev().addClass('disabled');
		}else if(_thisIndex == testimonialsPageLen){
			$(this).siblings().removeClass('disabled').end().next().addClass('disabled');
		}else{
			$(this).siblings().removeClass('disabled');
		}
		$(window).scrollTop(0);
		$('.testimonialsPanel .tabsDialog.active .tabsInfo').hide();
		$('.testimonialsPanel .tabsDialog.active .tabsInfo').slice(5*_thisIndex-5, 5*_thisIndex).show();//(n-1)*5 ---- n*5
		$(this).addClass('active').siblings().removeClass('active');
	});
	
	//点击上一页翻页
	$('.testimonialsPagination li.prev').click(function(){
		if($(this).hasClass('disabled')){
			return false;
		}
		var _thisIndex = $('.testimonialsPagination li.active').index();
		if(_thisIndex == 2){
			$('.testimonialsPagination li').removeClass('disabled');
			$(this).addClass('disabled');
		}
		$('.testimonialsPagination li').eq(_thisIndex-1).addClass('active').siblings().removeClass('active');
		$(window).scrollTop(0);
		$('.testimonialsPanel .tabsDialog.active .tabsInfo').hide();
		$('.testimonialsPanel .tabsDialog.active .tabsInfo').slice(5*_thisIndex-10, 5*_thisIndex-5).show();//(n-1-1)*5 ---- (n-1)*5
	})
	
	//点击下一页翻页
	$('.testimonialsPagination li.next').click(function(){
		if($(this).hasClass('disabled')){
			return false;
		}
		var _thisIndex = $('.testimonialsPagination li.active').index();
		if(_thisIndex == testimonialsPageLen-1){
			$('.testimonialsPagination li').removeClass('disabled');
			$(this).addClass('disabled');
		}
		$('.testimonialsPagination li').eq(_thisIndex+1).addClass('active').siblings().removeClass('active');
		$(window).scrollTop(0);
		$('.testimonialsPanel .tabsDialog.active .tabsInfo').hide();
		$('.testimonialsPanel .tabsDialog.active .tabsInfo').slice(5*_thisIndex, 5*_thisIndex+5).show();//(n-1+1)*5 ---- (n+1)*5
	})
	});
	
	var testimonialsPageLen = Math.ceil($('.testimonialsPanel .tabsDialog.active .tabsInfo').length/5);
	$('.testimonialsPagination').html('');
	if(testimonialsPageLen == 1){
		$('.testimonialsPagination').append('<li class="disabled prev"><a href="javascript:;" aria-label="Previous"><span class="glyphicon glyphicon-menu-left"></span></a></li><li class="active"><a href="javascript:;">1</a></li><li class="disabled next"><a href="javascript:;" aria-label="Next"><span class="glyphicon glyphicon-menu-right"></span></a></li>');
	}
	if(testimonialsPageLen > 1){
		for(var i=1; i<=testimonialsPageLen; i++){
			if(i == 1){
				$('.testimonialsPagination').append('<li class="disabled prev"><a href="javascript:;" aria-label="Previous"><span class="glyphicon glyphicon-menu-left"></span></a></li><li class="active"><a href="javascript:;">' + i + '</a></li>');
			}else if(i == testimonialsPageLen){
				$('.testimonialsPagination').append('<li><a href="javascript:;">' + i + '</a></li><li class="next"><a href="javascript:;" aria-label="Next"><span class="glyphicon glyphicon-menu-right"></span></a></li>');
			}else{
				$('.testimonialsPagination').append('<li><a href="javascript:;">' + i + '</a></li>');
			}
		};
	}
	
	//点击数字翻页
	$('.testimonialsPagination li:not(.prev):not(.next)').click(function(){
		if($(this).hasClass('active')){
			return false;
		}
		var _thisIndex = $(this).index();
		if(_thisIndex == 1){
			$(this).siblings().removeClass('disabled').end().prev().addClass('disabled');
		}else if(_thisIndex == testimonialsPageLen){
			$(this).siblings().removeClass('disabled').end().next().addClass('disabled');
		}else{
			$(this).siblings().removeClass('disabled');
		}
		$(window).scrollTop(0);
		$('.testimonialsPanel .tabsDialog.active .tabsInfo').hide();
		$('.testimonialsPanel .tabsDialog.active .tabsInfo').slice(5*_thisIndex-5, 5*_thisIndex).show();//(n-1)*5 ---- n*5
		$(this).addClass('active').siblings().removeClass('active');
	});
	
	//点击上一页翻页
	$('.testimonialsPagination li.prev').click(function(){
		if($(this).hasClass('disabled')){
			return false;
		}
		var _thisIndex = $('.testimonialsPagination li.active').index();
		if(_thisIndex == 2){
			$('.testimonialsPagination li').removeClass('disabled');
			$(this).addClass('disabled');
		}
		$('.testimonialsPagination li').eq(_thisIndex-1).addClass('active').siblings().removeClass('active');
		$(window).scrollTop(0);
		$('.testimonialsPanel .tabsDialog.active .tabsInfo').hide();
		$('.testimonialsPanel .tabsDialog.active .tabsInfo').slice(5*_thisIndex-10, 5*_thisIndex-5).show();//(n-1-1)*5 ---- (n-1)*5
	})
	
	//点击下一页翻页
	$('.testimonialsPagination li.next').click(function(){
		if($(this).hasClass('disabled')){
			return false;
		}
		var _thisIndex = $('.testimonialsPagination li.active').index();
		if(_thisIndex == testimonialsPageLen-1){
			$('.testimonialsPagination li').removeClass('disabled');
			$(this).addClass('disabled');
		}
		$('.testimonialsPagination li').eq(_thisIndex+1).addClass('active').siblings().removeClass('active');
		$(window).scrollTop(0);
		$('.testimonialsPanel .tabsDialog.active .tabsInfo').hide();
		$('.testimonialsPanel .tabsDialog.active .tabsInfo').slice(5*_thisIndex, 5*_thisIndex+5).show();//(n-1+1)*5 ---- (n+1)*5
	})
	
	$('.btnCart img').hover(function(){    //切换图片显示效果normal--hover
		var _thisImgSrc = $(this).attr("src");
		_thisImgSrc = _thisImgSrc.replace(/normal/, 'hover');
		$(this).attr("src", _thisImgSrc);
	}, function(){
		var _thisImgSrc = $(this).attr("src");
		_thisImgSrc = _thisImgSrc.replace(/hover/, 'normal');
		$(this).attr("src", _thisImgSrc);
	});
	
	
	//Login按钮点击事件
	$('#btnLogin').click(function(){
		$('#loginSignupPanel').show();
		loginSignupCenter();
		$('#loginSignupPanel').after('<div class="shadeDiv"></div>');
	});
	
	//关闭按钮点击事件
	$('#loginSignupPanel .btnCloseDialog').click(function(){
		$('#loginSignupPanel').hide();
		$('#loginSignupPanel input').val('');
		$('#loginPanel').show();
		$('#signupPanel').hide();
		$('.shadeDiv').remove();
	});
	
	//Sign up here.点击事件
	$('#loginSignupPanel .signupTxt').click(function(){		
		$('#loginPanel').hide();
		$('#signupPanel').show();
		loginSignupCenter()
	});
	
	//Login here.点击事件
	$('#loginSignupPanel .loginTxt').click(function(){		
		$('#loginPanel').show();
		$('#signupPanel').hide();
		loginSignupCenter()
	});
	
	//checkboxAgree点击事件
	$('#loginSignupPanel .checkboxAgree span').click(function(){		
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
	});
	
	$(window).resize(function(){
		loginSignupCenter();
	});
	
	//对话框居中显示
	function loginSignupCenter(){
		var _left = ($(window).innerWidth() - $('#loginSignupPanel').innerWidth()) / 2;
		var _top = ($(window).innerHeight() - $('#loginSignupPanel').innerHeight()) / 2;
		if(_left <= 0){
			$('#loginSignupPanel').css('left', 0);
		}else{
			$('#loginSignupPanel').css('left', _left);
		}
		if(_top <= 0){
			$('#loginSignupPanel').css('top', 0);
		}else{
			$('#loginSignupPanel').css('top', _top);
		}
	}
})