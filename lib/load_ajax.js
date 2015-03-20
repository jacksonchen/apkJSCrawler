var phantom = require('phantom');

module.exports = function (url, callback) {
    loadAjax : function (url) {
        phantom.create(function (ph) {
             ph.createPage(function (page) {
                 page.open(url, function (status) {
                     page.evaluate(function () {
                        callback(document.body.innerHTML())
                    }, function (result) {
                        console.log(result);
                        ph.exit();
                    });

                });
            });
        });
    }
}
