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
      console.log($(value).text()); // print text
    });

    saveToFile(['hello world'], 'text.txt');
  }, // end success
  error: function() {
    return console.log('error');
  }
}); //end .ajax()

var convertToInt = function(str) {
  return parseInt(str.replace(/,/g, ""), 10);
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
