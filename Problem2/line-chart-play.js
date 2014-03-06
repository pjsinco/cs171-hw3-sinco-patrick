(function() {

  var margin = {
    top: 20,
    right: 20, 
    bottom: 30, 
    left: 50
  }

  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var parseDate = d3.time.format('%d-%b-%y').parse;

  var xScale = d3.time.scale()
    .range([0, width])

  var yScale = d3.scale.linear()
    .range([height, 0])

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

  var line = d3.svg.line()
    .x(function(d) {
      return xScale(d.date);
    })
    .y(function(d) {
      return yScale(d.close);
    })

  var svg = d3.select('body')
      .append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.left + margin.right)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' 
          + margin.top + ')');

  d3.csv('stock-aapl.csv', function(error, data) {
    data.forEach(function(d, i) {
      d.date = parseDate(d.date);
      d.close = +d.close;
    });

    //xScale.domain(

  }) // end d3.csv()


})();
