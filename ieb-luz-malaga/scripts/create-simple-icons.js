// Simple script to create basic PNG icons for PWA
// This creates simple colored square icons that can be used immediately

const fs = require('fs');
const path = require('path');

// Create a simple base64 PNG icon (blue square with white cross)
const createSimpleIcon = (size) => {
  // This is a simple 1x1 blue pixel encoded as PNG
  // In a real scenario, you'd use a proper image library like sharp or canvas
  const canvas = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#3b82f6"/>
    <text x="${size / 2}" y="${size / 2 + size / 8}" font-family="Arial" font-size="${size / 4}" font-weight="bold" fill="white" text-anchor="middle">IEB</text>
    <g transform="translate(${size / 2}, ${size / 2})">
      <rect x="-${size / 20}" y="-${size / 4}" width="${size / 10}" height="${size / 2}" fill="white" rx="2"/>
      <rect x="-${size / 4}" y="-${size / 20}" width="${size / 2}" height="${size / 10}" fill="white" rx="2"/>
    </g>
  </svg>`;
  
  return canvas;
};

// Create simple placeholder icons
const createPlaceholderIcon = (size, filename) => {
  const svgContent = createSimpleIcon(size);
  const filePath = path.join(__dirname, '../public', filename.replace('.png', '.svg'));
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created ${filename.replace('.png', '.svg')} (${size}x${size})`);
};

// Create all required icons as SVG (can be converted later)
const icons = [
  { size: 192, filename: 'icon-192x192.png' },
  { size: 512, filename: 'icon-512x512.png' },
  { size: 180, filename: 'apple-touch-icon.png' },
  { size: 32, filename: 'favicon.png' },
];

icons.forEach(icon => {
  createPlaceholderIcon(icon.size, icon.filename);
});

// Create a simple favicon.ico file (this is just a placeholder)
const faviconContent = `# This is a placeholder favicon
# To create a real favicon.ico, use an online converter or image editing software
# Upload the favicon.svg file to https://favicon.io/favicon-converter/
# Or use ImageMagick: magick favicon.svg favicon.ico`;

fs.writeFileSync(path.join(__dirname, '../public', 'favicon-placeholder.txt'), faviconContent);

console.log('\n✅ Placeholder icons created as SVG files!');
console.log('📝 To complete PWA setup:');
console.log('1. Convert the SVG files to PNG using an online converter');
console.log('2. Or use ImageMagick: magick icon-512x512.svg icon-512x512.png');
console.log('3. Create favicon.ico from favicon.svg using favicon.io');

// Also create a simple HTML page to test the icons
const testHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test PWA Icons - IEB La Luz</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.svg">
    <link rel="manifest" href="/manifest.json">
</head>
<body>
    <h1>PWA Icons Test</h1>
    <p>Check if icons are loading correctly:</p>
    <ul>
        <li>192x192: <img src="/icon-192x192.svg" width="64" height="64" alt="192x192 icon"></li>
        <li>512x512: <img src="/icon-512x512.svg" width="64" height="64" alt="512x512 icon"></li>
        <li>Apple Touch Icon: <img src="/apple-touch-icon.svg" width="64" height="64" alt="Apple touch icon"></li>
        <li>Favicon: <img src="/favicon.svg" width="32" height="32" alt="Favicon"></li>
    </ul>
    
    <h2>PWA Test</h2>
    <p>Open this page on a mobile device to test PWA installation.</p>
    <p>You should see an "Install App" prompt after a few seconds.</p>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '../public', 'pwa-test.html'), testHTML);
console.log('4. Created pwa-test.html for testing PWA functionality');
