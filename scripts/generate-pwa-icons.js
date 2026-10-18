const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(typeStr, dataBuf) {
  const typeBuf = Buffer.from(typeStr, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(dataBuf.length, 0);

  const crcPayload = Buffer.concat([typeBuf, dataBuf]);
  const crcVal = crc32(crcPayload);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, dataBuf, crcBuf]);
}

function makePNG(width, height, getPixel) {
  const rowLen = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowLen);
  let pos = 0;

  for (let y = 0; y < height; y++) {
    rawData[pos++] = 0; // Filter type: 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      rawData[pos++] = r;
      rawData[pos++] = g;
      rawData[pos++] = b;
      rawData[pos++] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // 8 bits per channel
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; // Deflate
  ihdr[11] = 0; // Standard filter
  ihdr[12] = 0; // Non-interlaced

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Pixel shader for Iron & Habit emblem
function renderIconPixel(width, height, isMaskable) {
  return function(x, y) {
    const nx = (x + 0.5) / width;
    const ny = (y + 0.5) / height;

    const dx = nx - 0.5;
    const dy = ny - 0.5;
    const dist = Math.hypot(dx, dy);

    // Background color: Deep obsidian #0a0a0a
    let r = 10;
    let g = 10;
    let b = 10;
    let a = 255;

    // Subtle radial glow towards center
    const glow = Math.max(0, 1 - dist / 0.5);
    r = Math.min(255, r + Math.floor(glow * 10));
    g = Math.min(255, g + Math.floor(glow * 35));
    b = Math.min(255, b + Math.floor(glow * 25));

    // Outer subtle metallic ring (scaled for safe zone in maskable mode)
    const ringRadius = isMaskable ? 0.36 : 0.42;
    const ringDiff = Math.abs(dist - ringRadius);
    if (ringDiff < 0.012) {
      const ringAlpha = 1 - ringDiff / 0.012;
      return [
        Math.floor(16 * ringAlpha + r * (1 - ringAlpha)),
        Math.floor(185 * ringAlpha + g * (1 - ringAlpha)),
        Math.floor(129 * ringAlpha + b * (1 - ringAlpha)),
        255
      ];
    }

    // Scale central emblem
    const scale = isMaskable ? 0.85 : 1.0;
    const edx = dx / scale;
    const edy = dy / scale;

    // Central barbell bar
    if (Math.abs(edy) < 0.032 && Math.abs(edx) < 0.22) {
      // Knurling pattern or solid lime #ccff00
      const isKnurl = (Math.floor(nx * width) % 4 === 0) && Math.abs(edx) < 0.16;
      if (isKnurl) {
        return [180, 240, 20, 255];
      }
      return [204, 255, 0, 255];
    }

    // Barbell collars
    if ((Math.abs(edx - 0.17) < 0.015 || Math.abs(edx + 0.17) < 0.015) && Math.abs(edy) < 0.065) {
      return [16, 185, 129, 255];
    }

    // Main inner heavy plates (hexagonal / bevel effect)
    const inLeft = Math.abs(edx + 0.23) < 0.038 && Math.abs(edy) < 0.18;
    const inRight = Math.abs(edx - 0.23) < 0.038 && Math.abs(edy) < 0.18;
    if (inLeft || inRight) {
      // Bevel edge
      if (Math.abs(edy) > 0.155) {
        return [204, 255, 0, 255]; // Lime edge
      }
      return [16, 185, 129, 255]; // Emerald core
    }

    // Outer second plates
    const outLeft = Math.abs(edx + 0.29) < 0.025 && Math.abs(edy) < 0.13;
    const outRight = Math.abs(edx - 0.29) < 0.025 && Math.abs(edy) < 0.13;
    if (outLeft || outRight) {
      if (Math.abs(edy) > 0.11) {
        return [204, 255, 0, 255];
      }
      return [13, 148, 136, 255]; // Teal emerald
    }

    // End caps
    const capLeft = Math.abs(edx + 0.33) < 0.012 && Math.abs(edy) < 0.05;
    const capRight = Math.abs(edx - 0.33) < 0.012 && Math.abs(edy) < 0.05;
    if (capLeft || capRight) {
      return [204, 255, 0, 255];
    }

    // Top athletic chevron / diamond peak
    const topDiamond = Math.abs(edx) * 1.5 + Math.abs(edy + 0.16) < 0.045;
    if (topDiamond) {
      return [204, 255, 0, 255];
    }

    // Bottom athletic chevron / diamond peak
    const bottomDiamond = Math.abs(edx) * 1.5 + Math.abs(edy - 0.16) < 0.045;
    if (bottomDiamond) {
      return [204, 255, 0, 255];
    }

    return [r, g, b, a];
  };
}

// Generate PNG files
const publicDir = path.join(__dirname, '..', 'public');
const targets = [
  { name: 'icon-192x192.png', size: 192, maskable: false, dest: iconsDir },
  { name: 'icon-192x192-maskable.png', size: 192, maskable: true, dest: iconsDir },
  { name: 'icon-512x512.png', size: 512, maskable: false, dest: iconsDir },
  { name: 'icon-512x512-maskable.png', size: 512, maskable: true, dest: iconsDir },
  { name: 'icon-maskable.png', size: 512, maskable: true, dest: iconsDir },
  { name: 'icon.png', size: 512, maskable: false, dest: iconsDir },
  { name: 'apple-touch-icon.png', size: 180, maskable: true, dest: publicDir },
  { name: 'apple-touch-icon.png', size: 180, maskable: true, dest: iconsDir }
];

for (const t of targets) {
  const filePath = path.join(t.dest, t.name);
  const png = makePNG(t.size, t.size, renderIconPixel(t.size, t.size, t.maskable));
  fs.writeFileSync(filePath, png);
  console.log(`Generated: ${filePath} (${t.size}x${t.size}) - ${png.length} bytes`);
}

// Also generate a crisp SVG version in public/icons/icon.svg
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#0a0a0a"/>
  <circle cx="256" cy="256" r="215" fill="none" stroke="#10b981" stroke-width="6" opacity="0.4"/>
  <circle cx="256" cy="256" r="185" fill="none" stroke="#ccff00" stroke-width="2" opacity="0.2"/>
  
  <!-- Barbell Bar -->
  <rect x="140" y="244" width="232" height="24" rx="12" fill="#ccff00"/>
  
  <!-- Inner Collars -->
  <rect x="180" y="226" width="14" height="60" rx="4" fill="#10b981"/>
  <rect x="318" y="226" width="14" height="60" rx="4" fill="#10b981"/>
  
  <!-- Main Heavy Plates -->
  <rect x="135" y="165" width="34" height="182" rx="8" fill="#10b981" stroke="#ccff00" stroke-width="4"/>
  <rect x="343" y="165" width="34" height="182" rx="8" fill="#10b981" stroke="#ccff00" stroke-width="4"/>
  
  <!-- Outer Secondary Plates -->
  <rect x="100" y="195" width="26" height="122" rx="6" fill="#059669" stroke="#ccff00" stroke-width="3"/>
  <rect x="386" y="195" width="26" height="122" rx="6" fill="#059669" stroke="#ccff00" stroke-width="3"/>
  
  <!-- End Caps -->
  <rect x="80" y="238" width="14" height="36" rx="4" fill="#ccff00"/>
  <rect x="418" y="238" width="14" height="36" rx="4" fill="#ccff00"/>
  
  <!-- Diamonds -->
  <polygon points="256,160 270,175 256,190 242,175" fill="#ccff00"/>
  <polygon points="256,322 270,337 256,352 242,337" fill="#ccff00"/>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent);
console.log('Generated: icon.svg');
