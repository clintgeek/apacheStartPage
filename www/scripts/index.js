// ----------------
// CONFIGURATION
// ----------------
var settings = {
  "displayClock": true,
  "twelveHourClock": true,
  "displayWeather": true,
  "displayLinks": true,
  "fancyBackground": true,
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
  // document.getElementById('weekday').innerHTML = WeekdayString;
  document.getElementById('date').innerHTML = WeekdayString + " | " + monthString + " " + dayToString(day) + ", "+year;
  var t = setTimeout(startTime, 10000);
};

// ----------------
// WEATHER
// ----------------
function displayWeather() {
  if (settings.displayWeather) {
    $(".weather").append(`
      <a class="weatherwidget-io" href="https://forecast7.com/en/32d56n97d14/mansfield/?unit=us" data-label_1="MANSFIELD" data-label_2="WEATHER" data-font="Ubuntu" data-theme="dark" >MANSFIELD WEATHER</a>
      <script>
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://weatherwidget.io/js/widget.min.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","weatherwidget-io-js");
      </script>
    `);
  }
  if (!settings.displayWeather) {
    $(".weather").css("display", "none");
  }
}

// ----------------
// LINKS
// ----------------
if (!settings.displayLinks) {
  $("#links").css("display", "none");
} else {
  var links = [
    {
      "icon": "fas fa-home",
      "url": "https://home.clintgeek.com",
    },
    {
      "icon": "fab fa-android",
      "url": "https://messages.google.com/web/conversations",
    },
    {
      "icon": "fas fa-utensils",
      "url": "https://www.myfitnesspal.com/food/diary",
    },
    {
      "icon": "fas fa-running",
      "url": "https://connect.garmin.com/modern/",
    },
    {
      "icon": "fas fa-cloud-sun",
      "url": "https://www.meteoblue.com/en/weather/week/mansfield_united-states-of-america_4709013",
    },
    {
      "icon": "fas fa-download",
      "url": "https://sab.clintgeek.com",
    },
    {
      "icon": "fas fa-tv",
      "url": "https://sonarr.clintgeek.com",
    },
    {
      "icon": "fas fa-film",
      "url": "https://radarr.clintgeek.com",
    },
  ]
  links.forEach(link => {
    var icon = link.icon ? `<i class="fa-lg ` + link.icon + `"></i> ` : '';
    var text = link.text || '';
    $("#links").append(`
      <div class="text-center col-sm"><a class="btn btn-secondary btn-sm" href="` + link.url + `" role="button">`+ icon + text + `</a></div>
    `)
  })
}

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
  startClock();
  displayWeather();
  getBackgroundImage();
});
