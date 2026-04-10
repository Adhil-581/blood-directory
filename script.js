import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 REPLACE WITH YOUR CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBzlbqZQWCm1V1d4fzzcVcnoUYHEsSbqGw",
  authDomain: "blood-directory-8fe78.firebaseapp.com",
  projectId: "blood-directory-8fe78",
  storageBucket: "blood-directory-8fe78.firebasestorage.app",
  messagingSenderId: "249940062556",
  appId: "1:249940062556:web:dfd22a5fd76d2e72cb1199"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// =======================
// ➕ ADD DONOR FUNCTION
// =======================
window.addDonor = async function () {
  try {
    const name = document.getElementById("name").value.trim();
    const blood = document.getElementById("blood").value.trim();
    const district = document.getElementById("district").value.trim();
    const location = document.getElementById("location").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // 🚫 Validation
    if (!name || !blood || !district || !location || !phone) {
      alert("Please fill all fields properly");
      return;
    }

    // 🔥 Add to Firestore
    await addDoc(collection(db, "donors"), {
      name,
      blood,
      district,
      location,
      phone
    });

    alert("✅ Donor added successfully!");

    // 🧹 Clear inputs
    document.getElementById("name").value = "";
    document.getElementById("blood").value = "";
    document.getElementById("district").value = "";
    document.getElementById("location").value = "";
    document.getElementById("phone").value = "";

  } catch (error) {
    console.error("Error adding donor:", error);
    alert("❌ Failed to add donor");
  }
};


// =======================
// 🔍 SEARCH DONOR FUNCTION
// =======================
window.searchDonor = async function () {
  try {
    const searchBlood = document.getElementById("searchBlood").value.trim();
    const searchDistrict = document.getElementById("searchDistrict").value.trim();

    if (!searchBlood || !searchDistrict) {
      alert("Select both blood group and district");
      return;
    }

    const q = query(
      collection(db, "donors"),
      where("blood", "==", searchBlood),
      where("district", "==", searchDistrict)
    );

    const querySnapshot = await getDocs(q);

    const results = document.getElementById("results");
    results.innerHTML = "";

    if (querySnapshot.empty) {
      results.innerHTML = "<p>No donors found</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <strong>${data.name}</strong><br>
        📍 ${data.location} (${data.district})<br>
        🩸 ${data.blood}<br>
        📞 ${data.phone}
      `;

      results.appendChild(div);
    });

  } catch (error) {
    console.error("Error searching donor:", error);
    alert("❌ Search failed");
  }
};

async function adminExport() {
  const querySnapshot = await getDocs(collection(db, "donors"));

  let csv = "Name,Blood,District,Location,Phone\n";

  querySnapshot.forEach((doc) => {
    const d = doc.data();
    csv += `${d.name},${d.blood},${d.district},${d.location},${d.phone}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "donors.csv";
  a.click();
}