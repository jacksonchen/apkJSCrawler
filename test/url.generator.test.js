var expect = require('chai').expect;
var assert = require('chai').assert;
var generator = require('../lib/url.generator');
var rePattern = new RegExp(/^http\:\/\/www\.androiddrawer\.com\/\d+\/download[\d\w\-]+\//);

describe('URL Generator', function () {

  it('generates 10 urls', function () {
    generator('evernote', function(err, result){
      assert.lengthOf(result, 10);
    });
  })

  it('generates an actual AndroidDrawer URL', function () {
    generator('evernote', function(err, result){
      expect(result.match(rePattern)).to.equal(true);
    });
  })
})
