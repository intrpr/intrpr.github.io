$( function() {
	getPosts();
});

function getPosts() {
	// Post parser for Tumblr blogs.
	// Change "blog_url" to pull in a new feed.

	var blog_name   = 'intrpr',
		 tumblr_feed = 'http://' + blog_name + '.tumblr.com/api/read/json?callback=?';

	$.getJSON(tumblr_feed, function(data) {
		getPosts(data.posts);
	});

	// HELPERS
	function getPosts(json) {
		for( var i=0, l=json.length; i<l; i++ ) {
			formatPost(json[i]);
		}
	}

	var tagLength = function(p) {
			if (p.tags) {
			  var tagNum = p.tags.length;
			  var tagHTML = "";
			  for (b = 0; b < tagNum; b++) {
				 tagHTML = tagHTML + "<span class='post-tags'>" + p.tags[b] + "</span> ";
			  }
			  return tagHTML;
			}
			else {
			  return " ";
			}
		 };

	function formatPost(post) {
		date    = moment.unix(post['unix-timestamp']).format('DD MMMM YYYY');
		content = post['regular-body'];
		type    = post.type;

		// Format post based on post type
		switch (type)
		{
		// Normal post
		case "regular":
			content	= '<h3>' + post['regular-title'] + '</h3>' + post['regular-body'] + '<h6 class="tags">' + post['tags'] + '</h6>';
			tags		= 'tags';
			break;

		// Link post
		case "link":
			content	= '<p class="link-text"><a href="' + post['link-url'] + '" target="_blank">' + post['link-text'] + '</a></p>' + '<div class="link-description"> ' + post['link-description'] + '</div>' + '<h6 class="tags">' + post['tags'] + '</h6>';
			tags		= 'post-tags';
			break;

		// Video post
		case "video":
			content = '<div class="video-container">' + post['video-player-500'] + '</div><span class="video-caption">' + post['video-caption'] + '</span>' + '<h6 class="tags">' + post['tags'] + '</h6>';
			tags		= 'post-tags';
			break;

		// Photo post
		case "photo":
			content = '<div class="photo"><img src="' + post['photo-url-1280'] + '" alt=""></div>' + '<span class="photo-caption">' + post['photo-caption'] + '</span>' + '<h6 class="tags">' + post['tags'] + '</h6>';
			tags		= 'post-tags';
			break;

		case "quote":
			content = '<blockquote>' + post['quote-text'] + '</blockquote>' + '<h6 class="tags">' + post['tags'] + '</h6>';
			tags		= 'post-tags';
			break;

		case "audio":
			content = post['audio-player'] + '<span class="song-caption">' + post['audio-caption'] + '</span>' + '<h6 class="tags">' + post['tags'] + '</h6>';
			tags		= 'post-tags';
			break;
		}

		// Send it to the view
		$('#feed').append('<div class="post"><span class="post-date">' + date + '</span><div class="content">' + content + '</div></div>');


		// Remove duplicate dates
		// http://stackoverflow.com/a/2822974
		// var seen = {};
		// $('.post-date').each(function() {
		// 	var txt = $(this).text();
		// 	if (seen[txt])
		// 		$(this).hide().next('content').addClass('bordered');
		// 	else
		// 		seen[txt] = true;
		// });
	}
}
