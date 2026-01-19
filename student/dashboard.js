const API_BASE = "https://dorm-ledger.onrender.com";
 // change if deployed

// ==========================
// GLOBAL STATE
// ==========================
let selectedType = "";
let pendingEntry = null;

let mealData = {
  breakfast: null,
  lunch: null,
  dinner: null
};

// ==========================
// MEAL CUT-OFF LOGIC
// ==========================
const mealCutOffs = {
  breakfast: "06:30",
  lunch: "12:30",
  dinner: "18:30"
};

function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getCurrentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function isMealCutoffPassed(meal) {
  return getCurrentMinutes() > timeToMinutes(mealCutOffs[meal]);
}

// ==========================
// LOAD STUDENT INFO
// ==========================
async function loadStudentInfo(usn) {
  try {
    const res = await fetch(`${API_BASE}/users/${usn}`);

    if (res.status === 404) {
      throw new Error("Student not found");
    }

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    if (!data.success || !data.student) {
      throw new Error("Invalid response");
    }

    const student = data.student;

    document.getElementById("sName").innerText = student.name;
    document.getElementById("sUSN").innerText = student.usn;
    document.getElementById("sRoom").innerText = student.room;
    document.getElementById("sPhone").innerText = student.phone;
    document.querySelector(".student-name").innerText = student.name;

  } catch (err) {
    console.error("Load student failed:", err);
    alert("Session expired. Please login again.");
    localStorage.clear();
    window.location.href = "../login/login.html";
  }
}

// ==========================
// CHECK MEAL STATUS (BACKEND)
// ==========================
async function checkMealStatus() {
  const usn = localStorage.getItem("loggedInUSN");
  const today = new Date().toISOString().split("T")[0];

  try {
    const res = await fetch(`${API_BASE}/meals/attendance/${usn}/${today}`);
    const data = await res.json();

    if (data.submitted) {
      // Meal already submitted → hide form
      document.getElementById("mealForm").style.display = "none";
      document.getElementById("mealMessage").classList.remove("hidden");
    } else {
      // Show form
      document.getElementById("mealForm").style.display = "block";
      document.getElementById("mealMessage").classList.add("hidden");
      mealData = { breakfast: null, lunch: null, dinner: null };
    }
  } catch (err) {
    console.error("Failed to check meal status", err);
    // fallback: show form
    document.getElementById("mealForm").style.display = "block";
    document.getElementById("mealMessage").classList.add("hidden");
  }
}

// ==========================
// ON PAGE LOAD
// ==========================
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("gatePass").classList.add("hidden");

  const loggedInUSN = localStorage.getItem("loggedInUSN");
  if (!loggedInUSN) {
    window.location.href = "../login/login.html";
    return;
  }

  await loadStudentInfo(loggedInUSN);

  // ✅ Use backend check instead of localStorage
  await checkMealStatus();

  applyMealCutoffs();
  setInterval(applyMealCutoffs, 60000); // 🔥 live cutoff enforcement
});

// ==========================
// APPLY MEAL CUTOFFS (FIX)
// ==========================
function applyMealCutoffs() {
  ["breakfast", "lunch", "dinner"].forEach(meal => {
    if (isMealCutoffPassed(meal)) {
      document
        .querySelectorAll(`.meal-row[data-meal="${meal}"] .meal-btn`)
        .forEach(btn => btn.disabled = true);
    }
  });
}

// ==========================
// IN / OUT SELECTION
// ==========================
function selectType(event, type) {
  selectedType = type;
  document.querySelectorAll(".toggle-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
}

// ==========================
// SUBMIT IN / OUT FORM
// ==========================
function submitInOut() {
  if (!selectedType) return alert("Please select IN or OUT");

  const reason = document.getElementById("reason").value.trim();
  const time = document.getElementById("time").value;

  if (!reason || !time) return alert("Please fill all fields");

  pendingEntry = { type: selectedType, time, reason };

  const passId = "DL-" + selectedType + "-" + Date.now().toString().slice(-6);
  document.getElementById("gpType").innerText = selectedType;
  document.getElementById("gpTime").innerText = time;
  document.getElementById("gpReason").innerText = reason;
  document.getElementById("gpId").innerText = passId;

  document.getElementById("gatePass").classList.remove("hidden");
}

// ==========================
// RESET FORM
// ==========================
function resetInOutForm() {
  if (pendingEntry) addToHistory(pendingEntry.type, pendingEntry.time, pendingEntry.reason);
  showToast();

  pendingEntry = null;
  selectedType = "";
  document.getElementById("reason").value = "";
  document.getElementById("time").value = "";

  document.querySelectorAll(".toggle-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById("gatePass").classList.add("hidden");
}

// ==========================
// TOAST
// ==========================
function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.remove("hidden", "fade-out");

  setTimeout(() => toast.classList.add("fade-out"), 2000);
  setTimeout(() => toast.classList.add("hidden"), 2600);
}

// ==========================
// HISTORY
// ==========================
function addToHistory(type, time, reason) {
  const table = document.getElementById("historyTable");
  const row = document.createElement("tr");
  const today = new Date().toLocaleDateString("en-GB");

  if (type === "OUT") {
    row.innerHTML = `<td>${today}</td><td>${time}</td><td>--</td><td>${reason}</td>`;
  } else {
    row.innerHTML = `<td>${today}</td><td>--</td><td>${time}</td><td>${reason}</td>`;
  }

  table.prepend(row);
}

// ==========================
// MEAL SELECTION (FIX)
// ==========================
function selectMeal(event, meal, value) {
  if (isMealCutoffPassed(meal)) {
    alert(`${meal.toUpperCase()} response window closed`);
    return;
  }

  mealData[meal] = value;

  const row = event.target.closest(".meal-row");
  row.querySelectorAll(".meal-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
}

// ==========================
// SUBMIT MEAL (FIX)
// ==========================
function mapMealValue(value) {
  if (value === "yes") return true;
  if (value === "no") return false;
  return null; // cutoff passed or not answered
}

async function submitMeal() {
  // Check if all meals are selected
  for (const meal of ["breakfast", "lunch", "dinner"]) {
    if (!isMealCutoffPassed(meal) && mealData[meal] === null) {
      return alert(`Please select ${meal}`);
    }
  }

  const payload = {
    usn: localStorage.getItem("loggedInUSN"),
    date: new Date().toISOString().split("T")[0],
    breakfast: mapMealValue(mealData.breakfast),
    lunch: mapMealValue(mealData.lunch),
    dinner: mapMealValue(mealData.dinner)
  };

  try {
    const res = await fetch(`${API_BASE}/meals/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 400 && data.message === "Meal already recorded for this date") {
        alert("You have already submitted meal attendance for today");
        document.getElementById("mealForm").style.display = "none";
        document.getElementById("mealMessage").classList.remove("hidden");
        return;
      } else {
        throw new Error(data.message || "Meal submission failed");
      }
    }

    // Success
    await checkMealStatus();

    document.getElementById("mealForm").style.display = "none";
    document.getElementById("mealMessage").classList.remove("hidden");

  } catch (err) {
    console.error(err);
    alert("Failed to submit meal. Please try again.");
  }
}

// ==========================
// PROFILE & LOGOUT
// ==========================
function toggleStudentProfile(event) {
  event.stopPropagation();
  document.getElementById("studentProfileBox").classList.toggle("hidden");
}

document.addEventListener("click", () => {
  document.getElementById("studentProfileBox").classList.add("hidden");
});

function studentLogout() {
  localStorage.clear();
  window.location.href = "/login/login.html";
}
