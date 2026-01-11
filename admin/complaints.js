const rows = document.querySelectorAll("#complaintTable tr");
const filter = document.getElementById("statusFilter");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const resolvedCount = document.getElementById("resolvedCount");

function updateCounts() {
  let total = 0, pending = 0, resolved = 0;

  rows.forEach(row => {
    total++;
    const status = row.getAttribute("data-status");
    if (status === "pending") pending++;
    if (status === "resolved") resolved++;
  });

  totalCount.innerText = total;
  pendingCount.innerText = pending;
  resolvedCount.innerText = resolved;
}

function filterComplaints() {
  const value = filter.value;

  rows.forEach(row => {
    const status = row.getAttribute("data-status");
    row.style.display =
      value === "all" || status === value ? "" : "none";
  });
}

// Resolve button
document.querySelectorAll(".resolve-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    const row = this.closest("tr");
    row.setAttribute("data-status", "resolved");
    row.querySelector(".badge").className = "badge resolved";
    row.querySelector(".badge").innerText = "Resolved";
    this.parentElement.innerText = "-";
    updateCounts();
  });
});

filter.addEventListener("change", filterComplaints);

// Initial load
updateCounts();
