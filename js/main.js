import { INITIAL_HEIGHT } from './constants/constants.js';
import { setupInputHandler } from './inputHandler.js';
import { saveState } from './utils/state.js';

const gridsContainer = document.getElementById('grids-container');

setupInputHandler(gridsContainer, INITIAL_HEIGHT);

window.addEventListener('beforeunload', () => {
  saveState();
});
