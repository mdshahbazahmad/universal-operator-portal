/*
 * Eagle Network - Phase 3 Multi-Server Engine
 *
 * This file owns the adapter registry and its local persistence. The portal is
 * intentionally backend-neutral: it stores connection metadata and sync
 * results now, while a future server API can replace syncAdapter() with live
 * RouterOS/RADIUS/OLT calls without changing the dashboard UI.
 */
(function () {
    "use strict";

    const STORAGE_KEY = "eagle_server_profiles";
    const DEFAULT_SERVERS = [
        {
            id: "server-main",
            name: "Main MikroTik Router",
            type: "MikroTik RouterOS",
            endpoint: "",
            protocol: "routeros",
            token: "",
            interval: "15",
            capabilities: ["subscriber-sync", "plans", "usage"],
            status: "not_configured",
            lastSync: null,
            syncCount: 0
        },
        {
            id: "server-radius",
            name: "RADIUS AAA",
            type: "RADIUS AAA",
            endpoint: "",
            protocol: "radius",
            token: "",
            interval: "30",
            capabilities: ["subscriber-sync", "auth"],
            status: "not_configured",
            lastSync: null,
            syncCount: 0
        }
    ];

    let servers = readServers();

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function readServers() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
            return Array.isArray(saved) && saved.length ? saved : DEFAULT_SERVERS.map(server => ({ ...server }));
        } catch (error) {
            console.warn("[ServerEngine] Could not read saved adapters.", error);
            return DEFAULT_SERVERS.map(server => ({ ...server }));
        }
    }

    function persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
    }

    function formatTime(value) {
        if (!value) return "Never";
        return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
    }

    function statusClass(status) {
        if (status === "ready" || status === "online") return "ready";
        if (status === "syncing") return "syncing";
        if (status === "error") return "error";
        return "pending";
    }

    function getSubscriberMappings() {
        try {
            const subscribers = JSON.parse(localStorage.getItem("eagle_db_subscribers") || "[]");
            return Array.isArray(subscribers) ? subscribers.filter(sub => sub.serverId).length : 0;
        } catch (error) {
            return 0;
        }
    }

    function render() {
        const body = document.getElementById("server-list-body");
        if (!body) return;

        body.innerHTML = servers.map(server => `
            <tr class="server-row">
                <td>
                    <strong>${escapeHtml(server.name)}</strong>
                    <small style="display:block;color:#64748b;">${escapeHtml(server.type)} · ${escapeHtml(server.endpoint || "Endpoint not configured")}</small>
                    <div class="server-capabilities">${(server.capabilities || []).slice(0, 4).map(cap => `<span>${escapeHtml(cap)}</span>`).join("")}</div>
                </td>
                <td><span class="status-pill ${statusClass(server.status)}"><i class="fa-solid fa-circle"></i> ${escapeHtml(server.status.replace("_", " "))}</span></td>
                <td><small style="color:#94a3b8;">${formatTime(server.lastSync)}</small><small style="display:block;color:#64748b;">${server.syncCount || 0} syncs</small></td>
                <td>
                    <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        <button class="mini-btn primary" onclick="ServerEngine.sync('${escapeHtml(server.id)}')" title="Run adapter sync"><i class="fa-solid fa-rotate"></i></button>
                        <button class="mini-btn" onclick="ServerEngine.edit('${escapeHtml(server.id)}')" title="Edit adapter"><i class="fa-solid fa-pen"></i></button>
                        <button class="mini-btn danger" onclick="ServerEngine.remove('${escapeHtml(server.id)}')" title="Remove adapter"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join("") || `<tr><td colspan="4" class="empty-state">No server adapters configured.</td></tr>`;

        const online = servers.filter(server => server.status === "ready" || server.status === "online").length;
        const lastSync = servers.filter(server => server.lastSync).sort((a, b) => new Date(b.lastSync) - new Date(a.lastSync))[0];
        const count = document.getElementById("server-count");
        const onlineCount = document.getElementById("server-online");
        const lastSyncNode = document.getElementById("server-last-sync");
        const mappings = document.getElementById("server-mappings");
        if (count) count.innerText = servers.length;
        if (onlineCount) onlineCount.innerText = online;
        if (lastSyncNode) lastSyncNode.innerText = lastSync ? formatTime(lastSync.lastSync) : "Never";
        if (mappings) mappings.innerText = getSubscriberMappings();
    }

    function resetForm() {
        const form = document.getElementById("server-profile-form");
        if (form) form.reset();
        const editId = document.getElementById("server-edit-id");
        if (editId) editId.value = "";
        const title = document.querySelector("#sec-server h3");
        if (title) title.innerHTML = '<i class="fa-solid fa-plug"></i> Add or edit server adapter';
    }

    function edit(id) {
        const server = servers.find(item => item.id === id);
        if (!server) return;
        document.getElementById("server-edit-id").value = server.id;
        document.getElementById("server-name").value = server.name || "";
        document.getElementById("server-type").value = server.type || "Custom REST API";
        document.getElementById("server-endpoint").value = server.endpoint || "";
        document.getElementById("server-protocol").value = server.protocol || "https";
        document.getElementById("server-token").value = server.token || "";
        document.getElementById("server-interval").value = server.interval || "15";
        document.getElementById("server-capabilities").value = (server.capabilities || []).join(", ");
        const title = document.querySelector("#sec-server h3");
        if (title) title.innerHTML = '<i class="fa-solid fa-pen"></i> Edit server adapter';
        if (typeof window.switchTab === "function") window.switchTab("server");
    }

    function save(event) {
        event.preventDefault();
        const name = document.getElementById("server-name").value.trim();
        const endpoint = document.getElementById("server-endpoint").value.trim();
        if (!name || !endpoint) {
            if (typeof window.showToast === "function") window.showToast("Server name and endpoint are required.");
            return;
        }

        const id = document.getElementById("server-edit-id").value || `server-${Date.now()}`;
        const existing = servers.find(server => server.id === id);
        const profile = {
            id,
            name,
            type: document.getElementById("server-type").value,
            endpoint,
            protocol: document.getElementById("server-protocol").value,
            token: document.getElementById("server-token").value.trim(),
            interval: document.getElementById("server-interval").value,
            capabilities: document.getElementById("server-capabilities").value.split(",").map(item => item.trim()).filter(Boolean),
            status: existing && existing.status === "ready" ? "ready" : "pending",
            lastSync: existing ? existing.lastSync : null,
            syncCount: existing ? existing.syncCount || 0 : 0
        };

        if (existing) {
            servers = servers.map(server => server.id === id ? profile : server);
        } else {
            servers.unshift(profile);
        }
        persist();
        render();
        resetForm();
        if (typeof window.showToast === "function") window.showToast("Server adapter saved locally.");
    }

    function remove(id) {
        const server = servers.find(item => item.id === id);
        if (!server) return;
        if (!window.confirm(`Remove ${server.name} from the server fleet?`)) return;
        servers = servers.filter(item => item.id !== id);
        persist();
        render();
        if (typeof window.showToast === "function") window.showToast("Server adapter removed.");
    }

    function sync(id) {
        const server = servers.find(item => item.id === id);
        if (!server) return;
        if (!server.endpoint) {
            if (typeof window.showToast === "function") window.showToast("Configure an endpoint before syncing this server.");
            edit(id);
            return;
        }

        server.status = "syncing";
        persist();
        render();
        if (typeof window.showToast === "function") window.showToast(`Sync queued for ${server.name}.`);

        // Adapter boundary: replace this timeout with a backend API call when
        // the main-server contract is available.
        window.setTimeout(() => {
            server.status = "ready";
            server.lastSync = new Date().toISOString();
            server.syncCount = (server.syncCount || 0) + 1;
            persist();
            render();
            if (typeof window.dispatchAlertTrigger === "function") {
                window.dispatchAlertTrigger("server_sync", { serverName: server.name, endpoint: server.endpoint });
            }
            if (typeof window.showToast === "function") window.showToast(`${server.name} sync completed.`);
        }, 900);
    }

    function syncAll() {
        servers.filter(server => server.endpoint).forEach(server => sync(server.id));
        if (!servers.some(server => server.endpoint) && typeof window.showToast === "function") {
            window.showToast("Add at least one server endpoint before syncing.");
        }
    }

    function initialize() {
        persist();
        render();
    }

    window.ServerEngine = { initialize, render, save, edit, remove, sync, syncAll, resetForm, getServers: () => servers.slice() };
    window.addEventListener("DOMContentLoaded", initialize);
})();