var apiKey = '1954df614121c3c2ef68df0743988e4c';
var rootUrl = 'https://api.openweathermap.org';
var queryURL;
var week = [];

//DOM Selectors
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var currentWeather = document.querySelector('#today');
var historyContainer = document.querySelector('#history');
var citySearch = document.querySelector('#searched-city');
var currentTemp = document.querySelector('#temp');
var currentWind = document.querySelector('#wind');
var currentHumidity = document.querySelector('#humidity')
var currentUVI = document.querySelector('#uv');
var uviTitle = document.querySelector('#uv-title');



// API Call for current weather in city of choice
function getLatLong(lat, lon) {
    console.log('inside getWeather() function');
}

function getWeather() {
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
            console.log(data)
            queryURL = rootUrl + '/data/2.5/onecall?lat=' + data[0].lat + '&lon=' + data[0].lon + '&units=imperial&appid=' + apiKey;
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
                    currentHumidity.textContent = "Humidity: " + humidity + '%'
                    //Pulls current UVI
                    var uvi = (data.current.uvi);
                    uviTitle.textContent = "UV Index: ";
                    currentUVI.textContent = uvi
                    //Pulls city name next to current date
                    var date = moment().format("MM[/]DD[/]YYYY");
                    citySearch.textContent = city + "\n" + "(" + date + ")";

                    // Change UVI background color depending on safety conditions
                    var uviBackground = $('.uv-background');
                    if (uvi <= 2) {
                        console.log("123");
                        uviBackground.css("background-color", "green")
                    } else if (uvi > 2 && uvi <= 8) {
                        uviBackground.css("background-color", "yellow")
                    } else if (uvi > 8) {
                        uviBackground.css("background-color", "red")
                    }

                    //5-Day Forecast
                    fetch(rootUrl + "/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey).then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        var forecastWeather = $('#forecast');
                        console.log(data);
                        for (var i = 0; i < 5; i++) {
                            var day = {
                                dayNum: i,
                                temp: data.list[i].main.temp,
                                wind: data.list[i].wind.speed,
                                humidity: data.list[i].main.humidity
                            }
                            week.push(day);
                            forecastWeather.children().eq(i).empty();
                        }
                        for (var i = 0; i < 5; i++) {
                            var currentDate = moment();
                            var weekDate = $("<h6></h6>").text(moment(currentDate, "MM[/]DD[/]YYYY").add(i + 1, 'days'));
                            var status = $("<h6></h6>").text("Weather Conditions")
                            var weekTemp = $("<h6></h6>").text(week[i].temp);
                            var weekWind = $("<h6></h6>").text(week[i].wind);
                            var weekHumid = $("<h6></h6>").text(week[i].humidity);
                            console.log(forecastWeather.children()[i]);
                            forecastWeather.children().eq(i).append(weekDate, status, weekWind, weekTemp, weekHumid);
                        }
                    })
                })
        })
}

$('#search-button').on("click", (event) => {
    event.preventDefault();
    getLatLong();
    getWeather();
})

$("#clear-storage").on("click", (event) => {
    localStorage.clear();
})
