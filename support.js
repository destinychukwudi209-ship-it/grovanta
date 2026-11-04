
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("supportForm");
  const imageInput = document.getElementById("supportImage");
  const previewBox = document.getElementById("imagePreview");
  const previewImage = document.getElementById("previewImage");
  const removeButton = document.getElementById("removeImage");
  const status = document.getElementById("supportStatus");

  let selectedImageUrl = null;

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (selectedImageUrl) {
      URL.revokeObjectURL(selectedImageUrl);
      selectedImageUrl = null;
    }

    previewBox.hidden = true;
    previewImage.removeAttribute("src");

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      imageInput.value = "";
      status.textContent = "Please select a JPEG, PNG or WEBP image.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      imageInput.value = "";
      status.textContent = "The image must not exceed 5 MB.";
      return;
    }

    selectedImageUrl = URL.createObjectURL(file);
    previewImage.src = selectedImageUrl;
    previewBox.hidden = false;
    status.textContent = "Image selected successfully.";
  });

  removeButton.addEventListener("click", () => {
    imageInput.value = "";

    if (selectedImageUrl) {
      URL.revokeObjectURL(selectedImageUrl);
      selectedImageUrl = null;
    }

    previewImage.removeAttribute("src");
    previewBox.hidden = true;
    status.textContent = "Image removed.";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    const subject = document.getElementById("supportSubject").value.trim();
    const category = document.getElementById("supportCategory").value;
    const message = document.getElementById("supportMessage").value.trim();

    if (!subject || !category || !message) {
      status.textContent = "Please complete all required fields.";
      return;
    }

    status.textContent =
      "Your request is ready, but secure submission is not connected yet. No message or image has been sent to the admin.";
  });

  window.addEventListener("beforeunload", () => {
    if (selectedImageUrl) {
      URL.revokeObjectURL(selectedImageUrl);
    }
  });
});
