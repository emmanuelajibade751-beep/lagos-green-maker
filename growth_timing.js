function renderTiming(stage, plant) {
  const options = growthTiming[plant.id].comparisons[stage.id];
  if (!options.length) {
    return '<p>Stage timing unknown. ' +
      (growthTiming[plant.id].references.length ? 'See Timing evidence for published references.' : escape(stage.gaps)) + '</p>';
  }
  const times = options.map(option => {
    const span = option.time_min === option.time_max ? option.time_min : option.time_min + '–' + option.time_max;
    return '<div class="property"><strong>' + escape(span + ' ' + option.time_unit + ' · ' + option.time_origin) +
      '</strong><p>' + escape(option.starting_stock + ' ' + option.conditions) + '</p><p class="note">' +
      escape(option.assumption + ' ' + option.limitations) + ' <a href="' + url(option.source_url) + '">' +
      escape(option.locator || 'Source') + '</a></p></div>';
  }).join('');
  return '<section><h4>Conditional height comparison</h4>' + times + '</section>';
}

function showGrowthTiming(plant) {
  const rows = growthTiming[plant.id].references;
  const comparisons = plant.stages.filter(stage => growthTiming[plant.id].comparisons[stage.id].length);
  return '<p class="note">The time shown starts at the event named in each source. Size observations, harvest windows and maturity guidance describe their original conditions. A model comparison uses a measured size and remains conditional on that study.</p>' +
    '<p><a href="Stage_Timing_300.csv" download>Download timings and gaps for 300 model stages</a> · ' +
    '<a href="Species_Timing_References.csv" download>Download species timing references</a></p>' +
    (comparisons.length ? '<section><h3>Model stage comparisons</h3>' + comparisons.map(stage =>
      '<div class="property"><strong>' + escape(stage.id + ' · ' + stage.name) + '</strong>' + renderTiming(stage, plant) + '</div>'
    ).join('') + '</section>' : '<p>No published time currently matches a model stage for this species.</p>') +
    (rows.length ? '<section><h3>Published species timelines</h3>' + rows.map(row =>
      '<div class="property"><strong>' + escape(row.label) + '</strong><p>' + escape(row.when) + '</p><p class="note">' +
      escape(row.basis + ' · ' + row.context) + '<br><a href="' + url(row.source) + '">' +
      escape(row.locator) + '</a></p></div>').join('') + '</section>' :
      '<p>No usable dated observation or maturity window has been verified for this species.</p>');
}
