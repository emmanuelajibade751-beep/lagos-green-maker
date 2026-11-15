function showTowerPreview(plant) {
  return '<section class="tower-preview">'+window.towerChoicesHeader()+showWholeTowerRenders(plant)+showTowerFit(plant)+showWallComparison(plant)+showPairedShade(plant)+'<details class="plant-solar-panel"><summary>Plant solar analysis · stage and scope</summary>'+window.showPlantSolar(plant)+'</details><details class="tower-baseline" open><summary>Interactive numbered tower & solar baseline</summary><div class="tower-intro"><h3>Explore the solar-study tower.</h3>' +
    '<p class="note">The unplanted architectural baseline, with numbered cells and verified solar exposure. Select a species to keep its approved balcony study and placement guidance alongside the baseline.</p></div>' +
    '<div class="tower-toolbar"><label>Species <select id="tower-species" aria-label="Tower species">' +
    [...plants].sort(byName).map(p => '<option value="' + p.id + '"' + (p.id === plant.id ? ' selected' : '') + '>' + escape(p.name) + '</option>').join('') +
     '</select></label><div class="tower-views" role="group" aria-label="Camera view"><button data-camera="tower">Tower</button><button data-camera="balcony">Balcony detail</button><button data-camera="context">Neighbourhood</button></div></div>' +
    '<div class="tower-canvas" id="tower-canvas" role="img" aria-label="Interactive tower visualization of ' + escape(plant.name) + '"><p class="tower-loading" role="status">Preparing the tower…</p></div>' +
    '<div class="tower-toolbar"><span class="note">Drag to orbit · scroll or pinch to zoom</span><div class="tower-views"><button id="tower-rotate">Rotate 45°</button><label><input id="tower-context" type="checkbox" checked> Buildings</label></div></div>' +
    '<p id="tower-status" class="note" role="status"></p><p id="tower-fit" class="tower-fit"></p>' +
    '<details class="voxel-inspector"><summary>Inspect a numbered voxel</summary><div class="tower-toolbar"><label>Voxel ID <input id="tower-voxel" list="tower-voxel-ids" placeholder="e.g. 2b" autocomplete="off"></label><datalist id="tower-voxel-ids"></datalist><div class="tower-views"><button id="tower-spotlight">Spotlight voxel</button><button id="tower-clear-voxel">Clear selection</button></div></div><p id="tower-voxel-info" class="note" role="status">Select an original 4 m cell to locate it on the tower.</p><div id="tower-solar"></div></details>' +
    '<details><summary>Selected species balcony study</summary>' + showBalconyStudies(plant) + '</details><details><summary>Model provenance and limits</summary><p class="note">32 × 32 × 100 m tower · 1,600 original 4 m cells · 384 checkerboard balconies · 64 schematic neighbourhood buildings. Metres; model north assumed. The architectural solar run contains no trees or planting.</p>' +
    '<p class="note">The source plant models have not been changed. The tower shown here is unplanted. Species-specific planted solar results are available through the solar choices above. Root capacity, structural load, access, exposure and long-term suitability still require review.</p>' +
    '<p class="note" id="tower-source"></p><p><a href="tower_preview/host_validation.json" target="_blank" rel="noopener">Host geometry checks</a></p></details></details></section>';
}
window.mountTowerPreview = async function(plant) {
  const target = document.querySelector('#tower-canvas');
  if (!target) return;
  window.mountPlantSolar(plant);
  document.querySelector('#tower-species').addEventListener('change', event => openPlant(event.target.value, 'tower'));
  document.querySelector('#tower-layout')?.addEventListener('change', event => {window.towerSilverLayout=event.target.value;openPlant(plant.id,'tower');});
  try {
    const module = await import('./tower_preview/viewer.js');
    if (!target.isConnected) return;
    await module.mount(target, plant);
    if(target.isConnected)window.mountTowerChoices(plant);
  } catch (error) {
    if (target.isConnected) target.textContent = 'The 3D preview could not load. Open the hosted catalogue in a browser with WebGL enabled, then retry. ' + error.message;
  }
};
