var path = require('path');

function App(name, verc, vern, dir) {
  this.name = name;
  this.verc = verc;
  this.vern = vern;
  this.path = dir;
  this.vercpath = path.resolve(dir, verc);
  this.apkpath = path.resolve(this.vercpath, name + "-" + verc + ".apk")
  this.ID = name + "-" + verc;
}

exports.App = App;
