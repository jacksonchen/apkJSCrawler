var MongoClient = require('mongodb').MongoClient,
    should = require('chai').should();

var mongoURL = 'mongodb://localhost:27017/apkdb';

describe('db Connection', function(){
    var db;
    before(function(done){
      MongoClient.connect(mongoURL, function(err, result) {
        if (err) throw err;
        should.exist(result);
        db = result
        done();
      });
    });

    it('should find something in the database', function(done){
      should.exist({a:'abc'})
      done();
    })

    after(function(done) {
      db.close();
      done();
    })

});
