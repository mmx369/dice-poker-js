export function updateRowSum(rowCells, rowSum, row, sumCell, gridIndex, width) {
  rowSum = rowCells.reduce((sum, cell) => {
    const value = parseFloat(cell.textContent);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
  if (row <= 5) {
    // For rows 1 to 6
    if (
      rowCells.every((cell) => cell.textContent !== '') &&
      !rowCells.some((cell) => cell.textContent === 'O')
    ) {
      const otherGridsFilled = Array.from(document.querySelectorAll(`.grid`))
        .filter((_, index) => index !== gridIndex)
        .some((grid) => {
          const otherRowCells = Array.from(grid.children).slice(
            row * (width + 2) + 1,
            (row + 1) * (width + 2) - 1
          );
          return otherRowCells.every((cell) => cell.textContent !== '');
        });
      if (!otherGridsFilled) {
        sumCell.textContent = (row + 1) * 5;
      } else {
        sumCell.textContent = '';
      }
    } else {
      sumCell.textContent = '';
    }
  } else if (row >= 6 && row <= 13) {
    // For rows 7 to 14
    if (
      rowCells.every((cell) => cell.textContent !== '') &&
      !rowCells.some((cell) => cell.textContent === 'X')
    ) {
      const otherGridsFilled = Array.from(document.querySelectorAll(`.grid`))
        .filter((_, index) => index !== gridIndex)
        .some((grid) => {
          const otherRowCells = Array.from(grid.children).slice(
            row * (width + 2) + 1,
            (row + 1) * (width + 2) - 1
          );
          return otherRowCells.every((cell) => cell.textContent !== '');
        });
      if (!otherGridsFilled) {
        sumCell.textContent = Math.max(
          ...rowCells
            .map((cell) => parseFloat(cell.textContent))
            .filter((value) => !isNaN(value))
        );
      } else {
        sumCell.textContent = '';
      }
    } else {
      sumCell.textContent = '';
    }
  } else if (row === 14) {
    // Always show X for row 15
    sumCell.textContent = 'X';
  } else {
    // For other rows
    if (
      rowCells.every(
        (cell) => cell.textContent !== '' && cell.textContent !== 'X'
      )
    ) {
      sumCell.textContent = rowSum;
    } else {
      sumCell.textContent = '';
    }
  }
}
