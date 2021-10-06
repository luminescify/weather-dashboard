var apiKey = '1954df614121c3c2ef68df0743988e4c';
var rootUrl = 'https://api.openweathermap.org';
var week = [];

//DOM Selectors
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var currentWeather = document.querySelector('#today');
var historyContainer = $('#history');
var citySearch = document.querySelector('#searched-city');
var currentTemp = document.querySelector('#temp');
var currentWind = document.querySelector('#wind');
var currentHumidity = document.querySelector('#humidity');
var currentUVI = document.querySelector('#uv');
var uviTitle = document.querySelector('#uv-title');
var currentConditions = $('#current-conditions');
var forecastWeather = $('#forecast');

// Pull cities from local storage
searchHistory = JSON.parse(localStorage.getItem("city"))
if (searchHistory === null) {
    searchHistory = [];
}
displaySearches();

// API Call for current weather in city of choice
function getLatLong(lat, lon) {
    console.log('inside getWeather() function');
}

// Display cities in search history
function displaySearches() {
    searchHistory.forEach(element => {
        var previousSearch = $('<button></button>');
        previousSearch.attr("class", "previous-cities");
        previousSearch.text(element);
        console.log(previousSearch);
        historyContainer.append(previousSearch);
    })
}

// Pulls weather for daily and 5-day forecasts + appends to the page
function getWeather(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("city", JSON.stringify(searchHistory));

        var previousSearch = $('<button></button>');
        previousSearch.attr("class", "previous-cities");
        previousSearch.text(city);
        console.log(previousSearch);
        historyContainer.append(previousSearch);

    
    }
    historyContainer.textContent = "";

    // Fetch's latitude and longitude data for weather location
    var queryURL = rootUrl + '/geo/1.0/direct?q=' + city + '&limit=5&units=imperial&appid=' + apiKey;
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            getLatLong()
            fetch(rootUrl + '/data/2.5/onecall?lat=' + data[0].lat + '&lon=' + data[0].lon + '&units=imperial&appid=' + apiKey).then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data)
                    //Pulls current temp
                    var temp = (data.current.temp);
                    currentTemp.textContent = "Temperature: " + temp + ' ºF'
                    //Pulls current wind speed
                    var wind = (data.current.wind_speed);
                    currentWind.textContent = "Wind Speed: " + wind + ' mph'
                    //Pulls current humidity
                    var humidity = (data.current.humidity);
                    currentHumidity.textContent = "Humidity: " + humidity + '%'
                    //Pulls current UVI
                    var uvi = (data.current.uvi);
                    uviTitle.textContent = "UV Index: ";
                    currentUVI.textContent = uvi
                    //Pulls city name, current date, and weather condition icon
                    var date = moment().format("MM/DD/YYYY");
                    var conditionIcon = data.daily[0].weather[0].icon;
                    var iconURL = 'http://openweathermap.org/img/wn/' + conditionIcon + '@2x.png';
                    currentConditions.attr("src", iconURL);
                    citySearch.textContent = city + "\n" + "(" + date + ")";

                    // Change UVI background color depending on safety conditions
                    var uviBackground = $('.uv-background');
                    if (uvi <= 2) {
                        uviBackground.css("background-color", "green")
                    } else if (uvi > 2 && uvi <= 8) {
                        uviBackground.css("background-color", "yellow")
                    } else if (uvi > 8) {
                        uviBackground.css("background-color", "red")
                    }

                    //5-Day Forecast API Call
                    fetch(rootUrl + "/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey).then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        console.log(data);
                        week = [];

                        // Creates object per day from data
                        for (var i = 0; i < 5; i++) {
                            var day = {
                                dayNum: i,
                                conditions: data.list[i].weather[0].icon,
                                temp: data.list[i].main.temp,
                                wind: data.list[i].wind.speed,
                                humidity: data.list[i].main.humidity
                            }
                            // Pushes into week array
                            week.push(day);
                            forecastWeather.children().eq(i).empty();
                            
                            // Creates and populates data for 5-day forecast
                            var currentDate = moment().format("MM/DD/YYYY");
                            var conditionIcon = week[i].conditions;
                            var weekDate = $("<h5></h5>").text(moment(currentDate).add(1, 'days'));
                            var weatherCondition = $("<img></img>").attr("src", "http://openweathermap.org/img/wn/" + conditionIcon + "@2x.png");
                            var weekTemp = $("<h6></h6>").text("Temp: " + week[i].temp + " ºF");
                            var weekWind = $("<h6></h6>").text("Wind: " + week[i].wind + " mph");
                            var weekHumid = $("<h6></h6>").text("Humidity: " + week[i].humidity + "%");
                            forecastWeather.children().eq(i).append(weekDate, weatherCondition, weekTemp, weekWind, weekHumid);
                        }
                        
                    })
                })
        })
}

// On clicking previously searched city, repopulate city weather
$(historyContainer).on("click", ".previous-cities", selectedCity)
function selectedCity(event) {
    console.log($(this).text())
    var click = $(this).text();
    getWeather(click);
}

// On clicking the search button, run getLatLong and getWeather
$('#search-button').on("click", (event) => {
    event.preventDefault();
    var searchedCity = searchInput.value.trim();
    getWeather(searchedCity);
})

// Clear Local storage and previous cities on page
$("#clear-storage").on("click", (event) => {
    localStorage.clear();
    historyContainer.textContent = "";
})
