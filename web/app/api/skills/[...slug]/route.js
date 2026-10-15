import fs from 'fs/promises';
import { SKILLS_DIR, safeJoin } from '@/lib/repo';
import { parseFrontmatter } from '@/lib/frontmatter';

export const dynamic = 'force-dynamic';

function resolveFile(slug) {
  const rel = (Array.isArray(slug) ? slug : []).join('/');
  if (!rel || rel.includes('..')) return null;
  return safeJoin(SKILLS_DIR, rel + '/SKILL.md');
}

// Skill 详情（含原始 Markdown）
export async function GET(req, { params }) {
  const { slug } = await params;
  const file = resolveFile(slug);
  if (!file) return Response.json({ error: '非法路径' }, { status: 400 });
  try {
    const raw = await fs.readFile(file, 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    return Response.json({ meta, body, raw });
  } catch {
    return Response.json({ error: 'Skill 不存在' }, { status: 404 });
  }
}

// 在线编辑 Skill
export async function PUT(req, { params }) {
  const { slug } = await params;
  const file = resolveFile(slug);
  if (!file) return Response.json({ error: '非法路径' }, { status: 400 });
  const { content } = await req.json().catch(() => ({}));
  if (typeof content !== 'string' || !content.trim()) {
    return Response.json({ error: '内容不能为空' }, { status: 400 });
  }
  try {
    await fs.writeFile(file, content.replace(/\r?\n/g, '\n'), 'utf8');
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: '保存失败：' + (e.message || e) }, { status: 500 });
  }
}
