var marginContext = {
  top    : 10,
  right  : 10,
  bottom : 430,
  left   : 60
};

var marginFocus = {
  top    : 100,
  right  : 10,
  bottom : 20,
  left   : 60
}
var width = 960 - marginFocus.left - marginFocus.right; // 910
var heightFocus = 500 - marginFocus.top - marginFocus.bottom; // 390
var heightContext = 500 - marginContext.top - marginContext.bottom; // 50
var padding = 30;
var dataset = [];

var parseDate = d3.time.format('%b-%y').parse

/*
 * Set up scales
 */
var xScaleFocus = d3.time.scale()
  .range([padding, width]);

var yScaleFocus = d3.scale.linear()
  .range([heightFocus, 0]);

var xScaleContext = d3.time.scale()
  .range([padding, width]);

var yScaleContext = d3.scale.linear()
  .range([heightContext, 0]);

/*
 * Set up axes
 */
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

/*
 * Set up area function
 */
var areaFocus = d3.svg.area()
  .x(function(d) {
    return xScaleFocus(d.date);
  })
  .y0(heightFocus)
  .y1(function(d) {
    return yScaleFocus(d.women);
  })

/*
 * Set up line function
 */
var lineContext = d3.svg.line()
  .x(function(d) {
    return xScaleContext(d.date);
  })
  .y(function(d) {
    return yScaleContext(d.women);
  })

/*
 * Set up brush
 */
var brush = d3.svg.brush()
  .x(xScaleContext)
  .on('brush', function(d) {
    console.log(brush.extent());
    return brushed();
  });


/*
 * Set up text and callouts
 */
var leadIn = d3.select('body')
  .append('div')
    .attr('class', 'leadin')

leadIn
  .append('h1')
  .text('Trends in tweets mentioning women\'s health')

leadIn
  .append('p')
  .text('Aenean lacinia bibendum nulla sed consectetur. Donec ullamcorper nulla non metus auctor fringilla. Aenean lacinia bibendum nulla sed consectetur. Donec ullamcorper nulla non metus auctor fringilla. Nullam id dolor id nibh ultricies vehicula ut id elit. Donec ullamcorper nulla non metus auctor fringilla. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.')

var callout1 = d3.select('body')
    .append('div')
    .attr('class', 'callout');

callout1
    .append('h3')
    .text('Porta tortor vehicula bibendum');

callout1
    .append('p')
    .text('Cras justo odio, dapibus ac facilisis in, egestas eget quam. Nulla vitae elit libero, a pharetra augue. Nulla vitae elit libero, a pharetra augue. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.');

callout1
  .append('button')
    .attr('class', 'btn')
    .attr('name', 'callout1')
    .text('Highlight')
  
var callout2 = d3.select('body')
  .append('div')
    .attr('class', 'callout')

callout2
  .append('h3')
  .text('Tellus elit commodo egestas vehicula')

callout2
  .append('p')
  .text('Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec id elit non mi porta gravida at eget metus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.')

callout2
  .append('button')
    .attr('class', 'btn')
    .attr('name', 'callout2')
    .text('Highlight')

/*
 * Set up parent svg, focus, context
 */
var svg = d3.select('body')
  .append('svg')
  .attr('height', heightFocus + marginFocus.top + marginFocus.bottom) // 
  .attr('width', width + marginFocus.left + marginFocus.right)

svg
  .append('defs')
  .append('clipPath')
    .attr('id', 'clip')
  .append('rect')
    .attr('width', width - padding)
    .attr('height', heightFocus)
    .attr('transform', 'translate(' + padding + ',0)');

var focus = svg.append('g')
  .attr('class', 'focus')
  .attr('transform', 'translate(' + marginFocus.left + ',' 
    + marginFocus.top + ')');

var context = svg.append('g')
  .attr('class', 'context')
  .attr('transform', 'translate(' + marginContext.left + ',' 
    + marginContext.top + ')');

/*
 * Import data
 */
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
    .attr('transform', 'translate(0,' + heightFocus + ')')
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
    .attr('transform', 'translate(0,' + heightContext + ')')
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

  context
    .append('g')
    .attr('class', 'brush')
    .call(brush)
    .selectAll('rect')
    .attr('height', heightContext)
  
}; // end createVis()

function brushed() {
  xScaleFocus
    .domain(brush.empty() ? xScaleContext.domain() : brush.extent());

  focus
    .select('.area')
    .attr('d', areaFocus);

  focus
    .select('.x.axis')
    .call(xAxisFocus);

  focus
    .selectAll('circle')
    .attr('cx', function(d) {
      return xScaleFocus(d.date);
    })
}

/*
 * Set up event listeners
 */
d3.selectAll('.btn')
  .on('click', function() {
    if (this.name === 'callout1') {
      // set brush to the dates we want
      brush.extent(
        [
          d3.time.format('%Y-%m-%d').parse('2012-01-21'),
          d3.time.format('%Y-%m-%d').parse('2012-02-15')
        ]
      )
    } else if (this.name === 'callout2') {
      brush.extent(
        [
          d3.time.format('%Y-%m-%d').parse('2012-07-21'),
          d3.time.format('%Y-%m-%d').parse('2012-08-15')
        ]
      )

    }

    // call brush on context selection
    context
      .call(brush);

    // call the brush update function
    brushed();
  })
