var sanitize = require("sanitize-filename"),
    request = require('request'),
    cheerio = require('cheerio'),
    exec = require('child_process').exec,
    async = require('async'),
    http = require('follow-redirects').http,
    fs = require('fs'),
    App = require('./class/app.js').App,
    Setting = require('./class/setting.js').Setting;

var packageReader = require('./packagereader.js');
    dbRead = require('./db.js');

var getHTML = function(url, outputDir, callback) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(body);
      var title = sanitize($('h2.single-title').text()).replace(/ /g, '');

      request(url).pipe(fs.createWriteStream(outputDir + '/temp-' + title + '.html'));
      console.log("HTML downloaded from " + url);
      callback(body, title);
    }
    else {
      console.log(url + " has an ERROR");
    }
  });
}

var parseBody = function(html, outputDir, settings, title) {
  $ = cheerio.load(html);
  var links = $('a.download-btn').get();
  var counter = 0;
  links.forEach(function(linkBlock) {
    downloadAPK(linkBlock, title, counter, outputDir, function(dest) {
      packageReader(outputDir, settings, dest, function(appVersion) {
        dbRead(appVersion, settings.collection, outputDir, dest, settings);
      });
    })
    counter += 1;
  });
}

var downloadAPK = function(linkBlock, title, counter, outputDir, cb) {
  var dest = outputDir + '/temp-' + title + '-' + counter + '.apk',
      file = fs.createWriteStream(dest);

  fs.writeFile(dest, '', function(err) {
    if (err) return console.log(err);
  })

  var r = http.get(linkBlock.attribs.href, function(response) {
    console.log("Got response: " + response.statusCode + " from " + linkBlock.attribs.href);
    response.pipe(file);
    counter += 1;
    file.on('finish', function() {
      console.log("APK Downloaded from " + linkBlock.attribs.href);
      file.close(cb(dest));
    });
  }).on('error', function(err) {
    console.log("Uh oh , error getting page");
    fs.unlink(dest);
    if (cb) cb(err.message);
  });
}

var download = function(url, outputDir, settings) {
  getHTML(url, outputDir, function(html, title) {
    parseBody(html, outputDir, settings, title);
  });
}

module.exports = download;
