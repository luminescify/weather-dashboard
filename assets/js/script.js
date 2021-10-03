var searchHistory = [];
var apiKey = '1954df614121c3c2ef68df0743988e4c';
var rootUrl = 'https://api.openweathermap.org';
var openCallAPI = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid=' + apiKey;

var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var currentWeather = document.querySelector('#today');
var forecastWeather = document.querySelector('#forecast');
var historyContainer = document.querySelector('#history');

function loadHistory() {
    searchHistory = JSON.parse(localStorage.getItem("city"));
    if (searchHistory.length !== null) {
        for (var i = 0; i < searchHistory.length; i++) {
            var cityList = document.createElement("button");
            cityList.setAttribute("id", searchHistory[i].savedCity);
            cityList.setAttribute("class", "prev-search")
    
            cityList.textContent = searchHistory[i].savedCity;
            historyContainer.appendChild(cityList);
        }
    }
}

function getLatLong(event) {
    event.preventDefault();
    console.log(event);
    var city = searchInput.value.trim();

    var coordinatesUrl = rootUrl + '/geo/1.0/direct?q=' + city + '&limit=5&appid=' + apiKey;
    console.log(city);

    // Saves searched cities to local storage
     historyOb = {
        savedCity: city,
    };
    for (var i = 0; i < searchHistory.length; i++) {
        if (!searchHistory[i].city == searchHistory.city) {
            searchHistory.splice(i, 1);
        }
    }
    searchHistory.push(historyOb);
    localStorage.setItem("city", JSON.stringify(searchHistory));

    // Fetch's latitude and longitude data for weather location
    fetch(coordinatesUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data[0].lat, data[0].lon);
            getWeather(data[0].lat, data[0].lon);
        });
    
}



function getWeek(lat, lon) {
    var day1Weather = rootUrl + '/data/2.5/onecall/timemachine?lat=' + lat + '&lon=' + lon + '&dt={time}&units=imperial&appid=' + apiKey;
    var day2Weather = rootUrl + '/data/2.5/onecall/timemachine?lat=' + lat + '&lon=' + lon + '&dt={time}&units=imperial&appid=' + apiKey;
    var day3Weather = rootUrl + '/data/2.5/onecall/timemachine?lat=' + lat + '&lon=' + lon + '&dt={time}&units=imperial&appid=' + apiKey;
    var day4Weather = rootUrl + '/data/2.5/onecall/timemachine?lat=' + lat + '&lon=' + lon + '&dt={time}&units=imperial&appid=' + apiKey;
    var day5Weather = rootUrl + '/data/2.5/onecall/timemachine?lat=' + lat + '&lon=' + lon + '&dt={time}&units=imperial&appid=' + apiKey;

}

function getWeather(lat, lon) {
    var weatherUrl = rootUrl + '/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;
    console.log('inside getWeather() function');
    console.log (lat, lon);

    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            //currentWeather.append(weatherUrl);
        })
}

loadHistory();
searchForm.addEventListener('submit', getLatLong);