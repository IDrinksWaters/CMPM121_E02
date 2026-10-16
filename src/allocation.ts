export {};

// ! tells ts assume element exist
const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const drawingContext = canvas.getContext("2d")!;
const allocationReadout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

const totalPeople = 6;
const suppliesPerProducer = 3;
const supplyConsumption = 6;
let peopleAssignedToProduction = 2;

//make sure the structure of the result all have type of number
type ShiftResults = {
  peopleAssignedToProduction: number;
  totalPeople: number;
  totalSupplyProduced: number;
  supplyConsumption: number;
  supplyBalance: number;
};

//new type use for displays

type SupplyDisplayRecord = {
  label: string;
  value: number;
  color: string;
};

//calculate the results of a shift based on the number of people assigned to production (not drawing anything yet)
function calculateShiftResults(assignedPeople: number): ShiftResults {
  const totalSupplyProduced = assignedPeople * suppliesPerProducer;
  const supplyBalance = totalSupplyProduced - supplyConsumption;

  return {
    peopleAssignedToProduction: assignedPeople,
    totalPeople,
    totalSupplyProduced,
    supplyConsumption,
    supplyBalance,
  };
}

//draws people assign to production on canvas
function drawPeopleAllocation(results: ShiftResults) {
  for (let personIndex = 0; personIndex < results.totalPeople; personIndex++) {
    const contributesToProduction =

      // calculates how many people are contributing to the production by accessing number of people that are assigned in results
      personIndex < results.peopleAssignedToProduction;

    //---------IMPORTANT, ? means true or false -> arg ? (if true) : (if false)
    drawingContext.fillStyle = contributesToProduction ? "#27766b" : "#c9d2c9";
    drawingContext.fillRect(18 + personIndex * 45, 16, 36, 36);

    drawingContext.fillStyle = contributesToProduction ? "#ffffff" : "#233e43";
    drawingContext.font = "16px system-ui";
    drawingContext.fillText(String(personIndex + 1), 31 + personIndex * 45, 40);
  }
}

//displays info about how many people produced supply, how much supply was produced / consumed
function drawSupplyTotals(results: ShiftResults) {
  drawingContext.fillStyle = "#233e43";
  drawingContext.font = "14px system-ui";
  drawingContext.fillText(
    `People assigned to production: ${results.peopleAssignedToProduction} / ${results.totalPeople}`,
    18,
    76,
  );
  drawingContext.font = "14px system-ui";

  // FOR A3--------- > now instead of two separate renderers for supply produced and consumed, use supplyDisplays to do the work
  const supplyDisplays: SupplyDisplayRecord[] = [
    {
      label: "Supply produced",
      value: results.totalSupplyProduced,
      color: "#27766b",
    },
    {
      label: "Supply consumption",
      value: results.supplyConsumption,
      color: "#a44d23",
    },
  ];

  for (let index = 0; index < supplyDisplays.length; index++) {
    const display = supplyDisplays[index];

    const labelY = 102 + index * 52;
    const barY = labelY + 8;

    drawingContext.fillStyle = "#233e43";
    drawingContext.fillText(
      `${display.label}: ${display.value}`,
      18,
      labelY,
    );

    drawingContext.fillStyle = display.color;
    drawingContext.fillRect(
      18,
      barY,
      display.value * 14,
      20,
    );
  }
}

//(DOM renderer) presents the same calculated results as text
function updateAllocationReadout(results: ShiftResults) {
  const balanceSign = results.supplyBalance > 0 ? "+" : "";

  allocationReadout.textContent =
    `People assigned to production: ${results.peopleAssignedToProduction}/${results.totalPeople} · ` +
    `Supply produced: ${results.totalSupplyProduced} · ` +
    `Supply consumption: ${results.supplyConsumption} · ` +
    `Supply balance: ${balanceSign}${results.supplyBalance}`;
}

// CALCUALTES, CLEARS AND DRAWS THE TEXT
function renderAllocation() {
  const results = calculateShiftResults(peopleAssignedToProduction);

  // clear alwys comes first
  drawingContext.clearRect(0, 0, canvas.width, canvas.height);
  drawPeopleAllocation(results);
  drawSupplyTotals(results);
  updateAllocationReadout(results);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  peopleAssignedToProduction = Math.max(0, peopleAssignedToProduction - 1);
  renderAllocation();
};

document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  peopleAssignedToProduction = Math.min(
    totalPeople,
    peopleAssignedToProduction + 1,
  );
  renderAllocation();
};

document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    peopleAssignedToProduction = 2;
    renderAllocation();
  };

renderAllocation();
