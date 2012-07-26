#!/bin/sh
dir=`pwd`
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=$dir/ext --pack-extension-key=$dir/../jirafy.pem &> out
package=`tail -1 out`
if [ ! -f "$package" ] 
then
  echo "ERROR: no package file generated.  Here's the output of the chrome command:"
  cat out
  rm out
  exit 1
fi
mv $package jirafy.crx
rm out
echo "New jirafy.crx created!"
