var exec = require('child_process').exec,
    log4js = require('log4js'),
    logger = log4js.getLogger('Core'),
    config = require('config'),
    path = require('path'),
    fs = require('fs'),
    App = require('./class/app.js').App;

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'play.log' }
  ]
});

var rePattern = new RegExp(/^package: name='([^\']+)' versionCode='([^\']+)' versionName='([^\']+)'/), // TODO: Get versionName (vern)
    pluginPattern = new RegExp(/([^-]+).html$/);

var aaptExecutor = function(outputDir, dest, oldhtmlPath, callback) {
  var aapt = config.get('aapt');
  COMMAND = aapt + " dump badging " + dest;
  logger.info("aaptExecutor::Running: " + COMMAND);
  exec(COMMAND, function(error, stdout, stderr) {
    if (stderr || error) {
      delCOMMAND = "rm " + dest;
      logger.error("aaptExecutor::" + stderr);
      exec(delCOMMAND, function(error, stdout, stderr) {
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
    else {
      logger.info("aaptExecutor::Aapt tool run successful on " + dest);
      var matches = stdout.match(rePattern),
          name = matches[1],
          verc = matches[2],
          vern = matches[3];
      var plugin = oldhtmlPath.match(pluginPattern)[1];
      pathGenerator(name, verc, outputDir, plugin, function(dir, pluginPATH) {
        var appVersion = new App(name, verc, vern, dir, dest);
        callback(appVersion, pluginPATH);
      })
    }
  })
}

var pathGenerator = function(name, verc, outputDir, plugin, callback) {
  splitName = name.split('.');
  var dir = path.resolve(outputDir);

  splitName.forEach(function(split) {
    dir = path.resolve(dir, split[0], split);
  });

  dir = path.resolve(dir, "multiple_versions")
  var pluginPATH = path.resolve(dir, plugin + "-");
  logger.info("pathGenerator::Path generated for " + name + "-" + verc);
  callback(dir, pluginPATH);
}

module.exports = aaptExecutor;
