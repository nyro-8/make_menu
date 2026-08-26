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

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// 中心からライト位置(lightDX/lightDY は半径に対する比率)への距離で近似した放射グラデーション円
function fillCircleGradient(rgba, w, cx, cy, radius, near, far, lightDX, lightDY, spread) {
  const lightX = cx + lightDX * radius;
  const lightY = cy + lightDY * radius;
  const maxDist = radius * spread;
  for (let y = Math.floor(cy - radius - 1); y <= cy + radius + 1; y++) {
    for (let x = Math.floor(cx - radius - 1); x <= cx + radius + 1; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 <= radius * radius) {
        const ldx = x + 0.5 - lightX;
        const ldy = y + 0.5 - lightY;
        const t = Math.max(0, Math.min(1, Math.sqrt(ldx * ldx + ldy * ldy) / maxDist));
        setPx(rgba, w, x, y, lerp(near.r, far.r, t), lerp(near.g, far.g, t), lerp(near.b, far.b, t), 255);
      } else if (d2 <= (radius + 1) * (radius + 1)) {
        const d = Math.sqrt(d2);
        const edgeA = Math.max(0, Math.min(1, radius + 1 - d)) * 255;
        setPx(rgba, w, x, y, far.r, far.g, far.b, edgeA);
      }
    }
  }
}

function fillEllipseGradient(rgba, w, cx, cy, rx, ry, near, far, lightDX, lightDY, spread) {
  const lightX = cx + lightDX * rx;
  const lightY = cy + lightDY * ry;
  const maxR = Math.max(rx, ry) + 2;
  for (let y = Math.floor(cy - maxR); y <= cy + maxR; y++) {
    for (let x = Math.floor(cx - maxR); x <= cx + maxR; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const val = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
      if (val <= 1) {
        const ldx = (x + 0.5 - lightX) / rx;
        const ldy = (y + 0.5 - lightY) / ry;
        const t = Math.max(0, Math.min(1, Math.sqrt(ldx * ldx + ldy * ldy) / spread));
        setPx(rgba, w, x, y, lerp(near.r, far.r, t), lerp(near.g, far.g, t), lerp(near.b, far.b, t), 255);
      }
    }
  }
}

// 中心が濃く、外周に向けて透明にフェードする柔らかい丸(ほっぺの赤み用)
function fillRadialFade(rgba, w, cx, cy, radius, r, g, b, maxAlpha) {
  for (let y = Math.floor(cy - radius); y <= cy + radius; y++) {
    for (let x = Math.floor(cx - radius); x <= cx + radius; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= radius) {
        setPx(rgba, w, x, y, r, g, b, maxAlpha * (1 - d / radius));
      }
    }
  }
}

function strokeQuadratic(rgba, w, x1, y1, cx, cy, x2, y2, thickness, r, g, b, a) {
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    const px = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
    const py = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;
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
  const bg = { r: 0xc1, g: 0x63, b: 0x3b }; // ビーバーモチーフ用のテラコッタ
  const radius = padded ? size * 0.5 : size * 0.24;
  fillRoundedRect(rgba, size, size, radius, bg.r, bg.g, bg.b, 255);

  // デザイン案「A. ふっくらもちもち」(200x200基準)をスケールして描画
  const s = size / 200;
  const headNear = { r: 0xc0, g: 0x8b, b: 0x57 };
  const headFar = { r: 0x95, g: 0x60, b: 0x2f };
  const earNear = { r: 0xa0, g: 0x6f, b: 0x3c };
  const earFar = { r: 0x7c, g: 0x4e, b: 0x26 };
  const earInner = { r: 0xd9, g: 0xa4, b: 0x68 };
  const muzzleNear = { r: 0xf7, g: 0xe6, b: 0xc4 };
  const muzzleFar = { r: 0xe3, g: 0xc3, b: 0x93 };
  const blush = { r: 0xef, g: 0x9a, b: 0x5f };
  const dark = { r: 0x3c, g: 0x2c, b: 0x1f };
  const noseShine = { r: 0x6a, g: 0x51, b: 0x38 };
  const tooth = { r: 0xff, g: 0xfa, b: 0xf1 };
  const toothStroke = { r: 0xe3, g: 0xcd, b: 0xa3 };

  // 耳
  fillCircleGradient(rgba, size, 56 * s, 58 * s, 18 * s, earNear, earFar, -0.3, -0.35, 1.6);
  fillCircleGradient(rgba, size, 144 * s, 58 * s, 18 * s, earNear, earFar, -0.3, -0.35, 1.6);
  fillCircle(rgba, size, 56 * s, 58 * s, 9 * s, earInner.r, earInner.g, earInner.b, 255);
  fillCircle(rgba, size, 144 * s, 58 * s, 9 * s, earInner.r, earInner.g, earInner.b, 255);

  // 頭
  fillCircleGradient(rgba, size, 100 * s, 102 * s, 58 * s, headNear, headFar, -0.3, -0.35, 1.6);

  // マズル
  fillEllipseGradient(rgba, size, 100 * s, 128 * s, 36 * s, 30 * s, muzzleNear, muzzleFar, -0.3, -0.35, 1.6);

  // ほっぺ
  fillRadialFade(rgba, size, 63 * s, 118 * s, 17 * s, blush.r, blush.g, blush.b, 160);
  fillRadialFade(rgba, size, 137 * s, 118 * s, 17 * s, blush.r, blush.g, blush.b, 160);

  // 八の字眉
  const browT = Math.max(1.5, 4.4 * s);
  strokeQuadratic(rgba, size, 84 * s, 80 * s, 74 * s, 84 * s, 65 * s, 92 * s, browT, dark.r, dark.g, dark.b, 255);
  strokeQuadratic(rgba, size, 116 * s, 80 * s, 126 * s, 84 * s, 135 * s, 92 * s, browT, dark.r, dark.g, dark.b, 255);

  // 目(ハイライト付き)
  fillCircle(rgba, size, 76 * s, 100 * s, 7 * s, dark.r, dark.g, dark.b, 255);
  fillCircle(rgba, size, 124 * s, 100 * s, 7 * s, dark.r, dark.g, dark.b, 255);
  fillCircle(rgba, size, 78.5 * s, 97 * s, 2.3 * s, 255, 255, 255, 242);
  fillCircle(rgba, size, 126.5 * s, 97 * s, 2.3 * s, 255, 255, 255, 242);
  fillCircle(rgba, size, 74 * s, 103 * s, 1 * s, 255, 255, 255, 153);
  fillCircle(rgba, size, 122 * s, 103 * s, 1 * s, 255, 255, 255, 153);

  // 鼻(ハイライト付き)
  fillEllipse(rgba, size, 100 * s, 118 * s, 10 * s, 7.5 * s, 0, dark.r, dark.g, dark.b, 255);
  fillEllipse(rgba, size, 97 * s, 115.5 * s, 2.4 * s, 1.6 * s, 0, noseShine.r, noseShine.g, noseShine.b, 179);

  // 前歯
  fillRect(rgba, size, 90 * s, 132 * s, 9 * s, 14 * s, tooth.r, tooth.g, tooth.b, 255);
  fillRect(rgba, size, 101 * s, 132 * s, 9 * s, 14 * s, tooth.r, tooth.g, tooth.b, 255);
  // 歯の輪郭(薄いストローク)
  for (const tx of [90 * s, 101 * s]) {
    strokeLine(rgba, size, tx, 132 * s, tx + 9 * s, 132 * s, 1, toothStroke.r, toothStroke.g, toothStroke.b, 200);
    strokeLine(rgba, size, tx, 146 * s, tx + 9 * s, 146 * s, 1, toothStroke.r, toothStroke.g, toothStroke.b, 200);
  }

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
