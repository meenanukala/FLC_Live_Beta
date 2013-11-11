// global date reference for today (uses date.js)
var today = Date.today().toString('yyyy-MM-dd');
//alert(today);

// make an ajax call
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

// make an ajax call
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

// opens and closes the video lightbox (jquery)
function openVideo(url, poster) {
	if (poster === undefined) poster = "http://www.flcbranson.org/images/Posters/Flcb.jpg";
	$('body').append('<div class="lightbox" onclick="closeVideo();"><a class="close" href="javascript:void(0)" onclick="closeVideo();">x</a></div>');
	$('.lightbox').append('<div class="lightboxcontent video"></div>');
	$('.lightboxcontent').append('<video src="' + url + '" poster="' + poster + '" autoplay controls x-webkit-airplay="allow" loop></video>');
}
function closeVideo() {
	$('.lightbox video')[0].pause();
	$('.lightbox').remove();
	// refresh the page
	//document.location.reload(true);
}

// prepend 0s to a number
function padDigits(number, digits) {
	return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

// full service rebroadcasts
function sundayRebroadcast() {
	// tell the function where the JSON data is
	fetchJSONFile('http://www.flcbranson.org/api/rebroadcast', function(data){
		// do something with your data
		// alert(JSON.stringify(data));
		//alert(data.sunday_publishingpoint_hls);
		//var sundayrebroadcastlink = 'http://www.flcbranson.org/liveapp/?rebroadcastsite=' + data.sunday + '&rebroadcastday=sun';
		//window.location = sundayrebroadcastlink;
		openVideo(data.sunday_publishingpoint_hls);
	});
}
function fridayRebroadcast() {
	// tell the function where the JSON data is
	fetchJSONFile('http://www.flcbranson.org/api/rebroadcast', function(data){
		// do something with your data
		// alert(JSON.stringify(data));
		//alert(data.friday_publishingpoint_hls);
		//var fridayrebroadcastlink = 'http://www.flcbranson.org/liveapp/?rebroadcastsite=' + data.friday + '&rebroadcastday=fri';
		//window.location = fridayrebroadcastlink;
		openVideo(data.friday_publishingpoint_hls);
	});
}

// you can't do global variables with asynchronous connections
// set a global javascript variable
var featuredseries, featuredseries_camelcase, featuredseries_speaker, featuredseries_poster;
// tell the function where the JSON data is
fetchJSONFile('http://www.flcbranson.org/api/featuredseries', function(data) {
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

// start javascript countdown (http://www.developphp.com/view.php?tid=1248)
// don't forget to pass the broadcast variable
function cdtd(broadcast) {
	// just about any standard date format is accepted
	var nextinternetbroadcast = new Date(broadcast);
	var now = new Date();
	var timeDiff = nextinternetbroadcast.getTime() - now.getTime();
	if (timeDiff <= 0) {
		document.getElementById('nextinternetbroadcast').classList.remove('disabled');
		document.getElementById('nextinternetbroadcast').innerHTML = '<a href="index.html">Join now<\/a>';
		//document.getElementById('nextinternetbroadcast').innerHTML = '<a href="javscript:openVideo(' + livepublishingpoint + ');">Join live service now<\/a>';
	} else {
		var seconds = Math.floor(timeDiff / 1000);
		var minutes = Math.floor(seconds / 60);
		var hours = Math.floor(minutes / 60);
		var days = Math.floor(hours / 24);
		hours %= 24;
		minutes %= 60;
		seconds %= 60;
		// padDigits() referenced above
		days = padDigits(days, 2);
		hours = padDigits(hours, 2);
		minutes = padDigits(minutes, 2);
		seconds = padDigits(seconds, 2);
		//document.getElementById('nextinternetbroadcast').className += " disabled";
		document.getElementById('nextinternetbroadcast').innerHTML = '<span class="days">' + days + ':</span><span class="hours">' + hours + ':</span><span class="minutes">' + minutes + ':</span><span class="seconds">' + seconds + '</span>';
		// loop the function every second
		setTimeout(function() { cdtd(broadcast); }, 1000);
	}
}

// show today's chapter reference
function todaysChapterReference() {
	if (Date.today().toString('dddd') == 'Saturday' || Date.today().toString('dddd') == 'Sunday') {
		$('.home #todayschapterreference').append('<p>No chapter today</p>');
	} else {
		// set a global javascript variable
		var dailychapter_book, dailychapter_chapter, dailychapter_todayschapter;
		// tell the function where the JSON data is
		fetchJSONFile('http://www.flcbranson.org/api/dailybiblereading', function(data) {
			// do something with your data
			// alert(JSON.stringify(data));
			// alert(data.title + ', ' + data.camelcase);
			// define the global variable (only works when using synchronous connections)
			dailychapter_book = data.dailychapter[0].book;
			dailychapter_chapter = data.dailychapter[0].chapter;
			dailychapter_todayschapter = dailychapter_book + '<span> Ch.</span>' + dailychapter_chapter;
			$('.home #todayschapterreference').append('<a href="dailybiblereading.html">' + dailychapter_todayschapter + '</a>');
		});
	}
}

// get data as json and fiddle with it
function todaysChapter() {
	if (Date.today().toString('dddd') == 'Saturday' || Date.today().toString('dddd') == 'Sunday') {
		$('.home #content').append('<p>There is no chapter to read on Saturday or Sunday</p>');
	} else {
		var xmlhttp;
		// code for IE7+, Firefox, Chrome, Opera, Safari
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
			// code for IE6, IE5
		} else {
			xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		}
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var json = JSON.parse(xmlhttp.responseText);
				//alert(JSON.stringify(json));
				//alert(json.Title);
				//$('#todayschapter').append('<p><a href="todayschapter.html">Today\'s chapter is ' + json.dailychapter[0].book + ' ' + json.dailychapter[0].chapter + '.</a></p>');
				$('.dailybiblereading #content').append('<dl id="verses">');
				for (var i = 0, l = json.dailychapter[0].verses.length; i < l; i++) {
					//alert(json.dailychapter[i].verses[i].number);
					$('.dailybiblereading #content #verses').append('<dt>' + json.dailychapter[0].book + ' ' + json.dailychapter[0].chapter + ':' + json.dailychapter[0].verses[i].number + '</dt>');
					$('.dailybiblereading #content #verses').append('<dd>' + json.dailychapter[0].verses[i].text + '</dd>');
				}
				$('.dailybiblereading #content').append('</dl>');
			}
		}
		// sometimes an asynchronous connection can be cached so sending an extra string (doesn't even have to be interpreted by the server) will cause it not to be cached
		var nocache = new Date().getTime();
		var path = 'http://www.flcbranson.org/api/dailybiblereading/?cache=' + nocache;
		// true is asynchronous and false is synchronous
		xmlhttp.open('GET', path, true);
		xmlhttp.send();
	}
}

// get data as xml and fiddle with it
function getXmlEvents() {
	loadXml('http://www.flcbranson.org/rss/Events.xml', function(data) {
		// getElementsByTagName() creates an array of elements with that name
		var items = data.getElementsByTagName('item');
		var today = Date.today().toString('yyyyMMdd');
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

			// getElementsByTagName() creates an array of elements with that name
			// these files only have one title for each item
			// you can create an array of the titles (of which there is only one) and then a variable for the one title
			//var titles = items[i].getElementsByTagName('title');
			//alert(titles[0].firstChild.nodeValue);
			//var title = titles[0].firstChild.nodeValue;
			// or just directly access the title
			// redefine your variables only if there is actual data
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
				enddate = Date.parse(enddate.substring(5, 16)).toString('yyyyMMdd');
			} else {
				enddate = Date.parse(begindate.substring(5, 16)).toString('yyyyMMdd');
			}
			if (enddate && enddate >= today) {
				$('#content').append(
				'<section id="' + title_camelcase + '" itemscope itemtype="http://schema.org/Event">' +
					'<h3 class="title" itemprop="name">' + title + '</h3>' +
					'<p class="venue">' + venue + '<span class="delimiter"></span>' + location + '</p>' +
					'<p class="speaker" itemprop="performer">' + speaker + '</p>' +
					'<div itemprop="location" itemscope itemtype="http://schema.org/Place">' +
						'<p class="address" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">' +
							'<span class="street" itemprop="streetAddress">' + address + '</span>' +
							'<span class="city" itemprop="addressLocality">' + location_city + '</span>, <span class="state" itemprop="addressRegion">' + location_state + '</span> <span class="zip" itemprop="postalCode">' + zip + '</span>' +
						'</p>' +
						'<!-- you could do <a href="941-388-6961"></a> but most phones will make it a link anyways -->' +
						'<p class="phone" itemprop="telephone">' + phone + '</p>' +
						'<p class="website"><a href="' + website + '" target="_blank" itemprop="url">' + website.substring(7) + '</a></p>' +
					'</div>' +
					'<ol id="' + title_camelcase + '-schedule" class="schedule">' +
					'</ol>' +
					'<div class="notes">' +
						notes +
					'</div>' +
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
					var date = '';
					var date_iso8601 = '';
					var date_array = '';
					var date_timezone = '';
					var date_readable = '';
					// this will be in rfc-822 format
					var date = dates[ii];
					// convert rfc-822 date format to iso8601 date format
					// date.js doesn't seem to like the abbreviated day or time zones so substring() them
					if (date) date_iso8601 = Date.parse(date.substring(5, 25)).toISOString();
					// create an array from a string using the defined delimiter
					if (date) date_array = date.split(' ');
					// splitting rfc-822 by spaces should result in 6 fields (starting with field 0)
					if (date_array && date_array.length === 6) date_timezone = date_array[5];
					// date.js doesn't seem to like the abbreviated day or time zones so substring() them
					if (date) date_readable = Date.parse(date.substring(5, 25)).toString('ddd, MMM d @ h:mmtt') + ' (' + date_timezone + ')';
					$('#content #' + title_camelcase + '-schedule').append('<li><time datetime="' + date_iso8601 + '">' + date_readable + '</time></li>');
				}
			}
		}
	});
}

/* using xml-based events
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
*/

function seriesDownload(seriestitle) {
	var series, number, description;
	// tell the function where the JSON data is
	fetchJSONFile('http://www.flcbranson.org/api/seriesdownload/?series=' + seriestitle, function(data) {
		// do something with your data
		// alert(JSON.stringify(data));
		// alert(data.title + ', ' + data.camelcase);
		series = data.series;
		number = data.seriesnumber;
		description = data.description;
		$('#content').append('<h2>' + series + '</h2>');
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
			$('#content #' + sermon_camelcase + ' #' + sermon_camelcase + '-downloadlinks ul').append('<li><a href="' + openVideo(mp3, featuredseries_poster) + '">Audio (MP3)</a>');
			$('#content #' + sermon_camelcase + ' #' + sermon_camelcase + '-downloadlinks ul').append('<li><a href="' + openVideo(mp4, featuredseries_poster) + '">Video (MP4)</a>');
			$('#content #' + sermon_camelcase + ' #' + sermon_camelcase + '-downloadlinks').append('</ul>');
			$('#content #' + sermon_camelcase).append('</dd>');
			$('#content').append('</dl>');
		}
	});
}

/* using the series download api
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
*/

// things that are no longer in use or don't work

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

/* testing functions
function yo() {
	alert('Yo')
};
$(document).ready(yo);
*/