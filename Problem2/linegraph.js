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
var padding = 40;

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
          est: +d[agency], // unary operator to turn string into int
          interp: false
        };
      })
    }
  });




  // filter out first years without data and 
  // fill in missing data with interpolations
  agencies.forEach(function(agency) {

    // find first year with nonzero data
    var c = 0;
    var firstYearWithData;
    while (c < agency.values.length) {
      if (agency.values[c].est !== 0) {
        firstYearWithData = agency.values[c].year;
        firstYearWithData = c;
        break;
      }
      c++;
    }

    // filter out years before first year with data
    agency.values = agency.values.filter(function(d, i) {
      console.log(agency.agency, firstYearWithData, i, i >= firstYearWithData);
      return i >= firstYearWithData;
    });

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


  return createVis();
});

var createVis = function() {

  console.log(agencies);

  var xScale = d3.scale.pow()
    .exponent(15)
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
    .range([padding, bbVis.w]);
  

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
    .tickValues(['0', '1000', '1500', '1600', '1700', '1800', '1900', '2000', '2050'])
    .tickFormat(d3.format('d'))

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(10)
    .orient('left')

  // place x-axis
  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + bbVis.h + ')')
    .call(xAxis)  
    .append('text')
      .attr('text-anchor', 'end')
      .text('Year')
      .attr('transform', 'translate(' + bbVis.w + ',-5)')

  // place y-axis
  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(40, 0)')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Population')

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
        //console.log(d, d.firstYearIndex);
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
          if (!d.interp) { 
            return 5;  
          } else {
            return 3;
          }
        })
        .attr('cx', function(d) {
          return xScale(d.year);
        })
        .attr('cy', function(d) {
          return yScale(d.est);
        })
        .style('fill', function(d) {
          // interpolated values are fuchsia
          if (d.interp) {
            return 'rgba(0, 0, 0, 0.2)';
          } else {
            return color(agencies[i].agency);
          }
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
