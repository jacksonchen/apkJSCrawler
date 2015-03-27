var exec = require('child_process').exec,
    App = require('./class/app.js').App;

var mongoURL = 'mongodb://localhost:27017/apkJSCrawler';
var p = {};

var accessDB = function(appVersion, collectionName, outputDir, db) {
  p[colName] = collectionName;

  results = db.p.colName.findOne({'n': appVersion.name, 'vc': appVersion.verc });
  if (results.length == 0) {
    db.collection(p.colName).insertOne({'n': appVersion.name, 'vc': appVersion.verc, 'p': appVersion.path}, function(err, r) {
      assert.equal(null, err);
      assert.equal(1, r.insertedCount);
      COMMAND = "mv " + outputDir + "/temp.apk " + appVersion.path;
      exec(COMMAND, function(error, stdout, stderr) {
        if (stderr) return console.log(stderr);
      });
    });
  }
  else {
    console.log("APK already exists");
  }
}

module.exports = accessDB;
