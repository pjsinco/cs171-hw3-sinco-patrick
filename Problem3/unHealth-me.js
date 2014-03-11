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
//var padding = 50;
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

var parseDate = d3.time.format('%B %Y').parse

var color = d3.scale.category10();

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

//var yAxis2 = d3.svg.axis()
  //.scale(yScale2)
  //.orient('left');

var line = d3.svg.line()
  .x(function(d) {
    return xScale2(d.date);
  })
  .y(function(d) {
    return yScale2(d.count);
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

d3.csv('unHealth.csv', function(error, data) {
  // set color domain
  color
    .domain(d3.keys(data[0]).filter(function(d) {
      return d !== 'date';
    }));

  xScale
    .domain(d3.extent(data, function(d) {
      return parseDate(d.date); 
    }));

  dataset = color.domain().map(function(cat) {
    return {
      cat: cat,
      values: data.map(function(d) {
        return {
          date: parseDate(d.date),
          count: +d[cat]
        };
      })
    } 
  });

  yScale.domain([
    d3.min(dataset, function(c) {
      return d3.min(c.values, function(v) {
        return v.count;
      });
    }),
    d3.max(dataset, function(c) {
      return d3.max(c.values, function(v) {
        return v.count;
      });
    })]);

  xScale2
    .domain(xScale.domain());

  yScale2
    .domain(yScale.domain());

  createVis();

}); // end d3.csv();

function createVis() {
  focus
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  focus
    .append('g')
    .attr('class', 'y axis')
    //.attr('transform', 'translate(' + padding + ',0)')
    .call(yAxis)

  context
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height2 + ')')
    .call(xAxis2)
    
  var categ = context.selectAll('.category')
    .data(dataset)
    .enter()
      .append('g')
      .attr('class', 'category')
  
  categ
    .append('path')
    .attr('class', 'path')
    .attr('d', function(d) {
      return line(d.values);
    })
    .style('stroke', function(d) {
      return color(d.cat);
    })

}

