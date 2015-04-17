var fs = require('fs'),
    S = require('string'),
    Setting = require('./class/setting.js').Setting;

var crawler = {}
crawler.keywordreader = require('./keywordreader.js')
crawler.download = require('./download.js')

function readSettings(Settingsdir, callback) {
  fs.readFile(Settingsdir, function(err, data) {
    if (err) throw err;
    var configData = JSON.parse(data).config,
      settings = new Setting(configData.dbCollectionName, configData.database);
    callback(settings);
  });
}

function readKeyword(inputDir, callback) {
  crawler.keywordreader(inputDir, function(err, keywords){
    console.log("Total keywords read: " + keywords.length);
    callback(keywords);
  });
}

function downloadAPK(APKLinks, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  crawler.download(APKLinks, outputDir, settings);
}


module.exports.readSettings = readSettings;
module.exports.readKeyword = readKeyword;
module.exports.downloadAPK = downloadAPK;




