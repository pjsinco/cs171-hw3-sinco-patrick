var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var width = 960 - margin.left - margin.right;
var height = 800 - margin.top - margin.top;

var bbOverview = {
  x: 0,
  y: 10,
  w: width,
  h: 50
}

var bbDetail = {
  x: 0,
  y: 100,
  w: width,
  h: 300
}

var parseDate = d3.time.format('%B %Y').parse

var color = d3.scale.category10();

var xScale = d3.time.scale()
  .range([0, width])

//var xScale2 = d3.time.scale()
  //.range([0, width])

var yScale = d3.scale.linear()
  .range([height, 0])

//var yScale2 = d3.scale.linear()
  //.range([bbOverview.h, 0])

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom')

//var xAxis2 = d3.svg.axis()
  //.scale(xScale2)
  //.orient('bottom')

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left')

var line = d3.svg.line()
  .x(function(d) {
    return xScale(d.date);
  })
  .y(function(d) {
    return yScale(d.count);
  })

svg = d3.select('body')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)

svg
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' 
    + margin.top + ')');

var dataset = [];
  
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
          year: parseDate(d.date),
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


}); // end d3.csv();

