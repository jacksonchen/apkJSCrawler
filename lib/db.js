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

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'play.log' }
  ]
});

var accessDB = function(appVersion, outputDir, dest, htmlPath, tempCommentPath, dirpluginPATH, callback) {
  var hostName = config.get('dbConfig.host'),
      portNumber = config.get('dbConfig.port'),
      dbName = config.get('dbConfig.db'),
      collectionName = config.get('dbConfig.collection');
  var mongoURL = 'mongodb://' + hostName + ':' + portNumber + '/' + dbName;

  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    logger.info("accessDB::Connected correctly to server for " + appVersion.ID);

    var collection = db.collection(collectionName);
    findDoc(db, collection, appVersion, function(results) {
      if (results.length === 0) {
        makeDir(appVersion, function() {
          insertDoc(db, collection, appVersion, function() {
            logger.info("accessDB::Successfully made directory " + appVersion.path);
            movesem.take(function() {
              moveAPK(dest, appVersion, movesem, function() {
                moveHTML(htmlPath, dirpluginPATH, appVersion, movesem, db, function() {
                  moveComment(tempCommentPath, dirpluginPATH, appVersion, movesem, function() {
                    runScraper(appVersion, function() {
                      movesem.leave();
                      logger.debug("init::Finish download " + appVersion.ID);
                      callback();
                      db.close();
                    })
                  })
                })
              })
            })
          });
        })
      }
      else {
        delAll(appVersion, tempCommentPath, htmlPath, dest, db, function() {
          callback();
        });
      }
    })
  });
}
var insertDoc = function(db, collection, appVersion, callback) {
  if (fs.existsSync(appVersion.path)) {
    collection.insert({'n': appVersion.name, 'verc': appVersion.verc, 'vern': appVersion.vern, 'path': appVersion.path, 'id': appVersion.ID }, function(err, r) {
      assert.equal(err, null);
      callback();
    });
  }
  else {
    return logger.error("insertDoc::File path " + appVersion.path + " does not exist.");
  }
}

var findDoc = function(db, collection, appVersion, callback) {
  collection.find({'n': appVersion.name, 'verc': appVersion.verc, 'vern': appVersion.vern }).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var makeDir = function(appVersion, callback) {
  makenewCOMMAND = "mkdir -p " + appVersion.path;
  exec(makenewCOMMAND, function(error, stdout, stderr) {
    if (stderr || error) {
      logger.error("accessDB::Making new directory failed for " + appVersion.path);
      return logger.error("accessDB::stderr:" + stderr + ". Error:" + error);
    }
    logger.info("accessDB::Successfully made directory " + appVersion.path);
    callback();
  });
}

var moveAPK = function(dest, appVersion, movesem, callback) {
  moveCOMMAND = "mv " + dest + ' ' + appVersion.path + appVersion.ID + '.apk';
  exec(moveCOMMAND, function(error, stdout, stderr) {
    if (stderr || error) { logger.error("accessDB::" + stderr); movesem.leave(); }
    logger.info("accessDB::Moved APK to " + appVersion.path);
    callback();
  });
}

var moveHTML = function(htmlPath, dirpluginPATH, appVersion, movesem, db, callback) {
  if (fs.existsSync(htmlPath)) {
    moveHTMLCOMMAND = "mv " + htmlPath + ' ' + dirpluginPATH + appVersion.ID + '.html';
    exec(moveHTMLCOMMAND, function(error, stdout, stderr) {
      if (stderr || error) {
        movesem.leave();
        return logger.error("accessDB::stderr:" + stderr + ". Error:" + error);
      }
      callback();
    });
  }
  else {
    movesem.leave();
    callback();
    db.close();
    return logger.error("accessDB::" + htmlPath + " doesn't exist")
  }
}

var moveComment = function(tempCommentPath, dirpluginPATH, appVersion, movesem, callback) {
  if (tempCommentPath != null) {
    moveCommentCOMMAND = "mv " + tempCommentPath + ' ' + dirpluginPATH + appVersion.ID + '.json5';
    exec(moveCommentCOMMAND, function(error, stdout, stderr) {
      if (stderr || error) {
        movesem.leave();
        return logger.error("accessDB::stderr:" + stderr + ". Error:" + error);
      }
      callback();
    });
  }
}

var delAll = function(appVersion, tempCommentPath, htmlPath, dest, db, callback) {
  logger.warn("accessDB::APK already exists for " + appVersion.name + "-" + appVersion.verc);

  deletesem.take(function() {
    DELETEJSON = "rm " + tempCommentPath;
    exec(DELETEJSON, function(error, stdout, stderr) {
      if (stderr || error) { logger.error("accessDB::" + stderr); }
      DELETEHTML = "rm " + htmlPath;
      exec(DELETEHTML, function(error, stdout, stderr) {
        if (stderr || error) {
          logger.error("accessDB::Deleting the HTML failed for " + appVersion.ID)
          logger.error("accessDB::stderr:" + stderr + ". Error:" + error);
        }
        COMMAND = "rm " + dest;
        exec(COMMAND, function(error, stdout, stderr) {
          if (stderr || error) {
            logger.error("accessDB::Deleting the APK failed for " + appVersion.ID);
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

var runScraper = function(appVersion, callback) {
  var scraper = config.get('scraper'),
      COMMAND = scraper + " " + appVersion.ID + " -o " + appVersion.path;
  logger.info("accessDB::runScraper:Scraping data for " + appVersion.name + " saved into " + appVersion.path);
  exec(COMMAND, function(error, stdout, stderr) {
    if (stderr || error) {
      movesem.leave();
      return logger.error("accessDB::runScraper:" + stderr + ". Error:" + error);
    }
    logger.info("accessDB::runScraper:Finished scraping data for " + appVersion.name + " saved into " + appVersion.path);
    callback();
  });
}

module.exports = accessDB;
