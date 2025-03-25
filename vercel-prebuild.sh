#!/bin/bash

echo "Setting up for Vercel deployment..."

# Set specific Rollup version
npm install rollup@3.29.4 --no-save

# Create dummy modules for the problematic dependencies
ROLLUP_DIR="node_modules/@rollup"
mkdir -p $ROLLUP_DIR/rollup-linux-x64-gnu
mkdir -p $ROLLUP_DIR/rollup-darwin-x64
mkdir -p $ROLLUP_DIR/rollup-win32-x64-msvc

# Create package.json for each dummy module
for MODULE in rollup-linux-x64-gnu rollup-darwin-x64 rollup-win32-x64-msvc; do
  echo "{\"name\":\"@rollup/$MODULE\",\"version\":\"4.0.0\",\"main\":\"index.js\"}" > $ROLLUP_DIR/$MODULE/package.json
  echo "module.exports = {};" > $ROLLUP_DIR/$MODULE/index.js
done

echo "Vercel deployment setup complete!" 