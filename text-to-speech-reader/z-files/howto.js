$(function(){
	$('.topTabs a').click(function(){
		var $this = $(this),
			_index = $this.index();
		if(!$this.hasClass('active')){
			$this.addClass('active').siblings().removeClass('active');
			$('.tabsInfo').eq(_index).addClass('active').siblings().removeClass('active');
		}
	});
	
})


