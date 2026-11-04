
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("promoForm");
  const codeInput = document.getElementById("promoCode");
  const status = document.getElementById("promoStatus");
  const button = document.getElementById("applyPromoButton");

  codeInput.addEventListener("input", () => {
    codeInput.value = codeInput.value
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "");
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    const code = codeInput.value.trim();

    if (!code) {
      status.textContent = "Please enter a promo code.";
      return;
    }

    if (code.length < 3) {
      status.textContent = "Please enter a valid code format.";
      return;
    }

    button.disabled = true;
    button.textContent = "Checking...";

    status.textContent =
      "Promo code submission is not connected yet. No code has been redeemed.";

    button.disabled = false;
    button.textContent = "Apply Promo Code";
  });

  console.log("GROVANTA promo code page initialized.");
});
