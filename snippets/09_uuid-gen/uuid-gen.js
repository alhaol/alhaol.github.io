#!/usr/bin/env node
// Print a random UUID v4.
'use strict';
const { randomUUID } = require('node:crypto');

console.log(randomUUID());
