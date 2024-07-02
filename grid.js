const data = [
  1,
  2,
  3,
  4,
  5,
  6,
  'Two',
  'Set',
  'TP',
  'FH',
  'FOK',
  'P',
  'SmStr',
  'LStr',
  'Sum',
];

let gridHasSum = -1; // Track which grid has summed

export function createGrid(
  container,
  width,
  height,
  resetGenerator,
  gridIndex,
  enableGenerateButton,
  isActive,
  switchActiveGrid
) {
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${width + 2}, 1fr)`; // +2 for the fixed column and the empty column

  const columnSums = new Array(width).fill(0);
  const rowSumCells = [];
  const columnSumCells = [];

  if (isActive) {
    container.classList.add('active');
  }

  for (let row = 0; row < height; row++) {
    // Add the fixed text column from the array
    const fixedCell = document.createElement('div');
    fixedCell.classList.add('cell', 'first-column');
    if (row === 5 || row === 6) {
      fixedCell.classList.add('bold-bottom-border');
    }
    if (row === height - 1) {
      fixedCell.classList.add('bold-bottom-border');
    }
    if (row === 0) {
      fixedCell.classList.add('bold-top-border');
    }
    fixedCell.textContent = data[row] !== undefined ? data[row] : ''; // Fills with data from the array or empty if out of bounds
    container.appendChild(fixedCell);

    const rowCells = [];
    let rowSum = 0;

    // Add the remaining dynamic columns, initialized as empty
    for (let col = 0; col < width; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (col === 0) {
        cell.classList.add('bold-left-border');
      }
      if (col === width - 1) {
        cell.classList.add('bold-right-border');
      }
      if (row === height - 1) {
        cell.classList.add('bold-bottom-border');
      }
      if (row === 0) {
        cell.classList.add('bold-top-border');
      }
      if (row === 5 || row === 6) {
        cell.classList.add('bold-bottom-border');
      }
      cell.textContent = ''; // Initialize as empty
      container.appendChild(cell);
      rowCells.push(cell);

      // Add event listener to fill cell with data from input, excluding the last row
      if (row !== height - 1) {
        cell.addEventListener('click', () => {
          if (!container.classList.contains('active')) {
            showError('It is not your turn to fill this grid.');
            return;
          }

          const firstEmptyCellIndex = rowCells.findIndex(
            (c) => c.textContent === ''
          );
          if (firstEmptyCellIndex !== col) {
            showError('You must fill the first empty cell in the row.');
            return;
          }

          let inputValue = document
            .getElementById('empty-input')
            .value.toUpperCase();
          if (isValidInput(inputValue, row)) {
            cell.textContent = inputValue;
            saveState(); // Save state after filling a cell
            resetGenerator(); // Reset generator and counters
            clearError(); // Clear error message
            updateRowSum();
            updateColumnSums();
            updateTotalSum();
            enableGenerateButton(); // Enable generate button after filling a cell
            switchActiveGrid(); // Switch active grid
          } else {
            showError(
              'Invalid input. Only positive numbers or "X" are allowed. Rows 1 to 6 also allow "O".'
            );
          }
        });
      }
    }

    // Add the empty column at the end with sum of row
    const sumCell = document.createElement('div');
    sumCell.classList.add('cell', 'last-column', 'bold-right-border');
    if (row === 5 || row === 6) {
      sumCell.classList.add('bold-bottom-border');
    }
    if (row === height - 1) {
      sumCell.classList.add('bold-bottom-border');
    }
    if (row === 0) {
      sumCell.classList.add('bold-top-border');
    }
    if (row === 14) {
      sumCell.textContent = 'X';
    }
    container.appendChild(sumCell);
    rowSumCells.push(sumCell);

    function updateRowSum() {
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
          const otherGridsFilled = Array.from(
            document.querySelectorAll(`.grid`)
          )
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
          const otherGridsFilled = Array.from(
            document.querySelectorAll(`.grid`)
          )
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
  }

  // Create sum cells in the last row (16th row)
  const lastRow = height - 1;
  for (let col = 0; col < width; col++) {
    const columnSumCell = container.children[lastRow * (width + 2) + col + 1];
    columnSumCell.textContent = columnSums[col];
    columnSumCells.push(columnSumCell);
  }

  function updateColumnSums() {
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

  function updateTotalSum() {
    let totalSum = 0;
    let allFilled = true;
    // Sum of all cells in the last row
    for (let col = 0; col < width; col++) {
      const value = columnSumCells[col].textContent;
      if (!isNaN(value)) {
        totalSum += parseFloat(value);
      } else {
        allFilled = false;
      }
    }
    // Sum of all cells in the last column (excluding the last cell)
    for (let row = 0; row < lastRow; row++) {
      const cell = container.children[row * (width + 2) + width + 1];
      const value = cell.textContent;
      if (!isNaN(value)) {
        totalSum += parseFloat(value);
      } else if (value === 'O') {
        totalSum -= 200;
      } else {
        allFilled = false;
      }
    }
    // Display the total sum if all cells are filled and no other grid has summed
    if (allFilled) {
      if (gridHasSum === -1 || gridHasSum === gridIndex) {
        document.getElementById(`total-sum-value-${gridIndex}`).textContent =
          totalSum;
        gridHasSum = gridIndex;
        // Clear other grids' total sum and set X
        document.querySelectorAll('.total-sum span').forEach((el, idx) => {
          if (idx !== gridIndex) {
            el.textContent = 'X';
          }
        });
      } else {
        document.getElementById(`total-sum-value-${gridIndex}`).textContent =
          'X';
      }
    } else {
      document.getElementById(`total-sum-value-${gridIndex}`).textContent = '';
    }
  }

  updateTotalSum();
}

function isValidInput(value, row) {
  const isPositiveNumber = !isNaN(value) && Number(value) > 0;
  const isX = value === 'X';
  const isO = value === 'O';
  if (row >= 0 && row <= 5) {
    return isPositiveNumber || isX || isO;
  }
  return isPositiveNumber || isX;
}

function showError(message) {
  const errorMessageElement = document.getElementById('error-message');
  errorMessageElement.textContent = message;
}

function clearError() {
  const errorMessageElement = document.getElementById('error-message');
  errorMessageElement.textContent = '';
}

export function saveState() {
  const grids = Array.from(document.querySelectorAll('.grid'));
  const state = {
    grids: grids.map((grid) =>
      Array.from(grid.children).map((cell) => cell.textContent)
    ),
    activeGridIndex: document.querySelector('.grid.active')
      ? grids.indexOf(document.querySelector('.grid.active'))
      : 0,
    pressCount: parseInt(
      document.getElementById('press-counter').textContent.split(' ')[2]
    ),
  };
  localStorage.setItem('gridState', JSON.stringify(state));
}

export function loadState() {
  const state = JSON.parse(localStorage.getItem('gridState'));
  return state;
}

export function clearState() {
  localStorage.removeItem('gridState');
}
