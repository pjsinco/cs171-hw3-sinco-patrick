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

dataset = [];

svg = d3.select('body')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)

svg
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' 
    + margin.top + ')');


  
d3.csv('unHealth.csv', function(error, data) {



}); // end d3.csv();

