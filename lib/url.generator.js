var Nightmare = require('nightmare'),
    cheerio = require('cheerio'),
    _ = require('lodash');
    blogPattern = new RegExp(/^http:\/\/www.blog.androiddrawer.com/);
    helpPattern = new RegExp(/^http:\/\/www.androiddrawer.com\/help/);

var BASE_URL = 'http://androiddrawer.com',
    SEARCH_PATH = '/search-results',
    QUERY_STRING = '/?q='

var loadAjax = function(url, callback) {
  new Nightmare()
    .goto(url)
      .wait('.gsc-table-result')
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

    //Checks to make sure link is not a help page or blog post
    if (!helpPattern.test(linkBlock.attribs.href) && !blogPattern.test(linkBlock.attribs.href)) {
      linkArray.push(linkBlock.attribs.href);
    }
  });
  callback(linkArray);
}

var generator = function(keyword, callback) {
  androidDrawerUrl = BASE_URL + SEARCH_PATH + QUERY_STRING + keyword
  loadAjax(androidDrawerUrl, function(html) {
    parseHTML(html, function(linkArray) {
      linkArray = _.compact(linkArray);
      linkArray = _.uniq(linkArray);
      callback(null, linkArray);
    });
  });
}

module.exports = generator;
