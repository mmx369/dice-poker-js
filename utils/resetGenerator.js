export function resetGenerator() {
  buttonPressCount = 0;
  pressCounter.textContent = `Count: ${buttonPressCount}`;
  resetRandomFields();
}
