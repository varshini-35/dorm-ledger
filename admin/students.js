const searchInput = document.getElementById("searchInput");
const filter = document.getElementById("feeFilter");
const rows = document.querySelectorAll("tbody tr");

const totalCount = document.getElementById("totalCount");
const paidCount = document.getElementById("paidCount");
const pendingCount = document.getElementById("pendingCount");

function updateCounts() {
  let total = 0;
  let paid = 0;
  let pending = 0;

  rows.forEach(row => {
    const status = row.getAttribute("data-status");
    total++;

    if (status === "paid") paid++;
    if (status === "due") pending++;
  });

  totalCount.innerText = total;
  paidCount.innerText = paid;
  pendingCount.innerText = pending;
}

function filterTable() {
  const searchValue = searchInput.value.toLowerCase();
  const filterValue = filter.value;

  rows.forEach(row => {
    const status = row.getAttribute("data-status");
    const rowText = row.innerText.toLowerCase();

    const matchesSearch = rowText.includes(searchValue);
    const matchesFilter =
      filterValue === "all" || status === filterValue;

    row.style.display =
      matchesSearch && matchesFilter ? "" : "none";
  });
}

/* EVENTS */
searchInput.addEventListener("input", filterTable);
filter.addEventListener("change", filterTable);

/* INITIAL LOAD */
updateCounts();
