(function () {
  'use strict';
  const appBase = new URL('.', document.currentScript?.src || location.href);
  const stages = ['establishment','intermediate','developed'];
  const label = value => value.charAt(0).toUpperCase()+value.slice(1);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number = value => value === null || value === undefined ? '—' : Number(value).toLocaleString('en-GB',{maximumFractionDigits:4});
  const state = {stage:'establishment',scope:'whole_tower'};
  let indexLoad;
  function ensureIndex() {
    if (window.PLANT_SOLAR_INDEX) return Promise.resolve(window.PLANT_SOLAR_INDEX);
    if (!indexLoad) indexLoad = new Promise((resolve,reject) => {
      const script=document.createElement('script');script.src=new URL('plant_solar_data/index.js',appBase);
      script.onload=()=>window.PLANT_SOLAR_INDEX ? resolve(window.PLANT_SOLAR_INDEX) : reject(new Error('Solar snapshot missing'));
      script.onerror=()=>reject(new Error('Solar snapshot could not load'));document.head.append(script);
    }).catch(error=>{indexLoad=null;throw error;});
    return indexLoad;
  }
  const cache=new Map();
  async function fetchData(url) {
    if(cache.has(url))return cache.get(url);
    const response=await fetch(new URL(url,appBase));if(!response.ok)throw new Error('Solar result could not load');
    const result=await response.json();cache.set(url,result);
    if(cache.size>4)cache.delete(cache.keys().next().value);
    return result;
  }
  function metrics(values, caption) {
    const plainCaption=caption.includes('mean of 16 deck probes')?'Balcony floor at this test position':caption.startsWith('Whole-tower case')?'Outside faces of block '+caption.split(' · ')[1]:caption;
    let plain='This area has no sampled exterior surface, so there is no sunlight result to compare.';
    if(Number.isFinite(values[3]) && values[3]>0 && Number.isFinite(values[4])) {
      const percent=100*(values[3]-values[4])/values[3];
      plain=Math.abs(percent)<0.5?'About the same amount of the sun’s energy reaches this sampled area over the modelled year.':'About '+Math.round(Math.abs(percent))+'% '+(percent>=0?'less':'more')+' of the sun’s energy reaches this sampled area over the modelled year than without the plants.';
      if(Number.isFinite(values[0])&&Number.isFinite(values[1])) {
        const hours=values[0]-values[1];
        plain+=' It receives '+(Math.abs(hours)<0.5?'about the same direct-sun time.':'about '+Math.round(Math.abs(hours)).toLocaleString('en-GB')+' '+(hours>=0?'fewer':'more')+' hours of direct sun across that year.');
      }
    }
    const row=(name,unit,indices)=>'<tr><th scope="row" style="text-align:left;padding:8px 8px 8px 0">'+name+'<br><small>'+unit+'</small></th>'+indices.map(i=>'<td style="text-align:right;padding:8px">'+number(values[i])+'</td>').join('')+'</tr>';
    return '<p class="solar-plain-summary"><strong>'+esc(plainCaption)+'</strong><br>'+plain+'</p><details><summary>Exact sunlight figures and units</summary><div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px"><caption style="text-align:left;margin:10px 0">'+esc(caption)+'</caption><thead><tr><th scope="col">Metric</th><th scope="col">Unplanted checkerboard</th><th scope="col">Selected planted stage</th><th scope="col">Removed</th></tr></thead><tbody>'+row('Annual sky-matrix irradiation','kWh/m²/year',[3,4,5])+row('Geometric direct sun','h/year',[0,1,2])+row('Hourly direct-beam diagnostic','kWh/m²/year · beam only',[6,7,8])+'</tbody></table></div></details>';
  }
  function evidence(item) {
    const names={summary:'Run summary',assumptions:'Method and assumptions',assembly_manifest:'Authoritative native assembly',assembly_provenance:'Analysis assembly match',assembly_receipt:'Native assembly receipt',voxel_csv:'All voxel results (CSV)',sensor_csv:'Envelope sensors (CSV)',face_csv:'Face results (CSV)',results:'24 envelope groups (CSV)',deck_results:'192 deck probes (CSV)'};
    return '<details style="margin-top:12px"><summary>Evidence, source and downloads</summary><p>'+Object.entries(names).filter(([k])=>item.links[k]).map(([k,name])=>'<a href="'+esc(item.links[k])+'" target="_blank" rel="noopener">'+name+(item.links[k].endsWith('.gz')?' · .gz':'')+'</a>').join(' · ')+'</p><p class="note">Compressed downloads restore the original file exactly. Comparison images are brand-neutral presentation copies generated from the same verified numerical results.</p><a href="'+esc(item.links.evidence)+'" target="_blank" rel="noopener"><img src="'+esc(item.links.evidence)+'" alt="Solar comparison evidence for this exact plant stage and scope" loading="lazy" style="display:block;width:100%;max-height:720px;object-fit:contain"></a><p class="note" style="overflow-wrap:anywhere">Native plant source SHA-256: '+esc(item.source_sha256)+'<br>Run summary SHA-256: '+esc(item.summary_sha256)+'</p></details>';
  }
  function wholePanel(data,item) {
    const requested=window.towerSelectedVoxel;
    const selected=data.voxels[requested] ? requested : '59a';
    const options=Object.keys(data.voxels).map(id=>'<option value="'+esc(id)+'"'+(id===selected?' selected':'')+'>'+esc(id)+'</option>').join('');
    const differences=item.control_difference;
    const qualification=differences && differences[0]>0 ? '<p class="note">Run-control check: '+number(item.half_hour_control_differences)+' sensors differ at ray boundaries; maximum '+number(differences[0])+' h/year and '+number(differences[1])+' kWh/m²/year from the native reference. This table uses the paired control saved with this run.</p>' : '';
    return '<p class="note"><strong>Whole tower · native assembly match verified</strong> · '+esc(item.scope)+' · '+number(item.occurrences)+' assembly placements. 3,456 envelope sensors, 864 exposed faces and all 1,600 voxel IDs.</p>'+(item.placement_note?'<p class="note">'+esc(item.placement_note)+'</p>':'')+'<label>Voxel <select data-plant-solar-voxel aria-label="Planted whole-tower voxel">'+options+'</select></label><div data-plant-solar-voxel-results></div>'+qualification+evidence(item);
  }
  function voxelPanel(data,id) {
    const v=data.voxels[id];
    let html='<p class="note"><strong>'+esc(id)+'</strong> · '+(v.m2 ? number(v.m2)+' m² sampled exterior area' : 'No sampled exterior face. Null values are not zero exposure.')+'</p>'+metrics(v.values,'Whole-tower case · '+id+' · area-weighted exposed-face mean');
    html+='<details><summary>Face results</summary>'+Object.entries(v.faces).map(([face,values])=>metrics(values,id+' · '+face+' face')).join('')+(v.m2?'':'<p class="note">No exterior receivers on this voxel.</p>')+'</details>';
    html+='<details><summary>Most and least incident solar exposure · all ties</summary><p class="note">Mean annual sky-matrix irradiation per exposed m². 736 exposed voxels; ties within 0.0001 kWh/m²/year. No temperature ranking.</p>';
    for(const [key,name] of [['unplanted_checkerboard','Unplanted checkerboard'],['planted','Selected planted stage'],['removed','Irradiation removed']]) {
      const rank=data.rankings[key];
      for(const side of ['min','max'])html+='<p class="note"><strong>'+name+' · '+(side==='min'?'least':'greatest')+'</strong>: '+number(rank[side])+' kWh/m²/year · '+rank[side+'_ids'].length+' tied voxel(s)</p><div style="display:flex;flex-wrap:wrap;gap:5px">'+rank[side+'_ids'].map(next=>'<button type="button" data-plant-solar-jump="'+esc(next)+'">'+esc(next)+'</button>').join('')+'</div>';
    }
    return html+'</details>';
  }
  function localPanel(data,item) {
    return '<p class="note"><strong>Single balcony · 12 positions</strong>. One module is inserted independently at each position: four façades at 8, 48 and 88 m. These are not whole-tower planted results. Envelope: 96 sensors across 24 groups. Deck: 192 separate horizontal probes.</p><label>Test position <select data-plant-solar-position aria-label="Single-balcony test position">'+data.positions.map((p,i)=>'<option value="'+i+'">'+esc(p.face)+' · '+number(p.slab_top_m)+' m · '+esc(p.id)+'</option>').join('')+'</select></label><div data-plant-solar-position-results></div>'+(data.fit_checks?.length?'<p class="note">Source fit notes: '+esc(data.fit_checks.join(' '))+'</p>':'')+(data.beam_input_hash_verified===false?'<p class="note">Beam diagnostic provenance gap: this run summary does not record the hourly input hash. Its diagnostic values are supplied by the completed run, with incomplete input traceability.</p>':'')+evidence(item);
  }
  function positionPanel(p) {
    return '<h4>Envelope faces · this insertion only</h4>'+p.faces.map(f=>metrics(f.values,p.id+' · '+(f.role==='entry_voxel'?'At entry':'Below slab')+' · voxel '+f.voxel+' · '+number(f.m2)+' m²')).join('')+'<h4>Horizontal deck · separate receiver set</h4>'+metrics(p.deck_mean,p.id+' · mean of 16 deck probes')+'<p class="note">Deck probes are not part of the numbered-voxel ranking. Their unplanted values come from a separate architecture-only deck control.</p>';
  }
  window.showPlantSolar = function (plant) {
    return '<section class="plant-solar" data-plant-solar-id="'+esc(plant.id)+'" style="border-top:1px solid #c8d1c2;margin-top:24px;padding-top:20px"><h3>Plant solar research</h3><p class="note">Exact native plant and holder geometry, tested independently by assembly stage and scope. Measurements describe façade and deck exposure; growing-light suitability needs separate assessment. Opaque surfaces; no temperature or comfort prediction.</p><div data-plant-solar-body role="region" aria-label="Plant solar research results"><p role="status">Loading research snapshot…</p></div></section>';
  };
  window.mountPlantSolar = async function (plant) {
    const root=document.querySelector('[data-plant-solar-id="'+plant.id+'"]');if(!root)return;
    const body=root.querySelector('[data-plant-solar-body]');
    let revision=0,currentData=null;
    function selectVoxel(id,notify=true) {
      if(!currentData?.voxels?.[id])return;
      window.towerSelectedVoxel=id;
      const select=body.querySelector('[data-plant-solar-voxel]');if(select)select.value=id;
      const results=body.querySelector('[data-plant-solar-voxel-results]');if(results)results.innerHTML=voxelPanel(currentData,id);
      if(notify)root.dispatchEvent(new CustomEvent('tower-voxel-jump',{bubbles:true,detail:{id}}));
    }
    root.updateSolarVoxel=id=>selectVoxel(id,false);
    async function draw(index) {
      const ticket=++revision;currentData=null;
      const record=index.by_plant[plant.id],pair=record?.stages?.[state.stage],item=pair?.[state.scope];
      const complete=item?.status==='complete' && (state.scope!=='whole_tower'||item.assembly_match==='verified');
      body.innerHTML='<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:end"><label>Growth stage <select data-plant-solar-stage aria-label="Solar research growth stage">'+stages.map(stage=>'<option value="'+stage+'"'+(stage===state.stage?' selected':'')+'>'+label(stage)+'</option>').join('')+'</select></label><label>Analysis scope <select data-plant-solar-scope aria-label="Solar research scope"><option value="whole_tower"'+(state.scope==='whole_tower'?' selected':'')+'>Whole tower</option><option value="single_balcony"'+(state.scope==='single_balcony'?' selected':'')+'>Single balcony · 12 positions</option></select></label></div><p class="note">Research snapshot: '+index.counts.whole_tower_complete+'/300 whole-tower stage cases and '+index.counts.single_balcony_complete+'/300 single-balcony stage cases complete across 100 plants.</p><div data-plant-solar-result><p role="status">'+(complete?'Loading completed case…':'Analysis pending for this stage and scope.')+'</p></div>';
      const destination=body.querySelector('[data-plant-solar-result]');
      if(!complete) {
        destination.innerHTML='<p role="status"><strong>Analysis pending</strong> · '+label(state.stage)+' · '+(state.scope==='whole_tower'?'Whole tower':'Single balcony · 12 positions')+'</p><p class="note">'+esc(item?.reason || 'No verified completed result is included in this snapshot.')+'</p>';
        return;
      }
      try {
        const data=await fetchData(item.data);if(ticket!==revision||!root.isConnected)return;currentData=data;
        if(state.scope==='whole_tower') {
          destination.innerHTML=wholePanel(data,item);
          const id=data.voxels[window.towerSelectedVoxel]?window.towerSelectedVoxel:'59a';
          // Keep the research selection aligned without triggering a camera jump.
          selectVoxel(id,false);
        } else {destination.innerHTML=localPanel(data,item);destination.querySelector('[data-plant-solar-position-results]').innerHTML=positionPanel(data.positions[0]);}
        if(window.showPlantSolar3D)destination.insertAdjacentHTML('beforeend',window.showPlantSolar3D(plant,state.stage,state.scope,item));
        if(state.scope==='single_balcony' && data.beam_input_hash_verified===false) {
          try {
            const proof=await fetchData('release_evidence/hourly_beam_provenance_sidecar.json');
            if(ticket!==revision||!root.isConnected)return;
            const caseProof=proof.by_plant?.[plant.id]?.[state.stage];
            if(proof.numerical_index.sha256===index.snapshot_sha256 && caseProof?.summary.sha256===item.summary_sha256 && caseProof.status==='reconstructed_with_all_controls_reproduced') {
              destination.insertAdjacentHTML('beforeend','<p class="note" data-beam-reconstruction><strong>Beam input reconstructed; all controls reproduced.</strong> The saved weather and generator reproduce the surviving input exactly, and all stored unplanted controls match. The historical per-run input hash remains missing; this is not a replay of planted results. <a href="'+new URL('release_evidence/hourly_beam_provenance_sidecar.json',appBase).href+'" target="_blank" rel="noopener">Input verification record</a></p>');
            }
          } catch (_) { /* Optional verification never hides the original provenance gap. */ }
        }
        destination.insertAdjacentHTML('beforeend','<p class="note">Annual sky-matrix irradiation is the total incident sky estimate. The hourly diagnostic integrates timed direct beam only; it is separate and must not be added to that total. “Removed” means paired unplanted control minus planted stage.</p>');
      } catch(error) {if(ticket===revision&&root.isConnected)destination.textContent='Completed case could not load: '+error.message;}
    }
    try {
      const index=await ensureIndex();if(!root.isConnected)return;
      body.onchange=event=>{
        if(event.target.matches('[data-plant-solar-stage]')){state.stage=event.target.value;draw(index);}
        else if(event.target.matches('[data-plant-solar-scope]')){state.scope=event.target.value;draw(index);}
        else if(event.target.matches('[data-plant-solar-voxel]'))selectVoxel(event.target.value);
        else if(event.target.matches('[data-plant-solar-position]'))body.querySelector('[data-plant-solar-position-results]').innerHTML=positionPanel(currentData.positions[Number(event.target.value)]);
      };
      body.onclick=event=>{const jump=event.target.closest('[data-plant-solar-jump]');if(jump)selectVoxel(jump.dataset.plantSolarJump);};
      await draw(index);
    } catch(error) {if(root.isConnected)body.textContent='Solar research could not load: '+error.message;}
  };
  // Optional host hook: mirror a baseline voxel pick into the completed planted
  // case without modifying baseline values, scenario, or the existing 3 stages.
  window.updatePlantSolarVoxel = function(id) {
    document.querySelectorAll('[data-plant-solar-id]').forEach(root=>root.updateSolarVoxel?.(id));
  };
})();
