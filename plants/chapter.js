'use strict';

const $ = id => document.getElementById(id);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[char]));
const link = (url, label) => {
  if (!/^https?:\/\//i.test(url || '')) return '';
  return '<a href="' + escapeHtml(url) + '">' + escapeHtml(label) + '</a>';
};
const links = list => list.filter(Boolean).join(' · ');
const plantLabel = plant => plant.id === 'LAG-320' ? 'Wart fern' : plant.common_name || plant.catalogue_name;

function switchView(buttonsId, render) {
  const choices = [...$(buttonsId).querySelectorAll('button')];
  function show(i) {
    choices.forEach((button, index) => button.setAttribute('aria-pressed', index === i));
    render(i);
  }
  choices.forEach((button, i) => button.addEventListener('click', () => show(i)));
  show(0);
}

switchView('water-stages', stage => {
  $('water-cuts').innerHTML = names.map((name, i) =>
    '<article><h3>' + name + '</h3>' + diagram(i, stage) + '<p>' + descriptions[i][stage] + '</p></article>'
  ).join('');
});
switchView('fall-stages', stage => {
  const labels = ['Steady level', 'Lowered in steps'];
  const notes = ['Keep this waterline steady for comparison.', stage ? 'Lower the water here. Check where soil stays damp and where new roots appear.' : 'Start at the same waterline with the same roots.'];
  $('fall-cuts').innerHTML = labels.map((name, i) => {
    const lower = stage === 1 && i === 1;
    const alt = name + (lower ? '. The waterline is lower. Root growth has yet to be measured.' : '. The waterline is at the starting level.');
    return '<article><h3>' + name + '</h3>' +
      diagram(1, 0, {level:lower ? 258 : 211, key:'fall'+i, showUptake:false, beforeLevel:lower ? 211 : null, alt}) + '<p>' + notes[i] + '</p></article>';
  }).join('');
});

$('balance-cut').innerHTML = diagram(1, 0, {
  key:'balance', showUptake:false,
  alt:'Cutaway showing a wart fern and damp soil inside the pot.'
});

function downloadCsv(filename, headers, rows) {
  const quote = value => {
    const text = String(value ?? '');
    const safe = typeof value !== 'number' && /^[\s]*[=+\-@]/.test(text) ? "'" + text : text;
    return '"' + safe.replaceAll('"','""') + '"';
  };
  const csv = [headers, ...rows].map(row => row.map(quote).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\ufeff',csv], {type:'text/csv;charset=utf-8'}));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const waterForm = $('water-log');
const readings = [];
const waterFields = ['added','drained','storage','evaporation'];
function waterEstimate() {
  const values = waterFields.map(name => waterForm.elements[name].valueAsNumber);
  const [added,drained,storage,evaporation] = values;
  if (!values.every(Number.isFinite) || [added,drained,evaporation].some(n => n < 0)) return null;
  return {values, estimate: added - drained - storage - evaporation};
}
const estimateText = new Intl.NumberFormat('en', {maximumFractionDigits:3});
waterForm.addEventListener('input', () => {
  const reading = waterEstimate();
  $('water-estimate').textContent = !reading ? 'Enter four readings to see the estimate.' :
    estimateText.format(reading.estimate) + ' mL estimated' +
    (reading.estimate < 0 ? '. Check readings, units and evaporation.' : '.');
});
waterForm.addEventListener('submit', event => {
  event.preventDefault();
  const reading = waterEstimate();
  if (!reading) return;
  readings.push([waterForm.elements.pot.value, waterForm.elements.interval.value, ...reading.values, reading.estimate]);
  $('water-count').textContent = readings.length + (readings.length === 1 ? ' reading' : ' readings') + ' in this session. Download to keep your log.';
});
$('export-water').addEventListener('click', () => {
  downloadCsv('fern-water-log.csv', ['pot_id','interval','added_ml','drainage_ml','storage_change_ml','estimated_evaporation_ml','estimated_fern_use_ml'], readings);
});

const sorted = inventory.plants.slice().sort((a,b) => plantLabel(a).localeCompare(plantLabel(b)));
const species = new Map(sorted.map(plant => [plant.id, plant]));
function picker(id, render) {
  const select = $(id);
  select.replaceChildren(...sorted.map(plant => new Option(plantLabel(plant) + ' · ' + plant.id, plant.id)));
  select.value = 'LAG-320';
  select.addEventListener('change', () => render(species.get(select.value)));
  render(species.get(select.value));
}
const dimensions = new Intl.NumberFormat('en', {maximumFractionDigits:1});
const cm = metre => Number.isFinite(metre) ? dimensions.format(metre*100) + ' cm' : 'Missing';
function traitSources(plant, ids) {
  return links(plant.catalogue_sources.filter(s => ids.includes(s.id)).map(s => link(s.url, s.title)));
}
const rootForm = $('root-form');
picker('size-species', plant => {
  rootForm.reset();
  const stages = plant.model_stages.map(stage => {
    const label = escapeHtml(stage.label);
    return '<article class="stage"><h3>' + label + '</h3><img loading="lazy" src="' + escapeHtml(stage.image) + '" alt="' + label + ' model of ' + escapeHtml(plantLabel(plant)) + '"><dl><dt>Across × front to back</dt><dd>' +
      cm(stage.width_x_m) + ' × ' + cm(stage.width_y_m) + '</dd><dt>Top above ' + escapeHtml(stage.datum || 'model datum') + '</dt><dd>' + cm(stage.top_from_datum_m) + '</dd></dl></article>';
  }).join('');
  const root = plant.root_architecture?.summary;
  $('size-view').innerHTML = '<p class="caption"><i>' + escapeHtml(plant.catalogue_name) + '</i> · Saved geometry. The three stages have no fixed calendar ages.</p><div class="cards three">' +
    stages + '</div><p><b>Live rootball width and depth</b> · Awaiting measurement.</p>' +
    '<details><summary>Model and root sources</summary><ul>' + plant.model_stages.map(stage => '<li>' + escapeHtml(stage.source_file) + ' · ' + escapeHtml(stage.source_scene) + '</li>').join('') +
    '</ul><p>' + escapeHtml(root || 'Root form evidence pending.') + '</p><p>' + links((plant.root_sources || []).slice(0,4).map(source => link(source.url, source.title))) + '</p></details>';
});
rootForm.addEventListener('submit', event => {
  event.preventDefault();
  const fields = ['specimen','date','height','width','canopyDepth','rootWidth','rootDepth','stem'];
  const record = fields.map(key => {
    const input = rootForm.elements[key];
    return input.type === 'number' && input.value !== '' ? input.valueAsNumber : input.value;
  });
  const id = $('size-species').value;
  downloadCsv(id+'-live-measurement.csv', ['plant_id','specimen_id','date','height_cm','width_cm','canopy_depth_cm','rootball_width_cm','rootball_depth_cm','creeping_stem_cm'], [[id,...record]]);
});
picker('trait-species', plant => {
  const claim = plant.original_claims.find(c => c.topic === 'Season and reproduction');
  const ferns = plant.category === 'Ferns';
  $('trait-view').innerHTML = '<h3>' + escapeHtml(plantLabel(plant)) + '</h3><p><b>Catalogue source note</b> · ' +
    escapeHtml(claim?.statement || 'Species-specific season or reproduction evidence pending.') +
    '</p><p><b>What to record here</b> · ' + (ferns ? 'Fertile fronds and spores.' : 'Flower, fruit or other seasonal stages where applicable.') +
    ' Record date and plant ID. Log shade, harvest and animal visits separately if observed.</p><p class="caption">No project measurements for these benefits in the evidence inventory.</p><p>' +
    traitSources(plant, claim?.source_ids ?? []) + '</p>';
});
picker('identity-species', plant => {
  const check = plant.checked_starter;
  const inherited = plant.inherited_identity || {};
  const local = plant.inherited_lagos_records || {};
  const name = check?.accepted_name || inherited.accepted_name || 'Pending';
  const nigeria = check ? (check.nigeria_native ? 'Native to Nigeria in Kew.' : 'Nigeria origin needs review.') : inherited.origin_status || 'Origin pending.';
  const sources = check ? link(check.source,'Kew name and origin') : traitSources(plant, inherited.source_ids ?? []);
  const localLinks = links((local.source_urls || []).map((url,i) => link(url,'Catalogue record '+(i+1))));
  $('identity-view').innerHTML = '<div class="identity"><img loading="lazy" src="' + escapeHtml(plant.thumbnail) + '" alt="Catalogue illustration of ' +
    escapeHtml(plantLabel(plant)) + '"><div><h3>' + escapeHtml(plantLabel(plant)) + '</h3><p class="caption">' + escapeHtml(plant.id) + ' · ' +
    (check ? 'Name and origin checked '+escapeHtml(check.checked_on) : 'Name and origin carried over from the catalogue') +
    '</p><dl class="evidence-steps"><div><dt>Accepted name recorded</dt><dd><i>' + escapeHtml(name) + '</i></dd></div><div><dt>Origin</dt><dd>' + escapeHtml(nigeria) +
    (sources ? ' ' + sources : '') + '</dd></div><div><dt>Lagos occurrence</dt><dd>' + escapeHtml(check?.local_claim || local.summary || 'Local occurrence pending.') +
    (check?.local_source ? ' ' + link(check.local_source,'Lagos field study') : '') +
    '</dd></div><div><dt>Current nursery stock</dt><dd>Awaiting dated confirmation.</dd></div></dl>' +
    (localLinks ? '<details><summary>Earlier catalogue records</summary><p>' + escapeHtml(local.summary) + '</p><p>' + localLinks + '</p></details>' : '') + '</div></div>';
});
