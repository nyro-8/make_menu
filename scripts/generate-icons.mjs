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

function strokeLine(rgba, w, x1, y1, x2, y2, thickness, r, g, b, a) {
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = x1 + (x2 - x1) * t;
    const py = y1 + (y2 - y1) * t;
    fillCircle(rgba, w, px, py, thickness / 2, r, g, b, a, false);
  }
}

function fillRect(rgba, w, x, y, rw, rh, r, g, b, a) {
  for (let yy = Math.round(y); yy < Math.round(y + rh); yy++) {
    for (let xx = Math.round(x); xx < Math.round(x + rw); xx++) {
      setPx(rgba, w, xx, yy, r, g, b, a);
    }
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
  const bg = { r: 0xc1, g: 0x63, b: 0x3b }; // ビーバーモチーフ用のテラコッタ
  const radius = padded ? size * 0.5 : size * 0.24;
  fillRoundedRect(rgba, size, size, radius, bg.r, bg.g, bg.b, 255);

  const cx = size / 2;
  const cy = size * 0.56;
  const faceR = size * 0.28;
  const earOuter = { r: 0x8a, g: 0x5a, b: 0x30 };
  const earInner = { r: 0xc9, g: 0x8f, b: 0x57 };
  const head = { r: 0xa9, g: 0x71, b: 0x3f };
  const muzzle = { r: 0xe8, g: 0xcf, b: 0xa0 };
  const cheek = { r: 0xe8, g: 0xa0, b: 0x6a };
  const dark = { r: 0x4a, g: 0x36, b: 0x26 };
  const tooth = { r: 0xff, g: 0xf8, b: 0xec };

  // 耳
  const earCx = size * 0.24;
  const earCy = cy - faceR * 0.82;
  fillCircle(rgba, size, earCx, earCy, faceR * 0.42, earOuter.r, earOuter.g, earOuter.b, 255);
  fillCircle(rgba, size, size - earCx, earCy, faceR * 0.42, earOuter.r, earOuter.g, earOuter.b, 255);
  fillCircle(rgba, size, earCx, earCy, faceR * 0.2, earInner.r, earInner.g, earInner.b, 255);
  fillCircle(rgba, size, size - earCx, earCy, faceR * 0.2, earInner.r, earInner.g, earInner.b, 255);

  // 頭
  fillCircle(rgba, size, cx, cy, faceR, head.r, head.g, head.b, 255);

  // マズル
  fillEllipse(rgba, size, cx, cy + faceR * 0.28, faceR * 0.62, faceR * 0.52, 0, muzzle.r, muzzle.g, muzzle.b, 255);

  // ほっぺ
  fillCircle(rgba, size, cx - faceR * 0.68, cy + faceR * 0.14, faceR * 0.2, cheek.r, cheek.g, cheek.b, 150);
  fillCircle(rgba, size, cx + faceR * 0.68, cy + faceR * 0.14, faceR * 0.2, cheek.r, cheek.g, cheek.b, 150);

  // 八の字眉
  const browT = Math.max(1.5, size * 0.02);
  strokeLine(
    rgba, size,
    cx - faceR * 0.26, cy - faceR * 0.58,
    cx - faceR * 0.74, cy - faceR * 0.34,
    browT, dark.r, dark.g, dark.b, 255
  );
  strokeLine(
    rgba, size,
    cx + faceR * 0.26, cy - faceR * 0.58,
    cx + faceR * 0.74, cy - faceR * 0.34,
    browT, dark.r, dark.g, dark.b, 255
  );

  // 目
  fillCircle(rgba, size, cx - faceR * 0.37, cy - faceR * 0.08, faceR * 0.14, dark.r, dark.g, dark.b, 255);
  fillCircle(rgba, size, cx + faceR * 0.37, cy - faceR * 0.08, faceR * 0.14, dark.r, dark.g, dark.b, 255);

  // 鼻
  fillEllipse(rgba, size, cx, cy + faceR * 0.14, faceR * 0.14, faceR * 0.11, 0, dark.r, dark.g, dark.b, 255);

  // 前歯
  const toothW = faceR * 0.14;
  const toothH = faceR * 0.22;
  fillRect(rgba, size, cx - toothW - 1, cy + faceR * 0.34, toothW, toothH, tooth.r, tooth.g, tooth.b, 255);
  fillRect(rgba, size, cx + 1, cy + faceR * 0.34, toothW, toothH, tooth.r, tooth.g, tooth.b, 255);

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
