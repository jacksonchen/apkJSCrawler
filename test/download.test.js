var expect = require('chai').expect
var download = require('../lib/download')

describe('download', function () {

  it('find a list of URLs for the keyword note', function () {
    var url = "http://www.androiddrawer.com/24639/download-evernote-app-apk/";
    var result = download(url);
    expect(result).to.have.length(2);
  })

})
