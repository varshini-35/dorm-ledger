const ctx = document.getElementById("weeklyChart");
const API_BASE = "https://dorm-ledger.onrender.com";

// Fetch today's meal counts from backend
async function loadMealSummary() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(`${API_BASE}/meals/summary?date=${today}`);
    const data = await res.json();

    // Fill top cards
    document.getElementById("breakfastCount").innerText = data.breakfastCount ?? 0;
    document.getElementById("lunchCount").innerText = data.lunchCount ?? 0;
    document.getElementById("dinnerCount").innerText = data.dinnerCount ?? 0;

  } catch (err) {
    console.error("Meal summary error:", err);
    document.getElementById("breakfastCount").innerText = 0;
    document.getElementById("lunchCount").innerText = 0;
    document.getElementById("dinnerCount").innerText = 0;
  }
}

// Dummy ML values (static)
const mlPrediction = {
  Breakfast: { turnout: 94 },
  Lunch: { turnout: 102 },
  Dinner: { turnout: 98 }
};


// Fill ML card
function fillMLCard() {
  document.getElementById("mlBreakfastTurnout").innerText =
    mlPrediction.Breakfast.turnout;

  document.getElementById("mlLunchTurnout").innerText =
    mlPrediction.Lunch.turnout;

  document.getElementById("mlDinnerTurnout").innerText =
    mlPrediction.Dinner.turnout;
}


// Weekly chart (static)
new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      { label: "Breakfast", data: [310, 300, 320, 315, 305, 312], backgroundColor: "#9ecbff" },
      { label: "Lunch", data: [295, 290, 300, 298, 292, 298], backgroundColor: "#b6f0c2" },
      { label: "Dinner", data: [280, 275, 290, 285, 278, 285], backgroundColor: "#d8c6ff" }
    ]
  },
  options: { responsive: true, plugins: { legend: { position: "top" } }, scales: { y: { beginAtZero: true } } }
});

// ======================
// Init
// ======================
document.addEventListener("DOMContentLoaded", () => {
  loadMealSummary(); // fetch counts from backend
  fillMLCard();      // fill ML card with dummy values
});
