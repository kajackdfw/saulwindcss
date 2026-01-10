#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const packageJsonPath = path.join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
console.log(packageJson.version)
