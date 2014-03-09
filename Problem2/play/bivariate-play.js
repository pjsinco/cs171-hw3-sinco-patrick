var margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50
};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format('%Y%m%d').parse;

var xScale = d3.time.scale()
  .range([0, width]);

var yScale = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom');

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left');

var area = d3.svg.area()
  .x(function(d) {
    return xScale(d.date);
  })
  .y0(function(d) {
    return yScale(d.low);
  })
  .y1(function(d) {
    return yScale(d.high);
  })

var svg = d3.select('body')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
    .attr('translate', 'transform(' + margin.left + ',' + margin.top + ')')

d3.csv('temps-high-low.csv', function(data) {
  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.low = +d.low;
    d.high = +d.high;
  });

  xScale
    .domain(d3.extent(data, function(d) {
      return d.date;
    }))

  yScale
    .domain([d3.min(data, function(d) {
      return d.low;
    }), d3.max(data, function(d) {
      return d.high;
    })]);

  console.log(xScale.domain());
  console.log(yScale.domain());

  svg
    .append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', area)

  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .attr('text-anchor', 'end')
      .text('Temperature (F)')


}); // end d3.csv()


