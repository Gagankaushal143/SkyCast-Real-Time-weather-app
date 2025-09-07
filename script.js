const container = document.getElementById("container");
const city = document.getElementById("cityName");
const weatherBox = document.getElementById("weatherBox");
const button = document.getElementById("searchBtn");
const input = document.getElementById("input");
const date = document.getElementById("date");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("windSpeed");
const clouds = document.getElementById("clouds");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const icon = document.getElementById("weatherIcon");

function formatCityTimeFromUTC(utcSeconds, offsetSeconds) {
    const utcMillis = utcSeconds * 1000;
    const cityMillis = utcMillis + (offsetSeconds * 1000);
    const cityDate = new Date(cityMillis);
    let hours = cityDate.getUTCHours();
    let minutes = cityDate.getUTCMinutes();
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

function formatCityTimeFromUTC_AMPM(utcSeconds, offsetSeconds) {
    const utcMillis = utcSeconds * 1000;
    const cityMillis = utcMillis + (offsetSeconds * 1000);
    const cityDate = new Date(cityMillis);
    let hours = cityDate.getUTCHours();
    let minutes = cityDate.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // 12-hour format
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    return `${hours}:${minutes} ${ampm}`;
}

function getCityCurrentTimeStr(offsetSeconds) {
    const nowUTC = Math.floor(Date.now() / 1000);
    // Use the same formatting function as above
    return formatCityTimeFromUTC_AMPM(nowUTC, offsetSeconds);
}

async function checkweather(city) {
    const api_key = "09bdc1ef03e24262e311743ba7f8e0a2";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${api_key}&units=metric`;

    try {
        const response = await fetch(url);
        const weather_data = await response.json();

        if (weather_data.cod !== 200) {
            alert("City not found. Please enter a valid city name.");
            return;
        }

        const iconCode = weather_data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        icon.src = iconUrl;

        const timezoneOffset = weather_data.timezone;

        date.innerHTML = `Local time: ${getCityCurrentTimeStr(timezoneOffset)}`;

        sunrise.innerHTML = formatCityTimeFromUTC_AMPM(weather_data.sys.sunrise, timezoneOffset);
        sunset.innerHTML = formatCityTimeFromUTC_AMPM(weather_data.sys.sunset, timezoneOffset);

        temperature.innerHTML = `${Math.round(weather_data.main.temp)}<sup>°C</sup>`;
        condition.innerHTML = `${weather_data.weather[0].description}`;
        feelsLike.innerHTML = `${Math.round(weather_data.main.feels_like)}°C`;
        humidity.innerHTML = `${weather_data.main.humidity}%`;
        wind.innerHTML = ` ${Math.round(weather_data.wind.speed * 3.6)} km/h`;
        clouds.innerHTML = `${weather_data.clouds.all}%`;

    }
    catch (error) {
        console.error("Error fetching Weather Data", error);
        alert("Error fetching weather data. Please try again later.");
    }

}

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    button.click(); 
  }
});

button.addEventListener("click", () => {
    if (input.value.trim() === "") {
        alert("Please enter a city name.");
        return;
    }
    checkweather(input.value.trim());
    container.classList.add("extended");
    city.style.display = "block";
    weatherBox.style.display = "block"
    city.innerHTML = input.value.trim();
});