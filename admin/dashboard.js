function toggleProfile(event) {
  event.stopPropagation(); // stop bubbling
  const box = document.getElementById("profileBox");
  box.classList.toggle("hidden");
}

// close when clicking anywhere else
document.addEventListener("click", function () {
  document.getElementById("profileBox").classList.add("hidden");
});

function logout() {
  window.location.href = "/login/login.html";
}

// Admin details
document.getElementById("pName").innerText = "Anitha Rao";
document.getElementById("pRole").innerText = "Warden";
document.getElementById("pEmail").innerText = "anitha@college.edu";


const currentMeal = getCurrentMeal();

document.getElementById("dashMealName").innerText = currentMeal;

// Dummy ML values (backend will replace)
const mlPrediction = {
  Breakfast: 310,
  Lunch: 295,
  Dinner: 285
};

document.getElementById("dashTurnout").innerText =
  mlPrediction[currentMeal];
