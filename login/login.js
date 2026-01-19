let selectedRole = "student"; // default role

// ================= ROLE SWITCH =================
function switchRole(role, element) {
  selectedRole = role.toLowerCase();

  // Toggle active tab
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

// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector(".login-btn");
  if (!loginBtn) {
    console.error("❌ Login button with class 'login-btn' not found");
    return;
  }

  loginBtn.addEventListener("click", async () => {

    // ---------- STUDENT LOGIN ----------
    if (selectedRole === "student") {
      const usn = document.getElementById("student-usn").value.trim().toUpperCase();
      const password = document.getElementById("student-password").value.trim();

      if (!usn || !password) {
        alert("Please enter USN and password");
        return;
      }

      try {
        const res = await fetch(`https://dorm-ledger.onrender.com/users/${usn}`);
        if (!res.ok) throw new Error("Student not found");

        const data = await res.json();

        if (!data.success || !data.student) {
          alert("Invalid USN or student not found");
          return;
        }

        // Verify password if stored in Firestore
        if (data.student.password && data.student.password !== password) {
          alert("Incorrect password");
          return;
        }

        // Save logged-in info for dashboard
        localStorage.setItem("role", "student");
        localStorage.setItem("loggedInUSN", usn);
        window.location.href = "../student/dashboard.html";

      } catch (err) {
        console.error("Student login failed:", err);
        alert("Login failed. Check USN and password.");
      }
    }

    // ---------- ADMIN LOGIN ----------
    if (selectedRole === "admin") {
      const email = document.getElementById("admin-email").value.trim();
      const password = document.getElementById("admin-password").value.trim();

      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      try {
        const res = await fetch("https://dorm-ledger.onrender.com/auth/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (data.success) {
          localStorage.setItem("role", "admin");
          window.location.href = "../admin/dashboard.html";
        } else {
          alert("Admin not authorized");
        }

      } catch (err) {
        console.error("Backend error:", err);
        alert("Server error");
      }
    }

  });
});