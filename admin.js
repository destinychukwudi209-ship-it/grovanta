
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".admin-nav a[href^='#']");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.forEach(item => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  console.log("GROVANTA admin interface initialized.");
});
