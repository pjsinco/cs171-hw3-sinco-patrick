// d3 margin convention
// http://bl.ocks.org/mbostock/3019563
var margin = {
  top: 50, 
  right: 50,
  bottom: 50,
  left: 50
};

var width = 960 - margin.left - margin.right;
var height = 300 - margin.bottom - margin.top;

var bbVis = {
  x: 100,
  y: 10,
  w: width - 100,
  h: 200
}

var dataSet = [];

var svg = d3.select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv('population-data.csv', function(data) {
  //console.log(data); // debug
  //console.log(data[3].year);// debug

  var color = d3.scale.category10();
  color.domain(d3.keys(data[0])
    .filter(function(key) {
      return key !== 'year';
    })
  );

  // idea from 'var cities = ... ' 
  // in http://bl.ocks.org/mbostock/3884955
  var agencies = color.domain().map(function(agency) {
    return {
      agency: agency,
      values: data.map(function(d) {
        return {
          year: d.year,
          est: +d[agency] // unary operator to turn string into int
        };
      })
    }
  });

  //console.log(agencies);

  var xScale = d3.scale.linear()
    //.domain([0, 100])
    .domain([0, d3.max(data, function(d) {
      return parseInt(d.year, 10);
    })])
    .range([0, bbVis.w]);

  var yScale = d3.scale.linear()
    // find max value by iterating through all agencies
    // and finding max value in each,
    // then find max value of all the maxes;
    // the key: nested d3.max()
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
      return (d.year);
    })
    .y(function(d) {
      return (d.est);
    })

  var visFrame = svg.append('g')
    .attr('transform', 'translate(' + bbVis.x + ',' 
      + (bbVis.y + bbVis.h) + ')');
    // ...

  visFrame.append('rect')
    .attr('fill', 'cadetblue')
    .attr('width', 100)
    .attr('height', 100)
  // ...

  // put dots on the graph for pop estimates
  //var agency = svg.selectAll('.agency')
    //.data(agencies)
    //.enter()
      //.append('g')
      //.attr('class', agency)
  svg
    .selectAll('circle')
    .data(data)
    .enter()
      .append('circle')
      .attr('r', 3)
      .attr('cx', function(d) {
        //console.log(d.year);
        return xScale(d.year);
      })
      //http://stackoverflow.com/questions/8312459/
      //  iterate-through-object-properties
      .attr('cy', function(d, i) {
        var est;
        for (var agency in d) {
          if (d[agency]) { // we have a nonblank value ...
            if (agency != 'date') { // ... and it's not a date
             est = yScale(parseInt(d[agency])); // ... plot it
            }
          } 
        }
        return est;
      })
     
  //return createVis();
});

var createVis = function() {
//  xScale = d3.scale.linear()
//    .domain([0, 100])
//    .range([0, bbVis.w]);
//
//
//  var visFrame = svg.append('g')
//    .attr('transform', 'translate(' + bbVis.x + ',' + (bbVis.y + bbVis.h) 
//      + ')')
//    // ...
//
//  visFrame.append('rect')
//  // ...
//
//  var yScale; // define the domain and range; use bbVis
//  var xAxis; 
//  var yAxis;

  // add y axis to svg
} // end createVis()
