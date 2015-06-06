var exec = require('child_process').exec,
    log4js = require('log4js'),
    logger = log4js.getLogger('Core'),
    App = require('./class/app.js').App;

var rePattern = new RegExp(/^package: name='([^\']+)' versionCode='([^\']+)'/),
    pluginPattern = new RegExp(/([^-]+).html$/);

var aaptExecutor = function(outputDir, dest, oldhtmlPath, callback) {
  COMMAND =  __dirname + '/../bin/aapt ' + " dump badging " + dest;
  logger.info("aaptExecutor::Running: " + COMMAND);
  exec(COMMAND, function(error, stdout, stderr) {
    if (stderr || error) {
      COMMAND = "rm " + dest;
      logger.error("aaptExecutor::" + stderr);
      exec(COMMAND, function(error, stdout, stderr) {
        if (stderr) {
          logger.error("aaptExecutor::" + dest + " failed to be removed");
          return logger.error("aaptExecutor::" + stderr);
        }
        if (error) {
          logger.error("aaptExecutor::" + dest + " had an error while being removed");
          return logger.error("aaptExecutor::" + error);
        }
        return logger.error("aaptExecutor::STDerr:" + stderr + ". Error:" + error);
      });
    }
    logger.info("aaptExecutor::Aapt tool run successful on " + dest);
    var matches = stdout.match(rePattern),
        name = matches[1],
        verc = matches[2];
    var plugin = oldhtmlPath.match(pluginPattern)[1];
    pathGenerator(name, verc, outputDir, plugin, function(path, htmlPATH) {
      var appVersion = new App(name, verc, path);
      callback(appVersion, htmlPATH);
    })
  })
}

var pathGenerator = function(name, verc, outputDir, plugin, callback) {
  var path = outputDir + '/';
  splitName = name.split('.');
  splitName.forEach(function(split) {
    path += split[0] + '/' + split + '/';
  });
  var htmlPATH = path + "multiple_versions/" + plugin + "-";
  path += "multiple_versions/" + verc + '/';
  logger.info("pathGenerator::Path generated for " + name + "-" + verc);
  callback(path, htmlPATH);
}

module.exports = aaptExecutor;
