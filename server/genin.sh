#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

(
  cd $DIR;
  js-beautify -r ../docs/index.html --type html
  sed -i -e 's/\/bundle.js/bundle.js/g' ../docs/index.html
)
