var convertToInt;

$.ajax({
  url: 'http://en.wikipedia.org/wiki/World_population_estimates',
  type: 'GET',
  cache: false,
  success: function(data) {
    var root, allData, body, table;
    root = $('<div></div>');
    root.html(data.responseText);
  
    // find all nodes with id 'content'
    var content = root.find('#content');

    // search in all content nodes for nodes of class
    // .mw-headline
    var h2s = content.find('.mw-headline');

    $.each(h2s, function(index, value) {
      //console.log($(this).text());
      //console.log($(value).text()); // print text
    });
    
    // get the rows we're interested in
    var data = 
      root.find('table.wikitable tbody tr:nth-child(n+12)');

    // array for collecting rows 
    var dataRow = [];
    // temp array for collecting values
    var csvRow = [];

    // get header row and put in data
    var headers = root.find('table.wikitable th')
    $.each(headers, function(i) {
      if (i === 0 || i === 1 || i === 2 || 
        i === 3 || i === 4 || i === 5) {
        csvRow.push($(this).find('>:first-child').text());
      }
    });
    dataRow.push(csvRow.join(','));

    // mine our captured rows for our targeted <td> values 
    $.each(data, function(index) {

      var tds = $(this).find('td'); // get 
      csvRow = [] 

      $.each(tds, function(i) {
        //var val = convertToInt($(this).text().trim());
        // grab values from first 6 elements in row
        if (i === 0 || i === 1 || i === 2 ||
          i === 3 || i === 4 || i === 5) {
          csvRow.push(convertToInt($(this).text().trim()));
        } else if (i === 11) {
          // we're at the end of row, so push to master array
          // and clear temp array
          for (var j = 1; j < csvRow.length; j++) {
            if (csvRow[j]) {
              dataRow.push(csvRow.join(','));
              break;
            } else {
              continue;
            }
            csvRow = [];
          }
        }
      }); // end .each()
    }); // end .each()
    
    saveToFile(dataRow, 'data.csv');
  }, // end success
  error: function() {
    return console.log('error');
  }
}); //end .ajax()

var convertToInt = function(str) {
  if (str) {
    return parseInt(str.replace(/,/g, ""), 10);
  } else {
    return null;
  }
};

// takes an array of strings
// and writes them line by line into a file given by filename
var saveToFile = function(arrayOfLines, fileName) {
  // add line breaks at the end
  var blob, blobText;

  blobText = arrayOfLines.map(function(d) {
    if (d.endsWith('\n')) {
      return d;
    } else {
      return d + '\n';
    }
  });

  blob = new Blob(blobText, {
    type: 'text/plain; charset=utf-8'
  });

  return saveAs(blob, fileName);
};

String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
