export function isValidInput(value, row) {
  const isPositiveNumber = !isNaN(value) && Number(value) > 0;
  const isX = value.toUpperCase() === 'X';
  const isO = value.toUpperCase() === 'O';
  if (row >= 0 && row <= 5) {
    return isPositiveNumber || isX || isO;
  }
  return isPositiveNumber || isX;
}
