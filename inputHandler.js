import { createGrid, saveState, loadState, clearState } from './grid.js';

export function setupInputHandler(gridsContainer, height) {
  const widthInput = document.getElementById('width-input');
  const gridCountInput = document.getElementById('grid-count');
  const updateButton = document.getElementById('update-button');
  const generateButton = document.getElementById('generate-button');
  const clearStateButton = document.getElementById('clear-state-button');
  const pressCounter = document.getElementById('press-counter');
  let buttonPressCount = 0;
  let activeGridIndex = 0;

  function resetRandomFields() {
    for (let i = 1; i <= 6; i++) {
      const field = document.getElementById(`random-${i}`);
      field.value = '';
      field.classList.remove('selected');
      field.innerHTML = ''; // Clear dots
    }
  }

  function resetGenerator() {
    buttonPressCount = 0;
    pressCounter.textContent = `Press Count: ${buttonPressCount}`;
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
    saveState(); // Save state after switching active grid
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

      // Restore grid state if available
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
      pressCounter.textContent = `Press Count: ${buttonPressCount}`;
    }
  }

  updateButton.addEventListener('click', () => {
    createMultipleGrids();
    saveState();
  });

  generateButton.addEventListener('click', () => {
    buttonPressCount++;
    if (buttonPressCount >= 3) {
      generateButton.disabled = true; // Disable button after the third press
    }
    if (buttonPressCount >= 4) {
      buttonPressCount = 0; // Reset the counter after the fourth press
      resetRandomFields(); // Reset the fields
      for (let i = 1; i <= 6; i++) {
        const field = document.getElementById(`random-${i}`);
        field.classList.add('rolling'); // Add animation class
        setTimeout(() => {
          field.classList.remove('rolling'); // Remove animation class after animation
          const randomNumber = Math.floor(Math.random() * 6) + 1;
          field.innerHTML = ''; // Clear previous dots
          updateDice(field, randomNumber);
        }, 600); // Duration of the animation
      }
    } else {
      for (let i = 1; i <= 6; i++) {
        const field = document.getElementById(`random-${i}`);
        if (!field.classList.contains('selected')) {
          field.classList.add('rolling'); // Add animation class
          setTimeout(() => {
            field.classList.remove('rolling'); // Remove animation class after animation
            const randomNumber = Math.floor(Math.random() * 6) + 1;
            field.innerHTML = ''; // Clear previous dots
            updateDice(field, randomNumber);
          }, 600); // Duration of the animation
        }
      }
    }
    pressCounter.textContent = `Press Count: ${buttonPressCount}`;
    saveState(); // Save state after pressing the generate button
  });

  // Add event listeners to toggle selection of random fields
  for (let i = 1; i <= 6; i++) {
    const field = document.getElementById(`random-${i}`);
    field.addEventListener('click', () => {
      field.classList.toggle('selected');
      saveState(); // Save state after toggling selection
    });
  }

  clearStateButton.addEventListener('click', () => {
    clearState(); // Clear state from local storage
    createMultipleGrids(); // Recreate empty grids
  });

  // Load state on page load
  const savedState = loadState();
  if (savedState) {
    createMultipleGrids(savedState);
  } else {
    createMultipleGrids();
  }
  enableGenerateButton(); // Ensure the generate button is enabled initially
}

function updateDice(field, number) {
  field.className = ''; // Reset the class
  field.classList.add('dice');
  field.classList.add(`dice-${number}`);
  field.innerHTML = ''; // Clear previous dots

  const dotPositions = [
    [],
    [{ top: '50%', left: '50%' }],
    [
      { top: '20%', left: '20%' },
      { bottom: '20%', right: '20%' },
    ],
    [
      { top: '20%', left: '20%' },
      { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      { bottom: '20%', right: '20%' },
    ],
    [
      { top: '20%', left: '20%' },
      { top: '20%', right: '20%' },
      { bottom: '20%', left: '20%' },
      { bottom: '20%', right: '20%' },
    ],
    [
      { top: '20%', left: '20%' },
      { top: '20%', right: '20%' },
      { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      { bottom: '20%', left: '20%' },
      { bottom: '20%', right: '20%' },
    ],
    [
      { top: '20%', left: '20%' },
      { top: '20%', right: '20%' },
      { bottom: '20%', left: '20%' },
      { bottom: '20%', right: '20%' },
      { top: '50%', left: '20%', transform: 'translateY(-50%)' },
      { top: '50%', right: '20%', transform: 'translateY(-50%)' },
    ],
  ];

  dotPositions[number].forEach((pos) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    Object.assign(dot.style, pos);
    field.appendChild(dot);
  });
}
