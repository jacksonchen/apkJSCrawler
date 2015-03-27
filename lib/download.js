var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    _ = require('lodash'),
    App = require('./class/app.js').App,
    Setting = require('./class/setting.js').Setting;

var packageReader = require('./packagereader.js');
    dbRead = require('./db.js');

var getHTML = function(url, outputDir, callback) {
  request(url).pipe(fs.createWriteStream(outputDir + '/temp.html'));
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("HTML downloaded from " + url);
      callback(body);
    }
    else {
      console.log(url + " has an ERROR");
    }
  });
}

var parseBody = function(html, outputDir, settings, db) {
  $ = cheerio.load(html);

  _.forEach($('a.download-btn').get(), function(linkBlock) {
    var r = request(linkBlock.attribs.href).pipe(fs.createWriteStream(outputDir + '/temp.apk'));
    r.on('finish', function() {
      console.log("APK file downloaded from " + linkBlock.attribs.href);
      packageReader(outputDir, settings, function(appVersion) {
        dbRead(appVersion, settings.collection, outputDir, db);
      });
    });
  });
}

var download = function(url, outputDir, settings, db) {
  getHTML(url, outputDir, function(html) {
    parseBody(html, outputDir, settings, db);
  });
}

module.exports = download;
