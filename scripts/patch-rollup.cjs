// postinstall: if Rollup's native .node binding is blocked by OS policy
// (Application Control / WDAC), patch rollup/dist/native.js to fall back to
// the WASM bindings shipped in @rollup/wasm-node. No-op when native works.
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const nativePath = path.join(__dirname, '..', 'node_modules', 'rollup', 'dist', 'native.js');
if (!fs.existsSync(nativePath)) process.exit(0);

let src = fs.readFileSync(nativePath, 'utf8');
if (src.includes('@rollup/wasm-node')) process.exit(0); // already patched

const probe = `try{require(${JSON.stringify(path.join(__dirname, '..', 'node_modules', '@rollup', 'rollup-win32-x64-msvc', 'rollup.win32-x64-msvc.node'))})}catch(e){process.exit(1)}`;
// Probe by actually loading rollup's native.js in a child process.
try {
  execSync(`node -e "require('${nativePath.replace(/\\/g, '\\\\')}')"`, { stdio: 'pipe' });
  process.exit(0); // native binding loads fine — nothing to do
} catch {
  // native blocked → apply patch
}

const anchor = 'const nativeModule = requireWithFriendlyError(';
const idx = src.indexOf(anchor);
if (idx === -1) process.exit(0);
const end = src.indexOf(');', idx) + 2;
const patched = `let nativeModule;\ntry {\n\tnativeModule = requireWithFriendlyError(\n\t\texistsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`\n\t);\n} catch (nativeError) {\n\tnativeModule = require('@rollup/wasm-node/dist/native.js');\n}`;
src = src.slice(0, idx) + patched + src.slice(end);
fs.writeFileSync(nativePath, src);
console.log('[postinstall] Rollup native binding unavailable — patched to WASM fallback.');
