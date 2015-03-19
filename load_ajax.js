var phantom = require('phantom');

module.exports = {
  loadAjax : function (url) {
    phantom.create(function (ph) {
      ph.createPage(function (page) {
        page.open(url, function (status) {
          page.evaluate(function () { return document.body.innerHTML(); }, function (result) {
            console.log(result);
            ph.exit();
          });
        });
      });
    });
  }
}
