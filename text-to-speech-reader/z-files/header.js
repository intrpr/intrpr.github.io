if(typeof(duee2013)=="undefined"){
	var duee2013={};
};

duee2013.header = typeof(duee2013.header)!="undefined" ? duee2013.header : {
	mousein5:false,
	mousein6:false,
	go_agree:false,
	islogin:false,
	ismustlogin:false,
	index_ready:function()
	{
		$("#menu_login").click(function(){
		  	$("#loginiframe").attr("src","dueelogin.php");
			$("#loginview").fadeIn("slow");
		});
		$('#user_frame').mouseenter(function(){
				duee2013.header.mousein5=true;
				duee2013.header.showlogout();
			});
		$('#user_frame').mouseleave(function(){
				duee2013.header.mousein5=false;
				duee2013.header.showlogout();
			});
		$('#persondata').mouseenter(function(){
				duee2013.header.mousein6=true;
				duee2013.header.showlogout();
			});
		$('#persondata').mouseleave(function(){
				duee2013.header.mousein6=false;
				duee2013.header.showlogout();
			});
		$('#log_out').click(function() {
			$('#persondata').css("display","none");
			NA.logout();
		});
		NA.init("de52ydkplza","g13pqbr77k84cggw4oscsggwcos8sco");
		NA.setAuthPrepare(duee2013.header.logincb,duee2013.header.logoutcb);
		var recognkey=NA.storage('NASDK_JS_recognkey');
		if (typeof(recognkey) == "undefined" || recognkey == null || recognkey==''){
			recognkey=duee2013.header.NewGuid();
			NA.storage('NASDK_JS_recognkey',recognkey);
		};
		NA._recognkey=recognkey;
		duee2013.header.checklogin();
	},
	checklogin:function(cb){
		var usertoken=NA.storage('NASDK_JS_usertoken');
		if (typeof(usertoken) != "undefined" && usertoken != null)
		{
			var lastsource=NA.storage('lastsource');
			switch(lastsource)
			{
				case "fb":duee2013.header.checkFBLoginStatus(cb);break;
				case "na":duee2013.header.getinfomation(true);cb(true);break;
				default:duee2013.header.islogin = false;cb(false);NA.logout();break;
			}
		}else{
			//NA.clearStorage();
			NA.storage('NASDK_JS_recognkey',NA._recognkey);
			//$('#menu_login').removeClass("top_login_loading");
			//$('#menu_login').addClass("top_login");
			duee2013.header.islogin = false;
			cb(false);
		};
	},
	checkFBLoginStatus:function (cb){
		if(typeof(window.fbAsyncInit) == "undefined" || window.fbAsyncInit == null){
			window.fbAsyncInit = function() {
				FB.init({
				  appId:'432892296746708',
					cookie:true, 
					status : true,
					xfbml:true
				});
				FB.getLoginStatus(function(response) {
					if (response.status === 'connected') {
						duee2013.header.getinfomation(true);
						cb(true);
					} else {
						duee2013.header.getinfomation(false);
						cb(false);
					}
				});
		  };
		}
	},
	getinfomation:function (flag)
	{
		if (flag) {
			//duee2013.header.getuserinfo();
			duee2013.header.islogin = true;
		} else {
			duee2013.header.islogin = false;
			NA.logout();
		}
	},
	getuserinfo:function (){//user/getuserinfo
		NA.api("user/getuserinfo",null,duee2013.header.getuserinfoCallback);
	},
	getuserinfoCallback:function (jsonstr){
		var str=duee.core.base64_decode(jsonstr.userinfo);
		var str1 = str.replace(/\"\[/g,'\[');
		var str2 = str1.replace(/\]\"/g,'\]');
		var userinfo=eval('(' + str2 + ')'); 
		$('#menu_login').removeClass("top_login_loading");
		$('#menu_login').addClass("top_login");
		$('#user_frame').css("display","block");
		$('#menu_login').css("display","none");
		$('#fancy_upload_login').css("display","none");
		$('#fancy_upload').css("display","block");
		$('#fancy_reading_type_login').css("display","none");
		$('#reading_type').css("display","block");
		var pic;
		switch(jsonstr.source){
			case "fb":
				$('#username').text(userinfo.name);
				pic='https://graph.facebook.com/'+userinfo.id+'/picture';break;
			case "na":
				$('#username').text(userinfo.name);
				pic="web/images/guest.png";break;
			default:;break;
			};
		$('#my_photo').attr("src",pic);
	},
	showlogout:function()
	{
		if(duee2013.header.mousein5==false && duee2013.header.mousein6==false){
			$('#persondata').css("display","none");
		}else{
			$('#persondata').css("display","block");
		};
	},
	closeloginview:function()
	{
		$("#loginview").fadeOut("slow",function(){
			if(duee2013.header.go_agree){
				window.location.href = "agreement.php";
			};
		});
	},
	NewGuid:function() 
	{   
	    var guid = "";
		for (var i = 1; i <= 32; i++){
		  var n = Math.floor(Math.random()*16.0).toString(16);
		  guid +=   n;
		}
		return guid;       
	},
	logincb:function(cb){
	},
	logoutcb:function(){
		NA.clearStorage();
		NA.storage('NASDK_JS_recognkey',NA._recognkey);
		window.location.href=window.location.href;
	},
}