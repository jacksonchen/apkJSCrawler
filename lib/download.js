var sanitize = require("sanitize-filename"),
    request = require('request'),
    cheerio = require('cheerio'),
    exec = require('child_process').exec,
    async = require('async'),
    http = require('follow-redirects').http,
    fs = require('fs'),
    App = require('./class/app.js').App;

var packageReader = require('./packagereader.js');
    dbRead = require('./db.js');

var getHTML = function(url, outputDir, title, callback) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var sanitizedTitle = sanitize(title).replace(/ /g, '').replace(/&/g, ''),
          htmlPath = outputDir + '/temp-' + title + '.html';

      request(url).pipe(fs.createWriteStream(htmlPath));
      console.log("HTML downloaded from " + url);
      callback(sanitizedTitle, htmlPath);
    }
    else {
      console.log(url + " has an ERROR");
    }
  });
}

var downloadAPK = function(url, title, counter, outputDir, cb) {
  var dest = outputDir + '/temp-' + title + '-' + counter + '.apk',
      file = fs.createWriteStream(dest);

  fs.writeFile(dest, '', function(err) {
    if (err) return console.log(err);
  })

  var r = http.get(url, function(response) {
    console.log("Got response: " + response.statusCode + " from " + url);
    response.pipe(file);
    counter += 1;
    file.on('finish', function() {
      console.log("APK Downloaded from " + url);
      file.close(cb(dest));
    });
  }).on('error', function(err) {
    console.log("Uh oh , error getting page");
    fs.unlink(dest);
    if (cb) cb(err.message);
  });
}

var download = function(outputDir, settings, APKLinks, title, htmlPath) {
  var counter = 0;
  APKLinks.forEach(function(link) {
    downloadAPK(link, title, counter, outputDir, function(dest) {
      packageReader(outputDir, dest, function(appVersion, newhtmlPATH) {
        dbRead(appVersion, outputDir, dest, settings, htmlPath, newhtmlPATH);
      });
    })
    counter += 1;
  });
}

module.exports = download;
module.exports.getHTML = getHTML;
module.exports.downloadAPK = downloadAPK;
