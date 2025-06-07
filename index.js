const form = document.getElementById('location-name');

let latitude;
let longitude;

form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Stop form from refreshing the page

    const location = document.querySelector('#location').value;
    const weatherInfo = document.getElementById('weather-info');

    if (!location) {
        alert('Please enter a location');
        return;
    }

    // Fetch lattude/longitude from Open Meteo Geocoding API
    async function fetchData() {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            weatherInfo.innerHTML = "<p>Location not found.</p>";
            return false;
        }

        latitude  = data.results[0].latitude;
        longitude = data.results[0].longitude;
        return true;
    }

    const coordsOK = await fetchData();

    if (!coordsOK) return;

    // Fetch weather
    async function fetchWeather() {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const res = await fetch(url);
        const data = await res.json();

        const weather = data.current_weather;
        if (!weather) {
            weatherInfo.innerHTML = "<p>Weather data not available.</p>";
            return;
        }

        weatherInfo.innerHTML = `
          <div class="weather-header">
            <span class="weather-icon">🌤️</span>
            <h2>Current Weather</h2>
          </div>
          <div class="weather-details">
            <div class="temp">
              <span class="label">🌡️ Temperature:</span>
              <span class="value">${weather.temperature} °C</span>
            </div>
            <div class="wind">
              <span class="label">💨 Wind Speed:</span>
              <span class="value">${weather.windspeed} km/h</span>
            </div>
            <div class="direction">
              <span class="label">🧭 Wind Direction:</span>
              <span class="value">${weather.winddirection}°</span>
            </div>
          </div>
        `;
    }

    await fetchWeather();
});
