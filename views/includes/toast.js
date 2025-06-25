function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `my-toast ${type}`;
  toast.textContent = message;

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.className = 'toast-close';
  closeBtn.onclick = () => toast.remove();
  toast.appendChild(closeBtn);

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

window.addEventListener('DOMContentLoaded', () => {
  if (Array.isArray(toastSuccess)) toastSuccess.forEach(msg => showToast(msg, 'success'));
  if (Array.isArray(toastError)) toastError.forEach(msg => showToast(msg, 'error'));
});
