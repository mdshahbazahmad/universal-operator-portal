/**
 * Eagle Portal - Live Weather, Location & Time Integration
 * Without modifying main dashboard.html structure
 */

document.addEventListener("DOMContentLoaded", function () {
    injectWeatherWidget();
    startLiveClock();
    fetchLiveWeatherAndLocation();
});

// 1. डैशबोर्ड में Top Header पर Weather & Location Widget Inject करना
function injectWeatherWidget() {
    const header = document.querySelector(".page-header") || document.querySelector("header") || document.body;
    
    const weatherContainer = document.createElement("div");
    weatherContainer.id = "live-weather-container";
    weatherContainer.style.cssText = `
        background: linear-gradient(135deg, #1e293b, #0f172a);
        border: 1px solid rgba(56, 189, 248, 0.2);
        border-radius: 10px;
        padding: 10px 16px;
        margin: 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    weatherContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <div id="weather-icon" style="font-size: 24px; color: #38bdf8;">
                <i class="fa-solid fa-cloud-sun"></i>
            </div>
            <div>
                <div style="font-size: 14px; font-weight: 600;" id="user-location-text">Detecting Location...</div>
                <div style="font-size: 12px; color: #94a3b8;" id="weather-temp-text">Loading Weather...</div>
            </div>
        </div>
        <div style="text-align: right;">
            <div id="live-clock-time" style="font-size: 16px; font-weight: 700; color: #38bdf8;">--:--:--</div>
            <div id="live-clock-date" style="font-size: 11px; color: #94a3b8;">-- ---- ----</div>
        </div>
    `;

    // Header के सबसे ऊपर इंसर्ट करें
    header.insertBefore(weatherContainer, header.firstChild);
}

// 2. लाइव घड़ी (Clock) और तारीख
function startLiveClock() {
    setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

        const timeEl = document.getElementById("live-clock-time");
        const dateEl = document.getElementById("live-clock-date");

        if (timeEl) timeEl.innerText = timeStr;
        if (dateEl) dateEl.innerText = dateStr;
    }, 1000);
}

// 3. लाइव लोकेशन और टेम्परेचर API (Auto Detect Location & Weather)
function fetchLiveWeatherAndLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherData(lat, lon);
            },
            () => {
                // Default fallback if location access denied (Delhi/India Default)
                getWeatherData(28.6139, 77.2090, "Delhi, India");
            }
        );
    } else {
        getWeatherData(28.6139, 77.2090, "Delhi, India");
    }
}

async function getWeatherData(lat, lon, fallbackCity = null) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        
        const temp = Math.round(data.current_weather.temperature);
        const weatherCode = data.current_weather.weathercode;

        const locationTextEl = document.getElementById("user-location-text");
        const tempTextEl = document.getElementById("weather-temp-text");

        if (locationTextEl) locationTextEl.innerText = fallbackCity ? fallbackCity : `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
        if (tempTextEl) tempTextEl.innerText = `Temperature: ${temp}°C | Live Weather`;

    } catch (err) {
        console.error("Weather API Error:", err);
        const tempTextEl = document.getElementById("weather-temp-text");
        if (tempTextEl) tempTextEl.innerText = "28°C | Sunny (Default)";
    }
}
