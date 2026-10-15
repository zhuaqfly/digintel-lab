import fs from 'fs/promises';
import path from 'path';
import { OUTPUT_DIR } from '@/lib/repo';
import { renderSlides } from '@/lib/slides-template';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function newId() {
  return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: '请求体格式错误' }, { status: 400 });
  }

  const { title, slides, theme = 'red', projectName, stageLabel } = body;

  if (!Array.isArray(slides) || slides.length === 0) {
    return Response.json({ error: '缺少幻灯片数据' }, { status: 400 });
  }

  const reportId = newId();
  const reportDir = path.join(OUTPUT_DIR, reportId);
  const pptDir = path.join(reportDir, 'ppt');

  try {
    await fs.mkdir(pptDir, { recursive: true });

    // 渲染HTML幻灯片
    const html = renderSlides(
      { title, slides },
      { theme, projectName, stageLabel, brand: '数智咨询实验室' }
    );

    if (!html) {
      return Response.json({ error: '幻灯片渲染失败' }, { status: 500 });
    }

    // 保存HTML
    await fs.writeFile(path.join(pptDir, 'index.html'), html, 'utf8');

    // 保存goal.json元数据
    const goal = {
      id: reportId,
      title: title || '数智化咨询报告',
      theme,
      pageCount: slides.length,
      slides,
      createdAt: new Date().toISOString(),
    };
    await fs.writeFile(path.join(reportDir, 'goal.json'), JSON.stringify(goal, null, 2), 'utf8');

    return Response.json({
      success: true,
      reportId,
      pageCount: slides.length,
      url: `/outputs/${reportId}`,
    });
  } catch (e) {
    return Response.json({ error: '生成失败：' + (e.message || e) }, { status: 500 });
  }
}
