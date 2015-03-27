var should = require('chai').should;
var assert = require('chai').assert;
var keywordreader = require('../lib/keywordreader');

describe('Keyword Reader', function () {

  it('reads in a list of keywords from a CSV file', function () {
    keywordreader('../packages.csv', function(err, result){
      should(result.length).not.equal(0)
    });
  })

  it ('trims preceding and trailing whitespace', function() {
    keywordreader('../packages.csv', function(err, result){
      assert.lengthOf(result[1], 4);
    });
  })
})
