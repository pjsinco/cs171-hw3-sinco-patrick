var margin = {
  top: 20,
  right: 80,
  bottom: 30,
  left: 50
}

var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format('%Y%m%d').parse;

var x = d3.time.scale()
  .range([0, width]);

var y = d3.scale.linear()
  .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom')

var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left')

var line = d3.svg.line()
  .interpolate('basis')
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return y(d.temperature);
  })

var svg = d3.select('body')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' 
    + margin.right + ')')
  
d3.csv('temps.csv', function(error, data) {
  //color.domain(
   //console.log(data);
    color
      .domain(d3.keys(data[0])
          .filter(function(key) {
            return key !== 'date';
          }));

    data.forEach(function(d) {
      d.date = parseDate(d.date);
    });

    var cities = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {
            date: d.date,
            temperature: +d[name]
          };
        })
      }
    });
  
    x.domain(d3.extent(function(d) {
      return d.date;
    }));
  
    y.domain([
      d3.min(cities, function(c) {
        return d3.min(c.values, function(v) {
          return v.temperature;
        })
      }),
      d3.max(cities, function(c) {
        return d3.max(c.values, function(v) {
          return v.temperature;
        })
      })]);
  
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);
  
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Temperature (degrees F)')
  
    var city = svg.selectAll('.city')
      .data(cities)
}); // end d3.csv()
