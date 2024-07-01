import { setupInputHandler } from './inputHandler.js';
import { saveState } from './grid.js';

const gridsContainer = document.getElementById('grids-container');
const initialHeight = 16; // Number of rows

// Setup input handler
setupInputHandler(gridsContainer, initialHeight);

window.addEventListener('beforeunload', () => {
  saveState(); // Save state before page unloads
});
