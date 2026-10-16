export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const headings = ["North", "East", "South", "West"];

//rover defaults to (2,2)
let x = 2;
let y = 2;
let direction = 0;

//A1---defines what a command must look like, for directions
type Command = {
  execute: () => void;
};

//A1---same command but for turning right
const rightCommand: Command = {
  execute: () => {
    direction = (direction + 1) % 4;
    drawRover();
  },
};

const forwardCommand: Command = {
  execute: () => {
    // coordinate is not the same in math, up is -1 for y and x is the same. Top left is the origin.
    if (direction === 0) y = Math.max(0, y - 1);
    if (direction === 1) x = Math.min(4, x + 1);
    if (direction === 2) y = Math.min(4, y + 1);
    if (direction === 3) x = Math.max(0, x - 1);

    drawRover();
  },
};

//A1---now we use invokeCommand to invoke forward and right command, as it checks for type Command and make sure it fits the data structure.
function invokeCommand(command: Command) {
  command.execute();
}

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
    headings[direction]
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  invokeCommand(forwardCommand);
};

document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  invokeCommand(rightCommand);
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  drawRover();
};
drawRover();
