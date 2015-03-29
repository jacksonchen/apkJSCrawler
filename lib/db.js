var exec = require('child_process').exec,
    App = require('./class/app.js').App;

var accessDB = function(appVersion, collectionName, outputDir, dest, db) {
  var collection = db.collection(collectionName);

  results = collection.findOne({'n': appVersion.name, 'vc': appVersion.verc });
  console.log("RESULTS: " + results)
  if (typeof results === 'undefined') {
    makenewCOMMAND = "mkdir -p " + appVersion.path;
    exec(makenewCOMMAND, function(error, stdout, stderr) {
      if (stderr) return console.log(stderr);
    });

    moveCOMMAND = "mv " + dest + ' ' + appVersion.path + appVersion.name + '-' + appVersion.verc;
    exec(moveCOMMAND, function(error, stdout, stderr) {
      if (stderr) return console.log(stderr);
      console.log(stdout);
    });

    collection.insertOne({'n': appVersion.name, 'vc': appVersion.verc, 'p': appVersion.path}, function(err, r) {
      assert.equal(null, err);
      assert.equal(1, r.insertedCount);
    });
  }
  else {
    console.log("APK already exists");
    COMMAND = "rm " + dest;
    exec(COMMAND, function(error, stdout, stderr) {
      if (stderr) return console.log(stderr);
    });
  }
}

module.exports = accessDB;
