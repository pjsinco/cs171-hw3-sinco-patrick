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


  xScale = d3.scale.linear()
    //.domain([0, 100])
    .domain([0, d3.max(function(d) {
      return d.year;
    })])
    .range([0, bbVis.w]);

  var yScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d) {
      return d.HYDE; // TODO iterate through values
    })])
    .range([bbVis.h, 0]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(5)
    .orient('left')

  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(40,' + bbVis.h + ')')
    .call(xAxis)  

  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(40, 0)')
    .call(yAxis)

  var usCensus = [];
  data.forEach(function(d) {
    usCensus.push(d.USCensus)
  });

  var visFrame = svg.append('g')
    .attr('transform', 'translate(' + bbVis.x + ',' 
      + (bbVis.y + bbVis.h) + ')')
    // ...

  visFrame.append('rect')
  // ...

  //return createVis();
});

var createVis = function() {
  xScale = d3.scale.linear()
    .domain([0, 100])
    .range([0, bbVis.w]);


  var visFrame = svg.append('g')
    .attr('transform', 'translate(' + bbVis.x + ',' + (bbVis.y + bbVis.h) 
      + ')')
    // ...

  visFrame.append('rect')
  // ...

  var yScale; // define the domain and range; use bbVis
  var xAxis; 
  var yAxis;

  // add y axis to svg
} // end createVis()
