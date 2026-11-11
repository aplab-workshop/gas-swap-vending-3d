// Smoke test ร่วมของ Codex + Claude — รัน: node scripts/check.mjs
// ตรวจ: 1) syntax ของ JS module  2) id ที่โค้ดอ้างถึงมีอยู่ใน HTML
//       3) three.js ปักเวอร์ชัน 0.160.0  4) PLC address ไม่ซ้ำ/ครบตาม AGENTS.md
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'gas_swap_3d.html'), 'utf8');
const errors = [], ok = msg => console.log('  ✓ ' + msg);

// 1) syntax
const mod = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!mod) errors.push('ไม่พบ <script type="module">');
else {
  const dir = mkdtempSync(join(tmpdir(), 'gascheck-'));
  const f = join(dir, 'app.mjs');
  writeFileSync(f, mod[1]);
  try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); ok('JS module syntax'); }
  catch (e) { errors.push('Syntax error:\n' + e.stderr.toString()); }
  finally { rmSync(dir, { recursive: true, force: true }); }
}

// 2) DOM ids
if (mod) {
  const js = mod[1];
  const used = new Set([...js.matchAll(/(?:getElementById\(|\$\()\s*'([\w-]+)'/g)].map(m => m[1]));
  const defined = new Set([...html.matchAll(/\sid="([\w-]+)"/g)].map(m => m[1]));
  const missing = [...used].filter(id => !defined.has(id));
  if (missing.length) errors.push('id ที่โค้ดใช้แต่ไม่มีใน HTML: ' + missing.join(', '));
  else ok(`DOM ids (${used.size} รายการ)`);
}

// 3) three.js version
const vers = [...html.matchAll(/three@([\d.]+)/g)].map(m => m[1]);
if (!vers.length || vers.some(v => v !== '0.160.0')) errors.push('three.js ต้องเป็น 0.160.0 เท่านั้น พบ: ' + vers.join(', '));
else ok('three@0.160.0');

// 4) PLC addresses
const expect = ['M100', 'M120', 'M121', 'M200', 'M210', 'M211'];
const missingM = expect.filter(a => !html.includes(`'${a}'`) && !html.includes(`"${a}"`) && !html.includes(a));
const aux = [...html.matchAll(/\{ M:'(M\d+)'/g)].map(m => m[1]);
const dup = aux.filter((a, i) => aux.indexOf(a) !== i);
if (missingM.length) errors.push('PLC address หาย: ' + missingM.join(', '));
else if (dup.length) errors.push('PLC address ซ้ำ: ' + dup.join(', '));
else ok('PLC map');

if (errors.length) { console.error('\n✗ ไม่ผ่าน:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log('\n✓ ผ่านทั้งหมด');
