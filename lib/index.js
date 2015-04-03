var fs = require('fs'),
    S = require('string'),
    Setting = require('./class/setting.js').Setting;

var crawler = {}
crawler.keywordreader = require('./keywordreader.js')
crawler.url_generator = require('./url.generator.js')
crawler.download = require('./download.js')

function readSettings(callback) {
  fs.readFile('config.json', function(err, data) {
    if (err) throw err;
    var configData = JSON.parse(data).config,
      settings = new Setting(configData.dbCollectionName, configData.database);
    callback(settings);
  });
}

function init(arg, inputType) {
  outputDir = process.argv.slice(2)[2];
  readSettings(function(settings) {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    if (inputType == "file") {
      crawler.keywordreader(process.argv.slice(2)[1], function(err, keywords){
        console.log("Total keywords read: " + keywords.length);
        keywords.forEach(function(keyword) {
          crawler.url_generator(keyword, function(err, urls) {
            console.log("~~~~~~~~~~~~~~" + urls.length + " urls detected for keyword " + keyword + "~~~~~~~~~~~~~~");
            urls.forEach(function(url) {
              crawler.download(url, outputDir, settings);
            });
          });
        });
      });
    }
    else {
      var keyword = process.argv.slice(2)[1];
      console.log("Keyword inputted: " + keyword);
      crawler.url_generator(keyword, function(err, urls) {
        console.log("~~~~~~~~~~~~~~" + urls.length + " urls detected for keyword " + keyword + "~~~~~~~~~~~~~~");
        urls.forEach(function(url) {
          crawler.download(url, outputDir, settings);
        });
      });
    }
  });
}


module.exports = {init : init};





