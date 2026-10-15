import fs from 'fs/promises';
import path from 'path';
import { OUTPUT_DIR, safeJoin } from '@/lib/repo';

export const dynamic = 'force-dynamic';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

// 静态文件服务：output/ 目录（用于 PPT 在线预览）
export async function GET(req, { params }) {
  const { path: parts } = await params;
  // 兼容 URL 编码的中文路径（Next.js catch-all 参数可能未解码）
  const rel = (parts || []).map((p) => {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  }).join('/');
  const abs = safeJoin(OUTPUT_DIR, rel);
  if (!abs) return new Response('Forbidden', { status: 403 });
  try {
    const stat = await fs.stat(abs);
    if (!stat.isFile()) return new Response('Not Found', { status: 404 });
    const data = await fs.readFile(abs);
    const ext = path.extname(abs).toLowerCase();
    return new Response(data, {
      headers: {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new Response('Not Found', { status: 404 });
  }
}
