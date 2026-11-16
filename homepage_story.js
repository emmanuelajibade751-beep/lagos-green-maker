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
 const sectionIds=['architecture','plants','method','catalogue'];
 const sections=sectionIds.map(id=>document.getElementById(id)).filter(Boolean);
 const sectionLinks=[...document.querySelectorAll('.story-nav a[href^="#"],.chapter-nav a[href^="#"]')];
 function setCurrentSection(id){
  sectionLinks.forEach(link=>{
   if(link.hash==='#'+id)link.setAttribute('aria-current','location');
   else link.removeAttribute('aria-current');
  });
 }
 setCurrentSection(sectionIds.includes(location.hash.slice(1))?location.hash.slice(1):'architecture');
 sectionLinks.forEach(link=>link.addEventListener('click',()=>setCurrentSection(link.hash.slice(1))));
 if('IntersectionObserver' in window&&sections.length){
  const inReadingBand=new Set();
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>entry.isIntersecting?inReadingBand.add(entry.target):inReadingBand.delete(entry.target));
   if(!inReadingBand.size)return;
   const readingLine=window.innerHeight*.3;
   const current=[...inReadingBand].sort((a,b)=>
    Math.abs(a.getBoundingClientRect().top-readingLine)-Math.abs(b.getBoundingClientRect().top-readingLine))[0];
   if(current)setCurrentSection(current.id);
  },{rootMargin:'-110px 0px -60% 0px',threshold:0});
  sections.forEach(section=>observer.observe(section));
 }
 window.addEventListener('DOMContentLoaded',()=>{
  const compare=document.querySelector('#compare-plants');
  if(compare)document.querySelector('.mast').append(compare);
 });
})();
