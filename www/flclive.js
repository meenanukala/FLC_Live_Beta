var today = moment().format('YYYY-MM-DD');

// make an asynchronous json call
function loadJson(url, callback) {
	var xmlhttprequest = new XMLHttpRequest();
	xmlhttprequest.onreadystatechange = function() {
		if (xmlhttprequest.readyState == 4 && xmlhttprequest.status == 200) {
			// do something with your data
			var data = JSON.parse(xmlhttprequest.responseText);
			if (callback) callback(data);
		}
	}
	// true is asynchronous and false is synchronous
	xmlhttprequest.open('GET', url, true);
	xmlhttprequest.send();
}

// make a synchronous json call
function loadJsonSynchronous(url, callback) {
    var xmlhttprequest = new XMLHttpRequest();
	xmlhttprequest.onreadystatechange = function() {
		if (xmlhttprequest.readyState == 4 && xmlhttprequest.status == 200) {
			// do something with your data
			var data = JSON.parse(xmlhttprequest.responseText);
			if (callback) callback(data);
		}
	}
	// true is asynchronous and false is synchronous
	xmlhttprequest.open('GET', url, false);
	xmlhttprequest.send();
}

// make an asynchronous xml call
function loadXml(url, callback) {
	var xmlhttprequest = new XMLHttpRequest();
	xmlhttprequest.onreadystatechange = function() {
		if (xmlhttprequest.readyState == 4 && xmlhttprequest.status == 200) {
			// do something with your data
			var data = xmlhttprequest.responseXML;
			if (callback) callback(data);
		}
	}
	// true is asynchronous and false is synchronous
	xmlhttprequest.open('GET', url, true);
	xmlhttprequest.send();
}

// make a synchronous xml call
function loadXmlSynchronous(url, callback) {
	var xmlhttprequest = new XMLHttpRequest();
	xmlhttprequest.onreadystatechange = function() {
		if (xmlhttprequest.readyState == 4 && xmlhttprequest.status == 200) {
			// do something with your data
			var data = xmlhttprequest.responseXML;
			if (callback) callback(data);
		}
	}
	// true is asynchronous and false is synchronous
	xmlhttprequest.open('GET', url, false);
	xmlhttprequest.send();
}

// opens and closes the video lightbox (jquery)
function openVideo(url, poster) {
	if (!poster) poster = "http://www.flcbranson.org/images/Posters/Flcb.jpg";
	$('body').append('<div class="lightbox" onclick="closeVideo();"><a class="close link" href="javascript:void(0)" onclick="closeVideo();">x</a></div>');
	$('.lightbox').append('<div class="lightboxcontent video"></div>');
	$('.lightboxcontent').append('<video src="' + url + '" poster="' + poster + '" autoplay controls x-webkit-airplay="allow" loop></video>');
}
function closeVideo() {
	$('.lightbox video')[0].pause();
	$('.lightbox').remove();
	// refresh the page
	//document.location.reload(true);
}

// when the next live broadcast is and play if broadcasting
// set a global javascript variable
var nextlivebroadcast;
function liveBroadcast() {
	// tell the function where the JSON data is
	loadJsonSynchronous('http://www.flcbranson.org/api/livebroadcast', function(data){
		// do something with your data
		// alert(JSON.stringify(data));
		// alert(data.datetime + ', ' + data.status);
		nextlivebroadcast = data.nextbroadcast;
		if (data.status == 'flcb' || data.status == 'flcs') {
			// define the global variable (only works when using synchronous connections)
			var livepublishingpoint = data.publishingpoint_hls;
			//window.location = 'http://www.flcbranson.org/liveapp';
			openVideo(livepublishingpoint);
		}
	});
}
// see if the global variable is still set (would say "undefined" if using an asychronous connection)
//alert(nextlivebroadcast);

// prepend 0s to a number
function padDigits(number, digits) {
	return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

// javascript countdown (http://www.developphp.com/view.php?tid=1248)
// don't forget to pass the broadcast variable
function cdtd(broadcast) {
	// just about any standard date format is accepted
	var nextinternetbroadcast = new Date(broadcast);
	var now = new Date();
	var timeDiff = nextinternetbroadcast.getTime() - now.getTime();
	if (timeDiff <= 0) {
		//document.getElementById('nextinternetbroadcast').classList.remove('disabled');
		$('#livebroadcast .countdown').html('<a href="index.html">Join now</a>');
		//document.getElementById('nextinternetbroadcast').innerHTML = '<a href="javscript:openVideo(' + livepublishingpoint + ');">Join live service now<\/a>';
	} else {
		var seconds = Math.floor(timeDiff / 1000);
		var minutes = Math.floor(seconds / 60);
		var hours = Math.floor(minutes / 60);
		var days = Math.floor(hours / 24);
		hours %= 24;
		minutes %= 60;
		seconds %= 60;

		var days_wording = 'days';
		if (days == 1) days_wording = 'day';
		var hours_wording = 'hrs';
		if (hours == 1) hours_wording = 'hour';
		var minutes_wording = 'mins';
		if (minutes == 1) minutes_wording = 'min';
		var seconds_wording = 'secs';
		if (seconds == 1) seconds_wording = 'sec';

		// padDigits() referenced above
		//days = padDigits(days, 2);
		//hours = padDigits(hours, 2);
		//minutes = padDigits(minutes, 2);
		//seconds = padDigits(seconds, 2);

		//document.getElementById('nextinternetbroadcast').className += " disabled";
		$('#livebroadcast .nextbroadcast').html('<span class="stylehook">Join our next live broadcast in</span> <span class="block"><span class="countdown"><span class="days">' + days + ' <span class="stylehook">' + days_wording + '</span></span> <span class="hours">' + hours + ' <span class="stylehook">' + hours_wording + '</span></span> <span class="minutes">' + minutes + ' <span class="stylehook">' + minutes_wording + '</span></span> <span class="seconds">' + seconds + ' <span class="stylehook">' + seconds_wording + '</span></span></span></span><span class="extrainfo">.</span>');
		// loop the function every second

		setTimeout(function() { cdtd(broadcast); }, 1000);
	}
}

// full service rebroadcasts
function sundayRebroadcast() {
    openVideo('http://ams.flcmedia.org/vod/RBSun.m3u8');

//	// tell the function where the JSON data is
//	loadJsonSynchronous('http://www.flcbranson.org/api/rebroadcast', function(data){
//		// do something with your data
//		// alert(JSON.stringify(data));
//		//alert(data.sunday_publishingpoint_hls);
//		//var sundayrebroadcastlink = 'http://www.flcbranson.org/liveapp/?rebroadcastsite=' + data.sunday + '&rebroadcastday=sun';
//		//window.location = sundayrebroadcastlink;
//		openVideo(data.sunday_publishingpoint_hls);
//		//playAudio(data.sunday_publishingpoint_hls);
//	});
}
function fridayRebroadcast() {
    openVideo('http://ams.flcmedia.org/vod/RBFri.m3u8');

//	// tell the function where the JSON data is
//	loadJsonSynchronous('http://www.flcbranson.org/api/rebroadcast', function(data){
//        console.log('data', data);
//		// do something with your data
//		// alert(JSON.stringify(data));
//		//alert(data.friday_publishingpoint_hls);
//		//var fridayrebroadcastlink = 'http://www.flcbranson.org/liveapp/?rebroadcastsite=' + data.friday + '&rebroadcastday=fri';
//		//window.location = fridayrebroadcastlink;
//		openVideo(data.friday_publishingpoint_hls);
//		//playAudio(data.friday_publishingpoint_hls);
//	});
}

// show today's chapter reference
function todaysChapterReference() {
	if (moment().format('dddd') == 'Saturday' || moment().format('dddd') == 'Sunday') {
		$('.home #dailybiblereading .title').append('No chapter today.');
	} else {
		// set a global javascript variable
		var dailychapter_book, dailychapter_chapter, dailychapter_todayschapter;
		// tell the function where the JSON data is
		loadJsonSynchronous('http://www.flcbranson.org/api/dailybiblereading', function(data) {
			// do something with your data
			// alert(JSON.stringify(data));
			// alert(data.title + ', ' + data.camelcase);
			// define the global variable (only works when using synchronous connections)
			dailychapter_book = data.dailychapter[0].book;
			dailychapter_chapter = data.dailychapter[0].chapter;
			dailychapter_todayschapter = dailychapter_book + ' ' + dailychapter_chapter;
			$('.home #dailybiblereading .title').append('Today\'s chapter is ' + dailychapter_todayschapter + '.');
		});
	}
}

// get data as json and fiddle with it
function todaysChapter() {
	if (moment().format('dddd') == 'Saturday' || moment().format('dddd') == 'Sunday') {
		$('.dailybiblereading #content').append('<img class="dbrcard" src="http://www.flcbranson.org/images/DBR-1.jpg alt="<p>Come Join us in reading the Bible this year. We read one chapter of the Bible each weekday(Monday through Friday).</p>><img class="dbrcard" src="http://www.flcbranson.org/images/DBR-2.jpg" alt="<p>Come Join us in reading the Bible this year. We read one chapter of the Bible each weekday(Monday through Friday).</p>>');
	} else {
		// tell the function where the JSON data is
		loadJsonSynchronous('http://www.flcbranson.org/api/dailybiblereading', function(data) {
			// do something with your data
			//alert(JSON.stringify(data));
			//alert(data.Title);
			//$('#todayschapter').append('<p><a href="todayschapter.html">Today\'s chapter is ' + json.dailychapter[0].book + ' ' + json.dailychapter[0].chapter + '.</a></p>');
			$('.dailybiblereading #content').append('<dl id="verses">');
			for (var i = 0, l = data.dailychapter[0].verses.length; i < l; i++) {
				//alert(json.dailychapter[i].verses[i].number);
				$('.dailybiblereading #content #verses').append('<dt>' + data.dailychapter[0].book + ' ' + data.dailychapter[0].chapter + ':' + data.dailychapter[0].verses[i].number + '</dt>');
				$('.dailybiblereading #content #verses').append('<dd>' + data.dailychapter[0].verses[i].text + '</dd>');
			}
			$('.dailybiblereading #content').append('</dl>');
		});
	}
}

// get data as xml and fiddle with it
function getXmlEvents() {
	// had to use a synchronous connection or the links wouldn't be converted to open in system browser (convertLinks())
	loadXmlSynchronous('http://www.flcbranson.org/rss/Events.xml', function(data) {
		// getElementsByTagName() creates an array of elements with that name
		var items = data.getElementsByTagName('item');
		var today = moment().format('YYYYMMDD');
		// iterate through the array in reverse
		for (var i = items.length - 1; i >= 0; i--) {
			// define your variables as null within the loop (just re-declaring a variable will not remove a previous value)
			var title = '';
			var title_camelcase = '';
			var speaker = '';
			var begindate = '';
			var enddate = '';
			var website = '';
			var venue = '';
			var address = '';
			var location = '';
			var location_array = '';
			var location_city = '';
			var location_state = '';
			var zip = '';
			var phone = '';
			var notes = '';

			// redefine your variables only if there is actual data
			// getElementsByTagName() creates an array of elements with that name
			// these files only have one title for each item
			// you can create an array of the titles (of which there is only one) and then a variable for the one title
			//var titles = items[i].getElementsByTagName('title');
			//alert(titles[0].firstChild.nodeValue);
			//var title = titles[0].firstChild.nodeValue;
			// or just directly access the title
			if (items[i].getElementsByTagName('title').length !== 0) var title = items[i].getElementsByTagName('title')[0].firstChild.nodeValue;
			// replace non-alphanumeric characters with nothing
			if (title) title_camelcase = title.replace(/[^a-zA-Z0-9]+/g, '');
			if (items[i].getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'creator').length !== 0) speaker = items[i].getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'creator')[0].firstChild.nodeValue;
			if (items[i].getElementsByTagName('pubDate').length !== 0) begindate = items[i].getElementsByTagName('pubDate')[0].firstChild.nodeValue;
			if (items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'endDate').length !== 0) enddate = items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'endDate')[0].firstChild.nodeValue;
			if (items[i].getElementsByTagName('link').length !== 0) website = items[i].getElementsByTagName('link')[0].firstChild.nodeValue;
			if (items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'venue').length !== 0) venue = items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'venue')[0].firstChild.nodeValue;
			if (items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'address').length !== 0) address = items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'address')[0].firstChild.nodeValue;
			if (items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'location').length !== 0) location = items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'location')[0].firstChild.nodeValue;
			// create an array from a string using the defined delimiter
			if (location) location_array = location.split(',');
			// if there's only one part of the array (the delimiter wasn't found)
			if (location_array.length === 1) {
				location_city = location_array[0];
			}
			// if there are two parts then assume a city and state
			if (location_array.length === 2) {
				location_city = location_array[0];
				location_state = location_array[1];
			}
			if (items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'zip').length !== 0) zip = items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'zip')[0].firstChild.nodeValue;
			if (items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'phone').length !== 0) phone = items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'phone')[0].firstChild.nodeValue;
			if (items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'notes').length !== 0) notes = items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'notes')[0].firstChild.nodeValue;
			if (enddate) {
				enddate = moment(enddate.substring(5, 16)).format('YYYYMMDD');
			} else {
				enddate = moment(begindate.substring(5, 16)).format('YYYYMMDD');
			}
			if (enddate && enddate >= today) {
				$('#content').append(
					'<section id="' + title_camelcase + '" itemscope itemtype="http://schema.org/Event">' +
						'<h3 class="title" itemprop="name">' + title + '</h3>' +
						'<p class="venue">' + venue + '<span class="delimiter"> // </span>' + location + '</p>' +
						'<dl>' +
							'<dt>Speaker / Host</dt>' +
							'<dd class="speaker" itemprop="performer">' + speaker + '</dd>' +
						'</dl>' +
						'<div itemprop="location" itemscope itemtype="http://schema.org/Place">' +
							'<dl>' +
								'<dt>Address</dt>' +
								'<dd>' +
									'<p class="address" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">' +
										'<span class="street" itemprop="streetAddress">' + address + '</span>' +
										'<span class="city" itemprop="addressLocality">' + location_city + '</span>, <span class="state" itemprop="addressRegion">' + location_state + '</span> <span class="zip" itemprop="postalCode">' + zip + '</span>' +
									'</p>' +
								'</dd>' +
							'</dl>' +
							'<!-- you could do <a href="941-388-6961"></a> but most phones will make it a link anyways -->' +
							'<dl>' +
								'<dt>Phone Number</dt>' +
								'<dd class="phone" itemprop="telephone">' + phone + '</dd>' +
							'</dl>' +
							'<dl>' +
								'<dt>Website</dt>' +
								'<dd class="website"><a href="' + website + '" target="_blank" itemprop="url">' + website.substring(7) + '</a></dd>' +
							'</dl>' +
						'</div>' +
						'<dl id="' + title_camelcase + '-schedule" class="schedule">' +
							'<dt>Schedule</dt>' +
						'</dl>' +
						'<dl class="notes">' +
							'<dt>Event Notes</dt>' +
							'<dd>' +
							notes +
							'</dd>' +
						'</dl>' +
					'</section>'
				);

				// create an array for the dates and times of each event
				var dates = new Array();
				// push() adds a record to the end of the array
				if (items[i].getElementsByTagName('pubDate').length !== 0) dates.push(items[i].getElementsByTagName('pubDate')[0].firstChild.nodeValue);
				if (items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'extraDate1').length !== 0) dates.push(items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'extraDate1')[0].firstChild.nodeValue);
				if (items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'extraDate2').length !== 0) dates.push(items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'extraDate2')[0].firstChild.nodeValue);
				if (items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'extraDate3').length !== 0) dates.push(items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'extraDate3')[0].firstChild.nodeValue);
				if (items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'extraDate4').length !== 0) dates.push(items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'extraDate4')[0].firstChild.nodeValue);
				if (items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'endDate').length !== 0) dates.push(items[i].getElementsByTagNameNS('http://www.moorelife.org/', 'endDate')[0].firstChild.nodeValue);

				for (var ii = 0; ii < dates.length; ii++) {
					// define your variables as null within the loop (just re-declaring a variable will not remove a previous value)
					var date = '';
					var date_iso8601 = '';
					var date_array = '';
					var date_timezone = '';
					var date_readable = '';
					// this will be in rfc-822 format
					var date = dates[ii];
					// convert rfc-822 date format to iso8601 date format
					// remove abbreviated day or time zones from date using substring()
					if (date) date_iso8601 = moment(date.substring(5, 25)).toISOString();
					// create an array from a string using the defined delimiter
					if (date) date_array = date.split(' ');
					// splitting rfc-822 by spaces should result in 6 fields (starting with field 0)
					if (date_array && date_array.length === 6) date_timezone = date_array[5];
					// remove abbreviated day or time zones from date using substring()
					if (date) date_readable = moment(date.substring(5, 25)).format('ddd, MMM D @ h:mmA') + ' (' + date_timezone + ')';
					$('#content #' + title_camelcase + '-schedule').append('<dd><time datetime="' + date_iso8601 + '">' + date_readable + '</time></dd>');
				}
			}
		}
	});
}

// get data as xml and fiddle with it
function featuredMessagesTitle() {
	// had to use a synchronous connection or the links wouldn't be converted to open in system browser (convertLinks())
	loadXmlSynchronous('http://www.flcbranson.org/rss/FeaturedMessages.xml', function(data) {
		// getElementsByTagName() creates an array of elements with that name
		var items = data.getElementsByTagName('item');
		// we just want the first one
		var featuredmessagestitle = items[0].getElementsByTagName('title')[0].firstChild.nodeValue;
		$('#featuredmessages .title').append(featuredmessagestitle + '<span class="extrainfo"> is our currently-featured messages.</span>');
	});
}

// get data as xml and fiddle with it
function featuredMessages() {
	// had to use a synchronous connection or the links wouldn't be converted to open in system browser (convertLinks())
	loadXmlSynchronous('http://www.flcbranson.org/rss/FeaturedMessages.xml', function(data) {
		// getElementsByTagName() creates an array of elements with that name
		var items = data.getElementsByTagName('item');
		// iterate through the array
		for (var i = 0; i <= items.length; i++) {
			var title = '';
			var title_camelcase = '';
			var title_array = '';
			var title_series = '';
			var title_seriespart = '';
			var title_sermon = '';
			var date = '';
			var date_iso8601 = '';
			var date_readable = '';
			var speaker = '';
			var guid = '';
			var mp3 = '';
			var mp4 = '';

			// redefine your variables only if there is actual data
			// getElementsByTagName() creates an array of elements with that name
			// these files only have one title for each item
			// you can create an array of the titles (of which there is only one) and then a variable for the one title
			//var titles = items[i].getElementsByTagName('title');
			//alert(titles[0].firstChild.nodeValue);
			//var title = titles[0].firstChild.nodeValue;
			// or just directly access the title
			var title = items[i].getElementsByTagName('title')[0].firstChild.nodeValue;
			// replace non-alphanumeric characters with nothing
			var title_camelcase = title.replace(/[^a-zA-Z0-9]+/g, '');
			var title_array = title.split(' - ');
			if (title_array) {
				title_series = title_array[0] || '';
				title_seriespart = title_array[1] || '';
				title_sermon = title_array[2] || '';
			}
			var date = items[i].getElementsByTagName('pubDate')[0].firstChild.nodeValue;
			// convert rfc-822 date format to iso8601 date format
			// remove abbreviated day or time zones from date using substring()
			var date_iso8601 = moment(date.substring(5, 25)).toISOString();
			var date_readable = moment(date.substring(5, 25)).format('dddd, MMMM D, YYYY');
			var speaker = items[i].getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'creator')[0].firstChild.nodeValue;
			var guid = items[i].getElementsByTagName('guid')[0].firstChild.nodeValue;
			var mp3 = guid;
			var mp4 = guid.replace(/mp3/g, 'mp4');
			var mp4 = mp4.replace(/MP3/g, 'MP4');
			var mp4 = mp4.replace(/Audio/g, 'Video');
			$('#content').append('<dl id="' + title_camelcase + '" class="message">');
			$('#content #' + title_camelcase).append('<dt>Date Preached</dt>');
			$('#content #' + title_camelcase).append('<dd class="date"><time datetime="' + date_iso8601 + '">' + date_readable + '</time></dd>');
			$('#content #' + title_camelcase).append('<dt>Title</dt>');
			$('#content #' + title_camelcase).append('<dd class="title series">' + title_series + (title_seriespart.length ? ' - ' + title_seriespart : '') + '</dd>');
			$('#content #' + title_camelcase).append('<dd class="title sermon">' + (title_sermon ? '(' + title_sermon + ')' : title_sermon) + '</dd>');
			$('#content #' + title_camelcase).append('<dt>Speaker</dt>');
			$('#content #' + title_camelcase).append('<dd class="speaker">' + speaker + '</dd>');
			$('#content #' + title_camelcase).append('<dt>Download Links</dt>');
			$('#content #' + title_camelcase).append('<dd id="' + title_camelcase + '-downloadlinks">');
			$('#content #' + title_camelcase + ' #' + title_camelcase + '-downloadlinks').append('<ul>');
			$('#content #' + title_camelcase + ' #' + title_camelcase + '-downloadlinks ul').append('<li class="link audio" onclick="openVideo(\'' + mp3 + '\');">Listen</li>');
			$('#content #' + title_camelcase + ' #' + title_camelcase + '-downloadlinks ul').append('<li class="link video" onclick="openVideo(\'' + mp4 + '\');">Watch</li>');
			$('#content #' + title_camelcase + ' #' + title_camelcase).append('</ul>');
			$('#content #' + title_camelcase).append('</dd>');
			$('#content').append('</dl>');
		}
	});
}

// open a link in the system browser
// window.open wasn't opening a link in the system browser on iOS, so we have to use this function (requires phonegap.js)
function redirectToSystemBrowser(url) {
	// Wait for Cordova to load
	document.addEventListener('deviceready', onDeviceReady, false);
	// Cordova is ready
	function onDeviceReady() {
		// open URL in default web browser
		var ref = window.open(encodeURI(url), '_system', 'location=yes');
	}
}

function convertLinks() {
	// convert the target="_blank" links to our function
	$('#content a').click(function(e) {
		// keep the browser from doing what it's supposed to
		e.preventDefault();
		//return false;
		var address = $(this).attr('href');
		// use our system browser function to open the url
		// calling redirectToSystemBrowser() didn't work
		// Wait for Cordova to load
		document.addEventListener('deviceready', onDeviceReady, false);
		// Cordova is ready
		function onDeviceReady() {
			// open URL in default web browser
			var ref = window.open(encodeURI(address), '_system', 'location=yes');
		}
		//redirectToSystemBrowser('\'' + address + '\'');
		//alert('didn\'t follow link');
		//alert('\'' + address + '\'');
	});
}

// just open links via javascript
function openLink(url) {
	// if you don't include _self it will open in a new tab
	window.open(url, '_self');
}

// phonegap api media playing
var media;
function loadMedia(url, poster) {
	// remove the player if it's already there
	if ($('.backgroundplayer')) {
		$('.backgroundplayer').remove();
	}
	if (!poster) poster = "http://www.flcbranson.org/images/Posters/Flcb.jpg";
	// create the player area
	$('body').append(
		'<div class="backgroundplayer" style="background-image:url(' + poster + ');">' +
			'<div class="button stop" onclick="stopMedia();">Stop</div>' +
			'<div class="button play" onclick="playMedia();">Play</div>' +
			'<div class="button pause" onclick="pauseMedia();">Pause</div>' +
			'<div class="button close" onclick="unloadMedia();">Close</div>' +
		'</div>'
	);
	$('body').addClass('withbackgroundplayer');
	// load a media resource
	media = new Media(url);
}
function playMedia() {
	// play when screen is locked
	media.play({ playAudioWhenScreenIsLocked : true });
}
function stopMedia() {
	if (media) {
		media.stop();
	}
}
function pauseMedia() {
	if (media) {
		media.pause();
	}
}
function unloadMedia() {
	if (media) {
		media.stop();
		media.release();
	}
	if ($('.backgroundplayer')) {
		$('.backgroundplayer').remove();
	}
	$('body').removeClass('withbackgroundplayer');
}

/* things that are no longer in use or don't work

function featuredSeriesTitle() {
	$('.home #featuredseriestitle').append('<a href="featuredseries.html">' + featuredseries + '</a><span class="extrainfo"> is the currently featured series.</span>');
}

function seriesDownload(seriestitle) {
	var series, number, description;
	// tell the function where the JSON data is
	loadJsonSynchronous('http://www.flcbranson.org/api/seriesdownload/?series=' + seriestitle, function(data) {
		// do something with your data
		// alert(JSON.stringify(data));
		// alert(data.title + ', ' + data.camelcase);
		series = data.series;
		number = data.seriesnumber;
		description = data.description;
		$('#content').append('<h2 class="heading page">' + series + '</h2>');
		$('#content').append('<blockquote><p>' + description + '</p></blockquote>');
		for (var i = 0, l = data.sermons.length; i < l; i++) {
			var date, speaker, seriespart, sermon, sermonpart, sermonsubtitle, sermonsubtitlepart, mp3, mp4;
			//alert(data.events[i].name);
			date = data.sermons[i].date;
			// date.js doesn't seem to like the iso8601 time zone offset
			var date_readable = Date.parse(date.substring(0, 19)).toString('dddd, MMMM d, yyyy');
			speaker = data.sermons[i].speaker;
			seriespart = data.sermons[i].seriespart;
			sermon = data.sermons[i].sermon;
			// replace non-alphanumeric characters with nothing
			var sermon_camelcase = sermon.replace(/[^a-zA-Z0-9]+/g, '');
			sermonpart = data.sermons[i].sermonpart;
			sermonsubtitle = data.sermons[i].sermonsubtitle;
			sermonsubtitlepart = data.sermons[i].sermonsubtitlepart;
			mp3 = data.sermons[i].downloadlinks.mp3;
			mp4 = data.sermons[i].downloadlinks.mp4;
			$('#content').append('<h3>Pt. ' + seriespart + ' - ' + sermon + '</h3>');
			$('#content').append('<dl id="' + sermon_camelcase + '">');
			$('#content #' + sermon_camelcase).append('<dt>Date Preached</dt>');
			$('#content #' + sermon_camelcase).append('<dd><time datetime="' + date + '">' + date_readable + '</time></dd>');
			$('#content #' + sermon_camelcase).append('<dt>Speaker</dt>');
			$('#content #' + sermon_camelcase).append('<dd>' + speaker + '</dd>');
			$('#content #' + sermon_camelcase).append('<dt>Download Links</dt>');
			$('#content #' + sermon_camelcase).append('<dd id="' + sermon_camelcase + '-downloadlinks">');
			$('#content #' + sermon_camelcase + ' #' + sermon_camelcase + '-downloadlinks').append('<ul>');
			$('#content #' + sermon_camelcase + ' #' + sermon_camelcase + '-downloadlinks ul').append('<li class="link" onclick="openVideo(\'' + mp3 + '\', \'' + featuredseries_poster + '\')">Audio (MP3)</li>');
			$('#content #' + sermon_camelcase + ' #' + sermon_camelcase + '-downloadlinks ul').append('<li class="link" onclick="openVideo(\'' + mp4 + '\', \'' + featuredseries_poster + '\')">Video (MP4)</li>');
			//$('#content #' + sermon_camelcase + ' #' + sermon_camelcase + '-downloadlinks ul').append('<li class="link" onclick="playAudio(\'' + mp3 + '\')">Audio (MP3)</li>');
			//$('#content #' + sermon_camelcase + ' #' + sermon_camelcase + '-downloadlinks ul').append('<li class="link" onclick="playAudio(\'' + mp4 + '\')">Video (MP4)</li>');
			$('#content #' + sermon_camelcase + ' #' + sermon_camelcase + '-downloadlinks').append('</ul>');
			$('#content #' + sermon_camelcase).append('</dd>');
			$('#content').append('</dl>');
		}
	});
}

// you can't do global variables with asynchronous connections
// set a global javascript variable
var featuredseries, featuredseries_camelcase, featuredseries_speaker, featuredseries_poster;
// tell the function where the JSON data is
loadJsonSynchronous('http://www.flcbranson.org/api/featuredseries', function(data) {
	// do something with your data
	// alert(JSON.stringify(data));
	// alert(data.title + ', ' + data.camelcase);
	// define the global variable (only works when using synchronous connections)
	featuredseries = data.title;
	featuredseries_camelcase = data.camelcase;
	featuredseries_speaker = data.speaker;
	featuredseries_poster = data.poster;
});
// see if the global variable is still set (would say "undefined" if using an asychronous connection)
//alert(featuredseries + ', ' + featuredseries_camelcase);

// generic get JSON data function
function fetchJSONFile(path, callback) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				var data = JSON.parse(httpRequest.responseText);
				if (callback) callback(data);
			}
		}
	};
	// false tells it to be synchronous instead of asynchronous
	httpRequest.open('GET', path, false);
	httpRequest.send();
}

// get data as json and fiddle with it
function getApiEvents() {
	// tell the function where the JSON data is
	fetchJSONFile('http://www.flcbranson.org/api/events', function(data) {
		// do something with your data
		// alert(JSON.stringify(data));
		// alert(data.title + ', ' + data.camelcase);
		for (var i = 0, l = data.events.length; i < l; i++) {
			//alert(data.events[i].name);
			var event_name = data.events[i].name;
			// replace non-alphanumeric characters with nothing
			var event_name_camelcase = event_name.replace(/[^a-zA-Z0-9]+/g, '');
			var event_speakers = data.events[i].speakers;
			var event_venue_name = data.events[i].venue.name;
			var event_venue_host = data.events[i].venue.host;
			var event_venue_street = data.events[i].venue.street;
			var event_venue_city = data.events[i].venue.city;
			var event_venue_state = data.events[i].venue.state;
			var event_venue_zip = data.events[i].venue.zip;
			var event_venue_country = data.events[i].venue.country;
			var event_venue_timezone = data.events[i].venue.timezone;
			var event_venue_map = data.events[i].venue.map;
			var event_phone = data.events[i].phone;
			var event_email = data.events[i].email;
			var event_website = data.events[i].website;
			$('#content').append('<dl id="' + event_name_camelcase + '">');
			$('#content #' + event_name_camelcase).append('<dt>Event Name</dt>');
			$('#content #' + event_name_camelcase).append('<dd class="eventname">' + event_name + '</dd>');
			$('#content #' + event_name_camelcase).append('<dt>Event Speakers</dt>');
			$('#content #' + event_name_camelcase).append('<dd class="eventspeakers">Speaking:  ' + event_speakers + '</dd>');
			$('#content #' + event_name_camelcase).append('<dt>Venue Title</dt>');
			$('#content #' + event_name_camelcase).append('<dd class="venuetitle">' + event_venue_name + ' <span class="delimiter"></span> ' + event_venue_city + ', ' + event_venue_state + '</dd>');
			$('#content #' + event_name_camelcase).append('<dt>Venue Host</dt>');
			$('#content #' + event_name_camelcase).append('<dd class="eventhost">Hosting:  ' + event_venue_host + '</dd>');
			$('#content #' + event_name_camelcase).append('<dt>Venue Address</dt>');
			$('#content #' + event_name_camelcase).append('<dd class="address"><span class="venuestreet">' + event_venue_street + '</span> <span class="venuecity">' + event_venue_city + '</span>, <span class="venuestate">' + event_venue_state + '</span>  <span class="venuezip">' + event_venue_zip + '</dd>');
			if (event_venue_country != "United States Of America") $('#content #' + event_name_camelcase).append('<span class="address venuecountry">' + event_venue_country + '</dd>');
			$('#content #' + event_name_camelcase).append('<dt>Venue Time Zone</dt>');
			$('#content #' + event_name_camelcase).append('<dd class="venuetimezone">' + event_venue_timezone + '</dd>');
			$('#content #' + event_name_camelcase).append('<dt>Venue Map</dt>');
			$('#content #' + event_name_camelcase).append('<dd class="map link"><a href="' + event_venue_map + '">Google Map</a></dd>');
			$('#content #' + event_name_camelcase).append('<dt>Event Phone Number</dt>');
			$('#content #' + event_name_camelcase).append('<dd class="eventphone">' + event_phone + '</dd>');
			$('#content #' + event_name_camelcase).append('<dt>Event E-Mail</dt>');
			$('#content #' + event_name_camelcase).append('<dd class="eventemail"><a href="' + event_email + '">E-Mail Address</a></dd>');
			$('#content #' + event_name_camelcase).append('<dt>Event Website</dt>');
			$('#content #' + event_name_camelcase).append('<dd class="eventwebsite"><a href="' + event_website + '">' + event_website + '</a></dd>');
			$('#content #' + event_name_camelcase).append('<dt>Event Schedule</dt>');
			$('#content #' + event_name_camelcase).append('<dd id="' + event_name_camelcase + '-schedule" class="schedule">');
			$('#content #' + event_name_camelcase + ' #' + event_name_camelcase + '-schedule').append('<ol>');
			for (var ii = 0, ll = data.events[i].schedule.length; ii < ll; ii++) {
				var event_schedule_datetime = data.events[i].schedule[ii].datetime;
				// date.js doesn't seem to like the iso8601 time zone offset
				var event_schedule_datetime_readable = Date.parse(event_schedule_datetime.substring(0, 19)).toString('dddd, MMMM d, yyyy @ h:mm tt');
				var event_schedule_timezone = data.events[i].schedule[ii].timezone;
				var event_schedule_speaker = data.events[i].schedule[ii].speaker;
				$('#content #' + event_name_camelcase + ' #' + event_name_camelcase + '-schedule ol').append('<li id="' + event_name_camelcase + '-schedule-' + ii + '">');
				$('#content #' + event_name_camelcase + ' #' + event_name_camelcase + '-schedule ol #' + event_name_camelcase + '-schedule-' + ii).append('<dl>');
				$('#content #' + event_name_camelcase + ' #' + event_name_camelcase + '-schedule ol #' + event_name_camelcase + '-schedule-' + ii + ' dl').append('<dt>Date &amp; Time</dt>');
				$('#content #' + event_name_camelcase + ' #' + event_name_camelcase + '-schedule ol #' + event_name_camelcase + '-schedule-' + ii + ' dl').append('<dd class="eventdatetime"><time datetime="' + event_schedule_datetime + '">' + event_schedule_datetime_readable + '</time></dd>');
				$('#content #' + event_name_camelcase + ' #' + event_name_camelcase + '-schedule ol #' + event_name_camelcase + '-schedule-' + ii + ' dl').append('<dt>Time Zone</dt>');
				$('#content #' + event_name_camelcase + ' #' + event_name_camelcase + '-schedule ol #' + event_name_camelcase + '-schedule-' + ii + ' dl').append('<dd class="eventtimezone">' + event_schedule_timezone + '</dd>');
				$('#content #' + event_name_camelcase + ' #' + event_name_camelcase + '-schedule ol #' + event_name_camelcase + '-schedule-' + ii + ' dl').append('<dt>Speaker</dt>');
				$('#content #' + event_name_camelcase + ' #' + event_name_camelcase + '-schedule ol #' + event_name_camelcase + '-schedule-' + ii + ' dl').append('<dd class="eventspeaker">' + event_schedule_speaker + '</dd>');
				$('#content #' + event_name_camelcase + ' #' + event_name_camelcase + '-schedule ol #' + event_name_camelcase + '-schedule-' + ii).append('</dl>');
				$('#content #' + event_name_camelcase + ' #' + event_name_camelcase + '-schedule ol').append('</li>');
			}
			$('#content #' + event_name_camelcase).append('</ol>');
			$('#content #' + event_name_camelcase).append('</dd>');
			$('#content #' + event_name_camelcase).append('</dl>');
		}
	});
}

// load one of our XML files and show the info
function loadXML(url) {
	var xmlhttp;
	var x, i, xx;
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {
		// code for IE6, IE5
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			// do something with your data
			txt = '<div>';
			x = xmlhttp.responseXML.documentElement.getElementsByTagName('item');
			for (i = 0; i < x.length; i++) {
				txt = txt + '<dl>';
				txt = txt + '<dt>Sermon Title</dt>';
				xx = x[i].getElementsByTagName('title'); {
					try {
						txt = txt + '<dd>Pt. ' + xx[0].firstChild.nodeValue + '</dd>';
					}
					catch (er) {
						txt = txt + '<dd> </dd>';
					}
				}
				txt = txt + '<dt>Speaker</dt>';
				// loads speakers in Internet Explorer but not iOS (maybe a namespace issue)
				xx = x[i].getElementsByTagName('dc:creator'); {
					try {
						txt = txt + '<dd>' + xx[0].firstChild.nodeValue + '</dd>';
					}
					catch (er) {
						txt = txt + '<dd> </dd>';
					}
				}
				txt = txt + '<dt>Date Preached</dt>';
				xx = x[i].getElementsByTagName('pubDate'); {
					// date.js (included separately) string format (Sunday, March 05, 2012)
					var date = Date.parse(xx[0].firstChild.nodeValue).toString('dddd, MMMM dd, yyyy');
					try {
						txt = txt + '<dd>' + date + '</dd>';
					}
					catch (er) {
						txt = txt + '<dd> </dd>';
					}
				}
				txt = txt + '<dt>Download Link</dt>';
				xx = x[i].getElementsByTagName('guid'); {
					try {
						txt = txt + '<dd onclick="openVideo(\'' + xx[0].firstChild.nodeValue + '\', \'http://www.flcbranson.org/images/Posters/' + basename(featuredseries_camelcase) + '.jpg\');">Audio</dd>';
					}
					catch (er) {
						txt = txt + '<dd> </dd>';
					}
				}
				txt = txt + '</dl>';
			}
			txt = txt + '</div>';
			document.getElementById('sermons').innerHTML = txt;
		}
	}
	xmlhttp.open('GET', url, true);
	xmlhttp.send();
}

// opens and closes the service times lightbox (jquery)
function openServiceTimes() {
	$('body').append('<div class="lightbox" onclick="closeServiceTimes();"><a class="close" href="javascript:void(0)" onclick="closeServiceTimes();">x</a></div>');
	$('.lightbox').append('<div class="lightboxcontent servicetimes"></div>');
	$('.lightboxcontent').append('\
	<dl>\n\
		<dt>Broadcast Times</dt>\n\
		<dd>Sundays @ 9:00 <abbr>AM</abbr> & <span class="qualification">***</span> 11:00 <abbr>AM</abbr> <span class="timezone">Central Time</span></dd>\n\
		<dd>Fridays @ 6:30 <abbr>PM</abbr> <span class="timezone">Central Time</span></dd>\n\
	</dl>\n\
	<p>Open "<abbr title="Faith Life Church">FLC</abbr> Live" during these times to connect directly to our live service broadcasts.</p>\n\
	<p><small><span class="qualification">***</span> When our Sunday service is broadcast live from Sarasota at 9:00 <abbr>AM</abbr> (central), the 11:00 AM service will be a rebroadcast and may be viewed by selecting Sunday Rebroadcast.</small></p>\
	');
}
function closeServiceTimes() {
	$('.lightbox').remove();
}

// a JavaScript equivalent of PHP’s basename() function
function basename(path, suffix) {
	// http://kevin.vanzonneveld.net
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   improved by: Ash Searle (http://hexmen.com/blog/)
	// +   improved by: Lincoln Ramsay
	// +   improved by: djmix
	// *     example 1: basename('/www/site/home.htm', '.htm');
	// *     returns 1: 'home'
	// *     example 2: basename('ecra.php?p=1');
	// *     returns 2: 'ecra.php?p=1'
	var b = path.replace(/^.*[\/\\]/g, '');
	if (typeof(suffix) == 'string' && b.substr(b.length - suffix.length) == suffix) {
		b = b.substr(0, b.length - suffix.length);
	}
	return b;
}

// get URL queries ?name1=value1&name2=value2 and turns them into javascript variables
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return(false);
}

function yo() {
	alert('Yo')
};
$(document).ready(yo);
*/
