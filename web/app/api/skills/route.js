import fs from 'fs/promises';
import path from 'path';
import { SKILLS_DIR } from '@/lib/repo';
import { parseFrontmatter } from '@/lib/frontmatter';

export const dynamic = 'force-dynamic';

// 递归扫描 skills/**/SKILL.md
async function walk(dir, base, out) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'scripts') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full, base, out);
    } else if (e.name === 'SKILL.md') {
      const rel = path
        .relative(base, path.dirname(full))
        .split(path.sep)
        .join('/');
      try {
        const raw = await fs.readFile(full, 'utf8');
        const { meta } = parseFrontmatter(raw);
        out.push({
          name: meta.name || rel.split('/').pop(),
          dir: rel,
          domain: meta.domain || rel.split('/')[0],
          description: meta.description || '',
          version: meta.version || '',
          tags: Array.isArray(meta.tags) ? meta.tags : [],
        });
      } catch {}
    }
  }
}

export async function GET() {
  const skills = [];
  await walk(SKILLS_DIR, SKILLS_DIR, skills);
  return Response.json({ skills });
}
