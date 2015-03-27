var Nightmare = require('nightmare'),
    cheerio = require('cheerio'),
    _ = require('lodash');

var BASE_URL = 'http://androiddrawer.com',
    SEARCH_PATH = '/search-results',
    QUERY_STRING = '/?q='

var loadAjax = function(url, callback) {
  new Nightmare()
    .goto(url)
      .wait(1000)
      .evaluate(function() { return document.body.innerHTML; }, function(result) {
        callback(result);
      })
      .run(function (err, nightmare) {
        if (err) return console.log(err);
      });
}

var parseHTML = function(html, callback) {
  var linkArray = [];
  $ = cheerio.load(html);
  linkBlockArray = $('a.gs-title').get();
  linkBlockArray.forEach(function(linkBlock) {
    linkArray.push(linkBlock.attribs.href);
  });
  callback(linkArray);
}

var generator = function(keyword, callback) {
  androidDrawerUrl = BASE_URL + SEARCH_PATH + QUERY_STRING + keyword
  loadAjax(androidDrawerUrl, function(html) {
    parseHTML(html, function(linkArray) {
      callback(null, linkArray);
    });
  });
}

module.exports = generator;
