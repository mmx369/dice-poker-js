export function showError(message) {
  const errorMessageElement = document.getElementById('error-message');
  errorMessageElement.textContent = message;
}

export function clearError() {
  const errorMessageElement = document.getElementById('error-message');
  errorMessageElement.textContent = '';
}
