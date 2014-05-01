#!/bin/sh
JS_FILE="$1"
TEST_FILE=$(echo $JS_FILE | sed "s/\.[^.]*$//g")Spec.js
if [ -f $TEST_FILE ]; then
  echo "Test file already exists: $TEST_FILE" 1>&2
  exit 1
fi

FILE_NAME=$(echo $JS_FILE | sed "s/\.[^.]*$//g")
BASE_PATH=$(cd $(dirname $0); pwd)
TEST_TEMPLATE_FILE=$BASE_PATH/test_template.js
cat $TEST_TEMPLATE_FILE | sed -e "s%{{FILE_NAME}}%$FILE_NAME%g" > $TEST_FILE
echo "Test file generated: $TEST_FILE"
