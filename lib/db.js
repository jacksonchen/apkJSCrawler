var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var exec = require('child_process').exec,
    fs = require('fs'),
    config = require('config'),
    App = require('./class/app.js').App;

var accessDB = function(appVersion, outputDir, dest, htmlPath, newhtmlPATH, tempCommentPath) {
  var hostName = config.get('dbConfig.host'),
      portNumber = config.get('dbConfig.port'),
      dbName = config.get('dbConfig.db'),
      collectionName = config.get('dbConfig.collection');
  var mongoURL = 'mongodb://' + hostName + ':' + portNumber + '/' + dbName;

  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    var collection = db.collection(collectionName);
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

              if (tempCommentPath != null) {
                moveCommentCOMMAND = "mv " + tempCommentPath + ' ' + newhtmlPATH + appVersion.name + '-' + appVersion.verc + '.json5';
                exec(moveCommentCOMMAND, function(error, stdout, stderr) {
                  if (stderr) return console.log(stderr);
                  console.log(stdout);
                });
              }
            });
          }

          db.close();
        })
      }
      else {
        console.log("APK already exists");
        DELETEHTML = "rm " + htmlPath;
        exec(DELETEHTML, function(error, stdout, stderr) {
          if (stderr) return console.log(stderr);
          COMMAND = "rm " + dest;
          exec(COMMAND, function(error, stdout, stderr) {
            if (stderr) return console.log(stderr);
          });
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
