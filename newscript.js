//api key
const apikey = '429bfe2b517326a2b745e3c8d6a99b14';

//dom extract
const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const mainCard = document.querySelector(".weather-main");
const detailCard = document.querySelector(".weather-details");
const forecastContainer = document.querySelector(".forecast-cards ");
const forecast = document.querySelector(".weather-forecast");

//city search
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    await fetchWeather(city);
});

//fetch by city name
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod === "404") {
            showError("City not found!");
            return;
        }

        displayWeather(data);
    } catch (err) {
        console.error("Error fetching weather:", err);
        showError("Error fetching weather data.");
    }
}

//if city not found then display this on screen
function showError(message) {
    mainCard.innerHTML = `<p class="text-danger fw-bold text-center">${message}</p>`;
    detailCard.innerHTML = "";
    forecastContainer.innerHTML = "";
    forecast.innerHTML = "";
}

//display function to render on ui
function displayWeather(data) {

    console.log("Weather Data Received from server is here-----:", data);

    const cityName = data.name;
    const country = data.sys.country;
    const icon = data.weather[0].icon;
    const temp = data.main.temp.toFixed(1);
    const feelsLike = data.main.feels_like.toFixed(1);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const clouds = data.clouds.all;
    const wind = data.wind.speed;
    const pressure = data.main.pressure;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // printing extracted data in console for cross check
    console.log("City:", cityName, ", Country:", country);
    console.log("Temperature:", temp);
    console.log("Feels Like:", feelsLike);
    console.log("Humidity:", humidity);
    console.log("Clouds:", clouds);
    console.log("Wind Speed:", wind);
    console.log("Pressure:", pressure);
    console.log("Sunrise:", sunrise);
    console.log("Sunset:", sunset);

    mainCard.innerHTML = `
        <h3>${cityName}, ${country}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="weather-icon">
        <h1>${temp}°C</h1>
        <p class="text-capitalize">${description}</p>
        <p>Feels like: ${feelsLike}°C</p>
    `;

    detailCard.innerHTML = `
        <div class="row g-3">
            <div class="col-6"><div class="weather-box"><i class="fa-solid fa-droplet me-2"></i>Humidity: ${humidity}%</div></div>
            <div class="col-6"><div class="weather-box"><i class="fa-solid fa-cloud me-2"></i>Clouds: ${clouds}%</div></div>
            <div class="col-6"><div class="weather-box"><i class="fa-solid fa-wind me-2"></i>Wind: ${wind} m/s</div></div>
            <div class="col-6"><div class="weather-box"><i class="fa-solid fa-tachometer-alt me-2"></i>Pressure: ${pressure} hPa</div></div>
            <div class="col-6"><div class="weather-box"><i class="fa-solid fa-sun me-2"></i>Sunrise: ${sunrise}</div></div>
            <div class="col-6"><div class="weather-box"><i class="fa-solid fa-moon me-2"></i>Sunset: ${sunset}</div></div>
        </div>
    `;
}

//Auto Load User Location or Pune
document.addEventListener("DOMContentLoaded", async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await fetchWeatherByCoords(latitude, longitude);
            },
            async () => {
                await fetchWeather("Pune");
            }
        );
    } else {
        await fetchWeather("Pune");
    }
});


// Fetch by Coordinates for by default on th screen
async function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        displayWeather(data);
    } catch (err) {
        console.error("Error fetching location-based weather:", err);
    }
}
