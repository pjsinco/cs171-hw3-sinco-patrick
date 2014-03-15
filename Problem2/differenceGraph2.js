// d3 marginBigVis convention
var marginBigVis = {
  top: 10,
  right: 10,
  bottom: 100,
  left: 40
}
var marginSmallVis = {
  top: 330,
  right: 10,
  bottom: 20,
  left: 40
}

var width = 960 - marginBigVis.right - marginBigVis.left; // 890
var heightBig = 500 - marginBigVis.top - marginBigVis.bottom; // 380
var heightSmall = 
  500 - marginSmallVis.top - marginSmallVis.bottom; // 130
var yearStats = [];
var decFormat = d3.format('.0f');

var xScale = d3.scale.pow()
  .exponent(15)
  .range([0, width]);

var yScaleBig = d3.scale.linear()
  .range([heightBig, 0]);

var yScaleSmall = d3.scale.linear()
  .range([0, heightSmall]);

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('top')
  .tickSize(heightBig)
  .tickValues(['0', '1500', '1600', '1700', '1800', '1900', 
    '2000', '2050'])
  .tickFormat(d3.format('d'));
  var yAxisBig = d3.svg.axis()
  .scale(yScaleBig)
  .orient('left')
  .tickFormat(d3.format('.2s'));

var yAxisSmall = d3.svg.axis()
  .scale(yScaleSmall)
  .orient('left')
  .ticks(3)
  //.tickFormat(d3.format('.2s'));

var svg = d3.select('#vis')
  .append('svg')
  .attr('width', width + marginBigVis.left + marginBigVis.right)
  .attr('height', heightBig + marginBigVis.top + marginBigVis.bottom)
  .append('g')
    .attr('transform', 'translate(' + marginBigVis.left + ','
      + marginBigVis.right + ')');

var line = d3.svg.line()
  .x(function(d) {
    return xScale(d.year);
  })
  .y(function(d) {
    return yScaleBig(d.mean);
  })

d3.csv('population-data.csv', function(data) {
  var keys = [];
   
  // get the keys in an array
  data.forEach(function(y) {
    keys = d3.keys(y).filter(function(d) {
      return d !== 'year'; 
    })
  });


  // generate year-by-year descriptive stats
  data.forEach(function(y) {
    var vals = [];
    var num = 0; // number of agencies reporting an estimate that year
    keys.forEach(function(key) {
      if (parseInt(y[key])) {
        num++;  // increment n
      }
      if (y[key]) {
        vals.push(parseInt(y[key]));
      }
    })
    var yearMin = d3.min(vals);
    var yearMax = d3.max(vals);
    var yearMean = d3.mean(vals);
    yearStats.push(
      {
        year: +y.year,
        low: yearMin / 1000000,
        high: yearMax / 1000000,
        mean: yearMean / 1000000,
        range: (yearMax - yearMin) / 1000000,
        n: num,
        stdDev: stdDev(vals) / 1000000
      }
    )
  })
  
  return createVis();

}); // end d3.csv()

function createVis() {
  console.log(yearStats);

  // extent is years
  xScale
    .domain(d3.extent(yearStats, function(d) {
      return d.year;
    }));

  // extent is mean
  yScaleBig 
    .domain(d3.extent(yearStats, function(d) {
      return d.mean;
    }));

  // extent is std dev
  yScaleSmall
    .domain(d3.extent(yearStats, function(d) {
      return d.stdDev;
    }));

  // add X axis
  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + heightBig + ')')
    .call(xAxis)
    .append('text')
      .attr('text-anchor', 'end')
      .text('Year')
      .attr('transform', 'translate(' + width + ',-5)')

  svg
    .selectAll('.tick text')
    .attr('transform', function(d, i) {
      // skip '0' tick
      if (i > 0) {
        return 'rotate(-45)';
      }
    })
    .attr('text-anchor', 'end')
    .attr('y', 10)
    .attr('x', function(d, i) {
      // skip '0' tick
      if (i > 0) {
        return -10
      }
    });

  // add big Y axis
  svg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(0,0)')
    .call(yAxisBig)

  // add little Y axis
//  svg
//    .append('g')
//    .attr('class', 'y axis')
//    .attr('transform', 'translate(0,' + heightBig + ')')
//    .call(yAxisSmall)

  // add consensus line
  svg
    .append('path')
    .datum(yearStats)
      .attr('class', 'line')
      .attr('d', function(d) {
        return line(d);
      })
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-width', 3)

  // add range bar graph
//  svg.selectAll('.rangeBar')
//    .data(yearStats)
//    .enter()
//      .append('rect')
//      .attr('class', 'rangeBar')
//      .style('fill', '#ddd')
//      .attr('x', function(d) {
//        return xScale(d.year) - 1.5;
//      })
//      .attr('y', function(d) {
//        return yScaleBig(d.mean)
//      })
//      .attr('height', function(d) {
//        console.log(yScaleBig(d.range) - heightBig);
//        //return yScaleBig(d.range) - heightBig;
//        return d.range;
//        //return d.range;
//      })
//      .attr('width', 3)
//      .attr('transform', function(d) {
//        return 'translate(0, -' + (d.range / 2) + ')';
//      })
  
    




  // add upside down bar graph for stdDev vals 
  //var barGraph = svg.append('g')
    //.attr('class', 'bar_graph');

//  barGraph
//    .selectAll('rect')
//    .data(yearStats)
//    .enter()
//      .append('rect')
//      .attr('class', 'std_dev')
//      //.attr('stroke', '#000')
//      .attr('x', function(d) {
//        //return xScale(d.year) - ((width / yearStats.length) / 2);
//        return xScale(d.year) - 3;
//      })
//      .attr('y', heightBig)
//      //.attr('width', (width / yearStats.length))
//      .attr('width', 3)
//      .attr('height', function(d) {
//        return yScaleSmall(d.stdDev);
//      })

  // add points to consensus line
  svg
    .selectAll('circle')
    .data(yearStats)
    .enter()
      .append('circle')
      .attr('class', 'mean')
      .attr('cx', function(d) {
        return xScale(d.year);
      })
      .attr('cy', function(d) {
        return yScaleBig(d.mean)
      })
      .attr('r', function(d) {
        //return d.n * 1.8;
        //return Math.pow(d.n, 1.8);
        //return (5 / d.n) * 2;
        //console.log(d.range);
        return 5;
        //return d.range / 2.5;
      })
      .attr('fill', function(d) {
        return 'rgba(95,168,160,' + (Math.pow((d.n / 5), 1.5)) + ')';
        //return 'rgba(95,168,160,' + (d.n / 5) + ')';
      })
  
//  svg
//    .selectAll('circle')
//    .on('mouseover', function(d) {
//      console.log(d.stdDev);
//      var index = yearStats.indexOf(d);
//      var bar = barGraph
//        .select('rect:nth-child(' + (index + 1) + ')')
//        .transition()
//        .duration(250)
//          .style('fill', 'fuchsia')
//    }) 
//    .on('mouseout', function(d) {
//       barGraph
//        .selectAll('rect')
//        .transition()
//        .duration(250)
//          .style('fill', 'cadetblue')
//    })

  var hoverLine = svg.append('line')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', heightBig)
    .style('stroke', '#888')
    
  //var text = svg.append('text')
    //.attr('x', 50)
    //.attr('y', 50)
    //.text('hiya')

  // wire up hoverLine actions
  d3.select('svg')
    .on('mousemove', function() {
      var mouse = d3.mouse(this);
      
      // constrain hoverLine on right and left edges
      if (mouse[0] < marginBigVis.left) {
        mouse[0] = marginBigVis.left;
      } else if (mouse[0] > width + marginBigVis.right 
          + marginBigVis.left - 10) {
        mouse[0] = width + marginBigVis.right + marginBigVis.left - 10;
      }

      // update hoverLine position
      hoverLine
        .attr('x1', mouse[0] - marginBigVis.left 
          - marginBigVis.right + 10)
        .attr('x2', mouse[0] - marginBigVis.left 
          - marginBigVis.right + 10)

      // figure out which year is being hovered over
      var yearHover =   
        Math.floor(xScale.invert(mouse[0] - marginBigVis.left 
        - marginBigVis.right + 10));

      var index;
      yearStats.forEach(function(d, i) {
        if (d.year === yearHover) {
          index = i;
        }
      })

      //d3.select('svg circle:nth-child(' + index + ')')
        //.style('fill', 'fuchsia')


      // update callout
      yearStats.forEach(function(d) {
        if ((d.year) === yearHover) {
          var index = yearStats.indexOf(d);
          d3.select('#year')
            .text(d.year)
          d3.select('#mean')
            .text(decFormat(d.mean) + 'M')
            .style('color', function() {
              return 'rgba(95,168,160,' + (d.n / 5) + ')';
            }) 
          d3.select('#range')
            .text(decFormat(d.range) + 'M')
            .style('color', function() {
              return 'rgba(95,168,160,' + (d.range / 5) + ')';
            }) 
        
        }
      })

      // highlight point being hovered over
      
      
    }); // end d3.select('svg')
    


}; // end createVis()

// calculate standard deviation of an array of numbers
function stdDev(vals) {
  if (vals.length === 1) return 0;

  var mean = d3.mean(vals)
  var sums = [];
  vals.forEach(function(v) {
    sums.push(Math.pow((v - mean), 2));
  });

  return Math.sqrt(d3.sum(sums) / (vals.length - 1));
}
