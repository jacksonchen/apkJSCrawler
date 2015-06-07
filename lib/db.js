var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var exec = require('child_process').exec,
    fs = require('fs'),
    log4js = require('log4js'),
    logger = log4js.getLogger('Core'),
    movesem = require('semaphore')(1),
    deletesem = require('semaphore')(1),
    config = require('config'),
    App = require('./class/app.js').App;

var accessDB = function(appVersion, outputDir, dest, htmlPath, newhtmlPATH, tempCommentPath, callback) {
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

            movesem.take(function() {
              moveCOMMAND = "mv " + dest + ' ' + appVersion.path + appVersion.name + '-' + appVersion.verc + '.apk';
              exec(moveCOMMAND, function(error, stdout, stderr) {
                if (stderr || error) { logger.error("accessDB::" + stderr); }
                logger.info("accessDB::Moved APK to " + appVersion.path);

                if (fs.existsSync(htmlPath)) {
                  moveHTMLCOMMAND = "mv " + htmlPath + ' ' + newhtmlPATH + appVersion.name + '.html';
                  exec(moveHTMLCOMMAND, function(error, stdout, stderr) {
                    if (stderr || error) {
                      movesem.leave();
                      return logger.error("accessDB::stderr:" + stderr + ". Error:" + error);
                    }

                    if (tempCommentPath != null) {
                      moveCommentCOMMAND = "mv " + tempCommentPath + ' ' + newhtmlPATH + appVersion.name + '-' + appVersion.verc + '.json5';
                      exec(moveCommentCOMMAND, function(error, stdout, stderr) {
                        if (stderr || error) {
                          movesem.leave();
                          return logger.error("accessDB::stderr:" + stderr + ". Error:" + error);
                        }
                        movesem.leave();
                        callback();
                        db.close();
                      });
                    }
                  });
                }
                else {
                  movesem.leave();
                  callback();
                  db.close();
                  return logger.error("accessDB::" + htmlPath + " doesn't exist")
                }
              });
            })
          });
        })
      }
      else {
        logger.warn("accessDB::APK already exists for " + appVersion.name + "-" + appVersion.verc);

        deletesem.take(function() {
          DELETEJSON = "rm " + tempCommentPath;
          exec(DELETEJSON, function(error, stdout, stderr) {
            if (stderr || error) { logger.error("accessDB::" + stderr); }
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
                  deletesem.leave();
                  return logger.error("accessDB::stderr:" + stderr + ". Error:" + error);
                }
                deletesem.leave();
                callback();
              });
            });
            db.close();
          })
        })
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
