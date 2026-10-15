import fs from 'fs/promises';
import path from 'path';
import { OUTPUT_DIR } from '@/lib/repo';

export const dynamic = 'force-dynamic';

// 递归扫描 output/ 目录，查找所有 index.html（交付件）
async function findDeliverables(dir, depth = 0) {
  const results = [];
  if (depth > 4) return results;
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.') || e.name === 'ppt' || e.name === 'assets') continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        const sub = await findDeliverables(full, depth + 1);
        results.push(...sub);
      } else if (e.isFile() && e.name === 'index.html') {
        const relPath = path.relative(OUTPUT_DIR, dir).replace(/\\/g, '/');
        results.push({ dir, relPath });
      }
    }
  } catch {}
  return results;
}

// 交付物列表：扫描 output/ 下所有项目的交付件
export async function GET() {
  try {
    const allDeliverables = await findDeliverables(OUTPUT_DIR);
    const outputs = [];

    for (const { dir, relPath } of allDeliverables) {
      const item = {
        name: relPath,
        title: '',
        pageCount: null,
        hasPpt: true,
        mtime: '',
        files: [],
        path: `${relPath}/index.html`.replace(/\\/g, '/'),
      };
      try {
        const st = await fs.stat(dir);
        item.mtime = st.mtime.toISOString().slice(0, 10);
      } catch {}
      try {
        const metaRaw = await fs.readFile(path.join(dir, 'meta.json'), 'utf8');
        const meta = JSON.parse(metaRaw);
        item.title = meta.title || '';
        item.pageCount = meta.pageCount || null;
      } catch {}
      try {
        const files = await fs.readdir(dir);
        item.files = files.filter((f) => !f.startsWith('.')).slice(0, 30);
      } catch {}
      outputs.push(item);
    }

    outputs.sort((a, b) => (b.mtime || '').localeCompare(a.mtime || ''));
    return Response.json({ outputs });
  } catch {
    return Response.json({ outputs: [] });
  }
}
