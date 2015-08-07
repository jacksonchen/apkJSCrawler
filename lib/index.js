var fs = require('fs'),
    S = require('string'),
    log4js = require('log4js'),
    keywordsem = require('semaphore')(1),
    logger = log4js.getLogger('Core'),
    path = require('path');

var crawler = {}
crawler.keywordreader = require('./keywordreader.js')
crawler.packageReader = require('./packagereader.js')
crawler.dbRead = require('./db.js')

function readKeywordFile(inputDir, output_dir, pluginPath) {
  crawler.keywordreader(inputDir, function(err, keywords){
    if (err) throw err;
    logger.info("readKeywordFile::Total keywords read: " + keywords.length);
    keywords.forEach(function(keyword) {
      keywordsem.take(function() {
        logger.debug("Semaphore keywordsem taken")
        readKeyword(keyword, output_dir, pluginPath, function(last) {
          if (last) {
            logger.debug("Semaphore keywordsem leave")
            keywordsem.leave();
          }
        });
      })
    });
  });
}

function readKeyword(keyword, output_dir, pluginPath, callback) {
  var plugin = require(path.resolve(pluginPath) + "/lib/index.js");
  plugin.init(keyword, output_dir, function(tempAPKdest, htmlPath, tempCommentPath, last) {
    if (tempCommentPath != null && htmlPath != null && tempCommentPath != null) {
      crawler.packageReader(output_dir, tempAPKdest, htmlPath, function(appVersion, newhtmlPATH) {
        crawler.dbRead(appVersion, output_dir, tempAPKdest, htmlPath, newhtmlPATH, tempCommentPath, function() {
          callback(last);
        });
      });
    }
    else {
      callback(last);
    }
  });
}


module.exports.readKeywordFile = readKeywordFile;
module.exports.readKeyword = readKeyword;
