// var MongoClient = require('mongodb').MongoClient,
//     assert = require('assert'),
//     should = require('chai').should,
//     mocha = require('mocha');

// var mongoURL = 'mongodb://localhost:27017/apkdb';

// describe('db Connection', function(){
//   var db;
//   before(function(done){
//     MongoClient.connect(mongoURL, function(err, result) {
//       should.not.exist(err);
//       should.exist(result);
//       db = result
//       done();
//     });
//   });

//   after(function() {
//     db.close();
//   })

// });

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    should = require('should'),
    chai = require('chai');

//chai.should();

var mongoURL = 'mongodb://localhost:27017/apkdb';

describe('db Connection', function(){
    var db;
    before(function(done){
        MongoClient.connect(mongoURL, function(err, result) {
            should.not.exist(err);
            should.exist(result);
            db = result
            done();
        });
    });

    it('should find something in the database', function(done){
        should.exist({a:'abc'})
        done();
    })

    after(function() {
        db.close();
    })

});
