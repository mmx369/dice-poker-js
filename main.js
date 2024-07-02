import { setupInputHandler } from './inputHandler.js';
import { saveState } from './grid.js';

const gridsContainer = document.getElementById('grids-container');
const initialHeight = 16;

// Setup input handler
setupInputHandler(gridsContainer, initialHeight);

// Save state before page unloads
window.addEventListener('beforeunload', () => {
  saveState();
});
