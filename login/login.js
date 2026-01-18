let selectedRole = "student"; // default

// ================= ROLE SWITCH =================
function switchRole(role, element) {
  selectedRole = role.toLowerCase();

  document.querySelectorAll(".role").forEach(r =>
    r.classList.remove("active")
  );
  element.classList.add("active");

  // Toggle forms
  document.getElementById("student-login").classList.toggle(
    "hidden",
    selectedRole !== "student"
  );

  document.getElementById("admin-login").classList.toggle(
    "hidden",
    selectedRole !== "admin"
  );
}

// ================= LOGIN HANDLER =================
document.querySelector(".login-btn").addEventListener("click", () => {

  if (selectedRole === "student") {
    const inputs = document
      .getElementById("student-login")
      .querySelectorAll("input");

    const phone = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    if (!phone || !password) {
      alert("Please enter phone number and password");
      return;
    }

    // TEMP: frontend auth
    localStorage.setItem("role", "student");

    window.location.href = "../student/dashboard.html";
  }

  if (selectedRole === "admin") {
    const inputs = document
      .getElementById("admin-login")
      .querySelectorAll("input");

    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    // Optional college email check
    if (!email.includes("@")) {
      alert("Please enter valid college email ID");
      return;
    }

    localStorage.setItem("role", "admin");

    window.location.href = "../admin/dashboard.html";
  }
});
