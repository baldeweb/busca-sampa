const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'i18n.ts');
const src = fs.readFileSync(filePath, 'utf8');

const marker = 'const resources = ';
const start = src.indexOf(marker);
if (start === -1) {
  console.error('Could not find resources marker in i18n.ts');
  process.exit(2);
}
let i = start + marker.length;
// find matching closing brace for the object
let depth = 0;
let started = false;
let endIndex = -1;
for (; i < src.length; i++) {
  const ch = src[i];
  if (!started) {
    if (ch === '{') { started = true; depth = 1; }
    continue;
  }
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) { endIndex = i; break; }
  }
}
if (endIndex === -1) {
  console.error('Could not find end of resources object');
  process.exit(2);
}
const objText = src.slice(start + marker.length, endIndex + 1);

// Prepare a JS-evaluable version: replace single trailing commas in object/array (keep as is), but remove TypeScript casts like `as any`.
const cleaned = objText.replace(/as any/g, '').replace(/\b(?:\w+)\s*:\s*/g, (m) => m); // keep keys as-is

// Evaluate in a safe VM
const vm = require('vm');
let resources;
try {
  resources = vm.runInNewContext('(' + cleaned + ')', {}, { timeout: 1000 });
} catch (e) {
  console.error('Failed to evaluate resources object:', e);
  process.exit(2);
}

function flatten(obj, prefix = '') {
  const res = {};
  for (const k of Object.keys(obj || {})) {
    const val = obj[k];
    const key = prefix ? prefix + '.' + k : k;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(res, flatten(val, key));
    } else {
      res[key] = true;
    }
  }
  return res;
}

const ptKeys = flatten(resources.pt && resources.pt.translation ? resources.pt.translation : {});

const report = {};
for (const lng of Object.keys(resources)) {
  if (lng === 'pt') continue;
  const trans = resources[lng] && resources[lng].translation ? resources[lng].translation : {};
  const keys = flatten(trans);
  const missing = [];
  for (const k of Object.keys(ptKeys)) {
    if (!keys[k]) missing.push(k);
  }
  report[lng] = missing;
}

// Print summary
let anyMissing = false;
for (const lng of Object.keys(report)) {
  const missing = report[lng];
  if (missing.length === 0) {
    console.log(lng + ': OK ✅');
  } else {
    anyMissing = true;
    console.log(lng + ': MISSING ' + missing.length + ' keys');
    missing.forEach(k => console.log('  - ' + k));
  }
}
if (anyMissing) process.exit(1);
else process.exit(0);
