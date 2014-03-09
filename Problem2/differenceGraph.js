// d3 margin convention
// http://bl.ocks.org/mbostock/3019563
var margin = {
  top: 50, 
  right: 50,
  bottom: 50,
  left: 50
};

var width = 1200 - margin.left - margin.right;
var height = 600 - margin.bottom - margin.top;

var bbVis = {
  x: 100,
  y: 10,
  w: width - 100,
  h: 500
}

var agencies = [];
var color = d3.scale.category10();
var yearlyEst = 
[
  {  
    year: null,
    stats: 
    {
      mean: null,
      min: null,
      max: null,
      range: null
    }
  }
];

//yearlyEst[0].year = 0;
//yearlyEst.push({year: 0, stats: {

var svg = d3.select('body')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' 
    + margin.right + ')')

d3.csv('population-data.csv', function(data) {
  color
    .domain(d3.keys(data[0])
      .filter(function(key) {
        return key !== 'year';
      })
    );

  // make the data into something we can work with
  agencies = color.domain().map(function(agency) {
    return {
      agency: agency,
      values: data.map(function(d) {
        return {
          year: parseInt(d.year),
          est: +d[agency], // unary operator to turn string into int
          interp: false
        };
      })
    }
  });

  // add a property to each agency indicating 
  // the index of the first year with data
  agencies.forEach(function(agency) {
    var indexCounter = 0;
    while (indexCounter < agency.values.length) {
      if (agency.values[indexCounter].est !== 0) {
        agency.firstYearIndex = indexCounter;
        break;
      }
      indexCounter++;
    }
  })

  // fill in missing data with interpolations
  agencies.forEach(function(agency) {

    // find first year with nonzero data
    var c = 0;
    var firstYearWithData;
    while (c < agency.values.length) {
      if (agency.values[c].est !== 0) {
        firstYearWithData = agency.values[c].year;
        break;
      }
      c++;
    }

    var years = []; 
    var estimates = [];
    for (var i = c; i < agency.values.length; i++) {
      if (agency.values[i].est) {
        years.push(agency.values[i].year);
        estimates.push(agency.values[i].est);
      }
    }
  
    var interp = d3.scale.linear()
      .domain(years)
      .range(estimates)
    
    // interpolate estimate if it's 0
    for (var i = c; i < agency.values.length; i++) {
      if (agency.values[i].est === 0) {
        agency.values[i].est = interp(agency.values[i].year);
        agency.values[i].interp = true;
      }
    }

  }); // end agencies.forEach()

  agencies[0].values.forEach(function(vals) {
    yearlyEst.push({year: vals.year});
  });

  agencies.forEach(function(agency) {
    var allEsts = [];
    agency.values.forEach(function(stats) {
      allEsts.push(stats.est);
    });
    var yearMin = d3.min(allEsts)
  })
      
  return createVis();
});

var createVis = function() {
  //console.log(agencies);




  var visFrame = svg.append('g')
    .attr('transform', 'translate(' + bbVis.x + ',' 
      + (bbVis.y + bbVis.h) + ')');
    // ...

  visFrame.append('rect')
    //.attr('fill', 'cadetblue')
    //.attr('width', 100)
    //.attr('height', 100)
    // ...

} // end createVis()
