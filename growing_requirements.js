function showGrowingRequirements(plant) {
  const rows = growingRequirements[plant.id];
  const entries = rows.map(row => {
    const sources = row.sources
      .filter(source => url(source.url))
      .map(source => '<a href="' + url(source.url) + '">' + escape(source.title) + '</a>')
      .join(' · ');
    return '<div class="property"><strong>' + escape(row.field) + '</strong><p>' +
      escape(row.value) + '</p><p class="note">' + escape(row.status) +
      (row.context ? ' · ' + escape(row.context) : '') +
      (sources ? '<br>' + sources : '') + '</p></div>';
  }).join('');
  return '<p><a href="Growing_Requirements_100.csv" download>Download growing requirements for all 100 plants</a></p>' +
    '<section><h3>Growing requirements</h3>' + entries + '</section>' +
    '<details><summary>How to establish local quantities</summary>' +
    '<p>Compare plants at the same growth stage and stock size. Record the bay exposure, container, substrate, rainfall, irrigation delivered, drainage and plant response. Repeat in wet and dry periods. ' +
    '<a href="https://www.fao.org/4/S2022E/s2022e08.htm">FAO irrigation water needs</a> · ' +
    '<a href="https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/lighting-for-indoor-plants">University of Minnesota Extension light measurement guide</a></p></details>';
}
