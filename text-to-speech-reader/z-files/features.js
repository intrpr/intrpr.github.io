$(function(){
	//点击音频按钮播放和暂停音频文件
	$('.btnControlAudio').click(function(){
		/* $('.btnControlAudio').each(function(){
			$(this).attr('src', 'images/play2.png').next('audio').get(0).pause();
		}); */
		var oAudio = $(this).next('audio').get(0);
		if(oAudio.paused){
			$(this).attr('src', 'images/btn_stop3_gray.gif');
			oAudio.play();
		}else{
			oAudio.pause();
			$(this).attr('src', 'images/play2.png');
		}
	});
	
})