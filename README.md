# Javascript APK Crawler [![Build Status](https://travis-ci.org/jacksonchen/apkJSCrawler.svg?branch=master)](https://travis-ci.org/jacksonchen/apkJSCrawler)

A program using node.js to scrape data and crawl various websites hosting Android APK's.

## Usage

`apkJSCrawler <options> <command>`


  Commands:

    keyword <keyword> <output-dir>    Download apps by the given keyword.
    file <keyword-file> <output-dir>  Download apps by the given keyword CSV file.
  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -H, --host_name <arg>    The host name that the mongod is connected to. Default host is localhost
    -b, --db_name <arg>      The name of MongoDB database to store the apks . Default name is apksDB
    -p, --plugin <path>      The path to the plugin for a specific service to download APKs from
    -n, --port_number <arg>  The port number that the mongod instance is listening. Default number is 27017
    -c, --collection <arg>   The name of MongoDB database collection to store the apks. Default name is apks

## Disclaimer

This tool is developed and released here for academic purposes only, and I am not responsible for any damage that could be done with it. Use it at your own risk.

This project uses the [MIT License](https://github.com/jacksonchen/apkJSCrawler/blob/master/LICENSE.md).

## MongoDB Collection Field Abbreviations

name = n
<br>
version code = vc
<br>
path = p
