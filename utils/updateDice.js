export function updateDice(field, number) {
  field.className = ''; // Reset the class
  field.classList.add('dice');
  field.innerHTML = ''; // Clear previous dots

  const dotPositions = [
    [],
    [{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }],
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

  const divEl = document.querySelector(`#${field.id}`);
  divEl.dataset.diceValue = number;

  dotPositions[number].forEach((pos) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    Object.assign(dot.style, pos);
    field.appendChild(dot);
  });
}
