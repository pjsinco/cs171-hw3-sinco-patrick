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

var svg = d3.select('body')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' 
    + margin.right + ')')

var years = [];

d3.csv('population-data.csv', function(data) {
  
  // fill in missing values
  var keys = d3.keys(data[0])
    .filter(function(key) {
      return key !== 'year';
    })

  var firstYearWithData = {};

  keys.forEach(function(key) {
    var c = 0;
    while (c < data.length) {
      if (!data[c][key]) {
        c++;
      } else {
        firstYearWithData[key] = c;
        break;
      }
    }
  });

  
  

//  // intepolate missing data
//  data.forEach(function(year) {
//    // find first year with nonzero data
//    var c = 0;
//    var firstYearWithData;
//    
//    //for (var col in year) {
//      for (var i = 0; i < data.length; i++) {
//        console.log(data[i]);
//      }
//      //if (col !== 'year') {
//        //console.log(year[col]);  
//      //}
//    //}
//  });

  data.forEach(function(year) {
    // make array of estimates for the year
    var vals = [];
    for (var col in year) {
      if (col !== 'year') {
        vals.push(parseInt(year[col]));
      }
    }
  
    // set descriptive stats
    year.min = d3.min(vals);
    year.mean = d3.mean(vals);
    year.max = d3.max(vals);
    year.range = year.max - year.min;

  });

  years = data;
  
  
  //years = data.map(function(year) {
    //console.log(year.year);
    //return {
      //year: year.year,
    //}
  //});
  
  //data.forEach(function(year) {
    
  //}


  return createVis();
}); // end d3.csv()

var createVis = function() {
  //console.log(years);




  var visFrame = svg.append('g')
    .attr('transform', 'translate(' + bbVis.x + ',' 
      + (bbVis.y + bbVis.h) + ')');
    // ...

  visFrame.append('rect')
    //.attr('fill', 'cadetblue')
    //.attr('width', 100)
    //.attr('height', 100)
    // ...

} // end createVis()
