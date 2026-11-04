const depositState = {
  records: [],
  filter: "all"
};

function escapeDepositHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function formatDepositAmount(amount) {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "Not available";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2
  }).format(value);
}

function getSafeReceiptURL(url) {
  try {
    const parsed = new URL(url, window.location.href);

    if (parsed.protocol !== "https:") return "";

    return parsed.href;
  } catch {
    return "";
  }
}

function updateDepositStats(records) {
  document.getElementById("totalDeposits").textContent = records.length;

  document.getElementById("pendingDeposits").textContent =
    records.filter(item => item.status === "pending").length;

  document.getElementById("approvedDeposits").textContent =
    records.filter(item => item.status === "approved").length;

  document.getElementById("rejectedDeposits").textContent =
    records.filter(item => item.status === "rejected").length;
}

function renderAdminDeposits(records) {
  if (!Array.isArray(records)) return;

  depositState.records = records.map(record => ({
    reference: String(record.reference || "Not provided"),
    name: String(record.name || "Not provided"),
    phone: String(record.phone || "Not provided"),
    amount: record.amount,
    method: String(record.method || "Not provided"),
    date: String(record.date || "Not provided"),
    status: ["pending", "approved", "rejected"].includes(record.status)
      ? record.status
      : "pending",
    receiptUrl: getSafeReceiptURL(record.receiptUrl)
  }));

  updateDepositStats(depositState.records);
  filterAdminDeposits();
}

function filterAdminDeposits() {
  const container = document.getElementById("adminDepositList");
  if (!container) return;

  const filtered = depositState.filter === "all"
    ? depositState.records
    : depositState.records.filter(
        record => record.status === depositState.filter
      );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="deposit-empty">
        <h3>No deposit records found</h3>
        <p>Records supplied by the connected backend will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(record => `
    <article class="deposit-record">
      <div class="deposit-record-header">
        <h3>${escapeDepositHTML(record.reference)}</h3>
        <span class="deposit-status ${record.status}">
          ${escapeDepositHTML(record.status.toUpperCase())}
        </span>
      </div>

      <div class="deposit-record-details">
        <div class="deposit-detail">
          <span>Account holder</span>
          <strong>${escapeDepositHTML(record.name)}</strong>
        </div>

        <div class="deposit-detail">
          <span>Phone number</span>
          <strong>${escapeDepositHTML(record.phone)}</strong>
        </div>

        <div class="deposit-detail">
          <span>Amount</span>
          <strong>${formatDepositAmount(record.amount)}</strong>
        </div>

        <div class="deposit-detail">
          <span>Payment method</span>
          <strong>${escapeDepositHTML(record.method)}</strong>
        </div>

        <div class="deposit-detail">
          <span>Date submitted</span>
          <strong>${escapeDepositHTML(record.date)}</strong>
        </div>
      </div>

      ${
        record.receiptUrl
          ? `<a class="deposit-receipt-link"
               href="${escapeDepositHTML(record.receiptUrl)}"
               target="_blank"
               rel="noopener noreferrer">View receipt</a>`
          : ""
      }
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const filter = document.getElementById("depositFilter");

  if (filter) {
    filter.addEventListener("change", event => {
      depositState.filter = event.target.value;
      filterAdminDeposits();
    });
  }

  renderAdminDeposits([]);
  console.log("GROVANTA admin deposits interface initialized.");
});

window.renderAdminDeposits = renderAdminDeposits;
