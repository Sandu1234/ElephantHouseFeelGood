document.addEventListener("DOMContentLoaded", async () => {

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxAkWR8Y0PrGxdMooejekrQYYjsTz9p1Y",
    authDomain: "feelgood-web.firebaseapp.com",
    databaseURL: "https://feelgood-web-default-rtdb.firebaseio.com/",
    projectId: "feelgood-web",
    storageBucket: "feelgood-web.appspot.com",
    messagingSenderId: "812145082703",
    appId: "1:812145082703:web:87d1fdc59e05b5ce99853a",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

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

// Create Team Charts
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

// Create Province Charts
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
                    backgroundColor: generateColors(labels.length),
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

// Generate Colors for Charts
function generateColors(count) {
    const baseColors = ["#1CA498", "#B51F67", "#FAD968"]; // Base colors
    const shades = [];

    // Generate shades for each base color
    for (let i = 0; i < count; i++) {
        const baseColor = baseColors[i % baseColors.length]; // Cycle through base colors
        const shadeFactor = 1 - (i % baseColors.length) * 0.1; // Reduce brightness for each shade
        const shade = adjustBrightness(baseColor, shadeFactor);
        shades.push(shade);
    }

    return shades;
}

// Adjust the brightness of a color
function adjustBrightness(color, factor) {
    const rgb = hexToRgb(color);
    const adjustedRgb = rgb.map((channel) => Math.min(255, Math.floor(channel * factor)));
    return rgbToHex(adjustedRgb[0], adjustedRgb[1], adjustedRgb[2]);
}

// Convert hex color to RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Convert RGB to hex color
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}


// Initialize the Dashboard
fetchAndUpdateDashboard();


// Get references to the new pharmacy button and forms
const newPharmacyBtn = document.getElementById("newPharmacyBtn");
const addPharmacyForm = document.getElementById("addPharmacyForm");
const addEntryForm = document.getElementById("addEntryForm");

// Show the New Pharmacy Form
newPharmacyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addEntryForm.style.display = "none";
    addPharmacyForm.style.display = "block";
});

// Handle New Pharmacy Form Submission
addPharmacyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const teamName = document.getElementById("pharmacyTeamName").value;
    const pharmacyName = document.getElementById("newPharmacyName").value;
    const contactNumber = document.getElementById("newPharmacyContact").value;
    const address = document.getElementById("newPharmacyAddress").value;

    const newPharmacy = { teamName, pharmacyName, contactNumber, address };

    try {
        await db.ref("pharmacies").push(newPharmacy);
        alert("New Pharmacy added successfully!");
        addPharmacyForm.reset();
        addPharmacyForm.style.display = "none";
        addEntryForm.style.display = "block";
    } catch (error) {
        console.error("Error adding pharmacy:", error);
        alert("Failed to add new pharmacy.");
    }
});

// Fetch and Update Pre-Registered and New Pharmacies Data
async function fetchAndUpdateDashboard() {
    try {
        const entriesSnapshot = await db.ref("entries").once("value");
        const pharmaciesSnapshot = await db.ref("pharmacies").once("value");

        const entries = entriesSnapshot.exists() ? Object.values(entriesSnapshot.val()) : [];
        const pharmacies = pharmaciesSnapshot.exists() ? Object.values(pharmaciesSnapshot.val()) : [];

        // Update Total Counts
        document.getElementById("preRegisteredEntries").textContent = entries.length;
        document.getElementById("newEntries").textContent = pharmacies.length;

        // Update Charts and Tables
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

// Create Team Charts for Pre-Registered and New Pharmacies
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

// Create Province Charts for Pre-Registered and New Pharmacies
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

// Function to Initialize the Dashboard
fetchAndUpdateDashboard();

});