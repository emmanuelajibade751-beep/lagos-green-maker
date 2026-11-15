function showBalconyStudies(plant) {
  const studies = window.BALCONY_STUDIES?.byPlantId[plant.id] || [];
  if (!studies.length) {
    return '<p>The balcony study for this plant is unavailable. Reload the catalogue to try again.</p>';
  }
  const choices = studies.length > 1
    ? '<div class="layout-options" role="group" aria-label="Balcony layouts">' +
      studies.map((study, index) => '<button type="button" data-layout="' + index +
        '" aria-pressed="true">' + escape(study.label) + '</button>').join('') + '</div>'
    : '';
  return '<p class="note">Each comparison shows establishment, intermediate and developed study sizes. ' +
    'Dimensions and planting provisions describe the modelled design. Check root space, load, exposure and care before placement.</p>' +
    choices + studies.map((study, index) =>
      '<section class="balcony-study" data-layout-panel="' + index + '">' +
      '<h3>' + escape(study.label) + '</h3><figure><a href="' + escape(study.image) +
      '" target="_blank" rel="noopener" aria-label="Open full-size ' + escape(study.label) + '">' +
      '<img src="' + escape(study.image) + '" width="' + study.width + '" height="' + study.height +
      '" alt="' + escape(study.alt) + '"></a><figcaption>Establishment · Intermediate · Developed</figcaption></figure>' +
      '<p class="balcony-links"><a href="' + escape(study.image) +
      '" target="_blank" rel="noopener">Open full-size comparison</a></p></section>'
    ).join('');
}
