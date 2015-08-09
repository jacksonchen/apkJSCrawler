import sys
import subprocess

with open(sys.argv[1]) as f:
  for line in f:
    print "Analyzing keyword " + line.rstrip('\n')
    COMMAND = "node bin/apkJSCrawler.js keyword " + line.rstrip('\n') + " " + sys.argv[2] + " ../apkJSCrawler-GooglePlay"
    subprocess.call(COMMAND, shell=True)
