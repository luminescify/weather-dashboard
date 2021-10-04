var searchHistory = [];
var lastCity = "";
var apiKey = '1954df614121c3c2ef68df0743988e4c';
var rootUrl = 'https://api.openweathermap.org';
var queryURL;

//DOM Selectors
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var currentWeather = document.querySelector('#today');
var forecastWeather = document.querySelector('#forecast');
var historyContainer = document.querySelector('#history');
var citySearch = document.querySelector('#searched-city');
var currentTemp = document.querySelector('#temp');
var currentWind = document.querySelector('#wind');
var currentHumidity = document.querySelector('#humidity')
var currentUVI = document.querySelector('#uv');
var forecastDate = document.querySelector('#forecast-date')


// API Call for current weather in city of choice
function getLatLong(lat, lon) {
    console.log('inside getCurrentWeather() function');
    console.log(lat, lon);
}

function displayWeather() {
    var date = moment().format("MM[/]DD[/]YYYY");
    var city = searchInput.value.trim();
    citySearch.textContent = city + "\n" + "(" + date + ")";
}

function getCurrentWeather(event) {
    event.preventDefault();
    console.log(event);
    var city = searchInput.value.trim();
    searchHistory = searchInput.value.trim();

    var queryURL = rootUrl + '/geo/1.0/direct?q=' + city + '&limit=5&units=imperial&appid=' + apiKey;
    console.log(city);

    // Fetch's latitude and longitude data for weather location
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            getCurrentWeather(data[0].lat, data[0].lon);

            queryURL = rootUrl + '/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;
            fetch(queryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    //Pulls current temp
                    var temp = (data.current.temp);
                    currentTemp.textContent = "Temperature: " + temp + ' ºF'
                    //Pulls current wind speed
                    var wind = (data.current.wind_speed);
                    currentWind.textContent = "Wind Speed: " + wind + ' mph'
                    //Pulls current humidity
                    var humidity = (data.current.humidity);
                    currentHumidity.textContent = "Humidity: " + humidity + ' %'
                    //Pulls current UVI
                    var uvi = (data.current.uvi);
                    currentUVI.textContent = "UV Index: " + uvi

                    // Change UVI background color depending on safety conditions
                    if (uvi.value <= 2) {
                        currentUVI.css("background", "green")
                    } else if (uvi.value > 2 && uvi.value <= 8) {
                        currentUVI.css("background", "yellow")
                    } else if (uvi.value > 8) {
                        currentUVI.css("background", "red")
                    }
                })
        })
}
displayWeather();

var getForecast = (event) => {
    var city = $(searchInput).val();
    var queryURL = rootUrl + '/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;

    fetch(queryURL)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            for (var i = 0; i < response.list.length; i++) {
                var dateData = response.list[i];
                var dayTimeUTC = dateData.dt;
                var timeZoneOffset = response.city.timezone;
                var timeZoneOffsetHours = timeZoneOffset / 60 / 60;
                var currentMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
                var iconURL = rootUrl + "/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + current.dt + "&appid=" + apiKey;
            }
        })
}

// Saves city to local storage
var saveCity = (newCity) => {
    var cityExists = false;
    for (i = 0; i < localStorage.length; i++) {
        if (localStorage["city" + i] === newCity) {
            cityExists = true;
            break;
        }
    }
    if (cityExists === false) {
        localStorage.setItem('city' + localStorage.length, newCity);
    }
}

var renderCity = () => {
    $('#city-results').empty();

    if (localStorage.length === 0) {
        if (lastCity) {
            $(searchInput).attr("value", lastCity);
        } else {
            $(searchInput).attr("value", "Orlando")
        }
    } else {
        var lastCityKey = "city" + (localStorage.length - 1);
        lastCity = localStorage.getItem(lastCityKey);
        $(searchInput).attr("value", lastCity);
        for (var i = 0; i < localStorage.length; i++) {
            var city = localStorage.getItem("city" + i);
            var cityEl;
            if (searchHistory === "") {
                searchHistory = lastCity;
            }
            if (city === searchHistory) {
                cityEl = `<button type="button" class=" list-group-item list-group-item-action active">${city}</button></li>`
            } else {
                cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`
            }
            $(searchInput).prepend(cityEl);
        }
        if (localStorage.length > 0) {
            $('#clear-storage').html($('<a id="clear-storage" href="#">clear</a>'))
        } else {
            $('#clear-storage').html('');
        }
    }
}

$('#city-results').on("click", (event) => {
    event.preventDefault();
    $(searchInput).val(event.target.textContent);
    searchHistory = $(searchInput).val();
    getCurrentWeather(event);
})

$('#search-button').on("click", (event) => {
    event.preventDefault();
    searchHistory = $(searchInput).val();
    getCurrentWeather(event);
})

$("#clear-storage").on("click", (event) => {
    localStorage.clear();
    renderCity();
})

renderCity();

searchForm.addEventListener('submit', getLatLong)