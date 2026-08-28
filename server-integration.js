/**
 * Eagle Portal - Direct UI & Multi-Server Injector Engine
 */

document.addEventListener("DOMContentLoaded", function () {
    injectPlanServerFields();
    injectServerSyncOptions();
    fetchLiveWeather();
});

// 1. Manage Plans में Server Plan ID, Cost और Protocol Dropdown जोड़ना
function injectPlanServerFields() {
    // Target the Plan Creation Form based on your screenshot structure
    const planForm = document.querySelector("#Create\\ New\\ Plan") || document.querySelector("form") || document.querySelector(".Manage-Plans");
    if (!planForm || document.getElementById("server-plan-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.id = "server-plan-wrapper";
    wrapper.style.cssText = "margin-top: 15px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(56,189,248,0.2);";
    wrapper.innerHTML = `
        <h5 style="color:#38bdf8; margin-bottom:8px; font-size:13px;"><i class="fa-solid fa-server"></i> Server Integration Settings</h5>
        
        <div style="margin-bottom: 10px;">
            <label style="color:#94a3b8; font-size:11px; display:block; margin-bottom:4px;">Server Protocol / Type</label>
            <select id="server-protocol-type" style="width:100%; padding:8px; background:#0f172a; color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:6px;">
                <option value="mikrotik">Mikrotik RouterOS API</option>
                <option value="radius">Radius Server API</option>
                <option value="olt">OLT SNMP / SSH Protocol</option>
            </select>
        </div>

        <div style="margin-bottom: 10px;">
            <label style="color:#94a3b8; font-size:11px; display:block; margin-bottom:4px;">Server Plan ID / Profile Name</label>
            <input type="text" id="plan-server-id" placeholder="e.g. PLAN_100M_PROFILE" style="width:100%; padding:8px; background:#0f172a; color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:6px;">
        </div>

        <div style="display:flex; gap:10px;">
            <div style="flex:1;">
                <label style="color:#94a3b8; font-size:11px; display:block; margin-bottom:4px;">Backend Wallet Cost (₹)</label>
                <input type="number" id="plan-backend-cost" placeholder="150" style="width:100%; padding:8px; background:#0f172a; color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:6px;">
            </div>
        </div>
    `;

    // Publish Plan बटन से ठीक पहले इंजक्ट करें
    const publishBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Publish Plan"));
    if (publishBtn && publishBtn.parentNode) {
        publishBtn.parentNode.insertBefore(wrapper, publishBtn);
    } else {
        planForm.appendChild(wrapper);
    }
}

// 2. Server Sync वाले पेज में Multi-Server Support जोड़ना
function injectServerSyncOptions() {
    const serverCard = document.querySelector("#Server\\ Sync") || document.querySelector("form");
    if (!serverCard || document.getElementById("multi-server-type-group")) return;

    const selectDiv = document.createElement("div");
    selectDiv.id = "multi-server-type-group";
    selectDiv.style.cssText = "margin-bottom: 12px;";
    selectDiv.innerHTML = `
        <label style="color:#94a3b8; font-size:11px; display:block; margin-bottom:4px;">Server Connection Mode</label>
        <select id="active-server-mode" style="width:100%; padding:8px; background:#0f172a; color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:6px;">
            <option value="mikrotik_api">Mikrotik Direct RouterOS API (Port 8728)</option>
            <option value="radius_rest">Radius Server REST API</option>
            <option value="olt_snmp">OLT SNMP / SSH Connection</option>
        </select>
    `;

    serverCard.prepend(selectDiv);
}

// 3. Header में Live Location और Weather Temp अपडेट करना
function fetchLiveWeather() {
    const headerTitle = document.querySelector(".header-title") || document.querySelector("h2") || document.body;
    
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            const city = data.city || "Delhi";
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.latitude || 28.61}&longitude=${data.longitude || 77.20}&current_weather=true`)
                .then(res => res.json())
                .then(wData => {
                    const temp = Math.round(wData.current_weather.temperature);
                    const weatherBadge = document.createElement("span");
                    weatherBadge.style.cssText = "font-size: 12px; background: rgba(56,189,248,0.15); color: #38bdf8; padding: 4px 10px; border-radius: 20px; margin-left: 10px; border: 1px solid rgba(56,189,248,0.3);";
                    weatherBadge.innerText = `📍 ${city} | 🌡️ ${temp}°C Live`;
                    
                    const locationHeader = document.querySelector("h3") || document.querySelector(".header");
                    if(locationHeader) locationHeader.appendChild(weatherBadge);
                });
        }).catch(() => console.log("Weather loading bypassed."));
}

// 4. Mikrotik & Payment Webhook Processing Logic
async function activateMikrotikUser(userId, profileName) {
    console.log(`[Auto Activation] Triggered for STB/User: ${userId} with Profile: ${profileName}`);
    return { status: "success" };
}

function handlePaymentWebhook(payload) {
    if (payload && (payload.status === "captured" || payload.status === "SUCCESS")) {
        activateMikrotikUser(payload.stb_id, payload.plan_id);
    }
}
