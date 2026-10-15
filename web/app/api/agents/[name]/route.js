import fs from 'fs/promises';
import path from 'path';
import { AGENTS_DIR } from '@/lib/repo';
import { parseFrontmatter } from '@/lib/frontmatter';

export const dynamic = 'force-dynamic';

const NAME_RE = /^[A-Za-z0-9_-]+$/;

// Agent 详情（含原始 Markdown）
export async function GET(req, { params }) {
  const { name } = await params;
  if (!NAME_RE.test(name || '')) {
    return Response.json({ error: '非法名称' }, { status: 400 });
  }
  const file = path.join(AGENTS_DIR, name, 'AGENT.md');
  try {
    const raw = await fs.readFile(file, 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    return Response.json({ meta, body, raw });
  } catch {
    return Response.json({ error: 'Agent 不存在' }, { status: 404 });
  }
}

// 在线编辑 Agent
export async function PUT(req, { params }) {
  const { name } = await params;
  if (!NAME_RE.test(name || '')) {
    return Response.json({ error: '非法名称' }, { status: 400 });
  }
  const { content } = await req.json().catch(() => ({}));
  if (typeof content !== 'string' || !content.trim()) {
    return Response.json({ error: '内容不能为空' }, { status: 400 });
  }
  const file = path.join(AGENTS_DIR, name, 'AGENT.md');
  try {
    await fs.writeFile(file, content.replace(/\r?\n/g, '\n'), 'utf8');
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: '保存失败：' + (e.message || e) }, { status: 500 });
  }
}
