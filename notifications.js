
const notifications = [];
let activeFilter = "all";

const notificationList = document.getElementById("notificationList");
const totalCount = document.getElementById("totalNotifications");
const unreadCount = document.getElementById("unreadNotifications");
const announcementCount = document.getElementById("announcementCount");

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function updateNotificationCounts() {
  totalCount.textContent = notifications.length;

  unreadCount.textContent = notifications.filter(
    item => !item.read
  ).length;

  announcementCount.textContent = notifications.filter(
    item => item.type === "announcement"
  ).length;
}

function renderNotifications(items = notifications) {
  const filtered = items.filter(item => {
    if (activeFilter === "unread") return !item.read;
    if (activeFilter === "announcement") {
      return item.type === "announcement";
    }
    if (activeFilter === "account") {
      return item.type === "account";
    }
    return true;
  });

  if (filtered.length === 0) {
    notificationList.innerHTML = `
      <div class="notification-empty">
        <h3>No notifications yet</h3>
        <p>New account updates and official announcements will appear here.</p>
      </div>
    `;
    return;
  }

  notificationList.innerHTML = filtered.map(item => `
    <article class="notification-item ${item.read ? "read" : "unread"}">
      <div class="notification-content">
        <span class="notification-type">
          ${escapeHTML(item.type === "announcement" ? "Announcement" : "Account")}
        </span>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.message)}</p>
        <small>${escapeHTML(item.date || "Date unavailable")}</small>
      </div>
      ${
        item.read
          ? '<span class="notification-read-label">Read</span>'
          : `<button class="mark-read" data-id="${escapeHTML(item.id)}">Mark as read</button>`
      }
    </article>
  `).join("");
}

function setNotificationFilter(filter) {
  activeFilter = filter;

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.filter === filter
    );
  });

  renderNotifications();
}

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    setNotificationFilter(button.dataset.filter);
  });
});

notificationList.addEventListener("click", event => {
  const button = event.target.closest(".mark-read");
  if (!button) return;

  const item = notifications.find(
    notification => String(notification.id) === button.dataset.id
  );

  if (item) {
    item.read = true;
    updateNotificationCounts();
    renderNotifications();
  }
});

document.getElementById("markAllRead").addEventListener("click", () => {
  notifications.forEach(item => {
    item.read = true;
  });

  updateNotificationCounts();
  renderNotifications();
});

window.renderGrovantaNotifications = function(items) {
  if (!Array.isArray(items)) return;

  notifications.splice(0, notifications.length);

  items.forEach(item => {
    if (
      item &&
      item.id !== undefined &&
      typeof item.title === "string" &&
      typeof item.message === "string" &&
      ["announcement", "account"].includes(item.type)
    ) {
      notifications.push({
        id: String(item.id),
        title: item.title,
        message: item.message,
        type: item.type,
        date: item.date || "",
        read: Boolean(item.read)
      });
    }
  });

  updateNotificationCounts();
  renderNotifications();
};

updateNotificationCounts();
renderNotifications();
    
