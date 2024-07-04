export function updateColumnSums(
  width,
  columnSums,
  lastRow,
  container,
  columnSumCells,
  gridIndex
) {
  for (let col = 0; col < width; col++) {
    columnSums[col] = 0;
    for (let row = 0; row < lastRow; row++) {
      const cell = container.children[row * (width + 2) + col + 1];
      const value = parseFloat(cell.textContent);
      if (!isNaN(value)) {
        columnSums[col] += value;
      }
    }
    const columnCells = Array.from(
      { length: lastRow },
      (_, i) => container.children[i * (width + 2) + col + 1]
    );

    if (
      columnCells.every((cell) => cell.textContent !== '') &&
      !columnCells.slice(0, 6).some((cell) => cell.textContent === 'O') &&
      !columnCells.slice(6, 15).some((cell) => cell.textContent === 'X') &&
      Array.from(document.querySelectorAll(`.grid`))
        .filter((_, index) => index !== gridIndex)
        .every((grid) => {
          const otherColumnCell =
            grid.children[lastRow * (width + 2) + col + 1];
          return isNaN(parseFloat(otherColumnCell.textContent));
        })
    ) {
      columnSumCells[col].textContent = Math.max(
        ...columnCells
          .map((cell) => parseFloat(cell.textContent))
          .filter((value) => !isNaN(value))
      );
    } else {
      columnSumCells[col].textContent = '';
    }
  }
}
