# Javascript APK Crawler [![Build Status](https://travis-ci.org/jacksonchen/apkJSCrawler.svg?branch=master)](https://travis-ci.org/jacksonchen/apkJSCrawler)

A program using node.js to scrape data and crawl various websites hosting Android APK's.

## Usage

`apkJSCrawler [options] [command]`


  Commands:

    keyword <keyword> <output-dir>    Download apps by the given keyword.
    file <keyword-file> <output-dir>  Download apps by the given keyword CSV file.
  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -H, --host_name <arg>    The host name that the mongod is connected to. Default host is localhost
    -b, --db_name <arg>      The name of MongoDB database to store the apks . Default name is apksDB
    -p, --port_number <arg>  The port number that the mongod instance is listening. Default number is 27017
    -c, --collection <arg>   The name of MongoDB database collection to store the apks. Default name is apks

## Configuration File

Configuration paramaters in config.json:

```
dbCollectionName: Collection title to store APK info
database: Database name
```

## MongoDB Collection Field Abbreviations

name = n
<br>
version code = vc
<br>
path = p
