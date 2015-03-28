var exec = require('child_process').exec,
    App = require('./class/app.js').App,
    Setting = require('./class/setting.js').Setting;

var rePattern = new RegExp(/^package: name='([^\']+)' versionCode='([^\']+)'/);

var aaptExecutor = function(outputDir, settings, dest, callback) {
  COMMAND =  settings.aapt + " dump badging " + dest;
  console.log("Running: " + COMMAND);
  exec(COMMAND, function(error, stdout, stderr) {
    if (stderr) {
      COMMAND = "rm " + dest;
      exec(COMMAND, function(error, stdout, stderr) {
        if (stderr) { console.log(stderr) };
      });
      return console.log(stderr);
    }
    else {
      console.log("Aapt tool run successful!");
      var matches = stdout.match(rePattern),
          name = matches[1],
          verc = matches[2];
      pathGenerator(name, verc, outputDir, function(path) {
        var appVersion = new App(name, verc, path);
        callback(appVersion);
      })
    }
  })
}

var pathGenerator = function(name, verc, outputDir, callback) {
  path = outputDir + '/';
  splitName = name.split('.');
  splitName.forEach(function(split) {
    path += split[0] + '/' + split + '/';
  });
  path += "multiple_versions/" + verc + '/';
  callback(path);
}

module.exports = aaptExecutor;
