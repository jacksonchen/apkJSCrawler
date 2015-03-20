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
    .command("download <keyword>")
    .description("Download apps by the given keyword.")
    .action(function(keyword) {
        crawler.download(keyword, function(result, error) {
        if(result)
        	console.log(result)
        });
    });

program
    .command("find <keyword>")
    .description("Find the URL for apps by the given keyword.")
    .action(function(keyword) {
        crawler.find(keyword, function(error, result) {})
    });

program.parse(process.argv);

if (!program.args.length){
	program.help();
}