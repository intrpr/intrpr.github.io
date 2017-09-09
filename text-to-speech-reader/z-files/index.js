$(function(){
	//Play按钮点击事件
	$('.areaWrapTopBtn .btnPlayStop').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
	});
	//alert($(window).width());
	//clear text按钮点击事件
	$('.areaWrapTopBtn .btnClearText').click(function(){
		$('#areaWrap textarea').focus().val('');
		
	});
	
	//Sample1按钮点击事件
	$('.areaWrapBottomBtn .btnPlayStop').click(function(){
		var oAudio = $(this).find('audio').get(0);
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			oAudio.pause();
		}else{
			$(this).addClass('active');
			oAudio.play();
		}
	});
	
	//More Voice Sample按钮点击事件
	$('.areaWrapBottomBtn .btnMore').click(function(){
		
	});
	
	//Add document按钮点击事件
	$('.areaWrapBottomBtn .btnAdd').click(function(){
	
	});
	
	//Free Download按钮点击事件
	$('.freeNaturalReader .btnFreedownload').click(function(){
		
	});
	

	showPanelWrap('.testimonialsWrap');
	
	$(window).resize(function(){
		showPanelWrap('.testimonialsWrap');
	});
	
	function showPanelWrap(obj){
		var _thisObj = $(obj);
		//计算视频区域总长度
		var panelTabsWidth = _thisObj.eq(0).innerWidth();	//1349
		var panelTabsLen = _thisObj.find('.panelTabs').length;
		var totalWidth = panelTabsWidth * panelTabsLen;	//4047
		_thisObj.find('.panelTabs').innerWidth(panelTabsWidth);
		_thisObj.find('.showPanel').innerWidth(totalWidth);
		
		//动态生成切换按钮
		if(_thisObj.find('.switcher').length == 0){
			_thisObj.append('<div class="container switcher"></div>');
			for(var i=0; i<panelTabsLen; i++){
				if(i == 0){
					_thisObj.find('.switcher').append('<a href="javascript:;" class="active"></a>');
				}else{
					_thisObj.find('.switcher').append('<a href="javascript:;"></a>');
				}
			}
		}else{
			var _thisIndex = _thisObj.find('.switcher').find('a.active').index();
			_thisObj.find('.showPanel').css('left', -_thisIndex * panelTabsWidth);
		}
	}
	
	//点击切换按钮显示相应的视频内容
	$('.switcher a').click(function(){
		if(!$(this).parent().siblings('.showPanel').is(":animated")){
			var _thisIndex = $(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			$(this).parent().siblings('.showPanel').animate({
				left: -_thisIndex * $(this).parent().siblings('.showPanel').find('.panelTabs:first').innerWidth()
			}, 500);
		}
	});
	
	function marquee(obj){
		var _thisObj = $(obj);
		var _thisIndex = _thisObj.find('.switcher a.active').index();
		var switchLen = _thisObj.find('.switcher a').length;
		_thisIndex++;
		if(_thisIndex == switchLen){
			_thisIndex = 0;
		}
		_thisObj.find('.showPanel').animate({
			left: -_thisIndex * _thisObj.find('.panelTabs:first').innerWidth()
		}, 500)
		
		_thisObj.find('.switcher a').eq(_thisIndex).addClass('active').siblings().removeClass('active');
	}
	
	
	function hoverFun(obj){
		var timer = setInterval(function(){
			marquee(obj);
		}, 5000);
		$(obj).hover(function(){
			clearInterval(timer);
		}, function(){
			timer = setInterval(function(){
				marquee(obj);
			}, 5000);
		});
	}
	
	hoverFun('.testimonialsWrap');
	
	
	
	/*********************************new视频展示效果***********************************/	
	var liLength = $('.videoShowWrap li').length,
		dlLength = Math.ceil(liLength/3),
		oDl = '';
		
	//动态生成切换按钮
	for(var i=0; i<dlLength; i++){
		if(i == 0){
			oDl += '<dl>\r<dd class="active"></dd>\r';
		}else if(i == dlLength-1){
			oDl += '<dd></dd>\r</dl>';
		}else{
			oDl += '<dd></dd>\r';
		}
	}
	$('.videoShowWrap').append(oDl);
		
	ulliCSS();
	$(window).resize(function(){
		ulliCSS();
	});
	
	//默认显示第一个视频
	$('.mainVideo').html($('.videoShowWrap li.active video').clone());
	$('.mainVideo video').attr({
		"controls": "controls",
		"height": "auto"
	});
	
	//设置默认动态CSS样式
	function ulliCSS(){
		var _thisIndex = $('.videoShowWrap dd.active').index();
		var mainWidth = $('.videoShowWrap').innerWidth();
		var liWidth = mainWidth * .32;	
		$('.videoShowWrap ul').css({
			"width": mainWidth * (dlLength +1),
			"left": -_thisIndex * (mainWidth + mainWidth * .02)
		});
		
		$('.videoShowWrap li').css({
			"width": liWidth,
			"margin-right": mainWidth * .02
		});
	}
	
	
	//计算显示视频的长度
	$('.videoShowWrap .videoTime').each(function(){
		var _thisVideoTime = $(this).parent().prev().get(0).duration;
		_thisVideoTime = Math.round(_thisVideoTime);
		if(_thisVideoTime < 60){
			_thisVideoTime = '00:' + doubleNum(_thisVideoTime);
		}else if(_thisVideoTime >= 3600){
			var iHours = Math.floor(_thisVideoTime/3600);
			var iMinutes = Math.floor((_thisVideoTime - iHours * 3600) / 60);
			var iSeconds = _thisVideoTime - iHours*3600 - iMinutes*60;
			_thisVideoTime = doubleNum(iHours) + ':' + doubleNum(iMinutes) + ':' + doubleNum(iSeconds);
		}else{
			var iMinutes = Math.floor(_thisVideoTime / 60);
			var iSeconds = _thisVideoTime - iMinutes*60;
			_thisVideoTime = doubleNum(iMinutes) + ':' + doubleNum(iSeconds);
		}
		$(this).text(_thisVideoTime);
	});
	
	//点击小视频切换大视频
	$('.videoShowWrap li').click(function(){
		if($(this).hasClass('active')){
			return false;
		}
		var creatArrow = $('.videoShowWrap li.active .creatArrow').clone();
		$('.videoShowWrap .creatArrow').remove();
		$(this).addClass('active').siblings().removeClass('active').end().append(creatArrow);
		$('.mainVideo').html($(this).find('video').clone());
		$('.mainVideo video').attr({
			"controls": "controls",
			"height": "auto"
		});
	});
	
	//点击切换按钮显示相应的视频内容
	$('.videoShowWrap').on('click', 'dd', function(){
		if($(this).hasClass('active')){
			return false;
		}
		if(!$('.videoShowWrap ul').is(":animated")){
			$(this).addClass('active').siblings().removeClass('active');
			var _thisIndex = $(this).index();
			var mainWidth = $('.videoShowWrap').innerWidth();
			$('.videoShowWrap ul').animate({
				"left": -_thisIndex * (mainWidth + mainWidth * .02)
			});
		}
	});
	
	//自动轮播
	function videoMarquee(){
		var mainWidth = $('.videoShowWrap').innerWidth();
		var _thisIndex = $('.videoShowWrap dd.active').index();
		_thisIndex++;
		if(_thisIndex == dlLength){
			_thisIndex = 0;
		}
		$('.videoShowWrap ul').animate({
			"left": -_thisIndex * (mainWidth + mainWidth * .02)
		})	
		$('.videoShowWrap dd').eq(_thisIndex).addClass('active').siblings().removeClass('active');
	}
	var videoTimer = setInterval(videoMarquee, 5000);
	
	$('.videoShowWrap').hover(function(){
		clearInterval(videoTimer);
	}, function(){
		videoTimer = setInterval(videoMarquee, 5000);
	});

})