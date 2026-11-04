
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("depositForm");
  const amountInput = document.getElementById("depositAmount");
  const methodInput = document.getElementById("paymentMethod");
  const receiptInput = document.getElementById("depositReceipt");
  const previewBox = document.getElementById("receiptPreview");
  const previewImage = document.getElementById("receiptImage");
  const removeButton = document.getElementById("removeReceipt");
  const submitButton = document.getElementById("depositSubmit");
  const status = document.getElementById("depositStatus");

  let receiptUrl = null;

  function clearReceiptPreview() {
    if (receiptUrl) {
      URL.revokeObjectURL(receiptUrl);
      receiptUrl = null;
    }

    previewImage.removeAttribute("src");
    previewBox.hidden = true;
  }

  receiptInput.addEventListener("change", () => {
    clearReceiptPreview();

    const file = receiptInput.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      receiptInput.value = "";
      status.textContent = "Please select a JPEG, PNG or WEBP image.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      receiptInput.value = "";
      status.textContent = "Receipt image must not exceed 5 MB.";
      return;
    }

    receiptUrl = URL.createObjectURL(file);
    previewImage.src = receiptUrl;
    previewBox.hidden = false;
    status.textContent = "Receipt image selected.";
  });

  removeButton.addEventListener("click", () => {
    receiptInput.value = "";
    clearReceiptPreview();
    status.textContent = "Receipt image removed.";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    const amount = Number(amountInput.value);
    const method = methodInput.value;

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      status.textContent = "Enter a valid amount in Naira.";
      return;
    }

    if (!method) {
      status.textContent = "Please select a payment method.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Preparing...";

    status.textContent =
      "Your information is ready, but the secure deposit backend is not connected. No payment request has been sent and no account balance has changed.";

    submitButton.disabled = false;
    submitButton.textContent = "Prepare Deposit Request";
  });

  window.addEventListener("beforeunload", clearReceiptPreview);

  console.log("GROVANTA deposit interface initialized.");
});
