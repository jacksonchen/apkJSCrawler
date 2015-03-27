var S = require('string'),
    fs = require('fs'),
    readline = require('readline'),
    _ = require('lodash');


var reader = function(input, callback) {
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
    callback(null, keywords);
  });
}

module.exports = reader;
