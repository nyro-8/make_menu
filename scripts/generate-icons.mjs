// Minimal PNG icon generator (no external deps) for PWA icons.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter type: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const idat = deflateSync(raw, { level: 9 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function setPx(rgba, w, x, y, r, g, b, a) {
  if (x < 0 || y < 0 || x >= w) return;
  const i = (y * w + x) * 4;
  if (i < 0 || i >= rgba.length) return;
  // simple alpha blend over existing
  const srcA = a / 255;
  rgba[i] = Math.round(r * srcA + rgba[i] * (1 - srcA));
  rgba[i + 1] = Math.round(g * srcA + rgba[i + 1] * (1 - srcA));
  rgba[i + 2] = Math.round(b * srcA + rgba[i + 2] * (1 - srcA));
  rgba[i + 3] = Math.round(255 * srcA + rgba[i + 3] * (1 - srcA));
}

function fillRoundedRect(rgba, w, h, radius, r, g, b, a) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x < radius ? radius - x : x > w - radius ? x - (w - radius) : 0;
      const dy = y < radius ? radius - y : y > h - radius ? y - (h - radius) : 0;
      let inside = true;
      if ((x < radius || x > w - radius) && (y < radius || y > h - radius)) {
        inside = dx * dx + dy * dy <= radius * radius;
      }
      if (inside) setPx(rgba, w, x, y, r, g, b, a);
    }
  }
}

function fillCircle(rgba, w, cx, cy, radius, r, g, b, a, aa = true) {
  const rr = radius * radius;
  for (let y = Math.floor(cy - radius - 1); y <= cy + radius + 1; y++) {
    for (let x = Math.floor(cx - radius - 1); x <= cx + radius + 1; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 <= rr) {
        setPx(rgba, w, x, y, r, g, b, a);
      } else if (aa && d2 <= (radius + 1) * (radius + 1)) {
        const d = Math.sqrt(d2);
        const edgeA = Math.max(0, Math.min(1, radius + 1 - d)) * a;
        setPx(rgba, w, x, y, r, g, b, edgeA);
      }
    }
  }
}

function fillEllipse(rgba, w, cx, cy, rx, ry, angleDeg, r, g, b, a) {
  const angle = (angleDeg * Math.PI) / 180;
  const cosA = Math.cos(-angle);
  const sinA = Math.sin(-angle);
  const maxR = Math.max(rx, ry) + 2;
  for (let y = Math.floor(cy - maxR); y <= cy + maxR; y++) {
    for (let x = Math.floor(cx - maxR); x <= cx + maxR; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const ex = dx * cosA - dy * sinA;
      const ey = dx * sinA + dy * cosA;
      const val = (ex * ex) / (rx * rx) + (ey * ey) / (ry * ry);
      if (val <= 1) setPx(rgba, w, x, y, r, g, b, a);
    }
  }
}

function strokeArc(rgba, w, cx, cy, radius, thickness, startDeg, endDeg, r, g, b, a) {
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const deg = startDeg + ((endDeg - startDeg) * i) / steps;
    const rad = (deg * Math.PI) / 180;
    const px = cx + Math.cos(rad) * radius;
    const py = cy + Math.sin(rad) * radius;
    fillCircle(rgba, w, px, py, thickness / 2, r, g, b, a, false);
  }
}

function makeIcon(size, { padded = false } = {}) {
  const rgba = Buffer.alloc(size * size * 4);
  // transparent base
  for (let i = 0; i < rgba.length; i += 4) {
    rgba[i] = 0;
    rgba[i + 1] = 0;
    rgba[i + 2] = 0;
    rgba[i + 3] = 0;
  }
  const bg = { r: 0xec, g: 0x5f, b: 0x88 }; // うさぎモチーフ用のローズピンク
  const radius = padded ? size * 0.5 : size * 0.24;
  fillRoundedRect(rgba, size, size, radius, bg.r, bg.g, bg.b, 255);

  const cx = size / 2;
  const cy = size * 0.58;
  const faceR = size * 0.27;
  const white = { r: 255, g: 255, b: 255 };
  const plum = { r: 0x5b, g: 0x46, b: 0x50 };
  const pink = { r: 0xff, g: 0xd3, b: 0xe0 };
  const cheek = { r: 0xff, g: 0xb8, b: 0xcc };
  const nose = { r: 0xec, g: 0x5f, b: 0x88 };

  // 垂れ耳(白)+内耳(ピンク)
  const earCx = size * 0.27;
  const earCy = size * 0.32;
  fillEllipse(rgba, size, earCx, earCy, faceR * 0.38, faceR * 0.88, -18, white.r, white.g, white.b, 255);
  fillEllipse(rgba, size, earCx, earCy, faceR * 0.19, faceR * 0.62, -18, pink.r, pink.g, pink.b, 255);
  fillEllipse(rgba, size, size - earCx, earCy, faceR * 0.38, faceR * 0.88, 18, white.r, white.g, white.b, 255);
  fillEllipse(rgba, size, size - earCx, earCy, faceR * 0.19, faceR * 0.62, 18, pink.r, pink.g, pink.b, 255);

  // 顔(白)
  fillCircle(rgba, size, cx, cy, faceR, white.r, white.g, white.b, 255);

  // ほっぺ
  fillCircle(rgba, size, cx - faceR * 0.62, cy + faceR * 0.22, faceR * 0.22, cheek.r, cheek.g, cheek.b, 180);
  fillCircle(rgba, size, cx + faceR * 0.62, cy + faceR * 0.22, faceR * 0.22, cheek.r, cheek.g, cheek.b, 180);

  // 目(にっこりアーチ)
  const eyeR = faceR * 0.34;
  strokeArc(rgba, size, cx - faceR * 0.36, cy - faceR * 0.08, eyeR, size * 0.018, 25, 155, plum.r, plum.g, plum.b, 255);
  strokeArc(rgba, size, cx + faceR * 0.36, cy - faceR * 0.08, eyeR, size * 0.018, 25, 155, plum.r, plum.g, plum.b, 255);

  // 鼻
  fillCircle(rgba, size, cx, cy + faceR * 0.22, faceR * 0.09, nose.r, nose.g, nose.b, 255);

  return rgba;
}

const outDir = join(process.cwd(), 'public', 'icons');
mkdirSync(outDir, { recursive: true });

const targets = [
  { name: 'icon-192.png', size: 192, padded: false },
  { name: 'icon-512.png', size: 512, padded: false },
  { name: 'maskable-192.png', size: 192, padded: true },
  { name: 'maskable-512.png', size: 512, padded: true },
  { name: 'apple-touch-icon.png', size: 180, padded: false },
];

for (const t of targets) {
  const rgba = makeIcon(t.size, { padded: t.padded });
  const png = encodePNG(t.size, t.size, rgba);
  writeFileSync(join(outDir, t.name), png);
  console.log('wrote', t.name);
}

// favicon (32px), also as PNG (browsers accept png favicon)
const faviconRgba = makeIcon(32, { padded: false });
writeFileSync(join(outDir, 'favicon-32.png'), encodePNG(32, 32, faviconRgba));
console.log('wrote favicon-32.png');
