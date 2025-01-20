import { db } from "./firebase-config.js";

const newPharmacyBtn = document.getElementById("newPharmacyBtn");
const addPharmacyForm = document.getElementById("addPharmacyForm");
const addEntryForm = document.getElementById("addEntryForm");

// Show the New Pharmacy Form
if (newPharmacyBtn) {
    newPharmacyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        addEntryForm.style.display = "none";
        addPharmacyForm.style.display = "block";
    });
}

// Handle New Pharmacy Form Submission
if (addPharmacyForm) {
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
}

// Handle Add Entry Form Submission
if (addEntryForm) {
    addEntryForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const teamName = document.getElementById("teamName").value;
        const province = document.getElementById("province").value;
        const pharmacyName = document.getElementById("pharmacyName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const address = document.getElementById("address").value;
        const remarks = document.getElementById("remarks").value;

        // Collect sales quantities
        const skuInputs = document.querySelectorAll(".sku-input");
        const salesQuantities = {};
        skuInputs.forEach((input) => {
            const sku = input.dataset.sku;
            const quantity = parseInt(input.value, 10) || 0;
            salesQuantities[sku] = quantity;
        });

        const newEntry = { teamName, province, pharmacyName, contactNumber, address, salesQuantities, remarks };

        try {
            await db.ref("entries").push(newEntry);
            alert("New entry added successfully!");
            addEntryForm.reset();
        } catch (error) {
            console.error("Error adding entry:", error);
            alert("Failed to add new entry.");
        }
    });
}
