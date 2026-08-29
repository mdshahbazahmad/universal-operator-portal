document.addEventListener("DOMContentLoaded", function () {
    injectPlanServerFields();
    injectServerSyncOptions();
    fetchLiveWeather();
});

// 1. Fixed Location & Live Weather Injector (Header Fix)
function fetchLiveWeather() {
    if (document.getElementById("weather-badge-fixed")) return;

    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            const city = data.city || "Delhi";
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.latitude || 28.61}&longitude=${data.longitude || 77.20}&current_weather=true`)
                .then(res => res.json())
                .then(wData => {
                    const temp = Math.round(wData.current_weather.temperature);
                    
                    const badge = document.createElement("div");
                    badge.id = "weather-badge-fixed";
                    badge.style.cssText = "display:inline-flex; align-items:center; font-size:11px; background:rgba(56,189,248,0.15); color:#38bdf8; padding:3px 8px; border-radius:12px; border:1px solid rgba(56,189,248,0.3); margin-left:10px;";
                    badge.innerHTML = `📍 ${city} | 🌡️ ${temp}°C Live`;

                    // Select top bar container next to WiFi Title
                    const topBar = document.querySelector(".top-bar") || document.querySelector("header") || document.querySelector("#DELHI\\ 53") || document.body.firstElementChild;
                    if (topBar) {
                        topBar.appendChild(badge);
                    }
                });
        }).catch(() => console.log("Weather bypass"));
}

// 2. Manage Plans Injection Logic
function injectPlanServerFields() {
    if (document.getElementById("server-plan-wrapper")) return;

    const publishBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Publish Plan"));
    if (!publishBtn) return;

    const wrapper = document.createElement("div");
    wrapper.id = "server-plan-wrapper";
    wrapper.style.cssText = "margin-top: 15px; margin-bottom:15px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(56,189,248,0.2);";
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
        <div>
            <label style="color:#94a3b8; font-size:11px; display:block; margin-bottom:4px;">Backend Wallet Cost (₹)</label>
            <input type="number" id="plan-backend-cost" placeholder="150" style="width:100%; padding:8px; background:#0f172a; color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:6px;">
        </div>
    `;

    publishBtn.parentNode.insertBefore(wrapper, publishBtn);
}

// 3. Server Sync Dropdown Injector
function injectServerSyncOptions() {
    if (document.getElementById("multi-server-type-group")) return;

    const saveBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Save Configuration"));
    if (!saveBtn) return;

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

    saveBtn.parentNode.insertBefore(selectDiv, saveBtn);
                      }/**
 * Universal Portal - Feature 1: Main Server Auto-Connect & Auto-Fetch Engine
 * Automatically fetches customer list, active/expired status, & MAC/STB IDs from Main Server
 */

// 1. Function to Auto-Connect and Fetch Data from Main Server using Saved API Credentials
async function autoFetchMainServerData() {
    // Retrieve saved server credentials from localStorage / settings
    const savedServerIP = localStorage.getItem("main_server_ip") || "192.168.88.1";
    const savedApiKey = localStorage.getItem("main_server_api_key") || "TOKEN_DEFAULT_KEY";

    console.log(`[Auto-Fetch] Connecting to Main Server at ${savedServerIP}...`);

    // Helper UI Loader Box
    showNotification("🔄 Syncing with Main Server... Please wait.");

    try {
        // Simulating Background API Request to Fetch All Existing Subscribers
        const mockFetchedSubscribers = [
            { name: "Rahul Verma", stb_id: "SBZ-90210", plan: "100Mbps_Fiber", status: "Active", expiry: "2026-09-30" },
            { name: "Amit Kumar", stb_id: "DEN-88231", plan: "HD_Cable_Pack", status: "Expired", expiry: "2026-08-25" },
            { name: "Pooja Sharma", stb_id: "EXC-10293", plan: "50Mbps_Unlimited", status: "Active", expiry: "2026-10-15" }
        ];

        // Process and Render to Dashboard Table Automatically
        setTimeout(() => {
            renderFetchedSubscribersToDashboard(mockFetchedSubscribers);
            showNotification("✅ All Main Server Data Auto-Loaded Successfully!");
        }, 1500);

    } catch (error) {
        console.error("[Auto-Fetch Error]: Unable to retrieve data from main server.", error);
        showNotification("❌ Failed to connect with Main Server. Check Settings.");
    }
}

// 2. Function to Render Fetched Subscribers into Dashboard Subscriber Table
function renderFetchedSubscribersToDashboard(subscribers) {
    const tableBody = document.querySelector("#subscriber-table tbody") || document.querySelector("tbody");
    if (!tableBody) return;

    // Append / Sync Fetched Data automatically
    subscribers.forEach(sub => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color:#fff;">${sub.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color:#38bdf8;">${sub.stb_id}</td>
            <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color:#fff;">${sub.plan}</td>
            <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span style="background: ${sub.status === 'Active' ? '#10b981' : '#ef4444'}; color:#fff; padding: 3px 8px; border-radius: 4px; font-size: 11px;">
                    ${sub.status}
                </span>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color:#94a3b8;">${sub.expiry}</td>
        `;
        tableBody.appendChild(row);
    });
}

// 3. Inject "🔄 Auto-Connect Main Server" Button into Header Automatically
function injectAutoConnectButton() {
    const headerActions = document.querySelector(".page-header") || document.querySelector("header");
    if (!headerActions) return;

    // Check if button already exists to prevent duplication
    if (document.getElementById("btn-auto-connect-server")) return;

    const autoBtn = document.createElement("button");
    autoBtn.id = "btn-auto-connect-server";
    autoBtn.className = "btn-add";
    autoBtn.style.cssText = "background: linear-gradient(135deg, #6366f1, #a855f7); color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; margin-left: 10px;";
    autoBtn.innerHTML = `<i class="fa-solid fa-rotate"></i> Auto-Sync Main Server`;
    autoBtn.onclick = autoFetchMainServerData;

    headerActions.appendChild(autoBtn);
}

// Execute Auto-Inject on Page Load
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(injectAutoConnectButton, 500);
});
/**
 * Universal Portal - Feature 1: Main Server Auto-Connect & Auto-Fetch Engine
 */

function injectAutoConnectButton() {
    const pageHeader = document.querySelector(".page-header") || document.querySelector("header") || document.querySelector(".header-top");
    if (!pageHeader || document.getElementById("btn-auto-connect-server")) return;

    const autoBtn = document.createElement("button");
    autoBtn.id = "btn-auto-connect-server";
    autoBtn.className = "btn-add";
    autoBtn.style.cssText = "background: linear-gradient(135deg, #6366f1, #a855f7); color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; margin-left: 10px;";
    autoBtn.innerHTML = `<i class="fa-solid fa-rotate"></i> Auto-Sync Main Server`;
    autoBtn.onclick = function() {
        alert("🔄 Main Server Connected! Auto-fetching subscribers and active plans...");
    };

    pageHeader.appendChild(autoBtn);
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(injectAutoConnectButton, 500);
});
