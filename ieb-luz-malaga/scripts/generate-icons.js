// Script to generate PWA icons for IEB La Luz Málaga
// This script creates SVG icons that can be converted to PNG using tools like ImageMagick or online converters

const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// IEB La Luz icon design
const createIconSVG = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 8}" fill="#3b82f6" stroke="#ffffff" stroke-width="4"/>
  
  <!-- Cross -->
  <g transform="translate(${size / 2}, ${size / 2})">
    <!-- Vertical line of cross -->
    <rect x="-${size / 20}" y="-${size / 3}" width="${size / 10}" height="${size / 1.5}" fill="#ffffff" rx="${size / 40}"/>
    <!-- Horizontal line of cross -->
    <rect x="-${size / 3}" y="-${size / 20}" width="${size / 1.5}" height="${size / 10}" fill="#ffffff" rx="${size / 40}"/>
  </g>
  
  <!-- Light rays -->
  <g transform="translate(${size / 2}, ${size / 2})" opacity="0.8">
    <!-- Top ray -->
    <rect x="-${size / 60}" y="-${size / 2 + 12}" width="${size / 30}" height="${size / 8}" fill="#ffffff" rx="${size / 60}"/>
    <!-- Bottom ray -->
    <rect x="-${size / 60}" y="${size / 2 - 12 - size / 8}" width="${size / 30}" height="${size / 8}" fill="#ffffff" rx="${size / 60}"/>
    <!-- Left ray -->
    <rect x="-${size / 2 + 12}" y="-${size / 60}" width="${size / 8}" height="${size / 30}" fill="#ffffff" rx="${size / 60}"/>
    <!-- Right ray -->
    <rect x="${size / 2 - 12 - size / 8}" y="-${size / 60}" width="${size / 8}" height="${size / 30}" fill="#ffffff" rx="${size / 60}"/>
  </g>
  
  <!-- Text "IEB" -->
  <text x="${size / 2}" y="${size - size / 8}" font-family="Arial, sans-serif" font-size="${size / 8}" font-weight="bold" fill="#ffffff" text-anchor="middle">IEB</text>
</svg>`;
};

// Generate different icon sizes
const iconSizes = [
  { size: 192, filename: 'icon-192x192.svg' },
  { size: 512, filename: 'icon-512x512.svg' },
  { size: 180, filename: 'apple-touch-icon.svg' },
];

// Create SVG icons
iconSizes.forEach(({ size, filename }) => {
  const svgContent = createIconSVG(size);
  const filePath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created ${filename} (${size}x${size})`);
});

// Create a favicon SVG
const faviconSVG = createIconSVG(32);
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), faviconSVG);
console.log('Created favicon.svg (32x32)');

// Create a simple favicon.ico placeholder (text file with instructions)
const faviconInstructions = `# Favicon Instructions

To complete the PWA setup, you need to convert the SVG icons to PNG format:

## Required PNG Icons:
1. icon-192x192.png (192x192 pixels)
2. icon-512x512.png (512x512 pixels) 
3. apple-touch-icon.png (180x180 pixels)
4. favicon.ico (16x16, 32x32, 48x48 pixels)

## Conversion Methods:

### Method 1: Online Converter
1. Go to https://convertio.co/svg-png/ or https://cloudconvert.com/svg-to-png
2. Upload the SVG files from public/ directory
3. Set the appropriate dimensions
4. Download and save as PNG files in public/ directory

### Method 2: ImageMagick (Command Line)
\`\`\`bash
# Install ImageMagick first
npm install -g imagemagick

# Convert SVG to PNG
magick public/icon-192x192.svg public/icon-192x192.png
magick public/icon-512x512.svg public/icon-512x512.png
magick public/apple-touch-icon.svg public/apple-touch-icon.png

# Convert to favicon.ico (multiple sizes)
magick public/favicon.svg -resize 16x16 public/favicon-16.png
magick public/favicon.svg -resize 32x32 public/favicon-32.png
magick public/favicon.svg -resize 48x48 public/favicon-48.png
magick public/favicon-16.png public/favicon-32.png public/favicon-48.png public/favicon.ico
\`\`\`

### Method 3: Using Node.js sharp library
\`\`\`bash
npm install sharp
node -e "
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 192, 512, 180];
const inputDir = './public';
const outputDir = './public';

sizes.forEach(size => {
  const filename = size === 180 ? 'apple-touch-icon.png' : 
                   size === 16 || size === 32 || size === 48 ? \`favicon-\${size}.png\` :
                   \`icon-\${size}x\${size}.png\`;
  
  sharp(\`\${inputDir}/icon-512x512.svg\`)
    .resize(size, size)
    .png()
    .toFile(\`\${outputDir}/\${filename}\`)
    .then(() => console.log(\`Created \${filename}\`))
    .catch(err => console.error(\`Error creating \${filename}:\`, err));
});
"
\`\`\`

## After creating PNG files:
1. Delete the SVG files from public/ directory
2. Update manifest.json if needed
3. Test PWA installation on mobile devices

## Icon Design Features:
- Blue circular background (#3b82f6)
- White cross symbolizing Christianity
- Light rays representing "La Luz" (The Light)
- "IEB" text at the bottom
- Clean, modern design suitable for all platforms
`;

fs.writeFileSync(path.join(iconsDir, 'ICON_INSTRUCTIONS.md'), faviconInstructions);
console.log('Created ICON_INSTRUCTIONS.md with conversion instructions');

console.log('\n✅ SVG icons generated successfully!');
console.log('📝 Next steps:');
console.log('1. Convert SVG files to PNG format using the instructions in ICON_INSTRUCTIONS.md');
console.log('2. Test PWA functionality on mobile devices');
console.log('3. Verify installation prompt appears correctly');
