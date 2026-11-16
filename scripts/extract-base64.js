#!/usr/bin/env node
/**
 * 构建前预处理：把 Markdown 里内嵌的 base64 图片抽成独立文件，
 * 并把链接改写为短路径 /img/auto/<hash>.<ext>。
 * 目的：避免 marked 解析超长单行导致 "Maximum call stack size exceeded"，
 *       同时让 base64 笔记（含 Telegram 发来的）都能正常构建。
 *
 * 用法：
 *   node scripts/extract-base64.js          # 真正抽取并改写
 *   node scripts/extract-base64.js --dry    # 只统计，不改动
 * 仅处理 source/_posts 下所有 .md，幂等（无 base64 的文件跳过）。
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.cwd();
const POSTS = path.join(ROOT, 'source', '_posts');
const IMGDIR = path.join(ROOT, 'source', 'img', 'auto');
const dry = process.argv.includes('--dry');

const EXT = { png: 'png', jpeg: 'jpg', jpg: 'jpg', gif: 'gif', webp: 'webp', bmp: 'bmp', 'svg+xml': 'svg' };
const RE = /!\[([^\]]*)\]\(data:image\/([a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)\)/g;

function walk(d) {
  let out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else if (e.name.toLowerCase().endsWith('.md')) out.push(p);
  }
  return out;
}

function main() {
  if (!fs.existsSync(POSTS)) { console.log('[extract-base64] 无 source/_posts，跳过'); return; }
  let files = 0, imgs = 0, totalBytes = 0;
  for (const f of walk(POSTS)) {
    const text = fs.readFileSync(f, 'utf8');
    if (!text.includes('data:image')) continue;
    let changed = false;
    const out = text.replace(RE, (m, alt, mime, b64) => {
      let buf;
      try { buf = Buffer.from(b64, 'base64'); } catch (e) { return m; }
      if (!buf || buf.length === 0) return m;
      const ext = EXT[mime] || (mime.includes('svg') ? 'svg' : 'bin');
      const hash = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 16);
      const name = hash + '.' + ext;
      if (!dry) {
        fs.mkdirSync(IMGDIR, { recursive: true });
        const target = path.join(IMGDIR, name);
        if (!fs.existsSync(target)) fs.writeFileSync(target, buf);
      }
      imgs++; totalBytes += buf.length; changed = true;
      return `![${alt}](/img/auto/${name})`;
    });
    if (changed) { files++; if (!dry) fs.writeFileSync(f, out, 'utf8'); }
  }
  console.log(`[extract-base64] ${dry ? 'DRY-RUN ' : ''}改写文件=${files} 图片=${imgs} 体积=${(totalBytes / 1048576).toFixed(1)}MB`);
}

main();
