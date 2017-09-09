$(function(){
	var locationSearch = location.search,
		endIndex = locationSearch.indexOf('&info'),
		getIndex = locationSearch.substring(7, endIndex);
	
	//根据地址栏传递的参数，显示对应的内容
	$('.topTabs a').eq(getIndex).addClass('active').siblings().removeClass('active');
	$('.tabsInfo').eq(getIndex).addClass('active').siblings().removeClass('active');
	
	//顶部标签FAQ Video切换
	$('.topTabs a').click(function(){
		if($(this).hasClass("active")){
			return false;
		};
		var _thisIndex = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.tabsInfo').eq(_thisIndex).addClass('active').siblings().removeClass('active');
	});
	
	addPrevNextTag('.faqSideBar');
	addPrevNextTag('.videoSideBar');
	
	actionScope('.faqSideBar');
	actionScope('.videoSideBar');
	
	
	//右侧内容区prev next 标签链接点击事件
	function actionScope(obj){
		var _oSidebar = $(obj);
		
		_oSidebar.siblings('.rightInfo').find('.infoWrap .prevNextTag a').click(function(){
			var _thisIndex = Number($(this).attr('data-index'));
			$('html, body').scrollTop(0);
			
			var _leftSidebarLi = _oSidebar.find('li').eq(_thisIndex);
			var _rightInfoWrap = _oSidebar.siblings('.rightInfo').find('.infoWrap').eq(_thisIndex);
			
			_oSidebar.find('li').removeClass('active');
			_leftSidebarLi.addClass('active');
			_rightInfoWrap.addClass('active').siblings().removeClass('active');
		})
	}
	
	//自动添加prev next 标签链接 Function
	function addPrevNextTag(obj){
		var _oSidebar = $(obj);
		var _oSidebarLiLen = _oSidebar.find('li').length;
		
		_oSidebar.find('li').each(function(index){
			var _rightInfoWrap = _oSidebar.siblings('.rightInfo').find('.infoWrap').eq(index);
			
			if(index == 0){
				var _thisNextTxt = _oSidebar.find('li').eq(index+1).text();
				if(_rightInfoWrap.find('.prevNextTag').length == 0){
					_rightInfoWrap.append('<p class="prevNextTag">Next: <a href="javascript:;" data-index="' + (index+1) + '">' + _thisNextTxt + '</a></p>');
				}
			};
			if(index > 0 && index < _oSidebarLiLen-1){
				var _thisPrevTxt = _oSidebar.find('li').eq(index-1).text();
				var _thisNextTxt = _oSidebar.find('li').eq(index+1).text();
				if(_rightInfoWrap.find('.prevNextTag').length == 0){
					_rightInfoWrap.append('<p class="prevNextTag"><span class="prevTxt">Prev: <a href="javascript:;" data-index="' + (index-1) + '">' + _thisPrevTxt + '</a></span> Next: <a href="javascript:;" data-index="' + (index+1) + '">' + _thisNextTxt + '</a></p>');
				}
			};
			if(index == _oSidebarLiLen-1){
				var _thisPrevTxt = _oSidebar.find('li').eq(index-1).text();
				if(_rightInfoWrap.find('.prevNextTag').length == 0){
					_rightInfoWrap.append('<p class="prevNextTag"><span class="prevTxt">Prev: <a href="javascript:;" data-index="' + (index-1) + '">' + _thisPrevTxt + '</a></span></p>');
				}
			};
			
			//左侧导航点击事件
			$(this).click(function(){
				if($(this).hasClass("active")){
					return false;
				};
				_oSidebar.find('li').removeClass('active');
				$(this).addClass('active');
				_rightInfoWrap.addClass('active').siblings().removeClass('active');
				
				if($('body,html').innerWidth() < 992){					
					$('.sidebarHS').hide();
					$('.ulHeader').removeClass('open');
				}
			});
		});
	};
	
	$('.ulHeader').click(function(){
		if($(this).hasClass('open')){
			$(this).removeClass('open').next().hide();
		}else{
			$(this).addClass('open').next().show();
		}
	});
	
	$(window).resize(function(){
		if($('body,html').innerWidth() >= 992){					
			$('.sidebarHS').show();
			$('.ulHeader').removeClass('open');
		}else{
			$('.sidebarHS').hide();
		}
	});
	
})