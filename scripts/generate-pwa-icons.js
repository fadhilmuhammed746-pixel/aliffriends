const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

async function makeIcons() {
  const emblemPath = path.join(__dirname, '..', 'public', 'logo-emblem.png');
  
  // Standard sizes
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  for (const s of sizes) {
    const innerSize = Math.round(s * 0.72);
    const innerEmblem = await sharp(emblemPath)
      .resize({ height: innerSize, fit: 'inside' })
      .toBuffer();
    
    await sharp({
      create: {
        width: s,
        height: s,
        channels: 4,
        background: { r: 18, g: 60, b: 50, alpha: 1 } // #123C32 Forest Green
      }
    })
    .composite([{ input: innerEmblem, gravity: 'center' }])
    .png()
    .toFile(path.join(iconsDir, 'icon-' + s + 'x' + s + '.png'));
    
    console.log('Generated icon-' + s + 'x' + s + '.png');
  }
  
  // Maskable icons (requires 20% safe zone padding)
  for (const s of [192, 512]) {
    const innerSize = Math.round(s * 0.60);
    const innerEmblem = await sharp(emblemPath)
      .resize({ height: innerSize, fit: 'inside' })
      .toBuffer();
      
    await sharp({
      create: {
        width: s,
        height: s,
        channels: 4,
        background: { r: 18, g: 60, b: 50, alpha: 1 }
      }
    })
    .composite([{ input: innerEmblem, gravity: 'center' }])
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-' + s + 'x' + s + '.png'));
    
    console.log('Generated icon-maskable-' + s + 'x' + s + '.png');
  }
  
  // Apple Touch Icon (180x180)
  const appleInner = Math.round(180 * 0.72);
  const appleEmblem = await sharp(emblemPath)
    .resize({ height: appleInner, fit: 'inside' })
    .toBuffer();
  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 18, g: 60, b: 50, alpha: 1 }
    }
  })
  .composite([{ input: appleEmblem, gravity: 'center' }])
  .png()
  .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  
  console.log('Generated apple-touch-icon.png');
}

makeIcons().then(() => console.log('All icons generated successfully!')).catch(err => console.error(err));

