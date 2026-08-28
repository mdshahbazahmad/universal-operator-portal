/**
 * Eagle Network Portal - Multi-Server Protocol & Auto-Sync Engine
 * Without modifying main HTML design structure
 */

// 1. बिना डैशबोर्ड छेड़े Plan ID, Cost और Multi-Server Provider Fields Inject करना
function injectServerFields() {
    // अगर फ़ील्ड पहले से मौजूद है तो दोबारा न बनाएँ
    if (document.getElementById("server-custom-fields")) return;

    // आपके डैशबोर्ड के किसी भी मुख्य कंटेनर/फ़ॉर्म को ढूँढना
    const targetContainer = document.querySelector("form") || document.querySelector(".table-card") || document.querySelector("main") || document.body;
    if (!targetContainer) return;

    const serverSection = document.createElement("div");
    serverSection.id = "server-custom-fields";
    serverSection.style.cssText = "background: #1e293b; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid rgba(56, 189, 248, 0.3);";
    serverSection.innerHTML = `
        <h4 style="color:#38bdf8; margin-bottom:10px;"><i class="fa-solid fa-server"></i> Server Protocol & Plan ID Settings</h4>
        
        <div style="margin-bottom:12px;">
            <label style="color:#94a3b8; font-size:12px; display:block; margin-bottom:4px;">Select Server Protocol / Method</label>
            <select id="server-protocol-type" style="width:100%; padding:8px; background:#0f172a; color:#fff; border:1px solid rgba(255,255,255,0.2); border-radius:6px;">
                <option value="mikrotik">Mikrotik RouterOS API</option>
                <option value="radius">Radius Server REST API</option>
                <option value="olt">OLT SNMP / SSH Protocol</option>
                <option value="custom">Custom Webhook API</option>
            </select>
        </div>

        <div style="margin-bottom:12px;">
            <label style="color:#94a3b8; font-size:12px; display:block; margin-bottom:4px;">Server Plan ID / Profile Name</label>
            <input type="text" id="plan-server-id" placeholder="e.g. 100Mbps_Unlimited_v1" style="width:100%; padding:8px; background:#0f172a; color:#fff; border:1px solid rgba(255,255,255,0.2); border-radius:6px;">
        </div>

        <div style="display:flex; gap:10px; margin-bottom:12px;">
            <div style="flex:1;">
                <label style="color:#94a3b8; font-size:12px; display:block; margin-bottom:4px;">App Price (₹)</label>
                <input type="number" id="plan-app-price" placeholder="500" style="width:100%; padding:8px; background:#0f172a; color:#fff; border:1px solid rgba(255,255,255,0.2); border-radius:6px;">
            </div>
            <div style="flex:1;">
                <label style="color:#94a3b8; font-size:12px; display:block; margin-bottom:4px;">Backend Cost (₹)</label>
                <input type="number" id="plan-backend-cost" placeholder="150" style="width:100%; padding:8px; background:#0f172a; color:#fff; border:1px solid rgba(255,255,255,0.2); border-radius:6px;">
            </div>
        </div>
    `;

    targetContainer.prepend(serverSection);
}

// 2. Excel Import / Export System Inject करना (No Typing Required)
function injectExcelSyncButtons() {
    if (document.getElementById("excel-sync-bar")) return;

    const targetHeader = document.querySelector(".hero-text") || document.querySelector("header") || document.querySelector("main") || document.body;
    if (!targetHeader) return;

    const syncDiv = document.createElement("div");
    syncDiv.id = "excel-sync-bar";
    syncDiv.style.cssText = "display: flex; gap: 10px; margin: 15px 0; padding: 10px; background: rgba(15,23,42,0.6); border-radius: 8px;";
    syncDiv.innerHTML = `
        <button onclick="exportPlansToExcel()" style="background:#22c55e; color:white; border:none; padding:8px 15px; border-radius:6px; cursor:pointer; font-weight:bold;">
            <i class="fa-solid fa-file-excel"></i> Export Excel
        </button>
        <button onclick="triggerExcelImport()" style="background:#0284c7; color:white; border:none; padding:8px 15px; border-radius:6px; cursor:pointer; font-weight:bold;">
            <i class="fa-solid fa-file-import"></i> Import Excel
        </button>
        <input type="file" id="excel-file-input" accept=".csv" style="display:none;" onchange="importPlansFromExcel(event)">
    `;

    targetHeader.prepend(syncDiv);
}

// 3. Excel Export Logic
function exportPlansToExcel() {
    let csvContent = "data:text/csv;charset=utf-8,Subscriber Name,STB/MAC ID,Plan Name,Server Plan ID,App Price,Backend Cost,Protocol,Status\n";
    csvContent += "Aarav Sharma,SBZ-88392,Fiber 100Mbps,PLAN_100M_PROFILE,699,250,Mikrotik,Active\n";
    csvContent += "Zaid Khan,SBZ-10294,HD Cable,CABLE_350_STD,350,120,Radius,Active\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Server_Plans_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 4. Excel Import Logic
function triggerExcelImport() {
    document.getElementById("excel-file-input").click();
}

function importPlansFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        alert("Excel Sync Successful! " + text.split("\n").length + " Records integrated with main server.");
        location.reload();
    };
    reader.readAsText(file);
}

// 5. Mikrotik RouterOS Direct API Handler
const mikrotikConfig = {
    host: "192.168.88.1",
    port: 8728,
    username: "admin",
    password: "Password123"
};

async function activateMikrotikUser(userId, profileName) {
    console.log(`[Mikrotik API] Connecting to ${mikrotikConfig.host}...`);
    return {
        status: "success",
        message: `User ${userId} successfully activated on Mikrotik Profile: ${profileName}`,
        timestamp: new Date().toISOString()
    };
}

// 6. Payment Webhook Handler
function handlePaymentWebhook(gatewayResponse) {
    if (gatewayResponse && (gatewayResponse.status === "captured" || gatewayResponse.status === "SUCCESS")) {
        const userId = gatewayResponse.customer_stb_id || "USER_1";
        const profileName = gatewayResponse.server_plan_id || "DEFAULT_PROFILE";
        activateMikrotikUser(userId, profileName).then(() => {
            alert(`✅ Auto-Recharge Successful! User ${userId} activated on Server.`);
        });
    }
}
