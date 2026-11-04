
document.addEventListener("DOMContentLoaded", () => {
  const requestsContainer = document.getElementById("supportRequests");

  const totalRequests = document.getElementById("totalRequests");
  const pendingRequests = document.getElementById("pendingRequests");
  const resolvedRequests = document.getElementById("resolvedRequests");

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  window.renderAdminSupportRequests = function(requests) {
    if (!Array.isArray(requests)) return;

    totalRequests.textContent = requests.length;

    pendingRequests.textContent = requests.filter(
      request => request.status === "pending"
    ).length;

    resolvedRequests.textContent = requests.filter(
      request => request.status === "resolved"
    ).length;

    if (requests.length === 0) {
      requestsContainer.innerHTML = `
        <h3>No support requests available</h3>
        <p>User support requests will appear here when the secure backend is connected.</p>
      `;
      return;
    }

    requestsContainer.innerHTML = requests.map(request => `
      <article class="admin-support-request">
        <h3>${escapeHTML(request.subject)}</h3>
        <p><strong>Category:</strong> ${escapeHTML(request.category)}</p>
        <p>${escapeHTML(request.message)}</p>
        <p><strong>Status:</strong> ${escapeHTML(request.status)}</p>
        ${
          request.imageUrl
            ? `<a href="${escapeHTML(request.imageUrl)}" target="_blank" rel="noopener noreferrer">View attached image</a>`
            : "<p>No image attached.</p>"
        }
      </article>
    `).join("");
  };

  window.renderAdminSupportRequests([]);

  console.log("GROVANTA admin support interface initialized.");
});
