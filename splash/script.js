document.addEventListener("DOMContentLoaded", () => {
  const ormText = "ORM";
  const ledgerText = "LEDGER";

  let i = 0;
  let j = 0;

  const ormEl = document.getElementById("orm");
  const ledgerEl = document.getElementById("ledger");

  if (!ormEl || !ledgerEl) return;

  setTimeout(typeORM, 2600);

  function typeORM() {
    ormEl.style.opacity = 1;
    if (i < ormText.length) {
      ormEl.textContent += ormText[i++];
      setTimeout(typeORM, 180);
    } else {
      setTimeout(typeLedger, 400);
    }
  }

  function typeLedger() {
    ledgerEl.style.opacity = 1;
    if (j < ledgerText.length) {
      ledgerEl.textContent += ledgerText[j++];
      setTimeout(typeLedger, 160);
    }
  }
});
