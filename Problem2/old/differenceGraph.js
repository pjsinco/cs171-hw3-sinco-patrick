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
var padding = 40;

var bbVis = {
  x: 100,
  y: 10,
  w: width - 100,
  h: 300
}

var agencies = [];
var yearStats = [];
var color = d3.scale.category10();


var xScale = d3.scale.linear()
  .range([padding, bbVis.w]);

var yScale = d3.scale.linear()
  .range([bbVis.h, 0]);

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom')
  .tickFormat(d3.format('d'))
  .ticks(20)


var yAxis = d3.svg.axis()
  .scale(yScale)
  .ticks(6)
  .orient('left')
  .tickFormat(d3.format('.2s'));

var svg = d3.select('body')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' 
    + margin.right + ')')

var line = d3.svg.line()
  .x(function(d) {
    return xScale(d.year);
  })
  .y(function(d) {
    return yScale(d.mean);
  })

d3.csv('population-data.csv', function(data) {
  var keys = [];
  data.forEach(function(y) {
    keys = d3.keys(y).filter(function(d) {
      return d !== 'year';
    })
  })

  // generate year-by-year descriptive stats
  data.forEach(function(y) {
    var vals = [];
    keys.forEach(function(key) {
      vals.push(parseInt(y[key]))
    })
    var yearMin = d3.min(vals)
    var yearMax = d3.max(vals)
    var yearMean = d3.mean(vals);
    yearStats.push(
      {
        year: +y.year,
        low: yearMin,
        high: yearMax,
        mean: yearMean,
      }
    );
  });

  console.log(yearStats);

  console.log(yearStats);
  keys.forEach(function(key) {
    var vals = [];
    
  });

  // only use dates divisible by 100
  data = data.filter(function(d) {
    return parseInt(d.year) % 100 === 0;
  })

  color
    .domain(
      d3.keys(data[0]).filter(function(key) {
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

  console.log(agencies);

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
      // if we have an estimate, add the est and year to 
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
      
  return createVis();
  });

var createVis = function() {
  console.log(agencies);

  xScale
    .domain([0, d3.max(agencies, function(agency, i) {
      var max = d3.max(agency.values, function(d) {
        return d.year; 
      })
      return max;
    })])

  yScale
    .domain([0, d3.max(agencies, function(agency, i) {
      var max = d3.max(agency.values, function(d) {
        return d.est; 
      })
      return max;
    })])

  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + bbVis.h + ')')
    .call(xAxis)

  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(40, 0)')
    .call(yAxis)

  svg
    .append('path')
    .datum(yearStats)
    .attr('class', 'line')
    .attr('d', line)
    .style('fill', 'none')
    .style('stroke', '#eee')
    .style('stroke-width', 3)


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
            return '#f5f5f5';
          } else {
            return color(agencies[i].agency);
          }
        })
  }



} // end createVis()
