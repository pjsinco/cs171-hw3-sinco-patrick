var margin = {
  //top: 50,
  //right: 50,
  //bottom: 50,
  //left: 50
  top    : 10,
  right  : 10,
  bottom : 100,
  left   : 40
};

var margin2 = {
  top    : 430,
  right  : 10,
  bottom : 20,
  left   : 40
}
var width = 960 - margin.left - margin.right; // 910
var height = 500 - margin.top - margin.bottom; // 390
var height2 = 500 - margin2.top - margin2.bottom; // 50
var padding = 30;
var dataset = [];

//var bbOverview = {
//  x: 0,
//  y: 10,
//  w: width,
//  h: 50
//}
//
//var bbDetail = {
//  x: 0,
//  y: 100,
//  w: width,
//  h: 300
//}

var parseDate = d3.time.format('%b-%y').parse

var xScaleFocus = d3.time.scale()
  .range([padding, width]);

var yScaleFocus = d3.scale.linear()
  .range([height, 0]);

var xScaleContext = d3.time.scale()
  .range([padding, width]);

var yScaleContext = d3.scale.linear()
  .range([height2, 0]);

var xAxisFocus = d3.svg.axis()
  .scale(xScaleFocus)
  .orient('bottom');

var yAxisFocus = d3.svg.axis()
  .scale(yScaleFocus)
  .orient('left');

var xAxisContext = d3.svg.axis()
  .scale(xScaleContext)
  .orient('bottom');

var yAxisContext = d3.svg.axis()
  .scale(yScaleContext)
  .orient('left')
  .ticks(3);

var areaFocus = d3.svg.area()
  .x(function(d) {
    return xScaleFocus(d.date);
  })
  .y0(height)
  .y1(function(d) {
    return yScaleFocus(d.women);
  })

var lineContext = d3.svg.line()
  .x(function(d) {
    return xScaleContext(d.date);
  })
  .y(function(d) {
    return yScaleContext(d.women);
  })

var svg = d3.select('body')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom) // 
  .attr('width', width + margin.left + margin.right)

var focus = svg.append('g')
  .attr('class', 'focus')
  .attr('transform', 'translate(' + margin.left + ',' 
    + margin.top + ')');

var context = svg.append('g')
  .attr('class', 'context')
  .attr('transform', 'translate(' + margin2.left + ',' 
    + margin2.top + ')');

d3.csv('unHealth-women.csv', function(error, data) {
  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.women = +d.women;
  });

  dataset = data;

  // define xScaleFocus's domain now because we want to use 
  // the data before we reformat it
  xScaleFocus
    .domain(d3.extent(data, function(d) {
      return d.date; 
    }));

  console.log(data);

  yScaleFocus
    .domain(d3.extent(data.map(function(d) {
      return d.women;
    })));

  xScaleContext
    .domain(xScaleFocus.domain());

  yScaleContext
    .domain(yScaleFocus.domain());

  createVis();

}); // end d3.csv();

function createVis() {
  focus
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxisFocus);

  focus
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + padding + ',0)')
    .call(yAxisFocus)

  focus
    .append('path')
    .datum(dataset)
    .attr('class', 'area')
    .attr('d', areaFocus)

  focus
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('r', 2)
    .attr('cx', function(d) {
      return xScaleFocus(d.date);
    }) 
    .attr('cy', function(d) {
      return yScaleFocus(d.women);
    }) 

  context
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height2 + ')')
    .call(xAxisContext)

  context
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + padding + ',0)')
    .call(yAxisContext)
    
  context
    .datum(dataset)
    .append('path')
    .attr('class', 'path')
    .attr('d', lineContext)

  context
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('r', 2)
    .attr('cx', function(d) {
      return xScaleContext(d.date);
    }) 
    .attr('cy', function(d) {
      return yScaleContext(d.women);
    }) 

}; // end createVis()
