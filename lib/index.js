var crawler = {}

module.exports = crawler;

crawler.reader = require('./reader.js')
crawler.db = require('./db.js')
crawler.download = require('./download.js')

keywords = crawler.reader(process.argv.slice(2).toString());
console.log(keywords)

