import fs from 'fs/promises';
import path from 'path';
import { AGENTS_DIR } from '@/lib/repo';
import { parseFrontmatter } from '@/lib/frontmatter';

export const dynamic = 'force-dynamic';

// Agent 列表：扫描 agents/*/AGENT.md
export async function GET() {
  try {
    const dirs = await fs.readdir(AGENTS_DIR, { withFileTypes: true });
    const agents = [];
    for (const d of dirs) {
      if (!d.isDirectory()) continue;
      const file = path.join(AGENTS_DIR, d.name, 'AGENT.md');
      try {
        const raw = await fs.readFile(file, 'utf8');
        const { meta } = parseFrontmatter(raw);
        agents.push({
          name: meta.name || d.name,
          dir: d.name,
          description: meta.description || '',
          version: meta.version || '',
          tags: Array.isArray(meta.tags) ? meta.tags : [],
        });
      } catch {}
    }
    return Response.json({ agents });
  } catch {
    return Response.json({ agents: [] });
  }
}
