var fs = require('fs'),
    S = require('string'),
    log4js = require('log4js'),
    keywordsem = require('semaphore')(1),
    appsem = require('semaphore')(1),
    logger = log4js.getLogger('Core'),
    path = require('path');

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'play.log' }
  ]
});

var crawler = {}
crawler.keywordreader = require('./keywordreader.js')
crawler.packageReader = require('./packagereader.js')
crawler.dbRead = require('./db.js')

function readKeywordFile(inputDir, output_dir, pluginPath, action) {
  crawler.keywordreader(inputDir, function(err, keywords){
    if (err) throw err;
    logger.info("readKeywordFile::Total keywords read: " + keywords.length);
    keywords.forEach(function(keyword) {
      keywordsem.take(function() {
        readKeyword(keyword, output_dir, pluginPath, action, function(last) {
          if (last) {
            keywordsem.leave();
          }
        });
      })
    });
  });
}

function readKeyword(keyword, output_dir, pluginPath, action, callback) {
  var plugin = require(path.resolve(pluginPath, "lib", "index.js"));
  plugin.init(keyword, output_dir, appsem, function(tempAPKdest, htmlPath, tempCommentPath, last) {
    if (tempCommentPath != null && htmlPath != null && tempCommentPath != null) {
      crawler.packageReader(output_dir, tempAPKdest, htmlPath, function(appVersion, dirpluginPATH) {
        crawler.dbRead(appVersion, output_dir, tempAPKdest, htmlPath, tempCommentPath, dirpluginPATH, function() {
          logger.info("init::Finish download " + appVersion.ID);
          appsem.leave();
          if (action === "file") {
            callback(last);
          }
        });
      });
    }
    else {
      if (action === "file") {
        callback(last);
      }
    }
  });
}


module.exports.readKeywordFile = readKeywordFile;
module.exports.readKeyword = readKeyword;
