export function resetRandomFields() {
  for (let i = 1; i <= 6; i++) {
    const field = document.getElementById(`random-${i}`);
    field.value = '';
    field.classList.remove('selected');
    field.innerHTML = '';
  }
}
