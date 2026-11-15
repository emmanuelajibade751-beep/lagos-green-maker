(function () {
  'use strict';
  const safe = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const numeric = value => value === null || value === undefined ? '—' : Number(value).toLocaleString('en-GB', {maximumFractionDigits:5});
  const rankSets = [
    ['bare_irradiation','minimum','Least exposure · Bare + 14D'],
    ['bare_irradiation','maximum','Most exposure · Bare + 14D'],
    ['checkerboard_irradiation','minimum','Least exposure · Checkerboard + 14D'],
    ['checkerboard_irradiation','maximum','Most exposure · Checkerboard + 14D'],
    ['irradiation_removed','maximum','Greatest reduction · bare minus checkerboard'],
    ['irradiation_removed','minimum','Least reduction · bare minus checkerboard']
  ];
  function jumpButton(id, label) {
    return '<button type="button" data-solar-voxel="'+safe(id)+'">'+safe(label || id)+'</button>';
  }
  function tableRow(label, values) {
    return '<tr><th scope="row" style="text-align:left;padding:6px 10px 6px 0">'+label+'</th>'+values.map(v=>'<td style="text-align:right;padding:6px">'+v+'</td>').join('')+'</tr>';
  }
  window.renderTowerSolar = function (id, element) {
    const data = window.TOWER_SOLAR;
    if (!element) return;
    if (!data) { element.textContent='Solar baseline data unavailable.'; return; }
    const voxel = data.voxels[id];
    if (!voxel) { element.textContent='Unknown voxel ID.'; return; }
    const [bareSun,bareEnergy,balconySun,balconyEnergy,sunRemoved,energyRemoved] = voxel.baseline;
    const ranks = data.exposure_ranks[id];
    let html='<section class="tower-solar"><h4 style="margin:0 0 8px">Unplanted architectural baseline · '+safe(id)+'</h4>';
    html+='<p class="note">'+(voxel.exposed_m2 ? numeric(voxel.exposed_m2)+' m² sampled exterior area · '+safe(Object.keys(voxel.faces).join(', ')) : '<strong>No sampled exterior face</strong>')+'</p>';
    html+='<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><caption style="text-align:left;padding-bottom:6px">Annual mean across this voxel’s sampled exterior faces</caption><thead><tr><th scope="col" style="text-align:left">Metric</th><th scope="col">Bare + 14D</th><th scope="col">Checkerboard + 14D</th><th scope="col">Bare minus checkerboard</th></tr></thead><tbody>';
    html+=tableRow('Incident irradiation<br><small>kWh/m²/year</small>',[bareEnergy,balconyEnergy,energyRemoved].map(numeric));
    html+=tableRow('Geometric direct sun<br><small>h/year</small>',[bareSun,balconySun,sunRemoved].map(numeric));
    html+=tableRow('Exposure rank<br><small>1 = most exposed; of 736</small>',[ranks ? numeric(ranks.bare) : 'Not ranked',ranks ? numeric(ranks.checkerboard) : 'Not ranked','—']);
    html+='</tbody></table></div><p class="note">Planted scenarios: <strong>Use Greened tower solar analysis above.</strong> These architectural results stay unchanged when species or growth stage changes. Solar exposure is not temperature or thermal comfort.</p>';
    const related=[...new Set([...voxel.balcony_entry,...voxel.balcony_below])];
    if(related.length) html+='<details><summary>Linked balconies · entry and below slab</summary>'+related.map(key=>{const balcony=data.balconies[key];return '<p class="note">'+safe(key)+' · '+safe(balcony.face)+' face, bay '+safe(balcony.bay)+'<br>'+jumpButton(balcony.entry_voxel,'At entry · '+balcony.entry_voxel)+' '+jumpButton(balcony.below_voxel,'Below slab · '+balcony.below_voxel)+'</p>';}).join('')+'</details>';
    html+='<details class="solar-face-details"><summary>Face results and sensor IDs</summary>';
    if (!voxel.exposed_m2) html+='<p class="note">No sampled exterior face. Null metrics mean unavailable, not zero exposure.</p>';
    for (const [face,record] of Object.entries(voxel.faces)) {
      html+='<p class="note"><strong>'+safe(face)+'</strong> · '+numeric(record.area_m2)+' m² · sensor IDs '+record.sensors.map(safe).join(', ')+'<br>Incident irradiation: '+numeric(record.baseline[1])+' → '+numeric(record.baseline[3])+' kWh/m²/year. Direct sun: '+numeric(record.baseline[0])+' → '+numeric(record.baseline[2])+' h/year (bare → checkerboard).</p>';
    }
    html+='</details><details class="solar-rank-details"><summary>Find most and least solar exposure · all ties</summary><p class="note">Mean annual incident irradiation per m²; 736 exposed voxels. Ties within 0.0001 kWh/m²/year. Order within ties: level, then voxel number.</p>';
    rankSets.forEach(([key,kind,label],i)=>{
      const rank=data.rankings[key],ids=rank[kind+'_ids'];
      html+='<div class="solar-rank-set" style="margin:10px 0"><label style="display:block">'+safe(label)+' · '+ids.length+' voxel'+(ids.length===1?'':'s')+' · '+numeric(rank[kind])+' kWh/m²/year<br><select data-solar-rank="'+i+'" style="max-width:100%" aria-label="'+safe(label)+'">'+ids.map(voxelId=>'<option value="'+safe(voxelId)+'">'+safe(voxelId)+'</option>').join('')+'</select></label><button type="button" data-solar-go="'+i+'">Show selected voxel</button><details><summary>All '+ids.length+' matching IDs</summary><div style="display:flex;flex-wrap:wrap;gap:5px;margin:8px 0">'+ids.map(voxelId=>jumpButton(voxelId)).join('')+'</div></details></div>';
    });
    html+='</details><details><summary>Method and source</summary><p class="note">Both cases include the same 64 schematic 14D context buildings. Checkerboard adds 384 unplanted balconies. Annual irradiation uses the Lagos–Ikeja PVGIS 5.3 typical year (2005–2023 source period), annual Tregenza sky and zero ground reflectance. Geometric direct sun uses half-hour midpoint samples in WAT (UTC+1). Four sensors sample each 16 m² exterior face; voxel means are area-weighted. Balcony decks and internal/contact faces are not receivers.</p><p class="note" style="overflow-wrap:anywhere">Audited result join SHA-256: '+safe(data.browser_provenance.join_sha256)+'</p></details></section>';
    element.innerHTML=html;
    // Assigning replaces the previous handler when the selected voxel changes.
    element.onclick = event => {
      const direct=event.target.closest('[data-solar-voxel]');
      const go=event.target.closest('[data-solar-go]');
      let next=direct?.dataset.solarVoxel;
      if(go) next=element.querySelector('[data-solar-rank="'+go.dataset.solarGo+'"]').value;
      if(next && data.voxels[next]) element.dispatchEvent(new CustomEvent('tower-voxel-jump',{bubbles:true,detail:{id:next}}));
    };
  };
})();
