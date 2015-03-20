var cheerio = require('cheerio');
var mocha = require('mocha');
var S = require('string');
var _ = require('lodash');
var load_ajax = require('./load_ajax.js');
var fs = require('fs');
  readline = require('readline');

var BASE_URL = 'http://androiddrawer.com'
var SEARCH_PATH = '/search-results'
var QUERY_STRING = '/?q='

function downloadDrawer(keyword) {
  androidDrawerUrl = BASE_URL + SEARCH_PATH + QUERY_STRING + keyword
  load_ajax.loadAjax(androidDrawerUrl, function(error, result){
      var html = result.to something
  });
}

function browseQuery(keyword, htmlDoc) {
  $ = cheerio.load(htmlDoc);

  return $('a.gs-title').html();
}

fs.readFile(process.argv.slice(2).toString(), function(err, f){
  if (err) {
    return console.log(err);
  }
  var keywords = f.toString().split('\n');

  // Processing
  keywords = _.without(keywords, '');
  keywords.forEach(function(keyword) {
    keyword = S(keyword).trim().s;

    console.log("~~~~~~~~~~~~~~~~~~~Keyword: " + keyword + "~~~~~~~~~~~~~~~~~~~");
    htmlDoc = S(downloadDrawer(keyword)).escapeHTML().s;
    console.log(browseQuery(keyword, htmlDoc));
  });
});
