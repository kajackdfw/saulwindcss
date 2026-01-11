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

// Replace symlinks with actual copies before packing
// This ensures the tarball contains real files, not symlinks
console.log('Converting symlinks to copies for packaging...')

const symlinkTargets = [
  'index.js',
  'cli.js',
  'cli-peer-dependencies.js',
  'constants.js',
  'corePluginList.js',
  'corePlugins.js',
  'featureFlags.js',
  'processTailwindFeatures.js',
]

const dirSymlinks = ['css', 'lib', 'postcss-plugins', 'public', 'util']

// Store original symlink info to restore later
const symlinksToRestore = []

// Replace file symlinks with copies
for (const target of symlinkTargets) {
  const linkPath = path.join(ROOT, 'lib', target)

  if (fs.existsSync(linkPath)) {
    const stats = fs.lstatSync(linkPath)

    if (stats.isSymbolicLink()) {
      const targetPath = fs.readlinkSync(linkPath)
      const sourcePath = path.join(ROOT, 'lib', targetPath)

      // Store for restoration
      symlinksToRestore.push({ linkPath, targetPath, type: 'file' })

      // Replace symlink with copy
      fs.unlinkSync(linkPath)
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, linkPath)
        console.log(`  ✓ Replaced symlink ${target} with copy`)
      } else {
        console.warn(`  ⚠ Warning: Source file ${sourcePath} not found for ${target}`)
      }
    }
  }
}

// Replace directory symlinks with copies
for (const dir of dirSymlinks) {
  const linkPath = path.join(ROOT, 'lib', dir)

  if (fs.existsSync(linkPath)) {
    const stats = fs.lstatSync(linkPath)

    if (stats.isSymbolicLink()) {
      const targetPath = fs.readlinkSync(linkPath)
      const sourcePath = path.join(ROOT, 'lib', targetPath)

      // Store for restoration
      symlinksToRestore.push({ linkPath, targetPath, type: 'dir' })

      // Replace symlink with copy
      fs.rmSync(linkPath, { recursive: true, force: true })
      if (fs.existsSync(sourcePath)) {
        fs.cpSync(sourcePath, linkPath, { recursive: true })
        console.log(`  ✓ Replaced symlink ${dir}/ with copy`)
      } else {
        console.warn(`  ⚠ Warning: Source directory ${sourcePath} not found for ${dir}/`)
      }
    }
  }
}

console.log('\nRunning npm pack...')

// Run npm pack with output to dist/VERSION
try {
  execSync(`npm pack --pack-destination="${distVersionDir}"`, {
    stdio: 'inherit',
    cwd: ROOT,
  })
} catch (err) {
  console.error('npm pack failed')

  // Restore symlinks before exiting
  console.log('\nRestoring symlinks after failure...')
  for (const { linkPath, targetPath, type } of symlinksToRestore) {
    try {
      if (fs.existsSync(linkPath)) {
        if (type === 'dir') {
          fs.rmSync(linkPath, { recursive: true, force: true })
        } else {
          fs.unlinkSync(linkPath)
        }
      }
      fs.symlinkSync(targetPath, linkPath, type)
    } catch (restoreErr) {
      console.error(`Failed to restore symlink: ${linkPath}`)
    }
  }

  process.exit(1)
}

// Restore symlinks after successful pack
console.log('\nRestoring symlinks...')
for (const { linkPath, targetPath, type } of symlinksToRestore) {
  try {
    if (fs.existsSync(linkPath)) {
      if (type === 'dir') {
        fs.rmSync(linkPath, { recursive: true, force: true })
      } else {
        fs.unlinkSync(linkPath)
      }
    }
    fs.symlinkSync(targetPath, linkPath, type)
    console.log(`  ✓ Restored symlink: ${path.basename(linkPath)}`)
  } catch (restoreErr) {
    console.error(`  ✗ Failed to restore symlink: ${linkPath}`)
  }
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
