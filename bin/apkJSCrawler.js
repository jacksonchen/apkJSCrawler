#!/usr/bin/env node

var crawler = require('../lib'),
    program = require('commander'),
    hostName = 'localhost',
    portNumber = 27017,
    dbName = 'apksDB',
    collectionName = 'apks',
    pluginName = ''

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
var setPlugin = function(plugin) {
    pluginName = plugin
}

program
    .version("0.0.1")
    .usage("<options> <command>")
    .description("Downloads apks");
program
    .option('-H, --host_name <arg>', "The host name that the mongod is connected to." +
        " Default host is " + hostName, setHost)
    .option('-b, --db_name <arg>', "The name of MongoDB database to store the apks" +
        " . Default name is " + dbName, setDB)
    .option('-p, --plugin <path>', "The path to the plugin for a specific service" +
        " to download APKs from", setPlugin)
    .option('-p, --port_number <arg>', "The port number that the mongod instance is" +
        " listening. Default number is " + portNumber, setPort)
    .option('-c, --collection <arg>', "The name of MongoDB database collection to" +
        " store the apks. Default name is " + collectionName,
        setCollection)

program
    .command("keyword <keyword> <output_dir>")
    .description("Download apps by the given keyword.")
    .action(function(keyword, output_dir) {
        var dbArray = [hostName, portNumber, dbName, collectionName]
        crawler.readKeyword(keyword, output_dir, pluginName, dbArray);
    });

program
    .command("file <keyword-file> <output_dir>")
    .description("Download apps by the given keyword CSV file.")
    .action(function(keyword, output_dir) {
        var dbArray = [hostName, portNumber, dbName, collectionName]
        crawler.readKeywordFile(keyword, output_dir, pluginName, dbArray);
    });

program.parse(process.argv);

if (!program.args.length){
	program.help();
}
