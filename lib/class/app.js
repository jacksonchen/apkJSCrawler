var path = require('path'),
    fs = require('fs')

function App(name, verc, vern, dir, tempAPKdest) {
  this.name = name;
  this.verc = verc;
  this.vern = vern;
  this.path = dir;
  this.vercpath = path.resolve(dir, verc);
  this.apkpath = path.resolve(this.vercpath, name + "-" + verc + ".apk")
  this.ID = name + "-" + verc;
  this.size = fs.statSync(tempAPKdest).size;
  this.date = this.currentDate();
}

App.prototype.currentDate = function() {
  var today = new Date(),
      d = today.getDate(),
      m = today.getMonth()+1,
      y = today.getFullYear(),
      downloadDate = y + "-" + m + "-" + d;

  return downloadDate;
}

exports.App = App;
