(function(){
 'use strict';
 document.querySelectorAll('[data-story-mode]').forEach(button=>button.addEventListener('click',()=>{
   const mode=button.dataset.storyMode;
   document.querySelectorAll('[data-story-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   document.querySelector('.story-legend').hidden=mode!=='sunlight';
   document.querySelectorAll('[data-story-scene]').forEach(section=>{
   const image=section.querySelector('img'),caption=section.querySelector('[data-scene-caption]'),name=section.dataset.storyScene;
   image.src='homepage/'+name+'-'+mode+'.png';
   image.alt=(name==='bare'?'Bare tower with no balconies':'Unplanted tower with 384 checkerboard balconies')+(mode==='sunlight'?' — annual solar exposure on walls and roof, same 0–1800 kWh/m²/year colour scale':' — white voxel geometry in the schematic neighbourhood');
   caption.textContent=mode==='sunlight'?'Annual sunlight · same scale':'Geometry · no planting';
   });
 }));
 document.querySelectorAll('.shade-tile').forEach(tile=>tile.addEventListener('click',()=>{lastCard=tile;}));
 window.addEventListener('DOMContentLoaded',()=>{
  const compare=document.querySelector('#compare-plants');
  if(compare)document.querySelector('.story-nav').append(compare);
 });
})();
