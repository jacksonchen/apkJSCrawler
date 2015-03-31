var expect = require('chai').expect,
    assert = require('chai').assert,
    cheerio = require('cheerio'),
    fs = require('fs'),
    exec = require('child_process').exec,
    download = require('../lib/download'),
    titleMatch = new RegExp(/[,:?\*'"<>|&\s]/),
    directoryMatch = new RegExp(/(\/[^\/]+)+/),
    filePath = __dirname + "/apks",
    url = "http://www.androiddrawer.com/24639/download-evernote-app-apk/";

function readAapt(callback) {
  fs.readFile('../config.json', function(err, data) {
    if (err) throw err;
    var configData = JSON.parse(data).config,
        aapt = configData.aapt;
    callback(aapt);
  });
}

describe('Download HTML and APK', function () {

  before(function(done) {
    makenewCOMMAND = "mkdir -p " + filePath;
    exec(makenewCOMMAND, function(error, stdout, stderr) {
      if (stderr) return console.log(stderr);
    });
    done();
  });

  it('downloads the HTML page for ', function (done) {
    download.getHTML(url, filePath, function(body, title, htmlPath) {
      $ = cheerio.load(body);
      expect($('h3.section-title')[3]).to.exist;
      done();
    });
  });

  it('temporary app title is filename safe', function (done) {
    download.getHTML(url, filePath, function(body, title, htmlPath) {
      assert.notMatch(title, titleMatch);
      done();
    });
  });

  it('checks if HTML directory path is valid', function (done) {
    download.getHTML(url, filePath, function(body, title, htmlPath) {
      expect(htmlPath).to.match(directoryMatch);
      done();
    });
  });

  it('checks if apk has been properly downloaded', function (done) {
    url = "http://www.androiddrawer.com/download2/uc?export=download&confirm=no_antivirus&id=0B8muzPZAeiQ6VGVlVnJhbWpOV3M";
    this.timeout(20000);
    download.downloadAPK(url, "Evernote", 1, filePath, function(dest) {
      readAapt(function(aapt) {
        COMMAND =  aapt + " dump badging " + dest;
        exec(COMMAND, function(error, stdout, stderr) {
          expect(stderr).to.be.empty;
          done();
        });
      })
    });
  });

  // after(function(done) {
  //   deleteCOMMAND = "rm -rf " + filePath;
  //   exec(deleteCOMMAND, function(error, stdout, stderr) {
  //     if (stderr) return console.log(stderr);
  //   });
  //   done();
  // });

})
