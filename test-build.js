// Simple test script to verify build process
const fs = require('fs');
const path = require('path');

console.log('Testing build process...');

// Check if frontend out directory exists
const frontendOutPath = path.join(__dirname, 'frontend/out');
const indexPath = path.join(frontendOutPath, 'index.html');

console.log('Frontend out path:', frontendOutPath);
console.log('Index.html path:', indexPath);

if (fs.existsSync(frontendOutPath)) {
  console.log('✅ Frontend out directory exists');
  
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html exists');
    console.log('✅ Build process completed successfully');
  } else {
    console.log('❌ index.html not found');
    console.log('❌ Build process incomplete');
  }
} else {
  console.log('❌ Frontend out directory not found');
  console.log('❌ Build process failed');
}

// List contents of frontend directory
const frontendPath = path.join(__dirname, 'frontend');
if (fs.existsSync(frontendPath)) {
  console.log('\nFrontend directory contents:');
  const contents = fs.readdirSync(frontendPath);
  contents.forEach(item => {
    const itemPath = path.join(frontendPath, item);
    const isDir = fs.statSync(itemPath).isDirectory();
    console.log(`  ${isDir ? '📁' : '📄'} ${item}`);
  });
}
