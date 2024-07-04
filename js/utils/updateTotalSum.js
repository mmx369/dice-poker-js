export function updateTotalSum(gridIndex, width) {
  const cells = document.querySelectorAll(`#grid-${gridIndex} .cell`);
  let sum = 0;
  cells.forEach((cell, index) => {
    const column = index % (width + 2);
    if (column > 0) {
      const value = cell.textContent.trim();
      if (value === 'O' || value === 'o') {
        sum += -200;
      } else {
        const numericValue = parseInt(value);
        if (!isNaN(numericValue)) {
          sum += numericValue;
        }
      }
    }
  });
  document.getElementById(`total-sum-value-${gridIndex}`).textContent = sum;
}
