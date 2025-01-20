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

// Get a reference to the database
const db = firebase.database();

// Add Data to Realtime Database
if (document.getElementById("addEntryForm")) {
    const addEntryForm = document.getElementById("addEntryForm");

    addEntryForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const teamName = document.getElementById("teamName").value;
        const province = document.getElementById("province").value;
        const pharmacyName = document.getElementById("pharmacyName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const address = document.getElementById("address").value;

        const skuInputs = document.querySelectorAll(".sku-input");
        const salesQty = Array.from(skuInputs).map((input) => ({
            name: input.dataset.sku,
            count: input.value,
        }));

        const newEntry = { teamName, province, pharmacyName, contactNumber, address, salesQty };

        try {
            await db.ref("entries").push(newEntry);
            alert("Entry added successfully!");
            addEntryForm.reset();
        } catch (error) {
            console.error("Error adding entry:", error);
            alert("Failed to add entry.");
        }
    });
}

// Fetch Data from Realtime Database
if (document.getElementById("dashboardTable")) {
    const dashboardTable = document.getElementById("dashboardTable").getElementsByTagName("tbody")[0];

    db.ref("entries").on("value", (snapshot) => {
        if (!snapshot.exists()) {
            console.log("No data available in Firebase.");
            return;
        }

        const entries = snapshot.val();
        const formattedEntries = Object.values(entries);

        dashboardTable.innerHTML = "";
        formattedEntries.forEach((entry) => {
            const row = dashboardTable.insertRow();
            row.innerHTML = `
                <td>${entry.teamName}</td>
                <td>${entry.province}</td>
                <td>${entry.pharmacyName}</td>
                <td>${entry.contactNumber}</td>
                <td>${entry.address}</td>
                <td>${entry.salesQty.map((sku) => `${sku.name}: ${sku.count}`).join("<br>")}</td>
            `;
        });
    });
}
