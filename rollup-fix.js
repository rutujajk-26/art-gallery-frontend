// This file is for fixing Rollup issues on Vercel deployment
const fs = require('fs');
const path = require('path');

try {
  console.log('Starting Rollup fix script...');
  console.log(`Node.js version: ${process.version}`);
  console.log(`Current directory: ${process.cwd()}`);
  
  // Path to native.js that causes problems
  const nativePath = path.join(process.cwd(), 'node_modules', 'rollup', 'dist', 'native.js');
  
  if (fs.existsSync(nativePath)) {
    console.log(`Found problematic file: ${nativePath}`);
    
    // Create backup
    fs.copyFileSync(nativePath, `${nativePath}.backup`);
    
    // Replace with dummy implementation
    const fixedContent = `
// This file has been patched to avoid Rollup native module issues
exports.getDefaultExport = function getDefaultExport() {
  return null;
};
exports.getDefaultExportFromCjs = function getDefaultExportFromCjs() {
  return null;
};
exports.loadAndParseConfigFile = function loadAndParseConfigFile() {
  return null;
};
`;
    
    fs.writeFileSync(nativePath, fixedContent);
    console.log('Successfully patched Rollup native.js');
    
    // Create missing platform-specific modules
    const rollupDir = path.join(process.cwd(), 'node_modules', '@rollup');
    
    // Ensure @rollup directory exists
    if (!fs.existsSync(rollupDir)) {
      fs.mkdirSync(rollupDir, { recursive: true });
    }
    
    const platformModules = [
      'rollup-linux-x64-gnu',
      'rollup-darwin-x64',
      'rollup-win32-x64-msvc'
    ];
    
    for (const moduleName of platformModules) {
      const moduleDir = path.join(rollupDir, moduleName);
      if (!fs.existsSync(moduleDir)) {
        fs.mkdirSync(moduleDir, { recursive: true });
        
        // Create package.json
        fs.writeFileSync(
          path.join(moduleDir, 'package.json'),
          JSON.stringify({
            name: `@rollup/${moduleName}`,
            version: '4.0.0',
            main: 'index.js'
          }, null, 2)
        );
        
        // Create index.js
        fs.writeFileSync(
          path.join(moduleDir, 'index.js'),
          'module.exports = {};'
        );
        
        console.log(`Created dummy module: @rollup/${moduleName}`);
      }
    }
    
    console.log('Rollup fix completed successfully');
  } else {
    console.log('Could not find Rollup native.js file');
  }
} catch (error) {
  console.error('Error fixing Rollup:', error);
  process.exit(1);
}

// Success
process.exit(0); 