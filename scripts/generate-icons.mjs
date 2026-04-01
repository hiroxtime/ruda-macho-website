import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const iconsDir = join(publicDir, 'icons');
const logoPath = join(publicDir, 'assets', 'Logo Ruda Macho.png');

// Asegurar que existe el directorio de íconos
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  console.log('Generando íconos PWA desde el logo...');
  
  const logo = sharp(logoPath);
  const metadata = await logo.metadata();
  console.log(`Logo original: ${metadata.width}x${metadata.height}`);
  
  for (const size of sizes) {
    const outputPath = join(iconsDir, `icon-${size}x${size}.png`);
    
    // Crear un canvas cuadrado con fondo oscuro y el logo centrado
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 13, g: 13, b: 13, alpha: 1 } // #0D0D0D - fondo oscuro del sitio
      }
    })
      .composite([
        {
          input: await sharp(logoPath)
            .resize(Math.floor(size * 0.85), Math.floor(size * 0.85), { 
              fit: 'contain',
              background: { r: 13, g: 13, b: 13, alpha: 1 }
            })
            .toBuffer(),
          blend: 'over'
        }
      ])
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Generado: icon-${size}x${size}.png`);
  }
  
  // También crear apple-touch-icon
  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 27, g: 94, b: 32, alpha: 1 } // #1B5E20 - verde Ruda
    }
  })
    .composite([
      {
        input: await sharp(logoPath)
          .resize(150, 150, { 
            fit: 'contain',
            background: { r: 27, g: 94, b: 32, alpha: 1 }
          })
          .toBuffer(),
        blend: 'over'
      }
    ])
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  
  console.log('✓ Generado: apple-touch-icon.png (180x180)');
  
  // favicon.ico - 32x32
  await sharp(logoPath)
    .resize(32, 32, { fit: 'contain' })
    .png()
    .toFile(join(publicDir, 'favicon-32.png'));
  console.log('✓ Generado: favicon-32.png');
  
  console.log('\n🎉 Todos los íconos generados correctamente!');
}

generateIcons().catch(console.error);