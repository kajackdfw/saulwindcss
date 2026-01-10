#!/usr/bin/env node
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Read version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))
const VERSION = packageJson.version
const ROOT = path.join(__dirname, '..')

console.log(`Building Tailwind CSS v${VERSION}...`)

// Generate plugin list
console.log('Generating plugin list...')
try {
  execSync('npm run generate', { stdio: 'inherit', cwd: ROOT })
} catch (err) {
  console.error('Failed to generate plugin list')
  process.exit(1)
}

// Clean only this version's directory (preserve other versions)
const versionDir = path.join(ROOT, 'lib', VERSION)
console.log(`Cleaning ${versionDir}...`)
if (fs.existsSync(versionDir)) {
  try {
    execSync(`npx rimraf "${versionDir}"`, { stdio: 'inherit', cwd: ROOT })
  } catch (err) {
    console.error(`Failed to clean ${versionDir}`)
    process.exit(1)
  }
}

// Ensure lib directory exists
if (!fs.existsSync(path.join(ROOT, 'lib'))) {
  fs.mkdirSync(path.join(ROOT, 'lib'), { recursive: true })
}

// Build with versioned output
console.log(`Compiling to lib/${VERSION}...`)
try {
  execSync(`npx swc src --out-dir lib/${VERSION} --copy-files`, {
    stdio: 'inherit',
    cwd: ROOT,
  })
} catch (err) {
  console.error('SWC compilation failed')
  process.exit(1)
}

// Bundle peers
const peerInput = path.join('lib', VERSION, 'cli-peer-dependencies.js')
const peersDir = path.join(ROOT, 'peers')
console.log('Bundling peer dependencies...')

// Ensure peers directory exists
if (!fs.existsSync(peersDir)) {
  fs.mkdirSync(peersDir, { recursive: true })
}

try {
  execSync(`npx esbuild ${peerInput} --bundle --platform=node --outfile=peers/index.js`, {
    stdio: 'inherit',
    cwd: ROOT,
  })
} catch (err) {
  console.error('Failed to bundle peer dependencies')
  process.exit(1)
}

// Create symlinks for backwards compatibility
console.log('Creating symlinks for package entry points...')
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

for (const target of symlinkTargets) {
  const linkPath = path.join(ROOT, 'lib', target)
  const targetPath = path.join(VERSION, target)

  // Remove existing symlink/file
  if (fs.existsSync(linkPath)) {
    try {
      fs.unlinkSync(linkPath)
    } catch (err) {
      // Try to remove as directory if it's a directory symlink
      try {
        fs.rmSync(linkPath, { recursive: true, force: true })
      } catch (err2) {
        console.warn(`Warning: Could not remove existing ${target}`)
      }
    }
  }

  // Create symlink (or copy on Windows if symlink fails)
  try {
    fs.symlinkSync(targetPath, linkPath, 'file')
    console.log(`  ✓ Symlinked ${target} → ${VERSION}/${target}`)
  } catch (err) {
    // Fallback to copy for Windows without admin rights
    console.log(`  ℹ Symlink failed for ${target}, using copy instead`)
    const sourcePath = path.join(ROOT, 'lib', VERSION, target)
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, linkPath)
      console.log(`  ✓ Copied ${target} from ${VERSION}/${target}`)
    } else {
      console.warn(`  ⚠ Warning: ${sourcePath} does not exist, skipping`)
    }
  }
}

// Also handle subdirectories that might be imported
const dirSymlinks = ['css', 'lib', 'postcss-plugins', 'public', 'util']
for (const dir of dirSymlinks) {
  const linkPath = path.join(ROOT, 'lib', dir)
  const targetPath = path.join(VERSION, dir)

  // Remove existing symlink/directory
  if (fs.existsSync(linkPath)) {
    try {
      fs.rmSync(linkPath, { recursive: true, force: true })
    } catch (err) {
      console.warn(`Warning: Could not remove existing ${dir}/`)
    }
  }

  // Check if source directory exists
  const srcDir = path.join(ROOT, 'lib', VERSION, dir)
  if (!fs.existsSync(srcDir)) {
    console.log(`  ℹ Skipping ${dir}/ (doesn't exist in build output)`)
    continue
  }

  // Create symlink (or copy on Windows if symlink fails)
  try {
    fs.symlinkSync(targetPath, linkPath, 'dir')
    console.log(`  ✓ Symlinked ${dir}/ → ${VERSION}/${dir}/`)
  } catch (err) {
    // Fallback: recursive copy
    console.log(`  ℹ Symlink failed for ${dir}/, using copy instead`)
    if (fs.existsSync(srcDir)) {
      fs.cpSync(srcDir, linkPath, { recursive: true })
      console.log(`  ✓ Copied ${dir}/ from ${VERSION}/${dir}/`)
    }
  }
}

console.log(`\n✓ Build complete! Output: lib/${VERSION}/`)
console.log(`  Symlinks/copies created at lib/ for backwards compatibility`)
