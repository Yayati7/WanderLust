function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '30px';
    container.style.right = '30px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

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

  // Remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

window.addEventListener('DOMContentLoaded', () => {
  if (Array.isArray(toastSuccess)) {
    toastSuccess.forEach(msg => showToast(msg, 'success'));
  }
  if (Array.isArray(toastError)) {
    toastError.forEach(msg => showToast(msg, 'error'));
  }
});
