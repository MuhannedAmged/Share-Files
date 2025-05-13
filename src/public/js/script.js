const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const fileNameDisplay = document.getElementById("file-name");

dropArea.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", function () {
  if (this.files.length > 0) {
    fileNameDisplay.textContent = `${this.files[0].name}`;
    document.getElementById("uploadBtn").disabled = false;
  }
});

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.style.borderColor = "#666";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.borderColor = "#ccc";
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dropArea.style.borderColor = "#ccc";
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    fileNameDisplay.textContent = `${files[0].name}`;
    document.getElementById("uploadBtn").disabled = false;
  }
});
