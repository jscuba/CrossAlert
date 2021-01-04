#!/bin/bash
export XDG_RUNTIME_DIR=/run/user/$(id -u)
/usr/bin/node /home/user/Desktop/Projects/Tech/CrossAlert/crossalert.js > /dev/null 2>&1
