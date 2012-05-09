#!/usr/bin/env node

var tis = require('../lib/tis'),

    path = process.argv[2] || process.cwd();


// execute
tis.tis( path );