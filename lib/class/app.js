var path = require('path');

function App(name, verc, vern, dir) {
  this.name = name;
  this.verc = verc;
  this.vern = vern;
  this.path = path.resolve(dir, verc);
  this.ID = name + "-" + verc;
}

exports.App = App;
