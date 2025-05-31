const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Generating app icons...');

try {
  // 检查是否安装了 imagemagick
  execSync('which convert', { stdio: 'ignore' });
  
  // 将SVG转换为各种尺寸的PNG
  const sizes = [16, 32, 64, 128, 256, 512, 1024];
  const svgPath = path.join(__dirname, '../build/icon.svg');
  const iconsetPath = path.join(__dirname, '../build/icon.iconset');
  
  // 确保iconset目录存在
  if (!fs.existsSync(iconsetPath)) {
    fs.mkdirSync(iconsetPath, { recursive: true });
  }
  
  console.log('Converting SVG to PNG icons...');
  
  for (const size of sizes) {
    const iconName = `icon_${size}x${size}.png`;
    const iconPath = path.join(iconsetPath, iconName);
    
    execSync(`convert -background none -size ${size}x${size} ${svgPath} ${iconPath}`);
    console.log(`Created: ${iconName}`);
    
    // 创建@2x版本
    if (size <= 512) {
      const retinaSizeName = `icon_${size}x${size}@2x.png`;
      const retinaSizePath = path.join(iconsetPath, retinaSizeName);
      const doubleSize = size * 2;
      
      execSync(`convert -background none -size ${doubleSize}x${doubleSize} ${svgPath} ${retinaSizePath}`);
      console.log(`Created: ${retinaSizeName}`);
    }
  }
  
  // 创建icns文件
  console.log('Generating macOS .icns file...');
  execSync(`iconutil -c icns ${iconsetPath} -o ${path.join(__dirname, '../build/icon.icns')}`);
  
  console.log('Icon generation completed successfully!');
} catch (error) {
  console.error('Error generating icons:', error.message);
  console.log('Make sure you have ImageMagick installed:');
  console.log('  brew install imagemagick');
  console.log('');
  // 创建一个空的icns文件，以便构建过程不会失败
  console.log('Creating empty icon.icns to avoid build errors...');
  const emptyIconPath = path.join(__dirname, '../build/icon.icns');
  fs.writeFileSync(emptyIconPath, '');
  process.exit(1);
} 