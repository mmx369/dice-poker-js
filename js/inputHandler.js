import { createGrid } from './grid.js';
import { removeSelected } from './utils/removeSelected.js';
import { updateDice } from './utils/updateDice.js';
import { setFocusToInput } from './utils/setFocusToInput.js';
import { saveState, loadState, clearState } from './utils/state.js';
import { resetRandomFields } from './utils/resetRandomFields.js';

export function setupInputHandler(gridsContainer, height) {
  const widthInput = document.getElementById('width-input'); //table width
  const gridCountInput = document.getElementById('grid-count'); //number of players
  const updateButton = document.getElementById('update-button'); //start button (clear state and create new)
  const generateButton = document.getElementById('generate-button'); //generate dice number
  const pressCounter = document.getElementById('press-counter'); //press generate counter

  let buttonPressCount = 0;
  let activeGridIndex = 0;

  function resetGenerator() {
    buttonPressCount = 0;
    pressCounter.textContent = `Count: ${buttonPressCount}`;
    resetRandomFields();
  }

  function enableGenerateButton() {
    generateButton.disabled = false;
  }

  function switchActiveGrid() {
    const grids = document.querySelectorAll('.grid');
    grids[activeGridIndex].classList.remove('active');
    activeGridIndex = (activeGridIndex + 1) % grids.length;
    grids[activeGridIndex].classList.add('active');
    saveState();
  }

  function activateFirstGrid() {
    const grids = document.querySelectorAll('.grid');
    grids.forEach((grid, index) => {
      if (index === 0) {
        grid.classList.add('active');
      } else {
        grid.classList.remove('active');
      }
    });
    activeGridIndex = 0;
    saveState();
  }

  function createMultipleGrids(state = null) {
    const gridCount = state
      ? state.grids.length
      : parseInt(gridCountInput.value);
    const newWidth = parseInt(widthInput.value);

    gridsContainer.innerHTML = '';
    const gridsWrapper = document.createElement('div');
    gridsWrapper.classList.add('grid-container');
    gridsContainer.appendChild(gridsWrapper);

    for (let i = 0; i < gridCount; i++) {
      const gridWrapper = document.createElement('div');
      gridWrapper.classList.add('container');

      const gridElement = document.createElement('div');
      gridElement.classList.add('grid');
      gridElement.id = `grid-${i}`;

      const totalSumElement = document.createElement('div');
      totalSumElement.classList.add('total-sum');
      totalSumElement.innerHTML = `Total Sum: <span id="total-sum-value-${i}">0</span>`;

      gridWrapper.appendChild(gridElement);
      gridWrapper.appendChild(totalSumElement);
      gridsWrapper.appendChild(gridWrapper);

      if (newWidth > 0 && newWidth <= 7) {
        createGrid(
          gridElement,
          newWidth,
          height,
          resetGenerator,
          i,
          enableGenerateButton,
          i === activeGridIndex,
          switchActiveGrid
        );
      }

      if (state) {
        const gridState = state.grids[i];
        Array.from(gridElement.children).forEach((cell, index) => {
          cell.textContent = gridState[index];
        });
      }
    }

    // Highlight the active grid
    activeGridIndex = state ? state.activeGridIndex : 0;
    document.querySelectorAll('.grid')[activeGridIndex].classList.add('active');

    // Restore press counter if available
    if (state) {
      buttonPressCount = state.pressCount;
      pressCounter.textContent = `Count: ${buttonPressCount}`;
    }
  }

  updateButton.addEventListener('click', () => {
    resetGenerator();
    createMultipleGrids();
    clearState();
    activateFirstGrid();
    enableGenerateButton();
    saveState();
  });

  generateButton.addEventListener('click', () => {
    buttonPressCount++;
    if (buttonPressCount >= 3) {
      generateButton.disabled = true;
      setFocusToInput();
      setTimeout(() => {
        removeSelected();
        const finalNumbers = [];
        for (let i = 1; i <= 6; i++) {
          const field = document.getElementById(`random-${i}`);
          const selectedValue = parseInt(field.dataset.diceValue, 10);
          finalNumbers.push(selectedValue);
        }
        const sortedFinalNumbers = [...finalNumbers].sort((a, b) => a - b);
        for (let i = 1; i <= 6; i++) {
          const field = document.getElementById(`random-${i}`);
          updateDice(field, sortedFinalNumbers[i - 1]);
        }
      }, 1000);
    }

    for (let i = 1; i <= 6; i++) {
      const field = document.getElementById(`random-${i}`);
      if (!field.classList.contains('selected')) {
        field.classList.add('rolling');
        setTimeout(() => {
          field.classList.remove('rolling');
          const randomNumber = Math.floor(Math.random() * 6) + 1;
          field.innerHTML = '';
          updateDice(field, randomNumber);
        }, 600);
      }
    }

    pressCounter.textContent = `Press Count: ${buttonPressCount}`;
    saveState();
  });

  // Add event listeners to toggle selection of random fields
  for (let i = 1; i <= 6; i++) {
    const field = document.getElementById(`random-${i}`);
    field.addEventListener('click', () => {
      field.classList.toggle('selected');
      saveState();
    });
  }

  const savedState = loadState();
  if (savedState) {
    createMultipleGrids(savedState);
  } else {
    createMultipleGrids();
  }
  enableGenerateButton();
}
