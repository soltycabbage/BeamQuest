#!/bin/sh

NODE_PATH="app:public" ./node_modules/mocha/bin/mocha --reporter spec app/**/*Spec.js