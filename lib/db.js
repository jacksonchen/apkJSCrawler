var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var exec = require('child_process').exec,
    fs = require('fs'),
    App = require('./class/app.js').App;

var accessDB = function(appVersion, outputDir, dest, settings, htmlPath, newhtmlPATH) {
  var mongoURL = 'mongodb://localhost:27017/' + settings.database;

  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    var collection = db.collection(settings.collection);
    findDoc(db, collection, appVersion, function(results) {
      if (results.length === 0) {
        insertDoc(db, collection, appVersion, function() {
          makenewCOMMAND = "mkdir -p " + appVersion.path;
          exec(makenewCOMMAND, function(error, stdout, stderr) {
            if (stderr) return console.log(stderr);
          });

          moveCOMMAND = "mv " + dest + ' ' + appVersion.path + appVersion.name + '-' + appVersion.verc + '.apk';
          exec(moveCOMMAND, function(error, stdout, stderr) {
            if (stderr) return console.log(stderr);
            console.log(stdout);
          });

          if (fs.existsSync(htmlPath)) {
            moveHTMLCOMMAND = "mv " + htmlPath + ' ' + newhtmlPATH + appVersion.name + '.html';
            exec(moveHTMLCOMMAND, function(error, stdout, stderr) {
              if (stderr) return console.log(stderr);
              console.log(stdout);
            });
          }

          db.close();
        })
      }
      else {
        console.log("APK already exists");
        COMMAND = "rm " + dest;
        exec(COMMAND, function(error, stdout, stderr) {
          if (stderr) return console.log(stderr);
        });
        db.close();
      }
    })
  });
}
var insertDoc = function(db, collection, appVersion, callback) {
  collection.insert({'n': appVersion.name, 'vc': appVersion.verc, 'p': appVersion.path}, function(err, r) {
    assert.equal(err, null);
    callback();
  });
}

var findDoc = function(db, collection, appVersion, callback) {
  collection.find({'n': appVersion.name, 'vc': appVersion.verc }).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

module.exports = accessDB;
