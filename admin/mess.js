const ctx = document.getElementById("weeklyChart");
const API_BASE = "http://localhost:5000";

async function loadMealSummary() {
  try {
    console.log("Fetching meal summary...");

    const today = new Date().toISOString().split("T")[0];
    console.log("Date:", today);

    const res = await fetch(
      `${API_BASE}/meals/summary?date=${today}`
    );

    console.log("Response status:", res.status);

    const data = await res.json();
    console.log("Frontend received:", JSON.stringify(data, null, 2));


    const {
  breakfast,
  lunch,
  dinner
} = data;

document.getElementById("breakfastCount").innerText = breakfast ?? 0;
document.getElementById("lunchCount").innerText = lunch ?? 0;
document.getElementById("dinnerCount").innerText = dinner ?? 0;
  } catch (err) {
    console.error("Meal summary error:", err);
  }
}


new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Breakfast",
        data: [310, 300, 320, 315, 305, 312],
        backgroundColor: "#9ecbff"
      },
      {
        label: "Lunch",
        data: [295, 290, 300, 298, 292, 298],
        backgroundColor: "#b6f0c2"
      },
      {
        label: "Dinner",
        data: [280, 275, 290, 285, 278, 285],
        backgroundColor: "#d8c6ff"
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});


const currentMeal = getCurrentMeal();

function getCurrentMeal() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();

  if (minutes < (6 * 60 + 30)) return "Breakfast";
  if (minutes < (10 * 60 + 30)) return "Lunch";
  return "Dinner";
}


document.getElementById("mealName").innerText = currentMeal;

// Dummy ML values (backend will replace)
const mlPrediction = {
  Breakfast: { turnout: 310, quantity: 155, reduction: 12.4 },
  Lunch: { turnout: 295, quantity: 148, reduction: 15.1 },
  Dinner: { turnout: 285, quantity: 142, reduction: 18.6 }
};

document.getElementById("mlTurnout").innerText =
  mlPrediction[currentMeal].turnout;

document.getElementById("mlQuantity").innerText =
  mlPrediction[currentMeal].quantity;

document.getElementById("mlReduction").innerText =
  mlPrediction[currentMeal].reduction;

document.addEventListener("DOMContentLoaded", () => {
  loadMealSummary();
});

