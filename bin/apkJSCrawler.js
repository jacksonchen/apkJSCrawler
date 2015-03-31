#!/usr/bin/env node

var crawler = require('../lib'),
    program = require('commander'),
    hostName = 'localhost',
    portNumber = 27017,
    dbName = 'apksDB',
    collectionName = 'apks'

var setHost = function(host) {
    hostName = host
}
var setPort = function(port) {
    portNumber = port
}
var setDB = function(db) {
    dbName = db
}
var setCollection = function(collection) {
    collectionName = collection
}
program
    .version("0.0.1")
    .description("Downloads apks");
program
    .option('-H, --host_name <arg>', "The host name that the mongod is connected to." +
        " Default host is " + hostName, setHost)
    .option('-b, --db_name <arg>', "The name of MongoDB database to store the apks" +
        " . Default name is " + dbName, setDB)
    .option('-p, --port_number <arg>', "The port number that the mongod instance is" +
        " listening. Default number is " + portNumber, setPort)
    .option('-c, --collection <arg>', "The name of MongoDB database collection to" +
        " store the apks. Default name is " + collectionName,
        setCollection);
program
    .command("keyword <keyword> <output-dir>")
    .description("Download apps by the given keyword.")
    .action(function(keyword) {
        crawler.init(keyword, "keyword");
    });

program
    .command("file <keyword-file> <output-dir>")
    .description("Download apps by the given keyword CSV file.")
    .action(function(keyword) {
        crawler.init(keyword, "file");
    });

program.parse(process.argv);

if (!program.args.length){
	program.help();
}
