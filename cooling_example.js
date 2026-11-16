(function(){
 'use strict';
 const assumptions=Object.freeze({exterior_area_m2:13824,assumed_heat_entry_fraction:0.10,assumed_cop:3,reference_electrical_draw_kw:1.5,reference_hours_per_day:8,reference_days_per_year:365});
 const escape=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const number=(v,d=2)=>v.toLocaleString('en-GB',{maximumFractionDigits:d});
 function compute(annual){
  if(!Number.isFinite(annual)||annual<0)return null;
  const incident=annual*assumptions.exterior_area_m2,heat=incident*assumptions.assumed_heat_entry_fraction,electricity=heat/assumptions.assumed_cop,unit=assumptions.reference_electrical_draw_kw*assumptions.reference_hours_per_day*assumptions.reference_days_per_year;
  return{annual_kwh_m2:annual,incident_kwh_year:incident,assumed_solar_heat_kwh_year:heat,illustrative_kwh_year:electricity,reference_ac_kwh_year:unit,reference_ac_years:electricity/unit};
 }
 function box(annual,label='Whole tower'){
  const v=compute(annual);if(!v)return '';
  return '<aside class="cooling-example" aria-label="Illustrative solar-related cooling electricity — '+escape(label)+'" data-cooling-annual="'+annual+'" data-cooling-electricity="'+v.illustrative_kwh_year+'" data-cooling-ac="'+v.reference_ac_years+'"><p class="cooling-kicker">Cooling example &middot; sunlight only</p><p class="cooling-case">'+escape(label)+'</p><p class="cooling-equivalence">Same annual electricity as</p><strong class="cooling-ac">&asymp;'+number(Math.round(v.reference_ac_years),0)+' reference ACs</strong><p class="cooling-electricity">&asymp;'+number(Math.round(v.illustrative_kwh_year/1000)*1000,0)+' kWh/year</p><p class="cooling-assumptions">1.5 kW electrical draw &middot; 8 h/day<br>Assumed 10% heat entry &middot; COP 3</p></aside>';
 }
 function method(cases=[]){
  return '<details class="cooling-method"><summary>How we estimated it</summary><p><strong>Illustrative solar-related cooling electricity, not AC sizing.</strong> This example assumes 10% of sunlight arriving at the sampled walls and roof enters conditioned space as heat. That transfer has not been measured or thermally modelled. It assumes an AC coefficient of performance (COP) of 3: 3 kWh of heat removed per kWh of electricity.</p><p>Annual sunlight (kWh/m&sup2;/year) &times; 13,824 m&sup2; &times; 10% &divide; 3 = illustrative annual electricity (kWh/year). The same assumptions apply to every case. We use annual solar energy even when the map shows direct-sun hours.</p><p>One reference AC draws <strong>1.5 kW of electricity</strong> for 8 hours every day at that draw, for 365 days: <strong>4,380 kWh/year</strong>. Dividing the example electricity by 4,380 gives ACs&rsquo; worth of yearly electricity, not a number of units to install. Visible figures round to whole AC equivalents and the nearest 1,000 kWh.</p>'+cases.filter(c=>compute(c.annual)).map(c=>{const v=compute(c.annual);return '<p><strong>'+escape(c.label)+':</strong> '+number(v.annual_kwh_m2,6)+' kWh/m&sup2;/year &rarr; '+number(v.illustrative_kwh_year,4)+' kWh/year; '+number(v.reference_ac_years,6)+' reference AC-years.</p>';}).join('')+'<p>Other building heat gains, humidity control, peak loads, operating schedules, glazing and ventilation are not modelled here. These figures do not establish indoor temperature, total cooling demand, actual electricity use, costs or savings. <a href="https://bsesc.energy.gov/energy-basics/hvac-proper-sizing-hvac-systems">Actual HVAC sizing requires load calculations — U.S. Department of Energy</a>.</p><p><a href="homepage/cooling_examples.json">Exact examples and assumptions for all 300 plant stages</a> &middot; <a href="release_evidence/tower_comparison_summary.json">Verified sunlight inputs</a></p></details>';
 }
 function group(cases){return '<div class="cooling-group">'+cases.map(c=>box(c.annual,c.label)).join('')+'</div>'+method(cases);}
 let registry;
 function load(){return registry||(registry=fetch('homepage/cooling_examples.json').then(r=>{if(!r.ok)throw Error('Cooling examples unavailable');return r.json();}));}
 function annualMeans(data){const rows=Object.values(data.voxels).filter(r=>r.m2>0),area=rows.reduce((s,r)=>s+r.m2,0);if(area!==13824||rows.some(r=>![r.values[3],r.values[4]].every(Number.isFinite)))return null;return [3,4].map(k=>rows.reduce((s,r)=>s+r.m2*r.values[k],0)/area);}
 window.COOLING_EXAMPLE={assumptions,compute,box,method,group,load,annualMeans};
})();
