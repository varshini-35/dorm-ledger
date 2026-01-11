// ==========================
// GLOBAL STATE
// ==========================
let selectedType = "";
let pendingEntry = null; // 👈 holds data until OK is pressed


// ==========================
// ON PAGE LOAD
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("gatePass").classList.add("hidden");
});

// ==========================
// IN / OUT SELECTION
// ==========================
function selectType(type) {
  selectedType = type;

  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  if (type === "IN") {
    document.querySelector(".toggle-btn.in").classList.add("active");
  } else {
    document.querySelector(".toggle-btn.out").classList.add("active");
  }
}

// ==========================
// SUBMIT IN / OUT FORM
// ==========================
function submitInOut() {
  if (!selectedType) {
    alert("Please select IN or OUT");
    return;
  }

  const reason = document.getElementById("reason").value.trim();
  const time = document.getElementById("time").value;

  if (!reason || !time) {
    alert("Please fill all fields");
    return;
  }

  // Store entry temporarily (NOT adding to history yet)
  pendingEntry = {
    type: selectedType,
    time: time,
    reason: reason
  };

  // Generate Gate Pass
  const passId = "DL-" + selectedType + "-" + Date.now().toString().slice(-6);

  document.getElementById("gpType").innerText = selectedType;
  document.getElementById("gpTime").innerText = time;
  document.getElementById("gpReason").innerText = reason;
  document.getElementById("gpId").innerText = passId;

  document.getElementById("gatePass").classList.remove("hidden");
}


// ==========================
// RESET FORM (OK BUTTON)
// ==========================
function resetInOutForm() {
  // Add to history ONLY when OK is pressed
  if (pendingEntry) {
    addToHistory(
      pendingEntry.type,
      pendingEntry.time,
      pendingEntry.reason
    );
  }

  // Show toast
  showToast();

  // Reset temp data
  pendingEntry = null;
  selectedType = "";

  // Reset UI
  document.getElementById("reason").value = "";
  document.getElementById("time").value = "";

  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  document.getElementById("gatePass").classList.add("hidden");
}


// ==========================
// TOAST NOTIFICATION
// ==========================
function showToast() {
  const toast = document.getElementById("toast");

  toast.classList.remove("hidden");
  toast.classList.remove("fade-out");

  setTimeout(() => {
    toast.classList.add("fade-out");
  }, 2000);

  setTimeout(() => {
    toast.classList.add("hidden");
    toast.classList.remove("fade-out");
  }, 2600);
}

// ==========================
// ADD TO HISTORY TABLE
// ==========================
function addToHistory(type, time, reason) {
  const table = document.getElementById("historyTable");

  const row = document.createElement("tr");
  const today = new Date().toLocaleDateString("en-GB");

  if (type === "OUT") {
    row.innerHTML = `
      <td>${today}</td>
      <td>${time}</td>
      <td>--</td>
      <td>${reason}</td>
    `;
  } else {
    row.innerHTML = `
      <td>${today}</td>
      <td>--</td>
      <td>${time}</td>
      <td>${reason}</td>
    `;
  }

  table.prepend(row);
}

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
  lunch: "10:30",
  dinner: "16:00"
};

function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function isPastFinalCutoff() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes > timeToMinutes(mealCutOffs.dinner);
}

function selectMeal(meal, value) {
  if (isPastFinalCutoff()) {
    alert("Meal response window closed for today");
    return;
  }

  mealData[meal] = value;

  // Highlight selected button
  const row = event.target.closest(".meal-row");
  row.querySelectorAll(".meal-btn").forEach(btn =>
    btn.classList.remove("active")
  );
  event.target.classList.add("active");
}


function submitMeal() {
  if (
    mealData.breakfast === null ||
    mealData.lunch === null ||
    mealData.dinner === null
  ) {
    alert("Please select all meals");
    return;
  }

  if (isPastFinalCutoff()) {
    alert("Meal response window closed for today");
    return;
  }

  // Save submission date
  const today = new Date().toDateString();
  localStorage.setItem("mealSubmittedDate", today);
   
  document.getElementById("mealMessage").classList.remove("cutoff");

  // Hide form, show message
  document.getElementById("mealForm").style.display = "none";
  document.getElementById("mealMessage").classList.remove("hidden");

  console.log("Meal submitted:", mealData);
}



document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("mealSubmittedDate");

  if (savedDate === today) {
    // Already submitted today
    document.getElementById("mealForm").style.display = "none";
    document.getElementById("mealMessage").classList.remove("hidden");
  } else {
    // New day → reset meal section
    document.getElementById("mealForm").style.display = "block";
    document.getElementById("mealMessage").classList.add("hidden");

    // Reset meal data
    mealData = {
      breakfast: null,
      lunch: null,
      dinner: null
    };
  }
 // Disable meal form after final cut-off
if (isPastFinalCutoff()) {
  document.querySelectorAll("#mealForm .meal-btn, #mealForm .submit-btn")
    .forEach(btn => btn.disabled = true);

  const mealMsg = document.getElementById("mealMessage");

  mealMsg.classList.remove("hidden");
  mealMsg.classList.add("cutoff");   // ✅ ADD THIS LINE

  mealMsg.innerHTML = `
    <p class="cutoff-msg">⏰ Meal response window closed for today</p>
  `;
}

});


function toggleStudentProfile(event) {
  event.stopPropagation();
  const box = document.getElementById("studentProfileBox");
  box.classList.toggle("hidden");
}

/* Close profile when clicking outside */
document.addEventListener("click", () => {
  document.getElementById("studentProfileBox").classList.add("hidden");
});

/* Logout */
function studentLogout() {
  window.location.href = "/login/login.html";
}

/* (Optional – later backend can fill these dynamically) */
// document.getElementById("sName").innerText = "Varshini";
// document.getElementById("sUSN").innerText = "1AB23CS001";
// document.getElementById("sRoom").innerText = "204";
// document.getElementById("sPhone").innerText = "9XXXXXXXXX";
