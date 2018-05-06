function d3_draw (el) {
  let svg = el.append('svg')
    .attr({
      'width': width,
      'height': height,
      'viewBox': `0 0 ${width} ${height}`
    })

  // us map from: https://github.com/bradoyler/dataviz/blob/master/app/data/us.json
  d3.json('scripts/us-map.json', function (err, topology) {
    svg.append('path')
      .datum(topojson.feature(topology, topology.objects.land))
      .attr('d', path)
      .attr('class', 'land-boundary')

    svg.append('path')
      .datum(topojson.mesh(topology, topology.objects.states, (a, b) => a !== b))
      .attr('d', path)
      .attr('class', 'state-boundary')
  })
};

function d3_ping (el, zipcodes) {
  console.log('zip counts in d3_ping: ' + zipcodes.length)

  let colorScale = d3.scale.linear()
    .domain(d3.extent(zipcodes, c => c.ts))
    .range([0, 0.8])

  let zipSel = d3.select('svg').selectAll('circle')
    .data(zipcodes, (d) => d.lat)
    .attr('fill-opacity', c => colorScale(c.ts))

  zipSel.enter().append('circle')
    .attr({
      'cx': (d) => { let proj = projection([d.lon, d.lat]); return (proj == null) ? 50 : proj[0] },
      'cy': (d) => { let proj = projection([d.lon, d.lat]); return (proj == null) ? 50 : proj[1] }
    })

  zipSel.attr({
    'r': 1,
    'opacity': 1e-6,
    'fill-opacity': 0.3,
    'fill': '#dc143c',
    'stroke': '#fff',
    'stroke-opacity': 1
  })
    .transition()
    .delay((d) => Math.floor((Math.random() * 1000) + 0))
    .duration(1500)
    .ease('cubic-in-out')
    .attr({
      'fill': '#dc143c',
      'opacity': 1,
      'r': 15,
      'stroke-opacity': 0.4,
      'stroke-width': '1px',
      'stroke': '#361'
    })
    .each('end', function () {
      let dot = d3.select(this)

      dot.transition()
        .duration(600)
        .attr({
          'fill': '#dc143c',
          'opacity': 0.9,
          'fill-opacity': 0.9,
          'stroke-width': '1px',
          'stroke': '#361',
          'r': 2.2
        })
        .each('end', function () {
          let point = d3.select(this)

          point.transition()
            .duration(5000)
            .attr({
              'fill': '#ffd700'
            })
            // .remove() // remove the dots
        })
    })
};

function getSampleZips (filteredZips, pct) {
  return _.sampleSize(filteredZips, pct * filteredZips.length)
};
