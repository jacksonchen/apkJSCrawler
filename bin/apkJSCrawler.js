#!/usr/bin/env node

var crawler = require('../lib'),
    path = require('path'),
    program = require('commander');

program
    .version("0.0.1")
    .usage("<command>")
    .description("Downloads apks");

program
    .command("keyword <keyword> <output_dir> <plugin_path>")
    .description("Download apps by the given keyword.")
    .action(function(keyword, output_dir, plugin_path) {
        crawler.readKeyword(keyword, path.resolve(output_dir), plugin_path, "keyword");
    });

program
    .command("file <keyword-file> <output_dir> <plugin_path>")
    .description("Download apps by the given keyword CSV file.")
    .action(function(keyword, output_dir, plugin_path) {
        crawler.readKeywordFile(keyword, path.resolve(output_dir), plugin_path, "file");
    });

program.parse(process.argv);

if (!program.args.length){
	program.help();
}
