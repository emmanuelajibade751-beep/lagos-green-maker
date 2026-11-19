"use strict";
(() => {
  const byId = id => document.getElementById(id);
  const formatted = new Intl.NumberFormat("en-GB",{maximumFractionDigits:2});
  const format = n => formatted.format(n);
  const formatArea = new Intl.NumberFormat("en-GB",{maximumFractionDigits:3});
  const setText = (id,value) => {byId(id).textContent = value;};

  function choose(id, update) {
    const buttons = [...byId(id).querySelectorAll("button")];
    const select = index => {
      buttons.forEach((button,i) => button.setAttribute("aria-pressed", i === index));
      update(index);
    };
    buttons.forEach((button,i) => button.addEventListener("click",() => select(i)));
    select(0);
  }
  const fernNames = {wart:"Wart fern",sword:"Giant sword fern"};
  const treatment = (title, ferns) => `<figure><div class="e2-pot">${ferns.map(name =>
     `<img src="assets/e2-${name}.webp" alt="${fernNames[name]}">`).join("")}</div><figcaption>${title}</figcaption></figure>`;
  choose("e2-mode", index => {
    const mixed = treatment("One of each", ["wart","sword"]);
    const warts = treatment("Two wart ferns", ["wart","wart"]);
    const swords = treatment("Two sword ferns", ["sword","sword"]);
    const oneWart = treatment("One wart fern", ["wart"]);
    const oneSword = treatment("One sword fern", ["sword"]);
    byId("e2-treatments").innerHTML = index === 0 ?
      `<p><strong>Two plants in every holder.</strong> Compare the same species across neighbours.</p><div class="treatments three">${warts}${mixed}${swords}</div>` :
      `<p><strong>One plant versus two of the same species.</strong> Compare growth per fern.</p><div class="crowding"><div class="treatments two">${oneWart}${warts}</div><div class="treatments two">${oneSword}${swords}</div></div>`;
  });

  let shapeMode = 0;
  function updateShapes() {
    const depth = byId("e3-depth").valueAsNumber;
    const measure = byId(shapeMode === 0 ? "e3-volume" : "e3-area").valueAsNumber;
    const area = shapeMode === 0 ? measure/depth : measure;
    if (![depth,area].every(n=>Number.isFinite(n)&&n>0)) {
      setText("e3-summary","Enter positive values for a comparison.");
      byId("e3-shapes").replaceChildren();
      return;
    }
    const shapes = [["Round pot",1],["Rectangular planter",1.5],["Long trough",3]].map(([title,ratio],i) => {
      const circle = i===0;
      const fillArea = shapeMode===1 && circle ? area*Math.PI/4 : area;
      const width = circle ? Math.sqrt(4*fillArea/Math.PI) : Math.sqrt(fillArea/ratio);
      const length = width*ratio;
      const floor = shapeMode === 0 && circle ? 4*area/Math.PI : area;
      return {title,circle,width,length,floor,volume:fillArea*depth};
    });
    if(!shapes.every(s=>[s.floor,s.volume].every(Number.isFinite))){
      setText("e3-summary","Enter values within the calculator range.");
      byId("e3-shapes").replaceChildren();
      return;
    }
    const scale = 185/Math.max(...shapes.map(s=>s.length));
    byId("e3-shapes").innerHTML = shapes.map(s=>{
      const w=s.length*scale,h=s.width*scale,x=120-w/2,y=101-h/2;
      const outline=s.circle ? `<circle cx="120" cy="101" r="${w/2}" fill="#b3af91" stroke="#5a654e"/>` :
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#b3af91" stroke="#5a654e"/>`;
      return `<article><h3>${s.title}</h3><svg viewBox="0 0 240 202" role="img" aria-label="Plan outline of ${s.title}, drawn at the same scale"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#546c5d" stroke-dasharray="4 4"/>${outline}</svg><p><strong>${format(s.volume)} L soil</strong><br>${formatArea.format(s.floor)} m² reserved area<br><span class="caption">${s.circle?"Ø ":""}${format(s.length*1000)}${s.circle?"":" × "+format(s.width*1000)} mm inside</span></p></article>`;
    }).join("");
    setText("e3-summary",shapeMode===0 ? format(measure)+" L of soil in each. Compare the floor space and dimensions." :
      formatArea.format(measure)+" m² reserved for each. Compare how much soil fits inside.");
  }
  choose("e3-mode",index=>{
    shapeMode=index;
    byId("e3-volume-field").hidden=index!==0;
    byId("e3-area-field").hidden=index!==1;
    updateShapes();
  });
  for (const key of ["depth","volume","area"]) byId("e3-"+key).addEventListener("input", updateShapes);

  byId("e6-diagrams").innerHTML = ["Bare tray","Soil only","Wart fern + soil"].map((label,i) =>
    `<article><h3>${label}</h3><svg viewBox="0 0 240 168" role="img" aria-label="${label}, with rain above and an outflow collection cup">
      ${i===2?'<image href="../plants/chapter-assets/wart-fern.webp" x="83" y="38" width="70" height="57" preserveAspectRatio="xMidYMax meet"/>':""}
      <path d="M50 27v37m-5-7 5 7 5-7M104 16v22m-5-7 5 7 5-7M153 21v25m-5-7 5 7 5-7" fill="none" stroke="#4c8da1" stroke-width="2"/>
      <path d="M29 91v40h149v-40" fill="none" stroke="#4e6059" stroke-width="4"/>
      ${i>0?'<rect x="31" y="96" width="145" height="33" fill="#b3a487"/>':""}
      <path d="M175 123h21v17m-4-5 4 5 4-5" fill="none" stroke="#4c8da1" stroke-width="2"/>
      <path d="M184 143l3 19h19l3-19" fill="#dfeef0" stroke="#4c8da1" stroke-width="2"/>
     </svg><p class="caption">Same tray · Run from a dry and a wet start</p></article>`
  ).join("");

  function downloadCsv(name, headers, rows) {
    function quote(value) {
      const text=String(value ?? "");
      const safe=typeof value !== "number"&&/^\s*[=+\-@]/.test(text) ? "'"+text : text;
      return '"'+safe.replaceAll('"','""')+'"';
    }
    const csv=[headers,...rows].map(row=>row.map(quote).join(",")).join("\r\n");
    const url=URL.createObjectURL(new Blob(["\ufeff",csv],{type:"text/csv;charset=utf-8"}));
    const a=document.createElement("a");
    a.href=url;
    a.download=name;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  const rainForm=byId("e6-form");
  const rainRows=[];
  function rainReading(){
    const f=rainForm.elements;
    const area=f.area.valueAsNumber;
    const rain=f.rain.valueAsNumber;
    const outflow=f.outflow.valueAsNumber;
    const input=area*rain;
    if(![input,outflow].every(Number.isFinite)||area<=0||rain<0||outflow<0){
      setText("e6-result","Enter valid rain depth, tray area and outflow.");
      return null;
    }
    const difference=input-outflow;
    const compare=difference<0 ? "Outflow exceeds new rain by "+format(-difference)+" L. Check starting storage, collection and inputs." :
      format(difference)+" L of input uncollected at the reading.";
    setText("e6-result",format(input)+" L rain input · "+compare);
    return [f.run.value,f.treatment.value,f.start.value,area,rain,outflow,f.window.valueAsNumber,
      f.peak.value==="" ? "" : f.peak.valueAsNumber,input,difference];
  }
  rainForm.addEventListener("input",()=>{
    const f=rainForm.elements;
    f.peak.setCustomValidity(f.peak.valueAsNumber>f.window.valueAsNumber?"Peak time must be within the observation window.":"");
    rainReading();
  });
  rainForm.addEventListener("submit",event=>{
    event.preventDefault();
    const reading=rainReading();
    if(!reading) return;
    rainRows.push(reading);
    setText("e6-count",rainRows.length+" runs in this session. Download the log to keep it.");
  });
  byId("e6-export").addEventListener("click",()=>downloadCsv("planter-runoff-log.csv",
    ["run","tray_condition","starting_wetness","area_m2","rain_mm","drain_plus_overflow_l","window_min_from_rain_start","peak_min","rain_input_l","input_less_outflow_l"],rainRows));

  const accessForm=byId("e7-form");
  const accessRows=[];
  accessForm.addEventListener("submit",event=>{
    event.preventDefault();
    const names=["run","task","reach","time","empty","drained","wet","notes"];
    const row=names.map(name=>{
      const field=accessForm.elements[name];
      return field.type==="number"&&field.value!==""?field.valueAsNumber:field.value;
    });
    accessRows.push(row);
    setText("e7-count",accessRows.length+" checks in this session. Download the log to keep it.");
  });
  byId("e7-export").addEventListener("click",()=>downloadCsv("planter-access-log.csv",
    ["mockup","task","reach_cm","elapsed_min","empty_kg","drained_kg","fully_wet_kg","tools_and_wet_notes"],accessRows));

  byId("e8-paths").innerHTML = [false,true].map(wick=>{
    const title=wick?"Wick from below":"Water from above";
    const path=wick?'<rect x="48" y="125" width="144" height="30" fill="#a5d0d8" stroke="#577b85"/><path d="M102 147q18-9 18-28V80m-5 8 5-8 5 8" fill="none" stroke="#287d99" stroke-width="3"/><path d="M192 138h27m-7-5 7 5-7 5" fill="none" stroke="#287d99" stroke-width="2"/>' :
      '<path d="M46 22l19 43m-7-5 7 5 1-9M120 119v30m-5-7 5 7 5-7" fill="none" stroke="#287d99" stroke-width="3"/>';
    return `<article><h3>${title}</h3><svg viewBox="0 0 240 168" role="img" aria-label="${wick?"Water rises from tank through wick. Outlet shows an overflow.":"Water enters mix at the top. Excess drains out at the base."}">
      <image href="../plants/chapter-assets/wart-fern.webp" x="82" y="9" width="71" height="62" preserveAspectRatio="xMidYMax meet"/>
      <path d="M46 67v58h148V67" fill="none" stroke="#5d675d" stroke-width="4"/><rect x="48" y="70" width="144" height="53" fill="#baa787"/>
      <path d="M114 70q-12 7-16 24m16-24q18 7 22 26m-22-26q3 12-2 31" fill="none" stroke="#776049" stroke-width="2"/>
      ${path}</svg><p><strong>${wick?"Tank → wick → mix":"Watering can → mix → drain"}</strong><br>${wick?"Measure what the wick delivers. Check overflow separately.":"Match the target wetness. Record water added and excess drained."}</p></article>`;
  }).join("");
  const supplyForm=byId("e8-form");
  supplyForm.addEventListener("submit",event=>event.preventDefault());
  supplyForm.addEventListener("input",()=>{
    const f=supplyForm.elements;
    const demand=f.demand.valueAsNumber;
    const days=f.days.valueAsNumber;
    const usable=f.usable.valueAsNumber;
    const trial=demand*days;
    if(![demand,days,trial].every(Number.isFinite)||demand<=0||days<=0){
      setText("e8-result","Enter positive measured demand and a trial refill gap.");
      return;
    }
    if(f.usable.value!=="" && (!Number.isFinite(usable)||usable<0)){
      setText("e8-result","Enter a non-negative usable reservoir volume, or leave it blank.");
      return;
    }
    const availability=Number.isFinite(usable)&&usable>=0 ?
      (usable<trial ? " · "+format(trial-usable)+" L short of the quantity target." :
      " · Usable volume meets the quantity target. Wick delivery still needs testing.") : "";
    setText("e8-result",format(trial)+" L estimated supply for this trial gap"+(availability||"."));
  });
})();
