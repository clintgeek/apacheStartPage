// VERSION 1

// ----------------
// CONFIGURATION
// ----------------
var settings = {
  "displayClock": true,
  "twelveHourClock": true,
  "displayWeather": 'meteoblue', // forecast7 / meteoblue / none
  "displaySearch": false,
  "displayLinks": true,
  "displayQuote": true,
  "fancyBackground": true
};

// ----------------
// CLOCK
// ----------------
function startClock() {
  if (settings.displayClock) {
    startTime();
    writeDate();
  }
}

// add zero in front of numbers < 10
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
};
// convert to 12 hour
function formatHour(hourNow) {
  if (!settings.twelveHourClock) {
    return checkTime(hourNow);
  }
  if (settings.twelveHourClock && hourNow > 12) {
    return hourNow - 12;
  }
  if (settings.twelveHourClock && hourNow === 0) {
    return 12;
  }
  return hourNow;
}
// get am/pm marker
function formatAmPm(hourNow) {
  if (settings.twelveHourClock) {
    var amPm = ' am';
    if (hourNow > 11) {
      amPm = ' pm';
    }
    return amPm;
  }
  return '';
}
// Update clock every 10 sec.
function startTime() {
  var today = new Date();
  var hourNow = today.getHours();
  var h = formatHour(hourNow);
  var m = today.getMinutes();
  var ap = formatAmPm(hourNow);
  var month = today.getMonth();
  var weekDay = today.getDay();
  var day = today.getDate();
  if(m==0) {
    writeDate();
  }
  m = checkTime(m);
  document.getElementById('clock').innerHTML = h + ':' + m + ap;
  var t = setTimeout(startTime, 10000);
}
// Return a properly formatted day number, like 1st, 3rd ...
function dayToString(day){
  switch(day){
    case 1:
    case 21:
    case 31:
      return day+"st";
    case 2:
    case 22:
      return day+"nd";
    case 3:
    case 23:
      return day+"rd";
    default:
      return day+"th";
  }
}
// Update the date every time you load/reload the page or after midnight
function writeDate() {
  MonthsArray=["January","February","March","April","May","June","July","August","September","October","November","December"];
  WeekdaysArray=["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  var today = new Date();
  var month = today.getMonth();
  month < 12 ? monthString = MonthsArray[month] : monthString = "Error in month conversion, number="+month;
  var weekDay = today.getDay();
  weekDay < 7 ? WeekdayString = WeekdaysArray[weekDay] : WeekdayString = "Error: weekDay number "+today.getDay();
  var day = today.getDate();
  var year = today.getFullYear();
  document.getElementById('weekday').innerHTML = WeekdayString;
  document.getElementById('date').innerHTML = monthString + " " + dayToString(day) + ", "+year;
  var t = setTimeout(startTime, 10000);
};

// ----------------
// WEATHER
// ----------------
function displayWeather() {
  if (settings.displayWeather === 'forecast7') {
    $(".weather").append(`
      <div class="forecast7">
        <a class="weatherwidget-io" href="https://forecast7.com/en/32d56n97d14/mansfield/?unit=us" data-label_1="MANSFIELD" data-label_2="WEATHER" data-font="Ubuntu" data-theme="dark" >MANSFIELD WEATHER</a>
        <script>
          !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://weatherwidget.io/js/widget.min.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","weatherwidget-io-js");
        </script>
      </div>
    `);
  }
  if (settings.displayWeather === 'meteoblue') {
    $(".weather").append(` 
      <div class="meteoblue">
        <iframe src="https://www.meteoblue.com/en/weather/widget/three/mansfield_united-states-of-america_4709013?geoloc=fixed&nocurrent=0&noforecast=0&days=7&tempunit=FAHRENHEIT&windunit=MILE_PER_HOUR&layout=image"  frameborder="0" scrolling="NO" allowtransparency="true" sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox" style="width: 100%; height: 555px; margin-top: -15px"></iframe>
      </div>
    `);
  }
  if (settings.displayWeather === 'none') {
    $(".weather").append(`
      <div class="no-weather" />
    `)
  }
};

// ----------------
// SEARCH ENGINES
// ----------------
currEngine = 0;
engines=[
  {name:"Google", url:"https://www.google.it/search?q="},
  {name:"Google Images", url:"https://www.google.com/search?&tbm=isch&q="},
  {name:"DuckDuckGo", url:"https://duckduckgo.com/?q="},
  {name:"Wikipedia", url:"https://en.wikipedia.org/w/index.php?search="}
];
// Update the current engine
function changeEngine(n){
  if(n<engines.length) {
    $("#dropdown-btn").html(engines[n].name);
  }
  currEngine=n;
  setDefaultEngine(n, 30);
}
// Generate the dropdown list from the engines array
function generateEngines(){
  for(var i = 0; i < engines.length; i++) {
    $("#engine-list").html($("#engine-list").html()+'<a class="dropdown-item" href="#" onclick="changeEngine('+i+')">'+engines[i].name+'</a>');
  }
}
// Save an engine choice as a cookie
function setDefaultEngine(cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = "defaultEngine=" + cvalue + ";" + expires + ";path=/";
}
// Get the last used engine from the cookies
function getDefaultEngine() {
  var name = "defaultEngine=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
// Open a new tab with the generated link
function newSearch(){
  window.open(engines[currEngine].url+document.getElementById('field').value,"_self");
}
function startSearchEngines() {
  generateEngines();
  var defEngine=getDefaultEngine();
  if(defEngine == "") {
    changeEngine(0);
  } else {
    changeEngine(defEngine);
  }
  //Allows to use return to start a new search
  document.getElementById('search-bar').addEventListener("keydown", function(e) {
    if (e.keyCode == 13) {
      newSearch();
    }
  }, false);
  document.getElementById('field').focus();
}
if(!settings.displaySearch) {
  $("#search-bar").css("display", "none");
}

// ----------------
// LINKS
// ----------------
if (!settings.displayLinks) {
  $("#links").css("display", "none");
}

// ----------------
// QUOTE GENERATOR
// ----------------
// pull new quote from forismatic
function randomQuote() {
	$.ajax({
		url: "https://api.forismatic.com/api/1.0/",
		jsonp: "jsonp",
		dataType: "jsonp",
		data: {
			method: "getQuote",
			lang: "en",
			format: "jsonp"
		},
		success: function(quote) {
			var quoteText = $.trim(quote.quoteText);
			var quoteAuthor = 'Unknown';
			if (quote.quoteAuthor !== '') {
				quoteAuthor = quote.quoteAuthor;
			}
			$('#quote-text').html('&ldquo;'+quoteText+'&rdquo;')
			$('#quote-author').html("-"+quoteAuthor)
		}
	});
}
if (settings.displayQuote) {
  randomQuote();
}
//Click on the quote to generate another random quote
$('#quote').click(function() {
	randomQuote();
});

// ----------------
// BACKGROUND IMAGES
// ----------------
function getBackgroundImage() {
  if (settings.fancyBackground) {
  	// Background image
  	// sourced from unsplash.com; reference source.unsplash.com
  	// background got to be dark for the styling/ fonts are light in color
  	var bgBaseUrl= "https://source.unsplash.com/collection/";
  	var dayColId= "407887";
  	var nightColId= "407877";
  	var dawnColId= "407882";
  	var duskColId= "407878";
  	var bgURL= bgBaseUrl;
  // determine category based on time of day
  	var curD= new Date();
  	var curH= curD.getHours();
  	if (curH >= 5 && curH< 7){
  		bgURL += dawnColId;
  	} else if (curH >= 7 && curH< 18){
  		bgURL += dayColId;
  	} else if (curH >= 18 && curH< 20){
  		bgURL += duskColId;
  	} else {
  		bgURL += nightColId;
  	};
  	$('body').css({
  		'background-image':'url('+ bgURL + '/1920x1080' + ')',
  		'background-repeat':'no-repeat',
  		'background-size': 'cover'
  	});
  }
};

// ----------------
// FUNCTIONS EXECUTED AT LOAD OF PAGE
// ----------------
$(document).ready(function(){
  $('dropdown-toggle').dropdown();
  startClock();
  displayWeather();
  getBackgroundImage();
  startSearchEngines();
});
