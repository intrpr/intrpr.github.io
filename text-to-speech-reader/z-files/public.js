$(function(){
	//导航菜单显示和隐藏
	$('.btnNavbarMenu').click(function(){
		var navbarCollapse = $(this).parents('.mainNavbar').find('.navbarCollapse');
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			navbarCollapse.hide()
		}else{
			$(this).addClass('active');
			navbarCollapse.show()
		}
	});
	
	//下拉菜单点击事件
	$('.dropdown').find('li a').click(function(){
		$(this).parents('.dropdown').find('button').html($(this).html() + '\r<span class="caret"></span>');
	});
	
	//回到顶部
	$('#goTop').click(function(){
		$('html,body').animate({scrollTop: 0}, 500);
	});
	
	//Watch Video
	//$('.watchVideoWrap .watchVideo').click(function(){
        
		//$(this).parent().addClass('active');
		//var _thisVideo = $(this).next('video');
		
		//$(this).after('<span class="btnCloseVideo" title="close the video"></span>');
		//$('body').css('overflow', 'hidden').append('<div class="whiteShadeDiv"></div>');
		
		//_thisVideo.css({
		///	"position": "fixed",
		//	"z-index": 9999,
		//	"width": $(window).width() * .8,
		//	"height": "auto"
		//}).show().css({			
		//	"left": ($(window).width() - _thisVideo.width()) / 2,
		//	"top": ($(window).height() - _thisVideo.height()) / 2
	//	});
		
	//	$('.btnCloseVideo').css({
	//		"position": "fixed",
	//		"top": 0,
	//		"left": 0,
	//		"z-index": 9999,
	//		"display": "inline-block",
	//		"width": 45,
	//		"height": 45,
		//	"cursor": "pointer",
	//		"background": "url(images/close.png) 0 0 no-repeat"
	//	});
		
	//});
	//Close Watch Video
	//$('.watchVideoWrap').on('click', '.btnCloseVideo', function(){
	//	$('.watchVideoWrap.active').removeClass('active').find('video').hide().trigger('load');;
	//	$('.whiteShadeDiv, .btnCloseVideo').remove();
	//	$('body').css('overflow', 'scroll');
	//});
})

//个位数补零
function doubleNum(num){
	if(num < 10){
		num = '0' + num;
	}
	return num;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Example:

// writeCookie("myCookie", "my name", 24);

// Stores the string "my name" in the cookie "myCookie" which expires after 24 hours.

function writeCookie(name, value, hours)

{

  var expire = "";

  if(hours != null)

  {

    expire = new Date((new Date()).getTime() + hours * 3600000);

    expire = "; expires=" + expire.toGMTString();

  }

  document.cookie = name + "=" + escape(value) + expire;

}



// Example:

// alert( readCookie("myCookie") );

function readCookie(name)

{

  var cookieValue = "";

  var search = name + "=";

  if(document.cookie.length > 0)

  { 

    offset = document.cookie.indexOf(search);

    if (offset != -1)

    { 

      offset += search.length;

      end = document.cookie.indexOf(";", offset);

      if (end == -1) end = document.cookie.length;

      cookieValue = unescape(document.cookie.substring(offset, end))

    }

  }

  return cookieValue;

}

