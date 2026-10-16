export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

//B1---depending on the direction we're facing, we can increase or decraese x / y by 1, dx and dy for "difference" from the local coordinate.
const directions: DirectionRecord[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

//rover defaults to (2,2)
let x = 2;
let y = 2;
let direction = 0;

type Command = {
  label: string;
  execute: () => void;
};

const commandQueue: Command[] = [];

type DirectionRecord = {
  name: string;
  dx: number;
  dy: number;
};

//B3---now each of them holds a label so queueing up commands becomes easier to understand, logic is unchanged.
const rightCommand: Command = {
  label: "Right",
  execute: () => {
    direction = (direction + 1) % directions.length;
    drawRover();
  },
};

const forwardCommand: Command = {
  label: "Forward",
  execute: () => {
    const currentDirection = directions[direction];

    x = Math.max(0, Math.min(4, x + currentDirection.dx));
    y = Math.max(0, Math.min(4, y + currentDirection.dy));

    drawRover();
  },
};

function enqueueCommand(command: Command) {
  commandQueue.push(command);
  renderQueue();
}

//B3---uses clearChildren to rebuild the list, and create a list item for each command to add them to webpage
function renderQueue() {
  const queueList = document.querySelector<HTMLOListElement>("#rover-pending")!;

  queueList.replaceChildren();

  for (const command of commandQueue) {
    const item = document.createElement("li");
    item.textContent = command.label;
    queueList.appendChild(item);
  }
}

//B3--- rover run and clear
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  while (commandQueue.length > 0) {
    const command = commandQueue.shift()!;
    command.execute();
  }

  renderQueue();
};

document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  commandQueue.length = 0;

  renderQueue();
};

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";

  //outer loop chooses rows, and for each row draws a column from there
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      //each squares is 56 pixels wide
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();

  //this calcualtes the center of the square the rover is currently in.
  //Math: 38 comes from 10+28, so this is the center of ONE SINGLE SQUARE, then we add x * 56 and y * 56 to see what square we want to land on.
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16); //numbers are relative to the origin rover moved to, so it's small number
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name //B2---name is now part of the direction itself
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueueCommand(forwardCommand);
};

document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueueCommand(rightCommand);
};

document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  drawRover();
};

drawRover();
