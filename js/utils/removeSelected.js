export function removeSelected() {
  for (let i = 1; i <= 6; i++) {
    const field = document.getElementById(`random-${i}`);
    field.classList.remove('selected');
  }
}
