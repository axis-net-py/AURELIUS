/**
 * Auditoria dos dicionários `{ pt: {...}, es: {...} }` declarados dentro dos
 * componentes (padrão dominante neste ERP).
 *
 * É exatamente onde a mescla PT/ES se esconde: uma chave existe em `pt` e não em
 * `es`, então aquele rótulo fica em português mesmo com o espanhol selecionado.
 *
 * Uso: node scripts/check-strings.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "src");

/** Percorre recursivamente os arquivos .ts/.tsx. */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

/** Conteúdo entre chaves balanceadas a partir do índice de um '{'. */
function block(text, start) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return text.slice(start + 1, i);
    }
  }
  return "";
}

/** Extrai as chaves de primeiro nível de um bloco de idioma. */
function parseLang(body) {
  const keys = new Set();
  let depth = 0;
  for (const line of body.split("\n")) {
    const s = line.trim();
    if (depth === 0) {
      const m = /^([A-Za-z_]\w*)\s*:/.exec(s);
      if (m) keys.add(m[1]);
    }
    depth += (s.match(/\{/g) || []).length - (s.match(/\}/g) || []).length;
    if (depth < 0) depth = 0;
  }
  return keys;
}

let failed = false;
let audited = 0;

for (const file of walk(SRC)) {
  const txt = readFileSync(file, "utf8");
  // Aceita `const STRINGS = {`, `const translations = {`, `const labels = {`
  const decl = /const\s+(?:STRINGS|translations|labels)\s*=\s*\{/.exec(txt);
  if (!decl) continue;

  const outer = block(txt, decl.index + decl[0].length - 1);
  const ptM = /^\s*pt\s*:/m.exec(outer);
  const esM = /^\s*es\s*:/m.exec(outer);
  if (!ptM || !esM) continue;

  audited++;
  const pt = parseLang(block(outer, outer.indexOf("{", ptM.index)));
  const es = parseLang(block(outer, outer.indexOf("{", esM.index)));

  const missing = [...pt].filter((k) => !es.has(k));
  const extra = [...es].filter((k) => !pt.has(k));

  if (missing.length || extra.length) {
    failed = true;
    console.error(`\n${relative(root, file)}`);
    if (missing.length)
      console.error(`  faltam em "es" (${missing.length}): ${missing.join(", ")}`);
    if (extra.length)
      console.error(`  sobrando em "es" (${extra.length}): ${extra.join(", ")}`);
  }
}

if (failed) {
  console.error("\n✗ Dicionários de componente com idiomas divergentes.");
  process.exit(1);
}
console.log(
  `✓ ${audited} dicionários de componente com pt/es em paridade.`
);
