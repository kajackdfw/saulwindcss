#!/usr/bin/env node
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Read version
const ROOT = path.join(__dirname, '..')
const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
const VERSION = packageJson.version
const PACKAGE_NAME = packageJson.name

// Create dist/VERSION directory
const distVersionDir = path.join(ROOT, 'dist', VERSION)
const distRootDir = path.join(ROOT, 'dist')

fs.mkdirSync(distVersionDir, { recursive: true })

console.log(`Packing ${PACKAGE_NAME}@${VERSION}...`)

// Run npm pack with output to dist/VERSION
try {
  execSync(`npm pack --pack-destination="${distVersionDir}"`, {
    stdio: 'inherit',
    cwd: ROOT,
  })
} catch (err) {
  console.error('npm pack failed')
  process.exit(1)
}

const tarballName = `${PACKAGE_NAME}-${VERSION}.tgz`
const versionedTarball = path.join(distVersionDir, tarballName)
const rootTarball = path.join(distRootDir, tarballName)

if (!fs.existsSync(versionedTarball)) {
  console.error(`Error: Expected tarball not found at ${versionedTarball}`)
  process.exit(1)
}

console.log(`✓ Tarball created: dist/${VERSION}/${tarballName}`)

// Copy to root dist for backwards compatibility
try {
  fs.copyFileSync(versionedTarball, rootTarball)
  console.log(`✓ Also copied to: dist/${tarballName}`)
} catch (err) {
  console.error('Failed to copy tarball to root dist')
  process.exit(1)
}

console.log('\n✓ Packaging complete!')
console.log(`  Versioned: dist/${VERSION}/${tarballName}`)
console.log(`  Root:      dist/${tarballName}`)
