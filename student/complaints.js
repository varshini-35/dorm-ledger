function submitComplaint() {
  const category = document.getElementById("category").value;
  const desc = document.getElementById("description").value;

  if (!category || !desc) {
    alert("Please fill all fields");
    return;
  }

  const table = document.getElementById("complaintTable");
  const row = document.createElement("tr");

  const today = new Date().toLocaleDateString("en-GB");

  row.innerHTML = `
    <td>${today}</td>
    <td>${category}</td>
    <td>${desc}</td>
    <td><span class="badge pending">Pending</span></td>
  `;

  table.prepend(row);

  document.getElementById("category").value = "";
  document.getElementById("description").value = "";

  showToast();
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}
