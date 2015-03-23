var S = require('string');
var fs = require('fs');
  readline = require('readline');
var _ = require('lodash');


var reader = function(input) {
  fs.readFile(input, function(err, f){
    if (err) {
      return console.log(err);
    }
    var keywords = f.toString().split('\n');

    // Processing
    keywords = _.without(keywords, '');
    keywords.forEach(function(element, index) {
      keywords[index] = S(element).trim().s;
    });
    return keywords;
  });
}

exports.reader = reader;
