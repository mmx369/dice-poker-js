import { FIRST_ROW_DATA } from './constants/constants.js';
import { updateTotalSum } from './utils/updateTotalSum.js';
import { updateColumnSums } from './utils/updateColumnsSum.js';
import { updateRowSum } from './utils/updateRowSum.js';
import { isValidInput } from './utils/isValidInput.js';
import { showError, clearError } from './utils/error.js';
import { saveState } from './utils/state.js';

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
  const rowCells = [];
  let rowSum = 0;

  if (isActive) {
    container.classList.add('active');
  }

  // Create first fixed column from the array
  for (let row = 0; row < height; row++) {
    const fixedCell = document.createElement('div');
    fixedCell.classList.add('cell', 'first-column');

    if (row === 5) {
      fixedCell.classList.add('bold-bottom-border');
    }
    if (row === height - 1) {
      fixedCell.classList.add('bold-bottom-border');
    }
    if (row === 0) {
      fixedCell.classList.add('bold-top-border');
    }
    if (row === 14) {
      fixedCell.classList.add('bold-bottom-border');
    }
    if (row === 15) {
      fixedCell.classList.add('last-column');
    }

    fixedCell.textContent =
      FIRST_ROW_DATA[row] !== undefined ? FIRST_ROW_DATA[row] : '';

    container.appendChild(fixedCell);

    // Create the remaining dynamic columns, initialized as empty
    for (let col = 0; col < width; col++) {
      const cell = document.createElement('div');

      cell.classList.add('cell');
      if (row === 0) {
        cell.classList.add('bold-top-border');
      }
      if (row === 5) {
        cell.classList.add('bold-bottom-border');
      }
      if (row === 14) {
        cell.classList.add('bold-bottom-border');
      }
      if (row === 15) {
        cell.classList.add('last-column', 'bold-bottom-border');
      }
      cell.textContent = '';
      container.appendChild(cell);
      rowCells.push(cell);

      // Add event listener to fill cell with data from input, excluding the last row
      if (row !== height - 1) {
        cell.addEventListener('click', () => {
          if (!container.classList.contains('active')) {
            showError('It is not your turn.');
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
            saveState();
            resetGenerator();
            clearError();
            updateRowSum(rowCells, rowSum, row, sumCell, gridIndex, width);
            updateColumnSums(
              width,
              columnSums,
              lastRow,
              container,
              columnSumCells,
              gridIndex
            );
            updateTotalSum(gridIndex, width);
            enableGenerateButton();
            switchActiveGrid();
          } else {
            showError(
              'Invalid input. Only positive numbers or "X" are allowed. Rows from 1 to 6 also allow "O".'
            );
          }
        });
      }
    }

    // Create the last empty column with row sum

    const sumCell = document.createElement('div');
    sumCell.classList.add('cell', 'last-column', 'bold-right-border');
    if (row === 5) {
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
      sumCell.classList.add('bold-bottom-border');
    }
    container.appendChild(sumCell);
    rowSumCells.push(sumCell);
  }

  // Create sum cells in the last row (16th row)
  const lastRow = height - 1;
  for (let col = 0; col < width; col++) {
    const columnSumCell = container.children[lastRow * (width + 2) + col + 1];
    columnSumCell.textContent = columnSums[col];
    columnSumCells.push(columnSumCell);
  }
  updateTotalSum(gridIndex, width);
}
