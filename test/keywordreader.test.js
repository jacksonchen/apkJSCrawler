var keywordreader = require('../lib/keywordreader'),
    chai = require("chai"),
    fs = require('fs'),
    filePath = __dirname + "/keywordreaderTest.csv";


chai.Should();


describe('Keyword Reader', function () {

  before(function(done) {
    fs.writeFile(filePath, "test\n\u0020Evernote\u0020", function(err) {
      if(err) throw err;
      console.log(filePath);
      done();
    });
  });

  it('reads in a list of keywords from a CSV file', function (done) {
    keywordreader(filePath, function(err, result){
      if (err) throw err;
      result.should.have.length(2);
      done();
    });
  })

  it ('trims preceding and trailing whitespace', function(done) {
    keywordreader(filePath, function(err, result) {
      if (err) throw err;
      result[1].should.have.length(8);
      done();
    });
  })

  after(function(done) {
    fs.unlink(filePath, function(err) {
      if(err) throw err;
      done();
    });
  });

})
