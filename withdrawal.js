document.addEventListener("DOMContentLoaded", () => {
  console.log("GROVANTA withdrawal centre initialized.");

  const historySection = document.querySelector(".withdrawal-empty");

  if (historySection) {
    historySection.setAttribute("aria-live", "polite");
  }
});

/*
 * Future backend integration:
 * Withdrawal history must come from an authenticated,
 * authorised server endpoint.
 *
 * Never trust browser-side balances or withdrawal statuses.
 * No withdrawal requests or bank transfers are processed here.
 */

window.GrovantaWithdrawal = {
  serviceStatus: "not_connected",

  getStatus() {
    return this.serviceStatus;
  }
};
