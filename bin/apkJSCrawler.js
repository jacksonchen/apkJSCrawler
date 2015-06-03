#!/usr/bin/env node

var crawler = require('../lib'),
    program = require('commander'),
    pluginName = ''

var setPlugin = function(plugin) {
    pluginName = plugin
}

program
    .version("0.0.1")
    .usage("<options> <command>")
    .description("Downloads apks");
program
    .option('-p, --plugin <path>', "The path to the plugin for a specific service" +
        " to download APKs from", setPlugin)


program
    .command("keyword <keyword> <output_dir>")
    .description("Download apps by the given keyword.")
    .action(function(keyword, output_dir) {
        crawler.readKeyword(keyword, output_dir, pluginName);
    });

program
    .command("file <keyword-file> <output_dir>")
    .description("Download apps by the given keyword CSV file.")
    .action(function(keyword, output_dir) {
        crawler.readKeywordFile(keyword, output_dir, pluginName);
    });

program.parse(process.argv);

if (!program.args.length){
	program.help();
}
