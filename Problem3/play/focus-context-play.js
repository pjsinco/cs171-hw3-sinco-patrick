var margin = {
  top    : 10,
  right  : 10,
  bottom : 100,
  left   : 40,
}
var margin2 = {
  top    : 430,
  right  : 10,
  bottom : 20,
  left   : 40,
}
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format('%b %Y').parse;

var xScale = d3.time.scale()
  .range([0, width]);
var xScale2 = d3.time.scale()
  .range([0, width]);
var yScale = d3.scale.linear()
  .range([height, 0]);
var yScale2 = d3.scale.linear()
  .range([height2, 0]);

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom');
var xAxis2 = d3.svg.axis()
  .scale(xScale2)
  .orient('bottom');
var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left');
  
var brush = d3.svg.brush()
  .x(xScale2)
  .on('brush', brushed)

var area = d3.svg.area()
  .interpolate('monotone')
  .x(function(d) {
    return xScale(d.date);
  })  
  .y0(height)
  .y1(function(d) {
    return yScale(d.price);
  })

var area2 = d3.svg.area()
  .interpolate('monotone')
  .x(function(d) {
    return xScale2(d.date);
  })
  .y0(height2)
  .y1(function(d) {
    return yScale2(d.price)
  });

var svg = d3.select('body')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)

svg
  .append('defs')
  .append('clipPath')
    .attr('id', 'clip')
  .append('rect')
    .attr('width', width)
    .attr('height', height);

var focus = svg.append('g')
  .attr('class', 'focus')
  .attr('transform', 'translate(' + margin.left 
    + ',' + margin.top + ')')

var context = svg.append('g')
  .attr('class', 'context')
  .attr('transform', 'translate(' + margin2.left
    + ',' + margin2.top + ')')

d3.csv('sp500.csv', type, function(error, data) {

  xScale
    .domain(d3.extent(data.map(function(d) {
      return d.date;
    })));
  
  yScale
    .domain([0, d3.max(data.map(function(d) {
      return d.price;  
    }))]);

  xScale2
    .domain(xScale.domain());

  yScale2
    .domain(yScale.domain());

  focus 
    .append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', area)

  focus
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  focus
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis)

  context
    .append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', area2)
  
  context
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height2 + ')')
    .call(xAxis2)

  context
    .append('g')
    .attr('class', 'x brush')
    .call(brush)
    .selectAll('rect')
      .attr('y', -6)
      .attr('height', height2 + 7)
}); // end d3.csv()

function brushed() {
  xScale.domain(brush.empty() ? xScale2.domain() : brush.extent());
  focus
    .select('.area')
    .attr('d', area);
  focus
    .select('.x.axis')
    .call(xAxis)
}

function type(d) {
  d.date = parseDate(d.date);
  d.price = +d.price;
  return d;
}
