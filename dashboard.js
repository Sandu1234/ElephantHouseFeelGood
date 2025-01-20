// dashboard.js
import { db } from "./firebase-config.js";

// Fetch and Update Dashboard Data
async function fetchAndUpdateDashboard() {
    try {
        const entriesSnapshot = await db.ref("entries").once("value");
        const pharmaciesSnapshot = await db.ref("pharmacies").once("value");

        const entries = entriesSnapshot.exists() ? Object.values(entriesSnapshot.val()) : [];
        const pharmacies = pharmaciesSnapshot.exists() ? Object.values(pharmaciesSnapshot.val()) : [];

        // Update Total Counts
        document.getElementById("preRegisteredEntries").textContent = entries.length;
        document.getElementById("newEntries").textContent = pharmacies.length;

        // Update Dashboard Details
        updateTeamPerformance(entries, pharmacies);
        updateProvincePerformance(entries, pharmacies);
        createTeamCharts(entries, pharmacies);
        createProvinceCharts(entries, pharmacies);
    } catch (error) {
        console.error("Error fetching data from Firebase:", error.message);
        alert(`Failed to load data from Firebase: ${error.message}`);
    }
}

// Update Team Performance Table
function updateTeamPerformance(entries, pharmacies) {
    const teamPerformance = {};

    [...entries, ...pharmacies].forEach((entry) => {
        const teamName = entry.teamName || "Unknown";
        const province = entry.province || "Unknown";

        if (!teamPerformance[teamName]) {
            teamPerformance[teamName] = { count: 0, provinces: new Set() };
        }

        teamPerformance[teamName].count++;
        teamPerformance[teamName].provinces.add(province);
    });

    const teamTableBody = document.getElementById("teamPerformanceTable");
    teamTableBody.innerHTML = Object.entries(teamPerformance)
        .map(
            ([team, data]) =>
                `<tr><td>${team}</td><td>${data.count}</td><td>${Array.from(data.provinces).join(", ")}</td></tr>`
        )
        .join("");
}

// Update Province Performance Table
function updateProvincePerformance(entries, pharmacies) {
    const provincePerformance = {};

    [...entries, ...pharmacies].forEach((entry) => {
        const province = entry.province || "Unknown";
        const teamName = entry.teamName || "Unknown";

        if (!provincePerformance[province]) {
            provincePerformance[province] = { count: 0, teams: new Set() };
        }

        provincePerformance[province].count++;
        provincePerformance[province].teams.add(teamName);
    });

    const provinceTableBody = document.getElementById("provincePerformanceTable");
    provinceTableBody.innerHTML = Object.entries(provincePerformance)
        .map(
            ([province, data]) =>
                `<tr><td>${province}</td><td>${data.count}</td><td>${Array.from(data.teams).join(", ")}</td></tr>`
        )
        .join("");
}

// Create Charts
function createTeamCharts(entries, pharmacies) {
    const preRegisteredCounts = {};
    const newCounts = {};

    entries.forEach((entry) => {
        preRegisteredCounts[entry.teamName] = (preRegisteredCounts[entry.teamName] || 0) + 1;
    });

    pharmacies.forEach((pharmacy) => {
        newCounts[pharmacy.teamName] = (newCounts[pharmacy.teamName] || 0) + 1;
    });

    createPieChart("preRegisteredTeamChart", preRegisteredCounts, "Pre-Registered Pharmacies by Team");
    createPieChart("newPharmaciesTeamChart", newCounts, "New Pharmacies by Team");
}

function createProvinceCharts(entries, pharmacies) {
    const preRegisteredCounts = {};
    const newCounts = {};

    entries.forEach((entry) => {
        preRegisteredCounts[entry.province] = (preRegisteredCounts[entry.province] || 0) + 1;
    });

    pharmacies.forEach((pharmacy) => {
        newCounts[pharmacy.province] = (newCounts[pharmacy.province] || 0) + 1;
    });

    createPieChart("preRegisteredProvinceChart", preRegisteredCounts, "Pre-Registered Pharmacies by Province");
    createPieChart("newPharmaciesProvinceChart", newCounts, "New Pharmacies by Province");
}

// Function to Create Pie Chart
function createPieChart(chartId, dataCounts, title) {
    const ctx = document.getElementById(chartId).getContext("2d");

    if (Chart.getChart(chartId)) {
        Chart.getChart(chartId).destroy();
    }

    const labels = Object.keys(dataCounts);
    const data = Object.values(dataCounts);

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: ["#1CA498", "#B51F67", "#FAD968", "#FF5733"],
                },
            ],
        },
        options: {
            plugins: {
                legend: { position: "bottom" },
                title: { display: true, text: title },
            },
        },
    });
}

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("preRegisteredEntries")) {
        fetchAndUpdateDashboard();
    }
});
