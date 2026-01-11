const rows = document.querySelectorAll("#attendanceTable tr");
const filter = document.getElementById("statusFilter");

const totalCount = document.getElementById("totalCount");
const inCount = document.getElementById("inCount");
const outCount = document.getElementById("outCount");

function updateCounts() {
  let total = 0, inside = 0, outside = 0;

  rows.forEach(row => {
    total++;
    const status = row.getAttribute("data-status");
    if (status === "in") inside++;
    if (status === "out") outside++;
  });

  totalCount.innerText = total;
  inCount.innerText = inside;
  outCount.innerText = outside;
}

function filterAttendance() {
  const value = filter.value;

  rows.forEach(row => {
    const status = row.getAttribute("data-status");
    row.style.display =
      value === "all" || status === value ? "" : "none";
  });
}

filter.addEventListener("change", filterAttendance);

// Initial load
updateCounts();
