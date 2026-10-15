export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let peopleAssignToProd = 2;

//------------------------- Following is the main update function:
function update() {
  const { totalSupply: totalSupplyProduced, supplyBalance } =
    calculateSupplyBalance();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPeopleAllocation();
  drawSupplyTotals(totalSupplyProduced);
  updateAllocationReadout(totalSupplyProduced, supplyBalance);
}

//------------------------- Following are helper functions extracted:
function calculateSupplyBalance() {
  const totalSupply = peopleAssignToProd * 3;
  const supplyBalance = totalSupply - 6;
  return { totalSupply, supplyBalance };
}

function drawPeopleAllocation() {
  for (let personIndex = 0; personIndex < 6; personIndex++) {
    const contributesToProduction = personIndex < peopleAssignToProd;

    ctx.fillStyle = contributesToProduction ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + personIndex * 45, 16, 36, 36);

    ctx.fillStyle = contributesToProduction ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(personIndex + 1), 31 + personIndex * 45, 40);
  }
}

function drawSupplyTotals(totalSupplyProduced: number) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(
    `People assigned to production: ${peopleAssignToProd} / 6`,
    18,
    76,
  );
  ctx.fillText(`Supply produced: ${totalSupplyProduced}`, 18, 102);

  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, totalSupplyProduced * 14, 20);

  ctx.fillStyle = "#233e43";
  ctx.fillText(`Supply consumption: ${6}`, 18, 154);

  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, 6 * 14, 20);
}

function updateAllocationReadout(
  totalSupplyProduced: number,
  supplyBalance: number,
) {
  const balanceSign = supplyBalance > 0 ? "+" : "";

  readout.textContent =
    `People assigned to production: ${peopleAssignToProd}/6 · ` +
    `Supply produced: ${totalSupplyProduced} · ` +
    `Supply consumption: ${6} · ` +
    `Supply balance: ${balanceSign}${supplyBalance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  peopleAssignToProd = Math.max(0, peopleAssignToProd - 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  peopleAssignToProd = Math.min(6, peopleAssignToProd + 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    peopleAssignToProd = 2;
    update();
  };
update();
