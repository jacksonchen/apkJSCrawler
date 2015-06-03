var fs = require('fs'),
    S = require('string'),
    path = require('path');

var crawler = {}
crawler.keywordreader = require('./keywordreader.js')
crawler.packageReader = require('./packagereader.js')
crawler.dbRead = require('./db.js')

function readKeywordFile(inputDir, output_dir, pluginPath) {
  if (pluginPath == '') { throw new Error('Plugin not provided');}
  crawler.keywordreader(inputDir, function(err, keywords){
    if (err) throw err;
    console.log("Total keywords read: " + keywords.length);
    keywords.forEach(function(keyword) {
      readKeyword(keyword, output_dir, pluginPath);
    });
  });
}

function readKeyword(keyword, output_dir, pluginPath) {
  if (pluginPath == '') { throw new Error('Plugin not provided');}
  var plugin = require(path.resolve(pluginPath) + "/lib/index.js");
  plugin.init(keyword, output_dir, function(tempAPKdest, htmlPath) {
    crawler.packageReader(output_dir, tempAPKdest, htmlPath, function(appVersion, newhtmlPATH) {
      crawler.dbRead(appVersion, output_dir, tempAPKdest, htmlPath, newhtmlPATH);
    });
  });
}


module.exports.readKeywordFile = readKeywordFile;
module.exports.readKeyword = readKeyword;
