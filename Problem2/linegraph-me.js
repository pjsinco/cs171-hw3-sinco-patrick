// d3 margin convention
// http://bl.ocks.org/mbostock/3019563
var margin = {
  top: 50, 
  right: 50,
  bottom: 50,
  left: 50
};

var width = 960 - margin.left - margin.right;
var height = 600 - margin.bottom - margin.top;

var bbVis = {
  x: 100,
  y: 10,
  w: width - 100,
  h: 500
}

var agencies = [];
var color = d3.scale.category10();

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
          est: +d[agency] // unary operator to turn string into int
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

  console.log(agencies);

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
      }
    }

  }); // end agencies.forEach()

  return createVis();
});

var createVis = function() {

  var xScale = d3.scale.linear()
    // find max value by iterating through all agencies
    // and finding max value in each,
    // then find max value of all the maxes;
    // the key: nested d3.max()
    .domain([0, d3.max(agencies, function(agency, i) {
      var max = d3.max(agency.values, function(d) {
        return d.year; 
      })
      return max;
    })])
    .range([0, bbVis.w]);
  
  var yScale = d3.scale.linear()
    // same nested max() process as above
    .domain([0, d3.max(agencies, function(agency, i) {
      var max = d3.max(agency.values, function(d) {
        return d.est; 
      })
      return max;
    })])
    .range([bbVis.h, 0]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(5)
    .orient('left')

  // place x-axis
  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(40,' + bbVis.h + ')')
    .call(xAxis)  

  // place y-axis
  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(40, 0)')
    .call(yAxis)

  var line = d3.svg.line()
    .x(function(d) {
      return xScale(d.year);
    })
    .y(function(d) {
      return yScale(d.est);
    })

  // put dots on the graph for pop estimates
  var agency = svg.selectAll('.agency')
    .data(agencies)
    .enter()
      .append('g')
      .attr('class', 'agency')

  agency
    .append('path')
    .attr('class', 'line')
    .attr('d', function(d, i) {
      if (i >= d.firstYearIndex) {
        return line(d.values);
      }
    })
    .style('stroke', function(d) {
      return color(d.agency)
    })
    .style('stroke-width', '1.5px');
    

  // iterate through all 5 agencies,
  // add circle elments classed to name of agency
  for (var i = 0; i < agencies.length; i++) {
    svg
      .selectAll('.' + agencies[i].agency)
      .data(agencies[i].values)
      .enter()
        .append('circle')
        .attr('class', agencies[i].agency)
        .attr('r', function(d) {
          // hide circles whose bound estimate is 0
          if (d.est) { 
            return 2;  
          }
          //console.log(d.est);
        })
        .attr('cx', function(d) {
          return xScale(d.year);
        })
        .attr('cy', function(d) {
          return yScale(d.est);
        })
        .style('fill', function(d) {
          return color(agencies[i].agency);
        })
  }
     
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
