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
    var popDataRaw = 
      root.find('table.wikitable tbody tr:nth-child(n+12)');

    // we'll keep a 2d array of our rows here, csv-ready
    var popDataFormatted = [];

    var test = [[], []];
    $.each(popDataRaw, function(index) {
      var tds = $(this).find('td');

      $.each(tds, function(index) {
        var year, estCensus, estPopRef, estUn, estHyde, estMadison;
        if (index % 12 === 0) {
          test[index].push(convertToInt($(this).text()));
        } else if (index % 12 === 1) {
          test[index].push(convertToInt($(this).text()));
        } else if (index % 12 === 2) {

        }
      }); // end .each()
    }); // end .each()
    console.log(test);

//    $.each(popDataRaw.find('td'), function(cellIndex) {
//      var numCols = 12;
//      var year, estCensus, estPopRef, estUn, estHyde, estMadison;
//      var data = [];
//
//        if (cellIndex % numCols === 0) {
//          data.push(convertToInt($(this).text()));
//        } else if (cellIndex % numCols === 1) {
//          //console.log(convertToInt($(this).text()));
//          //console.log($(this).text() == );
//          data.push(estCensus = convertToInt($(this).text()));
//        } else if (cellIndex % numCols === 2) {
//          data.push(convertToInt($(this).text()));
//        } else if (cellIndex % numCols === 3) {
//          data.push(convertToInt($(this).text()));
//        } else if (cellIndex % numCols === 4) {
//          data.push(convertToInt($(this).text()));
//        } else if (cellIndex % numCols === 5) {
//          data.push(convertToInt($(this).text()));
//        }
//      
//        popDataFormatted.push(data);
//        //popDataFormatted.push(year + ',' + estCensus + ',' + estPopRef
//          //+ ',' + estUn + ',' + estHyde + ',' + estMadison);
//      //}
//
//    }); // end .each();

    console.log(popDataFormatted);

    //saveToFile(['hello world'], 'text.txt');
  }, // end success
  error: function() {
    return console.log('error');
  }
}); //end .ajax()

var convertToInt = function(str) {
  if (str) {
    return parseInt(str.replace(/,/g, ""), 10);
  } else {
    return 0;
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
