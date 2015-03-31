var expect = require('chai').expect,
    assert = require('chai').assert,
    generator = require('../lib/url.generator'),
    rePattern = new RegExp(/^http\:\/\/www\.androiddrawer\.com\/\d+\/download[\d\w\-]+\//),
    blogPattern = new RegExp(/^http:\/\/www.blog.androiddrawer.com/),
    helpPattern = new RegExp(/^http:\/\/www.androiddrawer.com\/help/);

describe('URL Generator', function () {

  it('generates 10 urls', function (done) {
    this.timeout(20000);
    generator('evernote', function(err, result){
      assert.lengthOf(result, 10);
      done();
    });
  })

  it('generates an actual AndroidDrawer URL', function (done) {
    this.timeout(20000);
    generator('evernote', function(err, result){
      expect(result[1]).to.match(rePattern);
      done();
    });
  })

  it('ignores URLs that are blog posts', function (done) {
    this.timeout(20000);
    generator('blog', function(err, result){
      result.forEach(function(link) {
        assert.notMatch(link, blogPattern);
      })
      done();
    });
  })

  it('ignores URLs that are help pages', function (done) {
    this.timeout(20000);
    generator('help', function(err, result){
      result.forEach(function(link) {
        assert.notMatch(link, helpPattern);
      })
      done();
    });
  })
})
