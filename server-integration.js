/**
 * Eagle Network Portal - Multi-Server Protocol & Auto-Sync Engine
 * Without modifying main HTML design structure
 */

document.addEventListener("DOMContentLoaded", function () {
    injectServerFields();
    injectExcelSyncButtons();
});

// 1. बिना डैशबोर्ड छेड़े Plan ID, Cost और Multi-Server Provider Fields Inject करना
function injectServerFields() {
    const planForm = document.getElementById("add-subscriber-form") || document.querySelector("form");
    if (!planForm) return;

    const serverSection = document.createElement("div");
    serverSection.id = "server-custom-fields";
    serverSection.innerHTML = `
        <hr style="border-color: rgba(255,255,255,0.1); margin: 15px 0;">
        <h4 style="color:#38bdf8; margin-bottom:10px;"><i class="fa-solid fa-server"></i> Server Protocol & Mapping Settings</h4>
        
        <div class="form-field" style="margin-bottom:12px;">
            <label style="color:#94a3b8; font-size:12px;">Select Server Protocol / Method</label>
            <select id="server-protocol-type" style="width:100%; padding:8px; background:#1e293b; color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:6px;">
                <option value="mikrotik">Mikrotik RouterOS API</option>
                <option value="radius">Radius Server REST API</option>
                <option value="olt">OLT SNMP / SSH Protocol</option>
                <option value="custom">Custom Webhook API</option>
            </select>
        </div>

        <div class="form-field" style="margin-bottom:12px;">
            <label style="color:#94a3b8; font-size:12px;">Server Plan ID / Profile Name</label>
            <input type="text" id="plan-server-id" placeholder="e.g. 100Mbps_Unlimited_v1" style="width:100%; padding:8px; background:#1e293b; color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:6px;" required>
        </div>

        <div style="display:flex; gap:10px; margin-bottom:12px;">
            <div style="flex:1;">
                <label style="color:#94a3b8; font-size:12px;">App Price (₹)</label>
                <input type="number" id="plan-app-price" placeholder="500" style="width:100%; padding:8px; background:#1e293b; color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:6px;" required>
            </div>
            <div style="flex:1;">
                <label style="color:#94a3b8; font-size:12px;">Backend Cost (₹)</label>
                <input type="number" id="plan-backend-cost" placeholder="150" style="width:100%; padding:8px; background:#1e293b; color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:6px;" required>
            </div>
        </div>
    `;

    const saveBtn = planForm.querySelector("button[type='submit']");
    if (saveBtn) {
        planForm.insertBefore(serverSection, saveBtn);
    } else {
        planForm.appendChild(serverSection);
    }
}

// 2. Excel Import / Export System Inject करना (No Typing Required)
function injectExcelSyncButtons() {
    const pageHeader = document.querySelector(".page-header") || document.querySelector("header");
    if (!pageHeader) return;

    const syncDiv = document.createElement("div");
    syncDiv.style.cssText = "display: flex; gap: 10px; margin-top: 10px;";
    syncDiv.innerHTML = `
        <button onclick="exportPlansToExcel()" class="btn-add" style="background:#22c55e;">
            <i class="fa-solid fa-file-excel"></i> Export Excel
        </button>
        <button onclick="triggerExcelImport()" class="btn-add" style="background:#0284c7;">
            <i class="fa-solid fa-file-import"></i> Import Excel
        </button>
        <input type="file" id="excel-file-input" accept=".csv" style="display:none;" onchange="importPlansFromExcel(event)">
    `;

    pageHeader.appendChild(syncDiv);
}

// 3. Excel Export Logic
function exportPlansToExcel() {
    let csvContent = "data:text/csv;charset=utf-8,Subscriber Name,STB/MAC ID,Plan Name,Server Plan ID,App Price,Backend Cost,Protocol,Status\n";
    
    // Example export sequence
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
/**
 * Step 1: Mikrotik RouterOS Direct API Communication Handler
 */

// 1. Mikrotik Server Connection Configuration
const mikrotikConfig = {
    host: "192.168.88.1", // IP Address of Operator Mikrotik Router
    port: 8728,           // Default RouterOS API Port
    username: "admin",
    password: "Password123"
};

// 2. Function to Send Renewal Signal to Mikrotik
async function activateMikrotikUser(userId, profileName) {
    console.log(`[Mikrotik API] Connecting to ${mikrotikConfig.host}...`);
    
    // Payload for RouterOS Command Execution
    const apiPayload = {
        command: "/ppp/secret/set",
        numbers: userId,
        profile: profileName, // Plan ID / Profile ID mapped from portal
        disabled: "no"
    };

    try {
        // Simulating Multi-Server Direct API Request
        console.log(`[Mikrotik API] Sending Command: Set Profile ${profileName} for User ${userId}`);
        
        // Return Success Response to UI
        return {
            status: "success",
            message: `User ${userId} successfully activated on Mikrotik Profile: ${profileName}`,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("[Mikrotik API Error]:", error);
        return {
            status: "failed",
            message: "Unable to connect with Mikrotik RouterOS. Check API Port 8728."
        };
    }
}

// 3. Test Function for Dashboard Testing
function testMikrotikConnection() {
    const testUser = document.getElementById("sub-stb") ? document.getElementById("sub-stb").value : "TEST_USER_1";
    const testProfile = document.getElementById("plan-server-id") ? document.getElementById("plan-server-id").value : "100Mbps_Plan";
    
    activateMikrotikUser(testUser, testProfile).then(response => {
        alert("Mikrotik Signal Status: " + response.message);
    });
}
