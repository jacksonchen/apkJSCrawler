var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    _ = require('lodash'),
    fs = require('fs'),
    S = require('string'),
    Setting = require('./class/setting.js').Setting;

var mongoURL = 'mongodb://localhost:27017/apkJSCrawler';

var crawler = {}
crawler.keywordreader = require('./keywordreader.js')
crawler.url_generator = require('./url.generator.js')
crawler.download = require('./download.js')

function readSettings(callback) {
  fs.readFile('config.json', function(err, data) {
    if (err) throw err;
    var configData = JSON.parse(data).config,
      settings = new Setting(configData.aapt, configData.dbCollectionName);
    callback(settings);
  });
}

function init(arg) {
  outputDir = process.argv.slice(2)[2];
  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    readSettings(function(settings) {
      if (!fs.existsSync()) {
        fs.mkdirSync(outputDir);
      }
      fs.writeFile(outputDir + '/temp.html', '', function(err) {
        if (err) return console.log(err);
      })
      fs.writeFile(outputDir + '/temp.apk', '', function(err) {
        if (err) return console.log(err);
      })
      crawler.keywordreader(process.argv.slice(2)[1], function(err, keywords){
        console.log("Total keywords read: " + keywords.length);
        keywords.forEach(function(keyword) {
          crawler.url_generator(keyword, function(err, urls) {
            urls = _.compact(urls);
            urls = _.uniq(urls);
            console.log("~~~~~~~~~~~~~~" + urls.length + " urls detected for keyword " + keyword + "~~~~~~~~~~~~~~");
            urls.forEach(function(url) {
              crawler.download(url, outputDir, settings, db);
            });
          });
        });
      });
    })
    db.close();
  });
}


module.exports = {init : init};





