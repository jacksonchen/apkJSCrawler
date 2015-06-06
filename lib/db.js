var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var exec = require('child_process').exec,
    execSync = require('child_process').execSync,
    fs = require('fs'),
    log4js = require('log4js'),
    logger = log4js.getLogger('Core'),
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
    logger.info("accessDB::Connected correctly to server for " + appVersion.name + "-" + appVersion.verc);

    var collection = db.collection(collectionName);
    findDoc(db, collection, appVersion, function(results) {
      if (results.length === 0) {
        insertDoc(db, collection, appVersion, function() {
          makenewCOMMAND = "mkdir -p " + appVersion.path;
          exec(makenewCOMMAND, function(error, stdout, stderr) {
            if (stderr || error) {
              logger.error("accessDB::Making new directory failed for " + appVersion.path);
              return logger.error("accessDB::stderr:" + stderr + ". Error:" + error);
            }
            logger.info("accessDB::Successfully made directory " + appVersion.path);

            moveCOMMAND = "mv " + dest + ' ' + appVersion.path + appVersion.name + '-' + appVersion.verc + '.apk';
            try {
              var error, stderr, stdout = execSync(moveCOMMAND);
              if (stderr || error) { logger.error("accessDB::" + stderr); }

              logger.info("accessDB::Moved APK to " + appVersion.path);
            }
            catch (ex) {
              logger.error("accessDB::Moving " + dest + " to " + appVersion.path + " failed");
              return logger.error("accessDB::" + ex);
            }

            if (fs.existsSync(htmlPath)) {
              moveHTMLCOMMAND = "mv " + htmlPath + ' ' + newhtmlPATH + appVersion.name + '.html';
              exec(moveHTMLCOMMAND, function(error, stdout, stderr) {
                if (stderr || error) {
                  return logger.error("accessDB::stderr:" + stderr + ". Error:" + error);
                }

                if (tempCommentPath != null) {
                  moveCommentCOMMAND = "mv " + tempCommentPath + ' ' + newhtmlPATH + appVersion.name + '-' + appVersion.verc + '.json5';
                  exec(moveCommentCOMMAND, function(error, stdout, stderr) {
                    if (stderr || error) {
                      return logger.error("accessDB::stderr:" + stderr + ". Error:" + error);
                    }
                    db.close();
                  });
                }
              });
            }
            else {
              db.close();
              return logger.error("accessDB::" + htmlPath + " doesn't exist")
            }
          });
        })
      }
      else {
        logger.warn("accessDB::APK already exists for " + appVersion.name + "-" + appVersion.verc);

        DELETEJSON = "rm " + tempCommentPath;
        try {
          var error, stderr, stdout = execSync(DELETEJSON);
          if (stderr || error) { logger.error("accessDB::" + stderr); }
        }
        catch (ex) {
          logger.error("accessDB::Deleting the JSON5 failed for " + tempCommentPath);
          return logger.error("accessDB::" + ex);
        }


        DELETEHTML = "rm " + htmlPath;
        exec(DELETEHTML, function(error, stdout, stderr) {
          if (stderr || error) {
            logger.error("accessDB::Deleting the HTML failed for " + appVersion.name + "-" + appVersion.verc)
            logger.error("accessDB::stderr:" + stderr + ". Error:" + error);
          }
          COMMAND = "rm " + dest;
          exec(COMMAND, function(error, stdout, stderr) {
            if (stderr || error) {
              logger.error("accessDB::Deleting the APK failed for " + appVersion.name + "-" + appVersion.verc);
              return logger.error("accessDB::stderr:" + stderr + ". Error:" + error);
            }
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
