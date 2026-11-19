"use strict";

const e1Form = document.querySelector("#e1-form");
const e1Number = new Intl.NumberFormat("en-GB", {maximumFractionDigits:2});
const e1DensityNumber = new Intl.NumberFormat("en-GB", {minimumFractionDigits:2,maximumFractionDigits:4});
const e1Set = (id, text) => { document.getElementById("e1-"+id).textContent = text; };
const e1Label = (number, unit) => e1Number.format(number)+" "+unit;

function updateDepthComparison() {
  const fields = e1Form.elements;
  const [length,width,shallow,deep,density] = ["length","width","shallow","deep","density"]
    .map(name => fields.namedItem(name).valueAsNumber);
  const valid = [length,width,shallow,deep,density].every(value => Number.isFinite(value) && value > 0);
  const ordered = shallow < deep;
  const shallowLitres = length * width * shallow / 1e6;
  const deepLitres = length * width * deep / 1e6;
  const finite = [shallowLitres,deepLitres,shallowLitres*density,deepLitres*density].every(Number.isFinite);
  const ready = valid && ordered && finite;

  for (const [key,depth,litres] of [["shallow",shallow,shallowLitres],["deep",deep,deepLitres]]) {
    const other = fields.namedItem(key+"Other");
    const supplied = other.value !== "";
    const validOther = supplied && other.validity.valid && Number.isFinite(other.valueAsNumber);
    const total = litres*density + other.valueAsNumber;
    e1Set(key+"-depth",ready ? e1Label(depth,"mm") : "—");
    e1Set(key+"-litres",ready ? e1Label(litres,"L") : "—");
    e1Set(key+"-mass",ready ? e1Label(litres*density,"kg") : "—");
    e1Set(key+"-total", !ready ? "Total pending valid dimensions." :
      !supplied ? "Holder, plant and support still to weigh." :
      validOther && Number.isFinite(total) ? e1Label(total,"kg")+" estimated total with entered parts." :
      "Use a non-negative mass for the other parts.");
  }
  if (!ready) {
    const error = valid && !ordered ? "Enter a deep fill depth greater than the shallow fill depth." :
      "Enter positive dimensions and density within the calculator's numeric range.";
    e1Set("error",error);
    e1Set("savings","Comparison pending");
    e1Set("scope",error);
    return;
  }
  e1Set("error","");
  const volumeGap = deepLitres-shallowLitres;
  e1Set("savings",e1Label(volumeGap,"L")+" less soil · "+e1Label(volumeGap*density,"kg")+" less drained-wet mix");
  e1Set("scope","Example only · "+e1Number.format(length)+" × "+e1Label(width,"mm")+
    " inside both planters · "+e1DensityNumber.format(density)+" kg/L drained-wet bulk density.");
}

e1Form.addEventListener("input", updateDepthComparison);
e1Form.addEventListener("reset", () => requestAnimationFrame(updateDepthComparison));
e1Form.addEventListener("submit", event => event.preventDefault());
updateDepthComparison();
