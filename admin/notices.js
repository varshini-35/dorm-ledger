const table = document.getElementById("noticeTable");
const totalCount = document.getElementById("totalCount");
const importantCount = document.getElementById("importantCount");
const activeCount = document.getElementById("activeCount");

let notices = [];

function toggleTarget() {
  const audience = document.getElementById("audience").value;
  document.getElementById("targetFields")
    .classList.toggle("hidden", audience !== "specific");
}

function postNotice() {
  const title = document.getElementById("title").value;
  const message = document.getElementById("message").value;
  const priority = document.getElementById("priority").value;
  const audience = document.getElementById("audience").value;
  const usn = document.getElementById("usn").value;
  const room = document.getElementById("room").value;

  if (!title || !message) {
    alert("Title and message are required");
    return;
  }

  const sentTo =
    audience === "all"
      ? "All Tenants"
      : `USN: ${usn || "-"} / Room: ${room || "-"}`;

  const notice = {
    title,
    priority,
    sentTo,
    postedBy: "Warden",
    date: new Date().toLocaleDateString(),
  };

  notices.unshift(notice);
  renderTable();
  clearForm();
}

function renderTable() {
  table.innerHTML = "";

  notices.forEach(n => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${n.title}</td>
      <td><span class="badge ${n.priority}">
        ${n.priority.toUpperCase()}
      </span></td>
      <td>${n.sentTo}</td>
      <td>${n.postedBy}</td>
      <td>${n.date}</td>
    `;
    table.appendChild(row);
  });

  updateCounts();
}

function updateCounts() {
  totalCount.innerText = notices.length;
  importantCount.innerText = notices.filter(n => n.priority === "important").length;
  activeCount.innerText = notices.length;
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("message").value = "";
  document.getElementById("usn").value = "";
  document.getElementById("room").value = "";
}
