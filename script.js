const apiKey = "92aef53081792cba07bb8de0466b4998";

/* =========================
   DARK MODE
========================= */
function toggleMode() {
    document.body.classList.toggle("dark");
}


/* =========================
   SEARCH BY CITY
========================= */
function getWeather() {

    const city = document.getElementById("city").value;
    const result = document.getElementById("result");
    const forecastBox = document.getElementById("forecast");

    if (city === "") {
        alert("Please enter city name");
        return;
    }

    result.innerHTML = "⏳ Loading...";
    forecastBox.innerHTML = "";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => res.json())
        .then(data => {

            if (data.cod === "404") {
                result.innerHTML = "❌ City not found";
                return;
            }

            showWeather(data);

            // Get lat lon for forecast
            const lat = data.coord.lat;
            const lon = data.coord.lon;

            getForecast(lat, lon);
        })
        .catch(() => {
            result.innerHTML = "⚠️ Error loading data";
        });
}


/* =========================
   GET LOCATION
========================= */
function getLocation() {

    if (!navigator.geolocation) {
        alert("Location not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(success, error);

    function success(position) {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        getWeatherByLocation(lat, lon);
    }

    function error() {
        alert("Permission denied");
    }
}


/* =========================
   WEATHER BY LOCATION
========================= */
function getWeatherByLocation(lat, lon) {

    const result = document.getElementById("result");
    const forecastBox = document.getElementById("forecast");

    result.innerHTML = "⏳ Loading...";
    forecastBox.innerHTML = "";

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => res.json())
        .then(data => {

            showWeather(data);

            getForecast(lat, lon);
        });
}


/* =========================
   SHOW TODAY WEATHER
========================= */
function showWeather(data) {

    const city = data.name;
    const temp = data.main.temp;
    const weather = data.weather[0].main;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    const icon = data.weather[0].icon;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    document.getElementById("result").innerHTML = `

        <h3>${city}</h3>

        <img src="${iconUrl}">

        <p>🌡️ ${temp} °C</p>

        <p>☁️ ${weather}</p>

        <p>💧 ${humidity}%</p>

        <p>💨 ${wind} m/s</p>

    `;
}


/* =========================
   7 DAY FORECAST
========================= */
function getForecast(lat, lon) {

    const forecastBox = document.getElementById("forecast");

    forecastBox.innerHTML = "⏳ Loading forecast...";

    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.daily.slice(0, 7).forEach(day => {

                const temp = day.temp.day;
                const icon = day.weather[0].icon;

                html += `
                    <div>
                        <img src="https://openweathermap.org/img/wn/${icon}.png">
                        <p>${temp}°C</p>
                    </div>
                `;
            });

            forecastBox.innerHTML = html;
        });
}
