export function loadState() {
  const state = JSON.parse(localStorage.getItem('gridState'));
  return state;
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

export function clearState() {
  localStorage.removeItem('gridState');
}
