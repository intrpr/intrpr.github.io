$(function(){
	
	$('.aBtnImg').hover(function(){    //切换图片显示效果normal--hover
		var _thisImgSrc = $(this).find('img:first').attr("src");
		_thisImgSrc = _thisImgSrc.replace(/normal/, 'hover');
		$(this).find('img:first').attr("src", _thisImgSrc);
	}, function(){
		var _thisImgSrc = $(this).find('img:first').attr("src");
		_thisImgSrc = _thisImgSrc.replace(/hover/, 'normal');
		$(this).find('img:first').attr("src", _thisImgSrc);
	}).click(function(){    
		//点击事件接口
	});
	
	$('.selectPanel .radioPic').click(function(){
		var _thisImgSrc = $(this).attr('src');
		if(/unChecked/g.test(_thisImgSrc)){
			var _newImgSrc = _thisImgSrc.replace(/unChecked/g, 'checked');
			$(this).attr('src', _newImgSrc);
			$(this).parent().siblings().find('.radioPic').attr('src', _thisImgSrc);
		}
	});



	
	//播放按钮点击效果
	$('.additionalVoices .playPausePic').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).attr('src', 'images/btn_play.png');
		}else{
			$(this).addClass('active');
			$(this).attr('src', 'images/btn_stop4_gray.gif');
		}
	});
})