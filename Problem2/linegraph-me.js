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
  x: 0 + 100,
  y: 10,
  w: width - 100,
  h: 100
}

var dataSet = [];

var svg = d3.select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)

svg
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv('population-data.csv', function(data) {
  console.log(data);

  console.log(data[3].year);

  return createVis();
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
