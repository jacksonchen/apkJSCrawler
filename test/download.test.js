var chai = require('chai'),
    assert = chai.assert,
    cheerio = require('cheerio'),
    fs = require('fs'),
    exec = require('child_process').exec,
    download = require('../lib/download'),
    titleMatch = new RegExp(/[,:?\*'"<>|&\s]/),
    directoryMatch = new RegExp(/(\/[^\/]+)+/),
    filePath = __dirname + "/apks",
    url = "http://www.androiddrawer.com/24639/download-evernote-app-apk/";

chai.Should();

describe('Download HTML and APK', function () {

  before(function(done) {
    makenewCOMMAND = "mkdir -p " + filePath;
    exec(makenewCOMMAND, function(error, stdout, stderr) {
      if (stderr) return console.log(stderr);
    });
    done();
  });

  it('downloads the HTML page for ', function (done) {
    this.timeout(20000);
    download.getHTML(url, filePath, function(body, title, htmlPath) {
      $ = cheerio.load(body);
      $('h3.section-title')[3].should.exist;
      done();
    });
  });

  it('temporary app title is filename safe', function (done) {
    this.timeout(20000);
    download.getHTML(url, filePath, function(body, title, htmlPath) {
      assert.notMatch(title, titleMatch);
      done();
    });
  });

  it('checks if HTML directory path is valid', function (done) {
    this.timeout(20000);
    download.getHTML(url, filePath, function(body, title, htmlPath) {
      htmlPath.should.match(directoryMatch);
      done();
    });
  });

  after(function(done) {
    deleteCOMMAND = "rm -rf " + filePath;
    exec(deleteCOMMAND, function(error, stdout, stderr) {
      if (stderr) return console.log(stderr);
      done();
    });
  });

})
