var style="style-newspaper";var size="size-large";var margin="margin-wide";var baseHref=window.location.toString().match(/.*\//);var linkStringStart="javascript:(function(){";var linkStringEnd="var locationURL=document.location.href;window.open('https://www.naturalreaders.com/index.html?&url='+encodeURIComponent(locationURL));})();";$(document).ready(function(){$(".bookmarkletLink").attr("href",linkStringStart+linkStringEnd);$(".bookmarkletLink").bind("click",function(){var content='';if($.browser.msie){content="To start using Readability, right-click and select 'Add To Favorites...' to save this link to your browser's bookmarks toolbar.";}else{content='If you want a free web reader, just drag this button to your Favorites/Bookmarks Bar.';}alert(content);return false;});});