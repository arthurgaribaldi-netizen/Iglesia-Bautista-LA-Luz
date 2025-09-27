# Favicon Instructions

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
```bash
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
```

### Method 3: Using Node.js sharp library
```bash
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
                   size === 16 || size === 32 || size === 48 ? `favicon-${size}.png` :
                   `icon-${size}x${size}.png`;
  
  sharp(`${inputDir}/icon-512x512.svg`)
    .resize(size, size)
    .png()
    .toFile(`${outputDir}/${filename}`)
    .then(() => console.log(`Created ${filename}`))
    .catch(err => console.error(`Error creating ${filename}:`, err));
});
"
```

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
