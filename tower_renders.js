function showWholeTowerRenders(plant) {
  const studies=window.TOWER_RENDERS?.byPlantId?.[plant.id] || [];
  const coverage='';
  if(!studies.length) return '<section class="tower-render-study"><h3>Greened tower · developed stage</h3>'+coverage+'<p class="note">Faithful native renders for this species are being prepared. Its approved balcony study remains available in the Balcony view.</p></section>';
  return '<section class="tower-render-study"><h3>Greened tower · developed stage</h3>'+coverage+'<p class="note">Original plant geometry and scale.</p><p class="note">'+escape(plant.route || 'Placement suitability requires review.')+'</p>' + studies.map((study,i)=>
    '<section class="tower-render-layout"><h4>'+escape(study.label)+'</h4><p class="note">'+escape(study.placement || '384 authored balcony arrangements; source dimensions retained.')+'</p><div class="tower-render-pair">'+study.views.map(view=>
      '<figure><a href="'+escape(view.image)+'" target="_blank" rel="noopener"><img src="'+escape(view.image)+'" width="1000" height="1200" loading="lazy" alt="'+escape(plant.name+' — '+study.label+' — '+view.label)+'"></a><figcaption>'+escape(view.label)+' · <a href="'+escape(view.image)+'" target="_blank" rel="noopener">Open full size</a>'+(view.note?'<br><span class="note">'+escape(view.note)+'</span>':'')+'</figcaption></figure>'
    ).join('')+'</div><p class="note"><a href="'+escape(study.audit)+'" target="_blank" rel="noopener">Source and render verification</a> · <a href="'+escape(study.review)+'" target="_blank" rel="noopener">Critic review</a> · Original dimensions retained; placement suitability requires review.</p></section>'
  ).join('')+'</section>';
}
