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

var years = [];

var xScale = d3.scale.linear()
  .range([0, bbVis.w]);

var yScale = d3.scale.linear()
  .range([bbVis.h, 0]);

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom');

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left');

var area = d3.svg.area()
  .x(function(d) {
    return xScale(d.year);
  })
  .y0(function(d) {
    return yScale(d.low);
  })
  .y1(function(d) {
    return yScale(d.high);
  });

var svg = d3.select('body')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' 
    + margin.right + ')')

d3.csv('population-data.csv', function(data) {
  data.forEach(function(y) {
    y.year = +y.year;
    var est = [];
    for (var key in y) {
      y[key] = (y[key]) ? parseInt(y[key]) : 0;

      if (key !== 'year' && y[key] !== 0) {
        est.push(y[key]);
      }
    }
    y.high = d3.min(est);
    y.low = d3.max(est);
  })

  years = data;

      
  return createVis();
});

var createVis = function() {
  console.log(years);

  var y = years.map(function(d) {
    return d.year;
  })
  console.log(y);

  xScale
    .domain(
      d3.extent(years.map(function(d) {
        return d.year; 
      }))
    );

  yScale
    .domain(
      [
        d3.min(years.map(function(d) {
          return d.low;
        })), 
        d3.max(years.map(function(d) {
          return d.high;
        }))
      ]
    );

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

  svg
    .append('path')
    .datum(years)
    .attr('class', 'area')
    .attr('d', area)



} // end createVis()
