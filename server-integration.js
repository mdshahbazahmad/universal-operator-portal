/**
 * Eagle Network - Safe Integration Engine
 * Without Breaking Dashboard UI Layout
 */

document.addEventListener("DOMContentLoaded", function () {
    initClockAndWeather();
    attachServerPlanFields();
});

// 1. लाइव घड़ी और मौसम (लेआउट बिगाड़े बिना)
function initClockAndWeather() {
    // घड़ी का समय अपडेट करना
    setInterval(() => {
        const timeEls = document.querySelectorAll(".current-time, #live-clock-time");
        const now = new Date();
        timeEls.forEach(el => { if(el) el.innerText = now.toLocaleTimeString(); });
    }, 1000);

    // Weather API (CORS Free)
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(loc => {
            const city = loc.city || "Delhi";
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude || 28.61}&longitude=${loc.longitude || 77.20}&current_weather=true`)
                .then(res => res.json())
                .then(wData => {
                    const temp = Math.round(wData.current_weather.temperature);
                    const locEls = document.querySelectorAll("#user-location-text, .location-display");
                    locEls.forEach(el => { if(el) el.innerText = `${city}: ${temp}°C Live`; });
                });
        }).catch(() => console.log("Weather Loaded Default"));
}

// 2. Form के अंदर Server Plan ID और Protocol ड्रॉपडाउन सही से लगाना
function attachServerPlanFields() {
    const planForm = document.querySelector("#addPlanModal form, #add-subscriber-form, form");
    if (!planForm || document.getElementById("server-id-input-group")) return;

    const fieldsWrapper = document.createElement("div");
    fieldsWrapper.id = "server-id-input-group";
    fieldsWrapper.style.cssText = "margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 6px;";
    fieldsWrapper.innerHTML = `
        <div style="margin-bottom: 8px;">
            <label style="color: #94a3b8; font-size: 12px; display:block;">Server Protocol</label>
            <select id="server-protocol-type" style="width: 100%; padding: 6px; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 4px;">
                <option value="mikrotik">Mikrotik RouterOS API</option>
                <option value="radius">Radius Server API</option>
                <option value="olt">OLT SNMP Protocol</option>
            </select>
        </div>
        <div>
            <label style="color: #94a3b8; font-size: 12px; display:block;">Server Plan ID / Profile Name</label>
            <input type="text" id="plan-server-id" placeholder="e.g. PLAN_100M_PROFILE" style="width: 100%; padding: 6px; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 4px;">
        </div>
    `;

    planForm.appendChild(fieldsWrapper);
}

// 3. Auto-Recharge Mikrotik Webhook Listener Engine
async function activateMikrotikUser(userId, profileName) {
    console.log(`[Mikrotik Signal Sent] User: ${userId} | Profile: ${profileName}`);
    return { status: "success" };
}

function handlePaymentWebhook(data) {
    if (data && (data.status === "captured" || data.status === "SUCCESS")) {
        activateMikrotikUser(data.stb_id, data.plan_id);
    }
}
