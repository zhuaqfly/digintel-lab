// 阶段交付物：结构化 JSON → 自包含 HTML 幻灯片渲染器
// 幻灯片 16:9（1280x720 设计稿），麦肯锡/BCG风格：信息密度高、逻辑清晰、数据说话、视觉专业

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ========== 公共组件 ==========
function section(sl, body, cls = '') {
  const chap = sl.chapter ? `<span class="foot-chap">${esc(sl.chapter)}</span>` : '';
  return `<section class="slide${cls ? ' ' + cls : ''}">${body}
    ${chap ? `<div class="foot-mark"></div>` : ''}
  </section>`;
}

function slideTitle(title, kicker, quote) {
  const kickerHtml = kicker ? `<div class="kicker">${esc(kicker)}</div>` : '';
  const titleHtml = title ? `<h2 class="stitle">${esc(title)}</h2>` : '';
  return `<header class="shead">${kickerHtml}${titleHtml}</header>`;
}

function insightBox(text) {
  if (!text) return '';
  return `<div class="insight-box"><span class="ib-icon">💡</span><div class="ib-text">${esc(text)}</div></div>`;
}

// ========== 1. 封面 ==========
function renderCover(sl) {
  return section(sl, `
    <div class="cover-band"></div>
    <div class="cover-deco"></div>
    <div class="cover-deco2"></div>
    <div class="cover-logo">
      <span class="cl-icon">◆</span>
      <span class="cl-text">数智咨询实验室</span>
    </div>
    <div class="cover-mid">
      <div class="cover-tag">${esc(sl.badge || '咨询交付物')}</div>
      <h1 class="cover-title">${esc(sl.title || '')}</h1>
      ${sl.subtitle ? `<p class="cover-sub">${esc(sl.subtitle)}</p>` : ''}
    </div>
    <div class="cover-meta">
      ${(sl.meta || []).map((m) => `<span>${esc(m)}</span>`).join(' <i>|</i> ')}
    </div>
    <div class="cover-ornament">
      <div class="co-line"></div>
      <div class="co-year">${new Date().getFullYear()}</div>
    </div>
  `, 'cover');
}

// ========== 2. 目录（纯目录，无结果预告） ==========
function renderToc(sl, pageMap) {
  const items = sl.items || [];
  const count = items.length;
  // 根据条目数量决定布局：<=7 单列，>=8 双列
  const useTwoCol = count >= 8;
  const halfLen = Math.ceil(count / 2);
  const col1Items = useTwoCol ? items.slice(0, halfLen) : items;
  const col2Items = useTwoCol ? items.slice(halfLen) : [];

  const renderItem = (t, i) => {
    const realIdx = useTwoCol && i >= halfLen ? i : i;
    const page = pageMap && pageMap[i] != null ? pageMap[i] : (i + 3);
    const titles = typeof t === 'string' ? {main: t} : t;
    const main = titles.main || t;
    const sub = titles.sub || '';
    return `
    <div class="toc-row">
      <span class="toc-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="toc-content">
        <span class="toc-txt">${esc(main)}</span>
        ${sub ? `<span class="toc-sub">${esc(sub)}</span>` : ''}
      </div>
      <span class="toc-dot"></span>
      <span class="toc-page">${String(page).padStart(2, '0')}</span>
    </div>`;
  };

  return section(sl, `
    ${slideTitle(sl.title || '目录', sl.kicker || 'CONTENTS')}
    <div class="toc-body">
      <div class="toc-col ${useTwoCol ? 'toc-col-half' : 'toc-col-full'}">
        ${col1Items.map((t, i) => renderItem(t, i)).join('')}
      </div>
      ${useTwoCol ? `
      <div class="toc-col toc-col-half">
        ${col2Items.map((t, i) => renderItem(t, i + halfLen)).join('')}
      </div>` : ''}
    </div>
  `);
}

// ========== 3. 金字塔（成熟度模型介绍页）- 全SVG精确对齐版 ==========
function renderPyramid(sl) {
  const levels = (sl.levels || []).slice();
  const n = levels.length || 5;
  const defaultFeatures = [
    ['业务单点信息化', '无统一转型战略', '数据分散孤立'],
    ['部门级系统建设', '核心业务线上化', '部门内数据可用'],
    ['跨部门流程贯通', '企业级数据共享', '数据驱动决策'],
    ['平台化能力复用', 'AI深度嵌入业务', '产业链数据协同'],
    ['数智原生组织', '智能自主决策', '生态价值网络']
  ];
  const levelNames = ['起始级', '单元级', '流程级', '网络级', '生态级'];
  const levelColors = ['#059669', '#16A34A', '#CA8A04', '#EA580C', '#DC2626'];

  // 构建levels数组：L1(idx=0)在底层, L5(idx=4)在顶层
  const lvls = [];
  for (let i = 0; i < n; i++) {
    const lv = levels[i] || {};
    lvls.push({
      idx: i,
      level: lv.level || ('L' + (i + 1)),
      name: lv.name || levelNames[i],
      features: (lv.features && lv.features.length) ? lv.features.slice(0, 3) : defaultFeatures[i],
      color: levelColors[i]
    });
  }

  // 全SVG画布：左侧特征区 + 金字塔 + 右侧特征区
  const CW = 1080, CH = 460;
  const cx = CW / 2;
  const topY = 30;
  const botY = CH - 40;
  const totalH = botY - topY;
  const pyrTopHW = 22;
  const pyrBotHW = 150;
  const leftAreaW = 300;  // 左侧特征区宽度
  const rightAreaW = 300; // 右侧特征区宽度
  const pyrLeftEdge = cx - pyrBotHW; // 金字塔最左边缘x
  const pyrRightEdge = cx + pyrBotHW; // 金字塔最右边缘x
  const leftCardX = 30;
  const rightCardX = pyrRightEdge + 50;
  const cardW = 270;
  const lineStartPad = 6; // 引导线从金字塔边缘伸出长度
  const lineEndPad = 8;   // 引导线到卡片距离

  // 计算每层坐标
  const layers = [];
  for (let i = 0; i < n; i++) {
    const li = n - 1 - i; // 顶层L5 -> 底层L1
    const t = i / n;
    const tNext = (i + 1) / n;
    const yTop = topY + t * totalH;
    const yBot = topY + tNext * totalH;
    const hwTop = pyrTopHW + (pyrBotHW - pyrTopHW) * t;
    const hwBot = pyrTopHW + (pyrBotHW - pyrTopHW) * tNext;
    layers.push({
      lv: lvls[li],
      yTop, yBot, hwTop, hwBot,
      midY: (yTop + yBot) / 2,
      leftX: cx - hwBot,  // 本层底部左边缘（连接引导线的位置）
      rightX: cx + hwBot  // 本层底部右边缘
    });
  }

  // 分配左右：L5左, L4右, L3左, L2右, L1左
  const side = ['L', 'R', 'L', 'R', 'L']; // i=0..4 对应顶层到L1的side
  // sideMap: level idx -> side (L/R)
  const sideForLvl = {};
  layers.forEach((l, i) => { sideForLvl[l.lv.idx] = side[i]; });

  // 绘制金字塔色块
  let svg = '';
  svg += `<defs>
    <filter id="pyrSh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="rgba(15,23,42,.12)"/>
    </filter>
  </defs>`;

  layers.forEach((l, i) => {
    const d = `M ${cx - l.hwTop} ${l.yTop} L ${cx + l.hwTop} ${l.yTop} L ${cx + l.hwBot} ${l.yBot} L ${cx - l.hwBot} ${l.yBot} Z`;
    svg += `<path d="${d}" fill="${l.lv.color}" opacity="${0.85 + i * 0.025}" stroke="#fff" stroke-width="2" filter="url(#pyrSh)"/>`;
    // 层标签
    const isTop = i === 0;
    const textY = isTop ? l.midY + 2 : l.midY;
    svg += `<text x="${cx}" y="${textY - 5}" text-anchor="middle" fill="#fff" font-size="13" font-weight="800" font-family="JetBrains Mono,Consolas,monospace" letter-spacing="1">${l.lv.level}</text>`;
    svg += `<text x="${cx}" y="${textY + 9}" text-anchor="middle" fill="rgba(255,255,255,0.95)" font-size="10" font-weight="600">${esc(l.lv.name)}</text>`;
  });

  // 绘制引导线和特征卡片
  const featLineColor = 'rgba(100,116,139,0.35)';
  layers.forEach((l, i) => {
    const s = side[i];
    const anchorX = s === 'L' ? l.leftX : l.rightX;
    const lineX1 = s === 'L' ? anchorX - lineStartPad : anchorX + lineStartPad;
    // 卡片矩形位置
    const cardX0 = s === 'L' ? leftCardX : rightCardX;
    const lineX2 = s === 'L' ? cardX0 + cardW + lineEndPad : cardX0 - lineEndPad;
    const cardH = 62;
    const cardY = l.midY - cardH / 2;

    // 引导线：从金字塔边缘水平伸出一小段，再连到卡片
    svg += `<line x1="${anchorX}" y1="${l.midY}" x2="${lineX1}" y2="${l.midY}" stroke="${l.lv.color}" stroke-width="1.5" opacity="0.7"/>`;
    svg += `<line x1="${lineX1}" y1="${l.midY}" x2="${lineX2}" y2="${l.midY}" stroke="${featLineColor}" stroke-width="1" stroke-dasharray="3,2"/>`;
    // 连接点小圆点
    svg += `<circle cx="${anchorX}" cy="${l.midY}" r="2.5" fill="${l.lv.color}"/>`;

    // 卡片背景（圆角矩形）
    const cardRectX = cardX0;
    svg += `<rect x="${cardRectX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="6" ry="6" fill="#fff" stroke="${l.lv.color}" stroke-width="1.5" opacity="0.98"/>`;
    // 卡片左侧/右侧色条
    const barW = 4;
    if (s === 'L') {
      svg += `<rect x="${cardRectX}" y="${cardY}" width="${barW}" height="${cardH}" rx="3" ry="3" fill="${l.lv.color}"/>`;
    } else {
      svg += `<rect x="${cardRectX + cardW - barW}" y="${cardY}" width="${barW}" height="${cardH}" rx="3" ry="3" fill="${l.lv.color}"/>`;
    }
    // 卡片内容：等级+名称
    const textPadX = s === 'L' ? cardRectX + 14 : cardRectX + 10;
    const textAnchor = s === 'L' ? 'start' : 'start';
    svg += `<text x="${textPadX}" y="${cardY + 20}" font-size="12" font-weight="800" font-family="JetBrains Mono,Consolas,monospace" fill="${l.lv.color}">${l.lv.level}</text>`;
    svg += `<text x="${textPadX + 30}" y="${cardY + 20}" font-size="12" font-weight="700" fill="#1e293b">${esc(l.lv.name)}</text>`;
    // 特征chip（文本形式，因foreignObject兼容性，用text+tspan）
    l.lv.features.forEach((ft, fi) => {
      const chipY = cardY + 40 + fi * 0; // 横排
    });
    // 使用foreignObject绘制chip更灵活
    const foX = s === 'L' ? cardRectX + 12 : cardRectX + 8;
    const foW = cardW - 20;
    svg += `<foreignObject x="${foX}" y="${cardY + 26}" width="${foW}" height="${cardH - 30}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;height:100%;${s === 'R' ? 'justify-content:flex-start' : ''}">
        ${l.lv.features.map(f => `<span style="padding:2px 7px;background:#f1f5f9;border-radius:10px;font-size:9.5px;color:#475569;font-weight:500;white-space:nowrap">${esc(f)}</span>`).join('')}
      </div>
    </foreignObject>`;
  });

  // 纵轴箭头指示
  svg += `<text x="${cx}" y="${topY - 10}" text-anchor="middle" fill="#DC2626" font-size="10" font-weight="700" font-family="JetBrains Mono,Consolas,monospace" letter-spacing="1">▲ 生态引领</text>`;
  svg += `<text x="${cx}" y="${botY + 20}" text-anchor="middle" fill="#059669" font-size="10" font-weight="700" font-family="JetBrains Mono,Consolas,monospace" letter-spacing="1">▼ 单点应用</text>`;

  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    <div class="pyrm-wrap">
      ${sl.modelDesc ? `<div class="pyrm-desc">${esc(sl.modelDesc)}</div>` : ''}
      <div class="pyrm-body">
        <svg viewBox="0 0 ${CW} ${CH}" width="100%" height="100%" style="max-height:480px" preserveAspectRatio="xMidYMid meet">${svg}</svg>
      </div>
    </div>
  `);
}

// ========== 4. 麦肯锡屋形模型（七维度评估框架）- 专业咨询版 ==========
function renderHouse(sl) {
  const pillars = sl.pillars || sl.nodes || [];
  const N = pillars.length;
  const W = 1140, H = 510;
  const roofTopY = 42;
  const roofLeftX = 60;
  const roofRightX = W - 60;
  const roofPeakX = W / 2;
  const roofBaseY = 148;
  const pillarTopY = 166;
  const pillarBotY = 400;
  const foundationTopY = 415;
  const foundationBotY = 475;
  const pillarGap = 8;
  const pillarW = (roofRightX - roofLeftX - pillarGap * (N - 1)) / N;

  let svg = '';
  svg += `<defs>
    <linearGradient id="roofGradV2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--brand)"/>
      <stop offset="100%" stop-color="var(--brand2)"/>
    </linearGradient>
    <linearGradient id="foundGradV2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <filter id="roofShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="var(--hl-shadow-soft)"/>
    </filter>
  </defs>`;

  // 地基
  svg += `<rect class="house-v2-foundation" x="${roofLeftX - 15}" y="${foundationTopY}" width="${roofRightX - roofLeftX + 30}" height="${foundationBotY - foundationTopY}" rx="6"/>`;
  svg += `<text class="house-v2-found-label" x="${roofLeftX + 10}" y="${foundationTopY + 22}">地基</text>`;
  svg += `<text class="house-v2-found-text" x="${W / 2}" y="${foundationTopY + 40}" text-anchor="middle">${esc(sl.foundation || '治理体系 · 组织架构 · 人才文化 · 安全合规')}</text>`;

  // 屋顶三角形（带装饰）
  svg += `<path class="house-v2-roof" d="M ${roofPeakX} ${roofTopY} L ${roofRightX} ${roofBaseY} L ${roofLeftX} ${roofBaseY} Z" filter="url(#roofShadow)"/>`;
  // 屋顶内部分隔线（装饰）
  for (let i = 1; i <= 3; i++) {
    const y = roofTopY + (roofBaseY - roofTopY) * (i / 4);
    const w = (roofRightX - roofLeftX) * (i / 4);
    svg += `<line class="house-v2-roof-line" x1="${roofPeakX - w/2}" y1="${y}" x2="${roofPeakX + w/2}" y2="${y}"/>`;
  }
  // 烟囱/顶尖装饰
  svg += `<rect class="house-v2-chimney" x="${roofPeakX - 8}" y="${roofTopY - 20}" width="16" height="25" rx="2"/>`;
  svg += `<circle class="house-v2-peak" cx="${roofPeakX}" cy="${roofTopY - 25}" r="8"/>`;

  // 屋顶文字
  svg += `<text class="house-v2-roof-tag" x="${roofPeakX}" y="${roofTopY + 40}" text-anchor="middle">评估目标</text>`;
  svg += `<text class="house-v2-roof-title" x="${roofPeakX}" y="${roofTopY + 65}" text-anchor="middle">${esc(sl.goal || sl.center || '数智化转型升级')}</text>`;
  svg += `<text class="house-v2-roof-sub" x="${roofPeakX}" y="${roofTopY + 85}" text-anchor="middle">${esc(sl.goalSub || '七大核心能力支柱')}</text>`;

  // 立柱
  pillars.forEach((p, i) => {
    const x = roofLeftX + i * (pillarW + pillarGap);
    // 立柱阴影
    svg += `<rect class="house-v2-pillar-shadow" x="${x + 3}" y="${pillarTopY + 3}" width="${pillarW}" height="${pillarBotY - pillarTopY}" rx="4"/>`;
    // 立柱主体
    svg += `<rect class="house-v2-pillar" x="${x}" y="${pillarTopY}" width="${pillarW}" height="${pillarBotY - pillarTopY}" rx="4"/>`;
    // 柱头
    svg += `<rect class="house-v2-pillar-cap" x="${x - 3}" y="${pillarTopY - 6}" width="${pillarW + 6}" height="10" rx="3"/>`;
    // 柱基
    svg += `<rect class="house-v2-pillar-base" x="${x - 2}" y="${pillarBotY - 3}" width="${pillarW + 4}" height="8" rx="2"/>`;
    // 序号圆形
    svg += `<circle class="house-v2-pillar-idx-circle" cx="${x + pillarW / 2}" cy="${pillarTopY + 26}" r="13"/>`;
    svg += `<text class="house-v2-pillar-idx" x="${x + pillarW / 2}" y="${pillarTopY + 31}" text-anchor="middle">${String(i + 1).padStart(2, '0')}</text>`;
    // 立柱名称
    const name = p.title || p.name || '';
    svg += `<text class="house-v2-pillar-name" x="${x + pillarW / 2}" y="${pillarTopY + 55}" text-anchor="middle">${esc(name)}</text>`;
    // 关键要点（显示3个，居中排版，优化间距）
    if (p.keyPoints && p.keyPoints.length > 0) {
      p.keyPoints.slice(0, 3).forEach((kp, ki) => {
        const kpY = pillarTopY + 82 + ki * 30;
        const bulletX = x + 12;
        svg += `<circle class="house-v2-bullet" cx="${bulletX}" cy="${kpY}" r="2.5"/>`;
        svg += `<text class="house-v2-pillar-kp" x="${bulletX + 8}" y="${kpY + 4}">${esc(kp)}</text>`;
      });
    } else if (p.desc) {
      const desc = p.desc;
      svg += `<text class="house-v2-pillar-desc" x="${x + pillarW / 2}" y="${pillarTopY + 95}" text-anchor="middle">${esc(desc.length > 30 ? desc.substring(0, 28) + '…' : desc)}</text>`;
    }
  });

  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    <div class="house-v2-wrap" style="--w:${W}px;--h:${H}px">
      <svg class="house-v2-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
        ${svg}
      </svg>
    </div>
    ${sl.frameworkNote ? `<div class="framework-note">
      <span class="fn-label">框架说明：</span>${esc(sl.frameworkNote)}
    </div>` : ''}
  `);
}

// ========== 5. 核心指标+关键发现（丰富内容，不只是数字） ==========
function renderMetrics(sl) {
  const cards = sl.cards || [];
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    <div class="metrics-v2-top">
      <div class="m-grid-v2" style="--n:${Math.min(cards.length || 1, 4)}">
        ${cards.map((c) => `
          <div class="m-card-v2${c.highlight ? ' hl' : ''}">
            <div class="m-v2-label">${esc(c.label)}</div>
            <div class="m-v2-val">${esc(c.value)}${c.unit ? `<span class="m-v2-unit">${esc(c.unit)}</span>` : ''}</div>
            ${c.benchmark ? `<div class="m-v2-bench">行业均值：${esc(c.benchmark)}</div>` : ''}
            ${c.trend ? `<div class="m-v2-trend ${c.trendDir === 'up' ? 'up' : c.trendDir === 'down' ? 'down' : ''}">${c.trendDir === 'up' ? '▲' : c.trendDir === 'down' ? '▼' : '—'} ${esc(c.trend)}</div>` : ''}
          </div>`).join('')}
      </div>
    </div>
    ${(sl.findings || sl.bullets || []).length ? `
    <div class="key-findings">
      <div class="kf-title">关键发现</div>
      <div class="kf-grid">
        ${(sl.findings || sl.bullets).map((f, i) => {
          const text = typeof f === 'string' ? f : f.text;
          const implication = typeof f === 'object' ? f.implication : '';
          return `
          <div class="kf-item">
            <div class="kf-num">${String(i + 1).padStart(2, '0')}</div>
            <div class="kf-content">
              <div class="kf-text">${esc(text)}</div>
              ${implication ? `<div class="kf-implication">→ ${esc(implication)}</div>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>` : ''}
  `);
}

// ========== 6. 雷达图（成熟度总览）+ 维度得分表 ==========
function renderRadar(sl) {
  const dims = sl.dims || [];
  if (dims.length < 3) return renderBar(sl);
  const N = dims.length;
  const W = 500, H = 460, cx = W / 2, cy = H / 2 + 4, R = 148;
  const pt = (i, r) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / N; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const poly = (fn) => dims.map((d, i) => pt(i, fn(d)).join(',')).join(' ');
  let grid = '';
  for (let v = 1; v <= 5; v++) grid += `<polygon class="r-ring" points="${poly(() => (R * v) / 5)}"/>`;
  const axes = dims.map((_, i) => { const [x, y] = pt(i, R); return `<line class="r-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`; }).join('');
  const ticks = [1,2,3,4,5].map((v) => { const [x, y] = pt(0, (R * v) / 5); return `<text class="r-tick" x="${x + 8}" y="${y + 3}">L${v}</text>`; }).join('');
  const hasPeer = dims.some((d) => d.peer != null);
  const hasTarget = dims.some((d) => d.target != null);
  const curPts = poly((d) => (R * (Number(d.value) || 0)) / 5);
  const peerPts = hasPeer ? poly((d) => (R * (Number(d.peer) || 0)) / 5) : '';
  const targetPts = hasTarget ? poly((d) => (R * (Number(d.target) || 0)) / 5) : '';
  const dots = dims.map((d, i) => { const [x, y] = pt(i, (R * (Number(d.value) || 0)) / 5); return `<circle class="r-dot" cx="${x}" cy="${y}" r="4"/>`; }).join('');
  const labels = dims.map((d, i) => {
    const [x, y] = pt(i, R + 40);
    const cos = Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / N);
    const anchor = Math.abs(cos) < 0.3 ? 'middle' : cos > 0 ? 'start' : 'end';
    const dx = anchor === 'start' ? 4 : anchor === 'end' ? -4 : 0;
    const score = Number(d.value) || 0;
    const peer = Number(d.peer) || 0;
    const scoreClass = score < peer ? 'low' : score > peer ? 'high' : '';
    return `<text class="r-label" x="${x + dx}" y="${y - 8}" text-anchor="${anchor}">${esc(d.label)}</text>
      <text class="r-val ${scoreClass}" x="${x + dx}" y="${y + 8}" text-anchor="${anchor}">${score.toFixed(1)}${d.peer != null ? `<tspan class="r-vp"> / 均${peer}</tspan>` : ''}</text>`;
  }).join('');

  // 右侧维度评价表 - 两列：维度名称(含得分) + 一句话评价
  const scoreRows = dims.map((d, i) => {
    const score = Number(d.value) || 0;
    const peer = Number(d.peer) || 0;
    const gap = score - peer;
    const gapClass = gap > 0.3 ? 'pos' : gap < -0.3 ? 'neg' : 'neu';
    const gapText = gap > 0 ? `+${gap.toFixed(1)}` : gap.toFixed(1);
    return `
    <div class="rs-row-v2" style="--dim-c:${gapClass === 'pos' ? '#059669' : gapClass === 'neg' ? '#DC2626' : '#CA8A04'}">
      <div class="rs-dim-name">
        <span class="rs-dim-dot"></span>
        <span class="rs-dim-label">${esc(d.label)}</span>
        <span class="rs-dim-score">${score.toFixed(1)}</span>
      </div>
      <div class="rs-dim-comment">${d.comment ? esc(d.comment) : ''}</div>
    </div>`;
  }).join('');

  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    <div class="r-layout-v2">
      <div class="r-svg-wrap">
        <svg class="r-svg-v2" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="rFillV2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="var(--radar-fill-a)"/>
              <stop offset="100%" stop-color="var(--radar-fill-b)"/>
            </linearGradient>
          </defs>
          ${grid}${axes}${ticks}
          ${peerPts ? `<polygon class="r-peer" points="${peerPts}"/>` : ''}
          ${targetPts ? `<polygon class="r-target" points="${targetPts}"/>` : ''}
          <polygon class="r-cur" points="${curPts}"/>
          ${dots}${labels}
        </svg>
        <div class="r-legend-v2 r-legend-center">
          <span><i class="lg-cur-v2"></i>本企业</span>
          ${hasPeer ? '<span><i class="lg-peer-v2"></i>行业均值</span>' : ''}
          ${hasTarget ? '<span><i class="lg-target-v2"></i>目标水平</span>' : ''}
        </div>
      </div>
      <div class="r-side-v2">
        <div class="r-side-title">七维度评价总结</div>
        <div class="rs-table-v2">
          ${scoreRows}
        </div>
        ${sl.summary ? `<div class="r-summary">${esc(sl.summary)}</div>` : ''}
      </div>
    </div>
  `);
}

// ========== 7. 维度详解（优势维度）- 大卡片布局，填充页面 ==========
function renderStrengths(sl) {
  const cards = sl.cards || sl.dimensions || [];
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    <div class="dim-v3-grid strengths-grid">
      ${cards.map((c) => `
        <div class="dim-v3-card strong">
          <div class="dim-v3-header">
            <div class="dim-v3-score">
              <span class="dvs-num">${esc(c.score || '-')}</span>
              <span class="dvs-lbl">得分</span>
            </div>
            <div class="dim-v3-title">
              <div class="dvt-name">${esc(c.title || c.name || '')}</div>
              ${c.level ? `<div class="dvt-tag strong-tag">${esc(c.level)}</div>` : ''}
            </div>
          </div>
          <div class="dim-v3-body">
            <div class="dv3-sec">
              <div class="dv3-st"><span class="dv3-st-ico">▸</span>现状概述</div>
              <div class="dv3-sc">${esc(c.status || c.desc || '已建立较为完善的体系')}</div>
            </div>
            ${c.evidence ? `
            <div class="dv3-sec">
              <div class="dv3-st"><span class="dv3-st-ico">✓</span>关键证据</div>
              <ul class="dv3-evidence">
                ${(Array.isArray(c.evidence) ? c.evidence : [c.evidence]).map(e => `<li>${esc(e)}</li>`).join('')}
              </ul>
            </div>` : ''}
            ${c.value ? `
            <div class="dv3-sec dv3-value-sec">
              <div class="dv3-st"><span class="dv3-st-ico">★</span>业务价值</div>
              <div class="dv3-sc dv3-value">${esc(c.value)}</div>
            </div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `);
}

// ========== 8. 维度详解（短板维度）- 大卡片布局，填充页面 ==========
function renderWeaknesses(sl) {
  const cards = sl.cards || sl.dimensions || [];
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    <div class="dim-v3-grid weaknesses-grid">
      ${cards.map((c) => `
        <div class="dim-v3-card weak">
          <div class="dim-v3-header weak-hdr">
            <div class="dim-v3-score weak-score">
              <span class="dvs-num">${esc(c.score || '-')}</span>
              <span class="dvs-lbl">得分</span>
            </div>
            <div class="dim-v3-title">
              <div class="dvt-name">${esc(c.title || c.name || '')}</div>
              ${c.gap ? `<div class="dvt-tag weak-tag">差距 ${esc(c.gap)}</div>` : ''}
            </div>
          </div>
          <div class="dim-v3-body">
            <div class="dv3-sec">
              <div class="dv3-st"><span class="dv3-st-ico">▸</span>当前现状</div>
              <div class="dv3-sc">${esc(c.status || c.desc || '存在明显短板')}</div>
            </div>
            <div class="dv3-sec">
              <div class="dv3-st danger-st"><span class="dv3-st-ico">!</span>主要差距</div>
              <div class="dv3-sc danger-sc">${esc(c.gapDesc || c.gap_detail || '与行业领先水平存在较大差距')}</div>
            </div>
            ${c.rootCause ? `
            <div class="dv3-sec">
              <div class="dv3-st"><span class="dv3-st-ico">→</span>根本原因</div>
              <div class="dv3-sc">${esc(c.rootCause)}</div>
            </div>` : ''}
            ${c.businessImpact ? `
            <div class="dv3-sec dv3-impact-sec">
              <div class="dv3-st danger-st"><span class="dv3-st-ico">⚡</span>业务影响</div>
              <div class="dv3-sc dv3-impact">${esc(c.businessImpact)}</div>
            </div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `);
}

// ========== 9. 条形图（差距量化对比）+ 优秀企业对标案例 ==========
function renderBar(sl) {
  const bars = (sl.bars || []).map((b) => {
    const max = b.max || 5;
    const pct = Math.max(2, Math.min(100, (Number(b.value) / max) * 100));
    const peerPct = b.peer != null ? Math.max(0, Math.min(100, (Number(b.peer) / max) * 100)) : null;
    const gap = b.peer != null ? (Number(b.value) - Number(b.peer)).toFixed(1) : null;
    const gapClass = gap > 0.3 ? 'pos' : gap < -0.3 ? 'neg' : 'neu';
    const gapText = gap > 0 ? `+${gap}` : gap;
    return `<div class="b-v4-row">
      <div class="b-v4-lbl">${esc(b.label)}</div>
      <div class="b-v4-track-wrap">
        <div class="b-v4-scale"><span>L1</span><span>L2</span><span>L3</span><span>L4</span><span>L5</span></div>
        <div class="b-v4-track">
          <div class="b-v4-fill" style="width:${pct}%"></div>
          ${peerPct != null ? `<div class="b-v4-peer" style="left:${peerPct}%"></div>` : ''}
        </div>
      </div>
      <div class="b-v4-val"><b>${esc(b.value)}</b>${gap != null ? `<span class="b-v4-gap ${gapClass}">${gapText}</span>` : ''}</div>
    </div>`;
  }).join('');

  // 差距解读多点：优先用gapPoints数组，否则将gapInterpretation按分号/句号拆分为多条
  let gapPoints = sl.gapPoints || [];
  if (!gapPoints.length && sl.gapInterpretation) {
    gapPoints = sl.gapInterpretation.split(/[；;。]/).map(s => s.trim()).filter(s => s.length > 4);
  }
  const gapPointsHtml = gapPoints.map((p, i) => `
    <div class="gp-item"><span class="gp-num">${String(i+1).padStart(2,'0')}</span><span class="gp-text">${esc(p)}</span></div>
  `).join('');

  const benchCases = (sl.benchmarks || sl.benchCases || []).map((bc) => `
    <div class="bench-card-v4">
      <div class="bc4-head">
        <div class="bc4-name">${esc(bc.company || bc.name || '')}</div>
        <div class="bc4-score">${esc(bc.score || '-')}<span class="bc4-slash">/5.0</span></div>
      </div>
      <div class="bc4-level">${esc(bc.level || '')}</div>
      <div class="bc4-practices">
        ${(bc.practices || bc.highlights || []).map(p => `<div class="bc4-p"><span class="bc4-p-dot"></span>${esc(p)}</div>`).join('')}
      </div>
    </div>
  `).join('');

  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    <div class="b-v4-layout">
      <!-- 上排：对比图 + 差距解读 -->
      <div class="b-v4-top">
        <div class="b-v4-chart-wrap">
          ${sl.comparisonNote ? `<div class="comparison-note">${esc(sl.comparisonNote)}</div>` : ''}
          <div class="b-v4-chart">
            <div class="b-v4-header">
              <span class="b-v4-h-lbl">维度</span>
              <span class="b-v4-h-track">成熟度等级</span>
              <span class="b-v4-h-val">得分/差距</span>
            </div>
            ${bars}
          </div>
        </div>
        ${gapPointsHtml ? `
        <div class="b-v4-insights">
          <div class="b-v4-insights-title">
            <span class="b4-ti-dot"></span>差距诊断要点
          </div>
          <div class="b-v4-insights-list">${gapPointsHtml}</div>
        </div>` : ''}
      </div>
      <!-- 下排：优秀企业对标 -->
      ${benchCases ? `
      <div class="b-v4-bottom">
        <div class="b-v4-bench-title">
          <span class="bench-title-ico">★</span>优秀企业对标实践
        </div>
        <div class="b-v4-bench-grid">${benchCases}</div>
      </div>` : ''}
    </div>
  `);
}

// ========== 10. 问题树/逻辑树（根因诊断） ==========
function renderTree(sl) {
  const problem = sl.problem || '核心问题';
  const roots = sl.roots || [];
  const n = roots.length;

  const prioColor = {P0:'#DC2626', P1:'#EA580C', P2:'#CA8A04'};
  const prioBg = {P0:'#fef2f2', P1:'#fff7ed', P2:'#fefce8'};
  const prioBorder = {P0:'#fca5a5', P1:'#fdba74', P2:'#fcd34d'};

  // SVG参数
  const W = 1140, H = 400;
  const problemY = 25;
  const problemH = 52;
  const level1Y = 130;
  const level2Y = 245;
  const cardW = 180, cardH = 60;
  const causeH = 28;
  const causeW = 180;

  const problemCX = W / 2;
  const problemW = 340;
  const problemX = problemCX - problemW / 2;
  const problemBottom = problemY + problemH;

  // 计算每个根因卡片的X位置（均匀分布，左右留边距）
  const marginX = 20;
  const usableW = W - marginX * 2;
  const gap = (usableW - cardW * n) / (n - 1);
  const positions = roots.map((_, i) => ({
    cx: marginX + cardW/2 + i * (cardW + gap),
    x: marginX + i * (cardW + gap)
  }));

  const horizontalLineY = (problemBottom + level1Y) / 2 + 5;

  let svg = '';

  // 核心问题框
  svg += `<rect x="${problemX}" y="${problemY}" width="${problemW}" height="${problemH}" rx="6" fill="#1e293b"/>`;
  svg += `<text x="${problemCX}" y="${problemY+17}" text-anchor="middle" font-family="JetBrains Mono,Consolas,monospace" font-size="8" fill="#94a3b8" letter-spacing="2">CORE PROBLEM</text>`;
  svg += `<foreignObject x="${problemX+10}" y="${problemY+20}" width="${problemW-20}" height="30"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:12.5px;font-weight:700;color:#fff;text-align:center;line-height:1.4;display:flex;align-items:center;justify-content:center;height:100%;font-family:system-ui,-apple-system,sans-serif">${esc(problem)}</div></foreignObject>`;

  // 主干竖线
  svg += `<line x1="${problemCX}" y1="${problemBottom}" x2="${problemCX}" y2="${horizontalLineY}" stroke="#94a3b8" stroke-width="1.5"/>`;
  // 水平干线
  svg += `<line x1="${positions[0].cx}" y1="${horizontalLineY}" x2="${positions[n-1].cx}" y2="${horizontalLineY}" stroke="#94a3b8" stroke-width="1.5"/>`;

  roots.forEach((r, i) => {
    const prio = r.priority || 'P2';
    const color = prioColor[prio] || prioColor.P2;
    const bg = prioBg[prio] || prioBg.P2;
    const border = prioBorder[prio] || prioBorder.P2;
    const pos = positions[i];
    const cardX = pos.x;
    const cardY = level1Y;
    const cardCX = pos.cx;

    // 从干线到根因卡片的竖线（使用优先级颜色）
    svg += `<line x1="${cardCX}" y1="${horizontalLineY}" x2="${cardCX}" y2="${cardY}" stroke="${color}" stroke-width="2.5"/>`;

    // 根因卡片矩形（顶部加粗色边）
    svg += `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="5" fill="${bg}" stroke="${border}" stroke-width="2"/>`;
    svg += `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="4" rx="5" fill="${color}"/>`; // 顶部色条

    // P0/P1/P2标签
    const prioW = 28, prioH = 16;
    svg += `<rect x="${cardX+8}" y="${cardY+10}" width="${prioW}" height="${prioH}" rx="3" fill="${color}"/>`;
    svg += `<text x="${cardX+8+prioW/2}" y="${cardY+10+prioH/2+4}" text-anchor="middle" font-size="8.5" font-weight="800" fill="#fff" font-family="JetBrains Mono,Consolas,monospace">${esc(prio)}</text>`;

    // 根因标题（foreignObject以便文字换行）
    const titleX = cardX + 8 + prioW + 6;
    const titleW = cardW - (8 + prioW + 6 + 10);
    svg += `<foreignObject x="${titleX}" y="${cardY+8}" width="${titleW}" height="${cardH-18}"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:11px;font-weight:700;color:#1e293b;line-height:1.3;display:flex;align-items:center;height:100%;font-family:system-ui,-apple-system,sans-serif">${esc(r.title || '')}</div></foreignObject>`;

    // 影响描述
    if (r.impact) {
      svg += `<foreignObject x="${cardX+8}" y="${cardY+36}" width="${cardW-16}" height="18"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:9px;color:#64748b;line-height:1.3;font-family:system-ui,-apple-system,sans-serif">${esc(r.impact)}</div></foreignObject>`;
    }

    // 具体原因
    const causes = r.causes || [];
    const cardBottom = cardY + cardH;
    const branchY = (cardBottom + level2Y) / 2 + 5;

    // 卡片到底部分支线的竖线
    svg += `<line x1="${cardCX}" y1="${cardBottom}" x2="${cardCX}" y2="${branchY}" stroke="#cbd5e1" stroke-width="1"/>`;

    causes.forEach((c, j) => {
      const cy = level2Y + j * (causeH + 6);
      const causeX = cardX;
      // 分支小竖线
      svg += `<line x1="${cardCX}" y1="${branchY}" x2="${cardCX}" y2="${cy + causeH/2}" stroke="#e2e8f0" stroke-width="1"/>`;
      // 原因标签框
      svg += `<rect x="${causeX}" y="${cy}" width="${causeW}" height="${causeH}" rx="4" fill="#fff" stroke="#e2e8f0" stroke-width="1"/>`;
      svg += `<rect x="${causeX}" y="${cy}" width="3" height="${causeH}" rx="1" fill="${color}"/>`; // 左侧色条
      // 原因文字
      svg += `<foreignObject x="${causeX+10}" y="${cy+1}" width="${causeW-16}" height="${causeH-2}"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:9.5px;color:#475569;line-height:1.3;display:flex;align-items:center;height:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:system-ui,-apple-system,sans-serif">${esc(c)}</div></foreignObject>`;
    });
  });

  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    <div class="tree-wrap">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%;max-width:${W}px;height:auto;max-height:100%">${svg}</svg>
    </div>
    ${sl.conclusion ? `<div class="root-conclusion"><span class="rc-label">根因诊断结论：</span>${esc(sl.conclusion)}</div>` : ''}
  `);
}

// ========== 11. 改进路线图（时间轴+甘特风格+里程碑+资源投入） ==========
function renderRoadmap(sl) {
  const steps = sl.steps || [];
  const n = steps.length;
  let totalMonths = sl.totalMonths || 36;
  const phaseColors = ['#059669', '#EA580C', '#DC2626'];
  const phaseBg = ['#f0fdf4', '#fff7ed', '#fef2f2'];

  // 月份甘特条
  const ganttMonths = Array.from({length: Math.ceil(totalMonths/6) + 1}, (_, i) => i * 6);

  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    ${sl.roadmapSummary ? `<div class="rm-v2-summary">${esc(sl.roadmapSummary)}</div>` : ''}
    <div class="rm-v2-wrap">
      <!-- 三阶段卡片 -->
      <div class="rm-v2-cards">
        ${steps.map((s, i) => {
          const c = phaseColors[i % phaseColors.length];
          const bg = phaseBg[i % phaseBg.length];
          const startM = s.startMonth || i * (totalMonths / n);
          const endM = s.endMonth || (i + 1) * (totalMonths / n);
          return `
          <div class="rm-v2-card" style="--pc:${c};--pbg:${bg}">
            <div class="rm2-head">
              <div class="rm2-phase-tag">阶段 ${i + 1}</div>
              <div class="rm2-time">${esc(s.time || `M${Math.round(startM)}-M${Math.round(endM)}`)}</div>
            </div>
            <div class="rm2-name">${esc(s.phase || '')}</div>
            <div class="rm2-obj">${esc(s.objective || s.desc || '')}</div>
            ${s.milestones && s.milestones.length ? `
            <div class="rm2-ms">
              ${s.milestones.slice(0, 4).map(m => `<div class="rm2-ms-i"><span class="rm2-ms-dot"></span>${esc(m)}</div>`).join('')}
            </div>` : ''}
            ${s.investment ? `<div class="rm2-inv"><span>投入：</span>${esc(s.investment)}</div>` : ''}
            ${s.deliverables ? `<div class="rm2-deliv"><span>交付物：</span>${esc(s.deliverables)}</div>` : ''}
          </div>
          ${i < n - 1 ? '<div class="rm2-arrow">▶</div>' : ''}
          `;
        }).join('')}
      </div>
      <!-- 甘特时间轴 -->
      <div class="rm-v2-gantt">
        <div class="rm-gantt-label">实施路径时间轴</div>
        <div class="rm-gantt-track">
          <div class="rm-gantt-bg"></div>
          ${steps.map((s, i) => {
            const c = phaseColors[i % phaseColors.length];
            const startM = s.startMonth || i * (totalMonths / n);
            const endM = s.endMonth || (i + 1) * (totalMonths / n);
            const left = (startM / totalMonths) * 100;
            const w = ((endM - startM) / totalMonths) * 100;
            return `
            <div class="rm-gantt-bar" style="left:${left}%;width:${w}%;background:${c}">
              <span class="rm-gantt-blbl">${esc(s.phase || '阶段'+(i+1))}</span>
            </div>`;
          }).join('')}
        </div>
        <div class="rm-gantt-scale">
          ${ganttMonths.map(m => `<span style="left:${(m/totalMonths)*100}%">M${m}</span>`).join('')}
        </div>
      </div>
    </div>
  `);
}

// ========== 12. 关键举措矩阵（优先级×影响×投入）+ 预期价值量化 ==========
function renderInitiatives(sl) {
  const initiatives = sl.initiatives || sl.actions || [];
  
  // 优先级排序 P0 > P1 > P2（避免 0 || 99 的 falsy bug）
  const prioOrder = {P0: 0, P1: 1, P2: 2};
  const getPrio = (p) => prioOrder.hasOwnProperty(p) ? prioOrder[p] : 99;
  const sorted = [...initiatives].sort((a, b) => getPrio(a.priority) - getPrio(b.priority));

  // 确定每个举措所在象限，并分配位置
  // 象限定义（x=实施难度，y=业务影响）：
  // Q1(左上)：高影响·低难度 = 快速赢取；Q2(右上)：高影响·高难度 = 战略举措
  // Q3(左下)：低影响·低难度 = 基础建设；Q4(右下)：低影响·高难度 = 审慎推进
  const quadrants = {
    q1: {name:'快速赢取', desc:'高影响·低难度', bx:0, by:0, color:'#059669', items:[]},
    q2: {name:'战略举措', desc:'高影响·高难度', bx:0, by:0, color:'#DC2626', items:[]},
    q3: {name:'基础建设', desc:'低影响·低难度', bx:0, by:0, color:'#CA8A04', items:[]},
    q4: {name:'审慎推进', desc:'低影响·高难度', bx:0, by:0, color:'#64748B', items:[]}
  };

  sorted.forEach((init, idx) => {
    // 象限判断：仅 high 视为"高"，medium/low 视为"低"
    const impact = init.impact === 'high' ? 1 : 0;
    const difficulty = init.difficulty === 'high' ? 1 : 0;
    let q;
    if (impact === 1 && difficulty === 0) q = 'q1';       // 高影响·低难度 = 快速赢取
    else if (impact === 1 && difficulty === 1) q = 'q2';  // 高影响·高难度 = 战略举措
    else if (impact === 0 && difficulty === 0) q = 'q3';  // 低影响·低难度 = 基础建设
    else q = 'q4';                                         // 低影响·高难度 = 审慎推进
    quadrants[q].items.push({...init, _idx: idx, _num: idx + 1});
  });

  // SVG四象限参数
  const SW = 380, SH = 320;
  const pad = 50;
  const ax = pad, ay = pad; // 坐标轴原点（左下）
  const axEnd = SW - pad, ayEnd = SH - pad; // 轴终点
  const plotW = axEnd - ax;
  const plotH = ayEnd - ay;
  const midX = ax + plotW / 2;
  const midY = ay + plotH / 2;

  let svg = '';
  // 背景四象限色块（Q1=快速赢取绿，Q2=战略举措红，Q3=基础建设黄，Q4=审慎推进灰）
  svg += `<rect x="${ax}" y="${ay}" width="${plotW/2}" height="${plotH/2}" fill="#dcfce7" opacity="0.6"/>`; // Q1左上-绿
  svg += `<rect x="${midX}" y="${ay}" width="${plotW/2}" height="${plotH/2}" fill="#fee2e2" opacity="0.6"/>`; // Q2右上-红
  svg += `<rect x="${ax}" y="${midY}" width="${plotW/2}" height="${plotH/2}" fill="#fef9c3" opacity="0.5"/>`; // Q3左下-黄
  svg += `<rect x="${midX}" y="${midY}" width="${plotW/2}" height="${plotH/2}" fill="#f1f5f9" opacity="0.7"/>`; // Q4右下-灰

  // 象限标题
  const tSize = 11;
  svg += `<text x="${ax + plotW/4}" y="${ay + 18}" text-anchor="middle" font-size="${tSize}" font-weight="700" fill="#059669">快速赢取</text>`;
  svg += `<text x="${midX + plotW/4}" y="${ay + 18}" text-anchor="middle" font-size="${tSize}" font-weight="700" fill="#DC2626">战略举措</text>`;
  svg += `<text x="${ax + plotW/4}" y="${ayEnd - 6}" text-anchor="middle" font-size="${tSize}" font-weight="700" fill="#CA8A04">基础建设</text>`;
  svg += `<text x="${midX + plotW/4}" y="${ayEnd - 6}" text-anchor="middle" font-size="${tSize}" font-weight="700" fill="#64748B">审慎推进</text>`;

  // 坐标轴
  svg += `<line x1="${ax}" y1="${ay}" x2="${ax}" y2="${ayEnd}" stroke="#94a3b8" stroke-width="1.5"/>`; // Y轴
  svg += `<line x1="${ax}" y1="${ayEnd}" x2="${axEnd}" y2="${ayEnd}" stroke="#94a3b8" stroke-width="1.5"/>`; // X轴
  // 箭头
  svg += `<polygon points="${ax-4},${ay+8} ${ax},${ay} ${ax+4},${ay+8}" fill="#94a3b8"/>`;
  svg += `<polygon points="${axEnd-8},${ayEnd-4} ${axEnd},${ayEnd} ${axEnd-8},${ayEnd+4}" fill="#94a3b8"/>`;
  // 中线（虚线）
  svg += `<line x1="${midX}" y1="${ay}" x2="${midX}" y2="${ayEnd}" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4,3"/>`;
  svg += `<line x1="${ax}" y1="${midY}" x2="${axEnd}" y2="${midY}" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4,3"/>`;

  // 轴标签
  svg += `<text x="${ax - 10}" y="${ay + plotH/4}" text-anchor="end" font-size="10" fill="#64748b" font-weight="600">高</text>`;
  svg += `<text x="${ax - 10}" y="${midY + plotH/4 + 4}" text-anchor="end" font-size="10" fill="#64748b" font-weight="600">低</text>`;
  svg += `<text x="${ax + plotW/4}" y="${ayEnd + 22}" text-anchor="middle" font-size="10" fill="#64748b" font-weight="600">低</text>`;
  svg += `<text x="${midX + plotW/4}" y="${ayEnd + 22}" text-anchor="middle" font-size="10" fill="#64748b" font-weight="600">高</text>`;
  // 轴名称
  svg += `<text x="${ax - 32}" y="${ay + plotH/2}" text-anchor="middle" font-size="11" fill="#475569" font-weight="700" transform="rotate(-90 ${ax-32} ${ay+plotH/2})">业务影响</text>`;
  svg += `<text x="${ax + plotW/2}" y="${ayEnd + 40}" text-anchor="middle" font-size="11" fill="#475569" font-weight="700">实施难度</text>`;

  // 为每个象限内的举措分配位置（网格分布）
  function placeItems(items, qx, qy, qw, qh) {
    const n = items.length;
    if (n === 0) return '';
    let dots = '';
    // 简单网格：按数量计算行列
    const cols = Math.min(n, 3);
    const rows = Math.ceil(n / cols);
    const cellW = qw / (cols + 1);
    const cellH = qh / (rows + 1);
    items.forEach((it, k) => {
      const col = k % cols;
      const row = Math.floor(k / cols);
      // 居中分布
      const totalItemsInRow = Math.min(cols, n - row * cols);
      const offsetX = (cols - totalItemsInRow) * cellW / 2;
      const cx = qx + cellW * (col + 1) + offsetX;
      const cy = qy + cellH * (row + 1);
      const prioClass = it.priority === 'P0' ? '#DC2626' : it.priority === 'P1' ? '#EA580C' : '#059669';
      const r = 16;
      dots += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${prioClass}" stroke="#fff" stroke-width="2"/>`;
      dots += `<text x="${cx}" y="${cy+4}" text-anchor="middle" fill="#fff" font-size="10" font-weight="800" font-family="JetBrains Mono,Consolas,monospace">${String(it._num).padStart(2,'0')}</text>`;
    });
    return dots;
  }

  // Q1左上：x=[ax,midX], y=[ay,midY]
  svg += placeItems(quadrants.q1.items, ax+10, ay+24, plotW/2-20, plotH/2-34);
  // Q2右上：x=[midX,axEnd], y=[ay,midY]
  svg += placeItems(quadrants.q2.items, midX+10, ay+24, plotW/2-20, plotH/2-34);
  // Q3左下：x=[ax,midX], y=[midY,ayEnd]
  svg += placeItems(quadrants.q3.items, ax+10, midY+10, plotW/2-20, plotH/2-34);
  // Q4右下：x=[midX,axEnd], y=[midY,ayEnd]
  svg += placeItems(quadrants.q4.items, midX+10, midY+10, plotW/2-20, plotH/2-34);

  // 右侧举措列表（按排序后的顺序展示，编号对应象限内编号）
  const initRows = sorted.map((init, i) => {
    const prioClass = init.priority === 'P0' ? 'p0' : init.priority === 'P1' ? 'p1' : 'p2';
    const num = i + 1;
    return `
    <div class="il-row">
      <span class="il-num">${String(num).padStart(2,'0')}</span>
      <span class="il-prio ${prioClass}">${esc(init.priority || 'P2')}</span>
      <div class="il-name-area">
        <div class="il-name">${esc(init.name || init.title || '')}</div>
        ${init.desc ? `<div class="il-desc">${esc(init.desc)}</div>` : ''}
      </div>
      <div class="il-value">
        ${init.value ? `<div class="il-val-main">${esc(init.value)}</div>` : ''}
        ${init.roi ? `<div class="il-roi">ROI：${esc(init.roi)}</div>` : ''}
      </div>
      <div class="il-time">${esc(init.timeline || init.timeframe || '-')}</div>
    </div>`;
  }).join('');

  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    <div class="im-v2-wrap">
      <div class="im-v2-matrix">
        <svg viewBox="0 0 ${SW} ${SH}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">${svg}</svg>
      </div>
      <div class="im-v2-list">
        <div class="il-header">
          <span class="h-num">#</span>
          <span class="h-prio">优先级</span>
          <span class="h-name">关键举措</span>
          <span class="h-value">预期价值</span>
          <span class="h-time">时间</span>
        </div>
        <div class="il-body">${initRows}</div>
      </div>
    </div>
    ${sl.expectedOutcome ? `<div class="expected-outcome"><span class="eo-label">整体预期：</span>${esc(sl.expectedOutcome)}</div>` : ''}
  `);
}

// ========== 13. 结尾 ==========
// ========== 访谈纪要 - 双栏引述+关键观点 ==========
function renderInterview(sl) {
  const role = sl.role || '高管';
  const signals = (sl.signals || []).map(sig => {
    const level = sig.level || 'mid';
    const dot = level === 'high' ? '🔴' : level === 'mid' ? '🟡' : '🟢';
    return `<div class="iv-signal"><span class="iv-sig-dot">${dot}</span><span class="iv-sig-text">${esc(sig.text)}</span></div>`;
  }).join('');
  const quotes = (sl.quotes || []).map(q => `
    <div class="iv-quote">
      <div class="iv-q-mark">"</div>
      <div class="iv-q-text">${esc(q.text)}</div>
      <div class="iv-q-src">— ${esc(q.source || role)}</div>
    </div>`).join('');
  const demands = (sl.demands || []).map(d => `<li><span class="iv-bullet"></span>${esc(d)}</li>`).join('');
  const pains = (sl.pains || []).map(p => `<li><span class="iv-bullet pain"></span>${esc(p)}</li>`).join('');
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    <div class="iv-header">
      <div class="iv-role-badge">${esc(role)}</div>
      ${sl.date ? `<span class="iv-date">访谈时间：${esc(sl.date)}</span>` : ''}
      ${sl.duration ? `<span class="iv-date">时长：${esc(sl.duration)}</span>` : ''}
    </div>
    <div class="iv-grid">
      <div class="iv-col">
        <div class="iv-sec-title"><span class="iv-st-dot red"></span>核心诉求</div>
        <ul class="iv-list">${demands}</ul>
        <div class="iv-sec-title" style="margin-top:12px"><span class="iv-st-dot orange"></span>核心痛点</div>
        <ul class="iv-list">${pains}</ul>
      </div>
      <div class="iv-col">
        <div class="iv-sec-title">关键原话</div>
        ${quotes}
      </div>
    </div>
    ${signals ? `<div class="iv-signals"><div class="iv-sec-title" style="margin-bottom:6px">情绪信号</div>${signals}</div>` : ''}
    ${insightBox(sl.insight)}
  `);
}

// ========== 高管观点矩阵 - 多角色对比表 ==========
function renderMatrix(sl) {
  const headers = sl.columns || ['角色', '核心诉求', '最关注', '底线/顾虑'];
  const rows = sl.rows || [];
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    ${insightBox(sl.insight)}
    <div class="mx-wrap">
      <table class="mx-table">
        <thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map(r => `<tr>${(Array.isArray(r) ? r : r.cells || []).map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
  `);
}

// ========== 风险矩阵 - 概率×影响 ==========
function renderRisk(sl) {
  const risks = sl.risks || [];
  const riskItems = risks.map(r => {
    const lvl = r.level || '中';
    const cls = lvl === '高' || lvl === 'P0' || r.priority === 'high' ? 'risk-high' : lvl === '中' || lvl === 'P1' ? 'risk-mid' : 'risk-low';
    return `<div class="risk-card ${cls}">
      <div class="risk-head">
        <span class="risk-level">${esc(lvl)}</span>
        <span class="risk-prob">概率 ${esc(r.probability || '—')}</span>
        <span class="risk-impact">影响 ${esc(r.impact || '—')}</span>
      </div>
      <div class="risk-title">${esc(r.title || '')}</div>
      <div class="risk-desc">${esc(r.desc || '')}</div>
      ${r.mitigation ? `<div class="risk-mit"><b>应对：</b>${esc(r.mitigation)}</div>` : ''}
      ${r.owner ? `<div class="risk-owner"><b>责任人：</b>${esc(r.owner)}</div>` : ''}
    </div>`;
  }).join('');
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    ${insightBox(sl.insight)}
    <div class="risk-grid">${riskItems}</div>
  `);
}

// ========== 组织架构 - 治理结构图 ==========
function renderOrgChart(sl) {
  const top = sl.top || { title: '指导委员会', members: 'CEO/各VP' };
  const mid = sl.mid || { title: 'PMO', members: 'CDO' };
  const teams = sl.teams || [];
  const teamHtml = teams.map(t => `
    <div class="org-team">
      <div class="org-team-name">${esc(t.name)}</div>
      <div class="org-team-members">${esc(t.members || '')}</div>
      <div class="org-team-resp">${esc(t.responsibility || '')}</div>
    </div>`).join('');
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    ${insightBox(sl.insight)}
    <div class="org-wrap">
      <div class="org-top">
        <div class="org-box org-top-box">
          <div class="org-box-title">${esc(top.title)}</div>
          <div class="org-box-sub">${esc(top.members || '')}</div>
          ${top.responsibility ? `<div class="org-box-resp">${esc(top.responsibility)}</div>` : ''}
        </div>
      </div>
      <div class="org-connector"></div>
      <div class="org-mid">
        <div class="org-box org-mid-box">
          <div class="org-box-title">${esc(mid.title)}</div>
          <div class="org-box-sub">${esc(mid.members || '')}</div>
          ${mid.responsibility ? `<div class="org-box-resp">${esc(mid.responsibility)}</div>` : ''}
        </div>
      </div>
      <div class="org-connector"></div>
      <div class="org-bottom">${teamHtml}</div>
    </div>
  `);
}

// ========== 预算表 ==========
function renderBudget(sl) {
  const items = sl.items || [];
  let total = 0;
  const rowsHtml = items.map(it => {
    const amount = parseFloat(it.amount) || 0;
    total += amount;
    return `<tr>
      <td class="bd-cat">${esc(it.category || '')}</td>
      <td class="bd-name">${esc(it.name || '')}</td>
      <td class="bd-desc">${esc(it.desc || '')}</td>
      <td class="bd-amount">${amount.toFixed(0)}<span class="bd-unit">万</span></td>
      <td class="bd-phase">${esc(it.phase || '')}</td>
    </tr>`;
  }).join('');
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    ${insightBox(sl.insight)}
    <div class="bd-wrap">
      <table class="bd-table">
        <thead><tr><th>类别</th><th>投入项</th><th>说明</th><th>预算（万元）</th><th>阶段</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot><tr><td colspan="3" style="text-align:right;font-weight:700">合计</td><td class="bd-amount bd-total">${total.toFixed(0)}<span class="bd-unit">万</span></td><td></td></tr></tfoot>
      </table>
      ${sl.roiNote ? `<div class="bd-roi">${esc(sl.roiNote)}</div>` : ''}
    </div>
  `);
}

// ========== MoSCoW范围矩阵 ==========
function renderMoscow(sl) {
  const cats = [
    { key: 'must', label: 'Must Have', sub: '必须有', cls: 'moscow-must' },
    { key: 'should', label: 'Should Have', sub: '应该有', cls: 'moscow-should' },
    { key: 'could', label: 'Could Have', sub: '可以有', cls: 'moscow-could' },
    { key: 'wont', label: "Won't Have", sub: '暂不做', cls: 'moscow-wont' },
  ];
  const colsHtml = cats.map(c => {
    const items = (sl[c.key] || sl.items?.[c.key] || []).map(i =>
      `<div class="moscow-item"><span class="moscow-dot"></span>${esc(typeof i === 'string' ? i : i.text || i.name || '')}</div>`
    ).join('');
    return `<div class="moscow-col ${c.cls}">
      <div class="moscow-head"><span class="moscow-label">${c.label}</span><span class="moscow-sub">${c.sub}</span></div>
      <div class="moscow-body">${items}</div>
    </div>`;
  }).join('');
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    ${insightBox(sl.insight)}
    <div class="moscow-grid">${colsHtml}</div>
  `);
}

// ========== 场景清单卡 - 适用于场景全景表 ==========
function renderScenario(sl) {
  const scenarios = sl.scenarios || sl.items || [];
  const cardsHtml = scenarios.map((s, i) => {
    const score = s.score || s.valueScore || s.difficulty || 0;
    const prio = s.priority || (i < 3 ? 'P0' : i < 6 ? 'P1' : 'P2');
    const prioCls = prio === 'P0' ? 'sc-prio-p0' : prio === 'P1' ? 'sc-prio-p1' : 'sc-prio-p2';
    return `<div class="sc-card">
      <div class="sc-head">
        <span class="sc-idx">${String(i + 1).padStart(2, '0')}</span>
        <span class="sc-name">${esc(s.name || s.title || '')}</span>
        <span class="sc-prio ${prioCls}">${esc(prio)}</span>
      </div>
      <div class="sc-desc">${esc(s.desc || s.description || '')}</div>
      <div class="sc-meta">
        ${s.value ? `<span class="sc-meta-item"><b>价值</b>${esc(s.value)}</span>` : ''}
        ${s.difficulty ? `<span class="sc-meta-item"><b>难度</b>${esc(s.difficulty)}</span>` : ''}
        ${s.owner ? `<span class="sc-meta-item"><b>负责</b>${esc(s.owner)}</span>` : ''}
      </div>
    </div>`;
  }).join('');
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    ${insightBox(sl.insight)}
    <div class="sc-grid">${cardsHtml}</div>
  `);
}

// ========== 优先级矩阵（2×2散点图） ==========
function renderPrioMatrix(sl) {
  const items = sl.items || sl.initiatives || [];
  const quadrants = { q1: [], q2: [], q3: [], q4: [] };
  items.forEach(it => {
    const impact = parseFloat(it.impact) || (it.impactLevel === 'high' ? 8 : it.impactLevel === 'low' ? 3 : 5);
    const difficulty = parseFloat(it.difficulty) || (it.difficultyLevel === 'high' ? 8 : it.difficultyLevel === 'low' ? 3 : 5);
    const q = impact >= 5 ? (difficulty < 5 ? 'q1' : 'q2') : (difficulty < 5 ? 'q4' : 'q3');
    quadrants[q].push({ ...it, _i: impact, _d: difficulty });
  });
  const qHtml = (q, label, desc, cls) => `<div class="pm-quad pm-${q} ${cls}">
    <div class="pm-q-label"><b>${label}</b><span>${desc}</span></div>
    <div class="pm-q-items">${quadrants[q].map(it => `<div class="pm-item">${esc(it.name || '')}</div>`).join('')}</div>
  </div>`;
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    ${insightBox(sl.insight)}
    <div class="pm-wrap">
      <div class="pm-y-label">价值/影响 → 高</div>
      <div class="pm-grid">
        ${qHtml('q2', '战略攻坚', '高价值·高难度：重点投入', 'pm-q2')}
        ${qHtml('q1', '速赢优先', '高价值·低难度：立即启动', 'pm-q1')}
        ${qHtml('q3', '暂缓观察', '低价值·高难度：暂不投入', 'pm-q3')}
        ${qHtml('q4', '补充优化', '低价值·低难度：顺手完成', 'pm-q4')}
      </div>
      <div class="pm-x-label">实施难度 → 高</div>
    </div>
  `);
}

// ========== KPI 目标卡 ==========
function renderKpi(sl) {
  const targets = sl.targets || sl.kpis || sl.items || [];
  const cards = targets.map(t => {
    const baseline = t.baseline != null ? t.baseline : (t.base || '—');
    const target = t.target != null ? t.target : t.goal;
    const unit = t.unit || '';
    const delta = t.delta || '';
    return `<div class="kpi-card">
      <div class="kpi-label">${esc(t.label || t.name || '')}</div>
      <div class="kpi-values">
        <div class="kpi-base"><span class="kpi-v-label">当前</span><span class="kpi-v-num">${esc(baseline)}${unit ? `<small>${esc(unit)}</small>` : ''}</span></div>
        <div class="kpi-arrow">→</div>
        <div class="kpi-target"><span class="kpi-v-label">目标</span><span class="kpi-v-num">${esc(target)}${unit ? `<small>${esc(unit)}</small>` : ''}</span></div>
      </div>
      ${delta ? `<div class="kpi-delta">${esc(delta)}</div>` : ''}
      ${t.measure ? `<div class="kpi-measure">衡量：${esc(t.measure)}</div>` : ''}
    </div>`;
  }).join('');
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    ${insightBox(sl.insight)}
    <div class="kpi-grid">${cards}</div>
  `);
}

// ========== 甘特图/时间线（多泳道） ==========
function renderGantt(sl) {
  const tracks = sl.tracks || sl.workstreams || [];
  const months = parseInt(sl.months) || 12;
  const trackHtml = tracks.map((t, i) => {
    const bars = (t.bars || t.phases || []).map(b => {
      const start = parseInt(b.startMonth) || parseInt(b.start) || 0;
      const end = parseInt(b.endMonth) || parseInt(b.end) || months;
      const left = (start / months * 100).toFixed(1);
      const width = ((end - start) / months * 100).toFixed(1);
      const milestone = b.milestone ? `<div class="gantt-milestone">◆ ${esc(b.milestone)}</div>` : '';
      return `<div class="gantt-bar" style="left:${left}%;width:${width}%">
        <span class="gantt-bar-label">${esc(b.name || b.label || '')}</span>
        ${milestone}
      </div>`;
    }).join('');
    return `<div class="gantt-row">
      <div class="gantt-label">${esc(t.name || '工作流')}</div>
      <div class="gantt-track">${bars}</div>
    </div>`;
  }).join('');
  // 月份刻度
  const ticks = [];
  for (let i = 0; i <= months; i += Math.max(1, Math.floor(months / 6))) {
    ticks.push(`<div class="gantt-tick" style="left:${(i / months * 100).toFixed(1)}%">${i === 0 ? '启动' : `M${i}`}</div>`);
  }
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    ${insightBox(sl.insight)}
    <div class="gantt-wrap">
      <div class="gantt-header">
        <div class="gantt-label"></div>
        <div class="gantt-track">${ticks.join('')}</div>
      </div>
      ${trackHtml}
    </div>
  `);
}

// ========== 章节分隔页（战略启航/立项场景常用） ==========
function renderSectionDivider(sl) {
  return section(sl, `
    <div class="divider-band"></div>
    <div class="divider-num">${esc(sl.chapterNum || '01')}</div>
    <h1 class="divider-title">${esc(sl.title || sl.chapter || '')}</h1>
    ${sl.subtitle ? `<div class="divider-sub">${esc(sl.subtitle)}</div>` : ''}
    ${(sl.points || []).length ? `<div class="divider-points">${sl.points.map(p => `<div class="divider-pt">${esc(p)}</div>`).join('')}</div>` : ''}
  `, 'divider');
}

// ========== 结论/总结页（Takeaway Box） ==========
function renderSummary(sl) {
  const points = (sl.points || sl.takeaways || []).map((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    if (typeof p === 'string') return `<div class="sum-row"><div class="sum-num">${num}</div><div class="sum-text">${esc(p)}</div></div>`;
    return `<div class="sum-row"><div class="sum-num">${num}</div><div class="sum-text"><b>${esc(p.title || '')}</b><div class="sum-sub">${esc(p.desc || '')}</div></div></div>`;
  }).join('');
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    ${sl.summary ? `<div class="sum-top">${esc(sl.summary)}</div>` : ''}
    <div class="sum-list">${points}</div>
    ${insightBox(sl.insight)}
  `);
}

// ========== 签字栏（项目章程用） ==========
function renderSignature(sl) {
  const signers = sl.signers || [
    { role: '项目 Sponsor（CEO/总裁）', name: '', date: '' },
    { role: '业务 Owner（COO/业务VP）', name: '', date: '' },
    { role: '项目经理（CDO/PMO负责人）', name: '', date: '' },
  ];
  const rows = signers.map(s => `<tr>
    <td class="sig-role">${esc(s.role)}</td>
    <td class="sig-name">${esc(s.name || '')}<div class="sig-line"></div></td>
    <td class="sig-date">${esc(s.date || '')}<div class="sig-line"></div></td>
  </tr>`).join('');
  return section(sl, `
    ${slideTitle(sl.title || '项目章程签署', sl.kicker)}
    ${sl.preamble ? `<div class="sig-preamble">${esc(sl.preamble)}</div>` : ''}
    <table class="sig-table">
      <thead><tr><th style="width:35%">角色</th><th style="width:40%">签字</th><th style="width:25%">日期</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `);
}

// ========== 数据表（盘点/清单类） ==========
function renderDataTable(sl) {
  const columns = sl.columns || [];
  const rows = sl.rows || [];
  return section(sl, `
    ${slideTitle(sl.title, sl.kicker)}
    ${insightBox(sl.insight)}
    <div class="dt-wrap">
      <table class="dt-table">
        <thead><tr>${columns.map(c => `<th>${esc(typeof c === 'string' ? c : c.label || c.name || '')}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(r => `<tr>${(Array.isArray(r) ? r : r.cells || []).map((c, i) => {
          const cls = columns[i]?.highlight ? 'dt-hl' : '';
          return `<td class="${cls}">${esc(c)}</td>`;
        }).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>
    ${sl.note ? `<div class="dt-note">${esc(sl.note)}</div>` : ''}
  `);
}

function renderEnding(sl) {
  return section(sl, `
    <div class="end-band"></div>
    <div class="end-body">
      <div class="end-thanks">THANK YOU</div>
      <h1 class="end-title">${esc(sl.title || '谢 谢')}</h1>
      ${sl.subtitle ? `<p class="end-sub">${esc(sl.subtitle)}</p>` : ''}
      ${sl.contact ? `<p class="end-contact">${esc(sl.contact)}</p>` : ''}
      ${(sl.meta || []).length ? `<div class="end-meta">${sl.meta.map((m) => `<span>${esc(m)}</span>`).join(' <i>|</i> ')}</div>` : ''}
    </div>
  `, 'ending');
}

// ========== 渲染器注册 ==========
const RENDERERS = {
  cover: renderCover,
  toc: renderToc,
  pyramid: renderPyramid,
  pyramid_model: renderPyramid,
  house: renderHouse,
  house_model: renderHouse,
  polygon: renderHouse,
  metrics: renderMetrics,
  radar: renderRadar,
  cards: renderStrengths,
  strengths: renderStrengths,
  weaknesses: renderWeaknesses,
  bar: renderBar,
  gap: renderBar,
  tree: renderTree,
  root_cause: renderTree,
  content: renderContentPage,
  detail: renderContentPage,
  initiatives: renderInitiatives,
  actions: renderInitiatives,
  process: renderRoadmap,
  roadmap: renderRoadmap,
  levels: renderPyramid,
  interview: renderInterview,
  interview_summary: renderInterview,
  matrix: renderMatrix,
  exec_matrix: renderMatrix,
  risk: renderRisk,
  risk_matrix: renderRisk,
  org: renderOrgChart,
  org_chart: renderOrgChart,
  budget: renderBudget,
  budget_table: renderBudget,
  moscow: renderMoscow,
  scope: renderMoscow,
  scenario: renderScenario,
  scenario_grid: renderScenario,
  prio_matrix: renderPrioMatrix,
  priority: renderPrioMatrix,
  kpi: renderKpi,
  kpi_card: renderKpi,
  targets: renderKpi,
  gantt: renderGantt,
  timeline: renderGantt,
  divider: renderSectionDivider,
  section: renderSectionDivider,
  summary: renderSummary,
  takeaway: renderSummary,
  signature: renderSignature,
  signoff: renderSignature,
  table: renderDataTable,
  datatable: renderDataTable,
  ending: renderEnding,
};

// ========== 主题配色定义 ==========
const THEMES = {
  red: {
    '--ink': '#0f172a', '--ink2': '#1e293b', '--muted': '#64748b', '--line': '#e2e8f0',
    '--bg': '#ffffff', '--bg2': '#f8fafc',
    '--brand': '#8B0000', '--brand2': '#C7000B', '--brand3': '#E63946',
    '--accent': '#ED6D00', '--warn': '#FCC800', '--danger': '#DC2626', '--ok': '#16A34A',
    '--brand-rgb': '199,0,11',
    '--cover-bg': 'linear-gradient(135deg,#fff 0%,#fff5f5 100%)',
    '--cover-band': 'linear-gradient(90deg,#8B0000,#C7000B,#E63946)',
    '--end-accent': '#E63946',
    '--end-title-grad': 'linear-gradient(90deg,#fff,#f8b4b9)',
    '--card-hl-bg': '#fff5f5',
    '--step-bg': '#fff8f8',
    '--hl-shadow': 'rgba(199,0,11,.18)',
    '--hl-shadow-soft': 'rgba(199,0,11,.1)',
    '--bar-fill': 'linear-gradient(90deg,#E63946,#C7000B)',
    '--radar-fill-a': 'rgba(230,57,70,0.35)', '--radar-fill-b': 'rgba(199,0,11,0.22)',
    '--radar-target-stroke': '#ED6D00',
    '--s1': '#DC2626', '--s2': '#EA580C', '--s3': '#CA8A04', '--s4': '#16A34A', '--s5': '#059669',
    '--warn-bg': '#FEF3C7', '--warn-text': '#92400E',
    '--danger-bg': '#FEE2E2', '--danger-text': '#991B1B',
    '--ok-bg': '#DCFCE7', '--ok-text': '#166534',
    '--peer-fill': 'rgba(252,200,0,.08)',
    '--prio-p0-bg': '#DC2626', '--prio-p0-text': '#fff',
    '--prio-p1-bg': '#EA580C', '--prio-p1-text': '#fff',
    '--prio-p2-bg': '#CA8A04', '--prio-p2-text': '#fff',
  },
  blue: {
    '--ink': '#0f172a', '--ink2': '#1e293b', '--muted': '#64748b', '--line': '#e2e8f0',
    '--bg': '#ffffff', '--bg2': '#f8fafc',
    '--brand': '#0C4A6E', '--brand2': '#0369A1', '--brand3': '#0EA5E9',
    '--accent': '#7C3AED', '--warn': '#D97706', '--danger': '#DC2626', '--ok': '#059669',
    '--brand-rgb': '3,105,161',
    '--cover-bg': 'linear-gradient(135deg,#fff 0%,#f0f9ff 100%)',
    '--cover-band': 'linear-gradient(90deg,#0C4A6E,#0369A1,#0EA5E9)',
    '--end-accent': '#0EA5E9',
    '--end-title-grad': 'linear-gradient(90deg,#fff,#bae6fd)',
    '--card-hl-bg': '#f0f9ff',
    '--step-bg': '#f8fafc',
    '--hl-shadow': 'rgba(3,105,161,.18)',
    '--hl-shadow-soft': 'rgba(3,105,161,.1)',
    '--bar-fill': 'linear-gradient(90deg,#0EA5E9,#0369A1)',
    '--radar-fill-a': 'rgba(14,165,233,0.35)', '--radar-fill-b': 'rgba(3,105,161,0.22)',
    '--radar-target-stroke': '#7C3AED',
    '--s1': '#DC2626', '--s2': '#D97706', '--s3': '#CA8A04', '--s4': '#059669', '--s5': '#047857',
    '--warn-bg': '#FEF3C7', '--warn-text': '#92400E',
    '--danger-bg': '#FEE2E2', '--danger-text': '#991B1B',
    '--ok-bg': '#DCFCE7', '--ok-text': '#166534',
    '--peer-fill': 'rgba(217,119,6,.08)',
    '--prio-p0-bg': '#DC2626', '--prio-p0-text': '#fff',
    '--prio-p1-bg': '#D97706', '--prio-p1-text': '#fff',
    '--prio-p2-bg': '#CA8A04', '--prio-p2-text': '#fff',
  }
};

// ========== 通用内容页渲染器 ==========
function renderContentPage(sl) {
  const title = sl.title || sl.topic || '';
  const kicker = sl.kicker || sl.chapter || '';
  const bullets = sl.bullets || sl.points || sl.items || [];
  const insight = sl.insight || sl.summary || sl.conclusion || '';
  const content = sl.body || sl.text || sl.content || '';

  let bulletsHtml = '';
  if (Array.isArray(bullets) && bullets.length > 0) {
    bulletsHtml = `<div class="fallback-list">${bullets.map((b) => {
      const text = typeof b === 'string' ? b : (b.text || b.content || b.desc || '');
      const sub = typeof b === 'object' ? (b.sub || b.desc || b.detail || '') : '';
      return `<div class="fallback-item"><span class="fb-dot"></span><div class="fb-text">${esc(text)}${sub ? `<div class="fb-sub">${esc(sub)}</div>` : ''}</div></div>`;
    }).join('')}</div>`;
  } else if (content && typeof content === 'string') {
    const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
    bulletsHtml = `<div class="fallback-text">${paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`;
  }

  return section(sl, `
    ${slideTitle(title, kicker)}
    ${insight ? `<div class="sum-top">${esc(insight)}</div>` : ''}
    ${bulletsHtml}
  `);
}

// ========== 兜底渲染器：将未知类型渲染为content页面 ==========
function renderFallbackContent(sl) {
  const title = sl.title || sl.topic || sl.heading || '';
  const kicker = sl.kicker || sl.chapter || '';
  const bullets = sl.bullets || sl.points || sl.items || sl.content || sl.text || [];
  const insight = sl.insight || sl.summary || sl.conclusion || '';
  const content = typeof sl.content === 'string' ? sl.content : (sl.text || sl.body || '');

  let bulletsHtml = '';
  if (Array.isArray(bullets) && bullets.length > 0) {
    bulletsHtml = `<div class="fallback-list">${bullets.map((b) => {
      const text = typeof b === 'string' ? b : (b.text || b.content || b.desc || '');
      const sub = typeof b === 'object' ? (b.sub || b.desc || b.detail || '') : '';
      return `<div class="fallback-item"><span class="fb-dot"></span><div class="fb-text">${esc(text)}${sub ? `<div class="fb-sub">${esc(sub)}</div>` : ''}</div></div>`;
    }).join('')}</div>`;
  } else if (content && typeof content === 'string') {
    const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
    bulletsHtml = `<div class="fallback-text">${paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`;
  }

  return section(sl, `
    ${slideTitle(title, kicker)}
    ${insight ? `<div class="sum-top">${esc(insight)}</div>` : ''}
    ${bulletsHtml}
  `);
}

// ========== 主入口 ==========
export function renderSlides(deck, opts = {}) {
  const rawSlides = (deck.slides || []).map((s) => {
    if (!s) return s;
    const sl = { ...s };
    if (sl.type === 'polygon') sl.type = 'house';
    if (sl.nodes && !sl.pillars) sl.pillars = sl.nodes;
    // 类型别名规范化
    if (sl.type === 'chapter_divider' || sl.type === 'chapter') sl.type = 'divider';
    if (sl.type === 'contents') sl.type = 'toc';
    if (sl.type === 'cover_page') sl.type = 'cover';
    if (sl.type === 'thank_you' || sl.type === 'thanks') sl.type = 'ending';
    if (sl.type === 'overview' || sl.type === 'intro') sl.type = 'summary';
    if (sl.type === 'detail' || sl.type === 'description') sl.type = 'content';
    if (sl.type === 'key_findings' || sl.type === 'findings') sl.type = 'summary';
    if (sl.type === 'action_items' || sl.type === 'next_steps') sl.type = 'initiatives';
    return sl;
  });

  const tocIdx = rawSlides.findIndex((s) => s && s.type === 'toc');
  let pageMap = null;
  if (tocIdx >= 0) {
    const tocItems = rawSlides[tocIdx].items || [];
    pageMap = tocItems.map(() => null);
    rawSlides.forEach((s, idx) => {
      if (!s || !s.chapter) return;
      const chapMatch = String(s.chapter).match(/^(\d+)[\.\s、]/);
      if (chapMatch) {
        const chapNum = parseInt(chapMatch[1], 10) - 1;
        if (chapNum >= 0 && chapNum < tocItems.length && pageMap[chapNum] == null) {
          pageMap[chapNum] = idx + 1;
        }
      }
    });
    let lastPage = (tocIdx + 1) + 1;
    for (let i = 0; i < pageMap.length; i++) {
      if (pageMap[i] == null) {
        pageMap[i] = lastPage;
      } else {
        lastPage = pageMap[i];
      }
    }
  }

  // 渲染每个幻灯片：未知类型使用兜底渲染器而非丢弃
  const slides = rawSlides
    .filter((s) => s && s.type)
    .map((s) => {
      const renderer = RENDERERS[s.type] || renderFallbackContent;
      if (s.type === 'toc') return renderer(s, pageMap);
      return renderer(s);
    });
  if (slides.length === 0) return null;

  const theme = opts.theme || 'red';
  const t = THEMES[theme] || THEMES.red;
  const cssVars = Object.entries(t).map(([k, v]) => `${k}:${v}`).join(';');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(deck.title || '咨询交付物')}</title>
<style>
:root,body.theme-red,body.theme-blue{${cssVars}}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;background:#e5e7eb;font-family:"PingFang SC","Microsoft YaHei","Segoe UI",system-ui,sans-serif;color:var(--ink);overflow:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
#stage{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}
#deck{width:1280px;height:720px;position:relative;background:#fff;box-shadow:0 18px 50px rgba(15,23,42,.18);overflow:hidden;font-size:12px;color:var(--ink2)}
.slide{position:absolute;inset:0;padding:40px 56px 48px;display:none;flex-direction:column;background:#fff;overflow:hidden}
.slide.active{display:flex}

/* ---------- 统一字体规范 ---------- */
/* H1 页面主标题 */
.stitle{font-size:22px;font-weight:700;color:var(--ink);line-height:1.3;letter-spacing:-.2px;border-left:4px solid var(--brand2);padding-left:10px}
.shead{margin-bottom:16px;flex-shrink:0}
/* Kicker 章节标签 */
.kicker{font-family:"JetBrains Mono","SF Mono",Consolas,monospace;font-size:10px;color:var(--brand);letter-spacing:2.5px;font-weight:700;margin-bottom:6px;text-transform:uppercase}
/* 模块小标题统一 */
.sec-title,.r-side-title,.bench-title,.kf-title,.pc-name,.dim-name,.bcc-name,.house-v2-pillar-name,.h-fn-title{font-size:13px;font-weight:700;color:var(--ink);letter-spacing:0}
/* 数据/数字统一 */
.num,.score,.bcc-score,.b-v3-val b,.dim-score,.pc-lv,.rs-dim-score,.r-val,.r-tick{font-family:"JetBrains Mono","SF Mono",Consolas,monospace;font-weight:700}
/* 正文统一 */
.ib-text,.rs-dim-comment,.kf-text,.bcc-p,.gi-content,.r-summary,.pyrm-desc,.rs-dim-comment,.kf-implication,.dim-sec-content{font-size:11px;color:var(--ink2);line-height:1.6}
/* 辅助文字 */
.muted,.pa-bot,.pa-top,.r-legend-v2,.bcc-slash,.foot-chap,.co-year,.b-v3-scale,.comparison-note{color:var(--muted);font-size:9.5px}

/* ---------- 洞察框 ---------- */
.insight-box{display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:linear-gradient(135deg,var(--card-hl-bg),#fff);border-radius:4px;margin-bottom:12px;border-left:3px solid var(--brand2)}
.ib-icon{font-size:14px;flex-shrink:0;margin-top:1px}
.ib-text{font-size:12px;line-height:1.6;color:var(--ink2);font-weight:500}

/* ---------- 底部章节标记 ---------- */
.slide .foot-mark{position:absolute;bottom:18px;left:56px;right:56px;height:1px;background:var(--line)}
.foot-chap{position:absolute;bottom:4px;left:56px;font-size:9.5px;letter-spacing:2px;color:var(--muted);font-family:"JetBrains Mono",Consolas,monospace;text-transform:uppercase}

/* ---------- 封面 ---------- */
.cover{padding:0;background:var(--cover-bg)}
.cover-band{position:absolute;top:0;left:0;right:0;height:6px;background:var(--cover-band)}
.cover-logo{position:absolute;top:40px;left:56px;display:flex;align-items:center;gap:8px;font-size:14px;color:var(--brand);font-weight:600;letter-spacing:1.5px}
.cl-icon{color:var(--brand2);font-size:18px}
.cover-mid{position:absolute;left:56px;top:200px;max-width:900px}
.cover-tag{display:inline-block;font-family:"JetBrains Mono",Consolas,monospace;font-size:11px;color:var(--brand);letter-spacing:2.5px;border:1px solid var(--brand2);padding:4px 12px;border-radius:2px;margin-bottom:22px}
.cover-title{font-size:44px;font-weight:800;line-height:1.2;letter-spacing:-.5px;color:var(--ink)}
.cover-sub{margin-top:14px;font-size:16px;color:var(--muted);line-height:1.6;max-width:760px}
.cover-meta{position:absolute;bottom:50px;left:56px;display:flex;gap:10px;font-size:11px;color:var(--muted);align-items:center;font-family:"JetBrains Mono",Consolas,monospace;letter-spacing:.5px}
.cover-meta i{color:var(--line);font-style:normal}

/* ---------- 结尾 ---------- */
.ending{background:var(--ink);color:#fff;justify-content:center;align-items:center;padding:0}
.end-band{position:absolute;top:0;left:0;right:0;height:6px;background:var(--cover-band)}
.end-body{text-align:center}
.end-thanks{font-family:"JetBrains Mono",Consolas,monospace;font-size:12px;letter-spacing:7px;color:var(--end-accent);margin-bottom:14px}
.end-title{font-size:52px;font-weight:800;letter-spacing:6px;background:var(--end-title-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.end-sub{margin-top:16px;font-size:14px;color:#94a3b8}
.end-contact{margin-top:8px;font-size:12px;color:#64748b}
.end-meta{margin-top:30px;display:flex;justify-content:center;gap:10px;font-size:10px;color:#64748b;font-family:"JetBrains Mono",Consolas,monospace;letter-spacing:.5px}
.end-meta i{color:#334155;font-style:normal}

/* ---------- 目录（自适应布局） ---------- */
.toc-body{display:flex;gap:36px;flex:1;align-items:stretch}
.toc-col-full{display:flex;flex-direction:column;gap:10px;flex:1}
.toc-col-half{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}
.toc-row{display:flex;align-items:center;gap:12px;padding:10px 14px;border-bottom:1px solid var(--line);transition:all .15s}
.toc-row:hover{background:var(--card-hl-bg);padding-left:20px}
.toc-num{font-family:"JetBrains Mono",Consolas,monospace;font-size:22px;font-weight:800;color:var(--brand2);width:40px;letter-spacing:-1px;flex-shrink:0}
.toc-content{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}
.toc-txt{font-size:15px;font-weight:600;color:var(--ink);line-height:1.3}
.toc-sub{font-size:10px;color:var(--muted);line-height:1.2}
.toc-dot{flex:1;border-top:2px dotted var(--line);min-width:20px}
.toc-page{font-family:"JetBrains Mono",Consolas,monospace;font-size:12px;color:var(--muted);font-weight:600;width:28px;text-align:right;flex-shrink:0}
.toc-col-half .toc-row{padding:8px 10px;gap:10px}
.toc-col-half .toc-num{font-size:18px;width:32px}
.toc-col-half .toc-txt{font-size:13px}
.toc-col-half .toc-sub{font-size:9px}

/* ---------- 金字塔模型（纯介绍页） ---------- */
.pyrm-layout{display:flex;gap:30px;flex:1;min-height:0}
.pyrm-left{width:44%;display:flex;flex-direction:column;align-items:center}
.pyrm-svg{width:100%;height:440px;flex-shrink:0}
.pyrm-axis-label{display:flex;align-items:center;gap:8px;margin-top:4px;font-size:10px;color:var(--muted)}
.pyrm-axis-low{color:var(--muted)}
.pyrm-axis-arrow{color:var(--brand2);font-weight:700}
.pyrm-axis-high{color:var(--brand2);font-weight:600}
.pyr-model{fill:url(#pyrModelGrad);stroke:var(--brand2);stroke-width:1}
.pyr-model-tag{fill:#fff;font-size:13px;font-weight:800;font-family:"JetBrains Mono",Consolas,monospace;letter-spacing:1px}
.pyr-model-name{fill:#fff;font-size:11px;font-weight:600}
.pyrm-right{flex:1;display:flex;flex-direction:column;overflow-y:auto}
.pyrm-rtitle{font-size:12px;font-weight:700;color:var(--brand2);margin-bottom:10px;letter-spacing:1px}
.pyrm-row{padding:10px 12px;border-left:3px solid var(--brand2);background:#fff;margin-bottom:8px}
.pyrm-head{display:flex;align-items:baseline;gap:8px;margin-bottom:6px}
.pyrm-lv{font-family:"JetBrains Mono",Consolas,monospace;font-size:11px;font-weight:700;color:var(--brand2)}
.pyrm-nm{font-size:13px;font-weight:700;color:var(--ink)}
.pyrm-features{display:flex;flex-direction:column;gap:4px}
.pyrm-feat{display:flex;align-items:flex-start;gap:6px;font-size:10.5px;color:var(--muted);line-height:1.5}
.pyrm-dot{width:4px;height:4px;border-radius:50%;background:var(--brand2);margin-top:5px;flex-shrink:0}
.model-desc{margin-top:10px;padding:10px 14px;background:var(--bg2);border-radius:4px;font-size:11px;color:var(--ink2);line-height:1.6;flex-shrink:0}

/* ---------- 麦肯锡屋形模型 V2 - 专业咨询版 ---------- */
.house-v2-wrap{width:100%;flex:1;display:flex;align-items:center;justify-content:center;min-height:0}
.house-v2-svg{width:100%;max-height:480px}
.house-v2-foundation{fill:url(#foundGradV2);stroke:#cbd5e1;stroke-width:1}
.house-v2-found-label{fill:var(--muted);font-size:10px;font-weight:600}
.house-v2-found-text{fill:var(--ink2);font-size:12px;font-weight:600;letter-spacing:1px}
.house-v2-roof{fill:url(#roofGradV2);stroke:var(--brand);stroke-width:1}
.house-v2-roof-line{stroke:rgba(255,255,255,.2);stroke-width:1}
.house-v2-chimney{fill:var(--brand);stroke:var(--brand);stroke-width:1}
.house-v2-peak{fill:#fff;stroke:var(--brand3);stroke-width:2}
.house-v2-roof-tag{fill:rgba(255,255,255,.7);font-size:10px;letter-spacing:2px;font-weight:500}
.house-v2-roof-title{fill:#fff;font-size:15px;font-weight:800;letter-spacing:1px}
.house-v2-roof-sub{fill:rgba(255,255,255,.75);font-size:10px;font-weight:500;letter-spacing:1px}
.house-v2-pillar-shadow{fill:rgba(0,0,0,.06)}
.house-v2-pillar{fill:#fff;stroke:var(--line);stroke-width:1}
.house-v2-pillar-cap{fill:var(--brand2);filter:drop-shadow(0 2px 3px var(--hl-shadow-soft))}
.house-v2-pillar-base{fill:#f1f5f9;stroke:#e2e8f0;stroke-width:1}
.house-v2-pillar-idx-circle{fill:var(--brand2)}
.house-v2-pillar-idx{fill:#fff;font-size:10px;font-weight:800;font-family:"JetBrains Mono",Consolas,monospace}
.house-v2-pillar-name{fill:var(--ink);font-size:12px;font-weight:700}
.house-v2-bullet{fill:var(--brand3)}
.house-v2-pillar-kp{fill:var(--muted);font-size:8.5px}
.house-v2-pillar-desc{fill:var(--muted);font-size:8.5px}
.framework-note{margin-top:8px;padding:8px 12px;background:var(--bg2);border-left:3px solid var(--muted);border-radius:0 4px 4px 0;font-size:10.5px;color:var(--muted);line-height:1.5;flex-shrink:0}
.fn-label{font-weight:600;color:var(--ink2)}

/* ---------- 核心指标 V2 + 关键发现 ---------- */
.metrics-v2-top{margin-bottom:14px}
.m-grid-v2{display:grid;grid-template-columns:repeat(var(--n),1fr);gap:12px}
.m-card-v2{border:1px solid var(--line);border-radius:6px;padding:16px 18px;background:#fff;position:relative;overflow:hidden}
.m-card-v2::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--brand2)}
.m-card-v2.hl{background:var(--card-hl-bg);border-color:var(--brand2)}
.m-v2-label{font-size:11px;color:var(--muted);font-weight:500;margin-bottom:6px}
.m-v2-val{font-size:34px;font-weight:800;color:var(--brand2);font-family:"JetBrains Mono",Consolas,monospace;letter-spacing:-1px;line-height:1}
.m-v2-unit{font-size:14px;font-weight:600;color:var(--muted);margin-left:2px}
.m-v2-bench{font-size:10px;color:var(--muted);margin-top:6px}
.m-v2-trend{font-size:10px;margin-top:4px;font-weight:600}
.m-v2-trend.up{color:var(--ok)}
.m-v2-trend.down{color:var(--danger)}
.key-findings{flex:1}
.kf-title{font-size:12px;font-weight:700;color:var(--brand2);letter-spacing:1px;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid var(--brand2);display:inline-block}
.kf-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.kf-item{display:flex;gap:10px;padding:10px 12px;background:var(--bg2);border-radius:4px;border-left:3px solid var(--brand2)}
.kf-num{font-family:"JetBrains Mono",Consolas,monospace;font-size:14px;font-weight:800;color:var(--brand2);flex-shrink:0}
.kf-content{flex:1}
.kf-text{font-size:11.5px;color:var(--ink);font-weight:600;line-height:1.5}
.kf-implication{font-size:10.5px;color:var(--muted);margin-top:3px;line-height:1.4}

/* ---------- 雷达图 V2 + 得分表 ---------- */
.r-layout-v2{display:flex;gap:22px;align-items:center;flex:1;min-height:0}
.r-svg-v2{width:100%;height:100%;flex-shrink:0}
/* 雷达图容器 - 垂直居中，缩小尺寸给右侧更多空间 */
.r-svg-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:0 0 400px;height:100%}
.r-svg-wrap .r-svg-v2{width:380px;height:350px}
.r-ring{fill:none;stroke:#e2e8f0;stroke-width:1}
.r-axis{stroke:#f1f5f9;stroke-width:1}
.r-tick{fill:#cbd5e1;font-size:9px;font-family:"JetBrains Mono",Consolas,monospace}
.r-cur{fill:url(#rFillV2);stroke:var(--brand2);stroke-width:2}
.r-dot{fill:var(--brand2)}
.r-peer{fill:var(--peer-fill);stroke:var(--warn);stroke-width:1.5;stroke-dasharray:5 3}
.r-target{fill:none;stroke:var(--radar-target-stroke);stroke-width:1.2;stroke-dasharray:2 3}
.r-label{fill:var(--ink);font-size:11px;font-weight:600}
.r-val{fill:var(--brand2);font-size:10px;font-weight:700;font-family:"JetBrains Mono",Consolas,monospace}
.r-val.low{fill:var(--danger)}
.r-val.high{fill:var(--ok)}
.r-vp{fill:var(--warn);font-weight:500;margin-left:2px;font-size:9px}
.r-side-v2{flex:1;display:flex;flex-direction:column;gap:10px}
.r-legend-v2{display:flex;gap:20px;font-size:11px;color:var(--muted)}
.r-legend-v2 span{display:inline-flex;align-items:center;gap:6px}
.r-legend-v2 i{width:20px;height:0;border-top:2px solid var(--brand2);display:inline-block}
.r-legend-v2 i.lg-peer-v2{border-top-style:dashed;border-top-color:var(--warn)}
.r-legend-v2 i.lg-target-v2{border-top-style:dotted;border-top-color:var(--radar-target-stroke)}
.r-legend-center{margin-top:6px}

/* 右侧维度评价表 - 两列：维度+评价 */
.r-side-title{font-size:12px;font-weight:700;color:var(--ink);padding-bottom:8px;border-bottom:2px solid var(--brand2);margin-bottom:4px}
.rs-table-v2{flex:1;display:flex;flex-direction:column;gap:0}
.rs-row-v2{display:grid;grid-template-columns:130px 1fr;gap:14px;padding:10px 8px;border-bottom:1px solid var(--line);align-items:center}
.rs-row-v2:last-child{border-bottom:none}
.rs-dim-name{display:flex;align-items:center;gap:6px;white-space:nowrap}
.rs-dim-dot{width:8px;height:8px;border-radius:50%;background:var(--dim-c);flex-shrink:0}
.rs-dim-label{font-size:12px;font-weight:700;color:var(--ink);line-height:1.3;white-space:nowrap}
.rs-dim-score{font-family:"JetBrains Mono",Consolas,monospace;font-size:12px;font-weight:800;color:var(--dim-c);margin-left:4px;background:var(--bg2);padding:1px 6px;border-radius:3px;flex-shrink:0}
.rs-dim-comment{font-size:11px;color:var(--ink2);line-height:1.5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.r-summary{padding:10px 12px;background:var(--card-hl-bg);border-radius:4px;font-size:11px;color:var(--ink2);line-height:1.6;border-left:3px solid var(--brand2);flex-shrink:0}

/* ---------- 维度详解（优势/短板）- 丰富布局 ---------- */
.dim-detail-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;flex:1;align-content:center;overflow-y:auto}
.dim-card{background:#fff;border:1px solid var(--line);border-radius:6px;overflow:hidden;display:flex;flex-direction:column}
.dim-card.weak{border-color:var(--danger)}
.dim-head{display:flex;align-items:center;gap:10px;padding:12px;background:linear-gradient(135deg,var(--ok-bg),#fff);border-bottom:1px solid var(--line)}
.dim-card.weak .dim-head{background:linear-gradient(135deg,var(--danger-bg),#fff)}
.dim-score-box{width:50px;height:50px;border-radius:50%;background:var(--ok);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}
.dim-score-box.weak{background:var(--danger)}
.dim-score{font-size:18px;font-weight:800;font-family:"JetBrains Mono",Consolas,monospace;line-height:1}
.dim-score-label{font-size:8px;font-weight:500;opacity:.8}
.dim-title-area{flex:1}
.dim-name{font-size:13px;font-weight:700;color:var(--ink);line-height:1.3}
.dim-level{font-size:10px;color:var(--ok);font-weight:600;margin-top:2px}
.dim-gap{font-size:10px;color:var(--danger);font-weight:600;margin-top:2px}
.dim-badge{font-size:9px;padding:3px 8px;border-radius:2px;font-weight:700;letter-spacing:.5px}
.dim-badge.ok{background:var(--ok);color:#fff}
.dim-badge.danger{background:var(--danger);color:#fff}
.dim-body{padding:10px 12px;display:flex;flex-direction:column;gap:8px;flex:1}
.dim-section{display:flex;flex-direction:column;gap:3px}
.dim-sec-title{font-size:9px;font-weight:700;color:var(--muted);letter-spacing:.5px;text-transform:uppercase}
.dim-sec-content{font-size:10.5px;color:var(--ink2);line-height:1.5}
.dim-sec-content.danger-text{color:var(--danger)}
.dim-evidence-list{list-style:none;display:flex;flex-direction:column;gap:3px}
.dim-evidence-list li{font-size:10px;color:var(--ink2);line-height:1.4;padding-left:10px;position:relative}
.dim-evidence-list li::before{content:"✓";position:absolute;left:0;color:var(--ok);font-weight:700;font-size:9px}
.dim-value-text{font-size:10.5px;color:var(--ok);font-weight:600;line-height:1.4}
.dim-impact-text{font-size:10.5px;color:var(--danger);font-weight:500;line-height:1.4}

/* ---------- 条形图 V2 - 差距对比+解读 ---------- */
.comparison-note{padding:8px 12px;background:var(--bg2);border-radius:4px;font-size:10.5px;color:var(--muted);margin-bottom:10px;flex-shrink:0}
.b-v2-chart{flex:1;display:flex;flex-direction:column;gap:2px}
.b-v2-header{display:grid;grid-template-columns:120px 1fr 100px;gap:12px;font-size:10px;color:var(--muted);font-weight:600;padding-bottom:6px;border-bottom:2px solid var(--line);margin-bottom:6px}
.b-v2-h-lbl{text-align:right}
.b-v2-h-track{padding-left:4px}
.b-v2-row{display:grid;grid-template-columns:120px 1fr 100px;gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid var(--bg2)}
.b-v2-lbl-area{display:flex;flex-direction:column;align-items:flex-end}
.b-v2-lbl{font-size:11px;color:var(--ink);font-weight:600;text-align:right}
.b-v2-weight{font-size:9px;color:var(--muted);margin-top:2px}
.b-v2-track-wrap{position:relative}
.b-v2-scale{display:flex;justify-content:space-between;font-size:9px;color:var(--muted);margin-bottom:3px;font-family:"JetBrains Mono",Consolas,monospace}
.b-v2-track{height:20px;background:linear-gradient(90deg,#fef2f2,#fff7ed,#fefce8,#f0fdf4,#dcfce7);border-radius:3px;position:relative;overflow:visible}
.b-v2-fill{height:100%;background:var(--bar-fill);border-radius:3px;opacity:.85}
.b-v2-peer{position:absolute;top:-4px;width:3px;height:28px;background:var(--warn);border-radius:1px;z-index:2}
.b-v2-labels{position:relative;height:14px;margin-top:2px}
.b-v2-cur-label,.b-v2-peer-label{position:absolute;font-size:9px;font-weight:600;transform:translateX(-50%)}
.b-v2-cur-label{color:var(--brand2)}
.b-v2-peer-label{color:var(--warn)}
.b-v2-val-area{display:flex;align-items:center;gap:8px}
.b-v2-val{font-family:"JetBrains Mono",Consolas,monospace;font-size:13px;font-weight:700;color:var(--brand2)}
.b-v2-gap{font-family:"JetBrains Mono",Consolas,monospace;font-size:11px;font-weight:700;padding:2px 6px;border-radius:2px}
.b-v2-gap.pos{color:var(--ok);background:var(--ok-bg)}
.b-v2-gap.neg{color:var(--danger);background:var(--danger-bg)}
.b-v2-gap.neu{color:var(--muted)}
.gap-interpretation{margin-top:10px;padding:10px 12px;background:var(--card-hl-bg);border-left:3px solid var(--brand2);border-radius:0 4px 4px 0;flex-shrink:0}
.gi-title{font-size:10px;font-weight:700;color:var(--brand2);margin-bottom:4px}
.gi-content{font-size:10.5px;color:var(--ink2);line-height:1.6}
.key-gaps-list{margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px;flex-shrink:0}
.kg-item{display:flex;align-items:flex-start;gap:6px;font-size:10.5px;color:var(--ink2);padding:6px 10px;background:var(--bg2);border-radius:3px}
.kg-icon{color:var(--danger);font-weight:700;flex-shrink:0}

/* ---------- MECE逻辑树（根因分析）V5 - 标准问题树布局 ---------- */
.tree-wrap{flex:1;display:flex;align-items:center;justify-content:center;min-height:0;position:relative;overflow:hidden}
.tree-inner{position:relative;transform-origin:center center}
.tree-svg{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
/* 核心问题（顶部深色块）*/
.tree-problem{position:absolute;background:linear-gradient(135deg,#1e293b,#0f172a);color:#fff;border-radius:6px;padding:10px 20px;text-align:center;box-shadow:0 4px 14px rgba(15,23,42,.3);z-index:2}
.tree-problem-tag{font-family:"JetBrains Mono",Consolas,monospace;font-size:8px;letter-spacing:2px;color:#94a3b8;margin-bottom:3px;text-transform:uppercase}
.tree-problem-title{font-size:13px;font-weight:700;line-height:1.4}
/* 一级根因卡片 */
.tree-l1-card{position:absolute;border:2px solid var(--bd);background:var(--bg);border-radius:6px;padding:8px 12px;z-index:2;box-shadow:0 2px 8px rgba(0,0,0,.06);border-top-width:4px;border-top-color:var(--c)}
.tree-l1-head{display:flex;align-items:center;gap:6px}
.tree-prio{font-size:8px;font-weight:800;padding:2px 7px;border-radius:2px;color:#fff;letter-spacing:.5px;flex-shrink:0;line-height:1.3}
.tree-l1-title{font-size:11px;font-weight:700;color:var(--ink);line-height:1.3}
.tree-l1-impact{font-size:9px;color:var(--muted);margin-top:3px;line-height:1.3}
/* 二级原因标签 */
.tree-cause{position:absolute;background:#fff;border:1px solid var(--line);border-left:3px solid var(--c);border-radius:4px;padding:5px 10px;font-size:10px;color:var(--ink2);line-height:1.3;z-index:2;display:flex;align-items:center;gap:6px}
.tree-cause-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;display:none}
.root-conclusion{margin-top:8px;padding:10px 14px;background:var(--bg2);border-radius:4px;font-size:10.5px;color:var(--ink2);line-height:1.6;flex-shrink:0;border-left:3px solid var(--brand2)}
.rc-label{color:var(--brand2);font-weight:700;margin-right:4px}

/* ---------- 路线图 V2 - 横向三阶段卡片+甘特轴 ---------- */
.rm-v2-summary{padding:8px 14px;background:linear-gradient(135deg,var(--card-hl-bg),#fff);border-left:3px solid var(--brand2);border-radius:0 4px 4px 0;font-size:11px;color:var(--ink2);margin-bottom:14px;flex-shrink:0;line-height:1.6}
.rm-v2-wrap{flex:1;display:flex;flex-direction:column;gap:16px;justify-content:center}
.rm-v2-cards{display:flex;gap:10px;align-items:stretch}
.rm-v2-card{flex:1;background:var(--pbg);border:1.5px solid var(--pc);border-radius:8px;padding:14px 16px;display:flex;flex-direction:column;gap:8px;position:relative;border-top-width:4px}
.rm2-head{display:flex;align-items:center;justify-content:space-between}
.rm2-phase-tag{font-family:"JetBrains Mono",Consolas,monospace;font-size:10px;font-weight:800;color:#fff;background:var(--pc);padding:2px 8px;border-radius:3px;letter-spacing:1px}
.rm2-time{font-family:"JetBrains Mono",Consolas,monospace;font-size:10px;color:var(--pc);font-weight:700}
.rm2-name{font-size:15px;font-weight:800;color:var(--ink);line-height:1.2}
.rm2-obj{font-size:11px;color:var(--ink2);line-height:1.55;padding-bottom:6px;border-bottom:1px dashed rgba(0,0,0,.08)}
.rm2-ms{display:flex;flex-direction:column;gap:4px;flex:1}
.rm2-ms-i{display:flex;align-items:flex-start;gap:6px;font-size:10.5px;color:var(--ink2);line-height:1.4}
.rm2-ms-dot{width:6px;height:6px;border-radius:50%;background:var(--pc);flex-shrink:0;margin-top:4px;opacity:.8}
.rm2-inv,.rm2-deliv{font-size:9.5px;color:var(--muted);padding-top:6px;border-top:1px solid rgba(0,0,0,.06)}
.rm2-inv span,.rm2-deliv span{font-weight:600;color:var(--pc)}
.rm2-arrow{display:flex;align-items:center;color:var(--muted);font-size:16px;font-weight:700;flex-shrink:0;width:20px;justify-content:center}
/* 甘特时间轴 */
.rm-v2-gantt{background:#fff;border:1px solid var(--line);border-radius:6px;padding:10px 14px 24px;position:relative}
.rm-gantt-label{font-size:10px;font-weight:700;color:var(--ink);margin-bottom:8px}
.rm-gantt-track{position:relative;height:26px}
.rm-gantt-bg{position:absolute;top:10px;left:0;right:0;height:8px;background:var(--bg2);border-radius:4px}
.rm-gantt-bar{position:absolute;top:6px;height:16px;border-radius:4px;display:flex;align-items:center;justify-content:center;transition:width .4s}
.rm-gantt-blbl{font-size:9px;color:#fff;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 6px}
.rm-gantt-scale{position:relative;height:16px;margin-top:4px}
.rm-gantt-scale span{position:absolute;font-size:9px;color:var(--muted);font-family:"JetBrains Mono",Consolas,monospace;transform:translateX(-50%);top:2px}

/* ---------- 举措矩阵 V2（SVG四象限+对应编号列表）---------- */
.im-v2-wrap{display:flex;gap:18px;flex:1;min-height:0;align-items:center}
.im-v2-matrix{width:400px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.im-v2-matrix svg{max-width:100%;max-height:100%}
.im-v2-list{flex:1;display:flex;flex-direction:column;border:1px solid var(--line);border-radius:6px;overflow:hidden;background:#fff}
.il-header{display:grid;grid-template-columns:32px 48px 1fr 110px 70px;gap:6px;font-size:9.5px;color:var(--muted);font-weight:700;padding:8px 10px;background:var(--bg2);letter-spacing:.5px;flex-shrink:0}
.il-body{flex:1;overflow-y:auto}
.il-row{display:grid;grid-template-columns:32px 48px 1fr 110px 70px;gap:6px;padding:8px 10px;align-items:center;border-bottom:1px solid var(--line);transition:background .15s}
.il-row:hover{background:var(--bg2)}
.il-row:last-child{border-bottom:none}
.il-num{font-family:"JetBrains Mono",Consolas,monospace;font-size:11px;font-weight:800;color:var(--brand);text-align:center;background:var(--bg2);border-radius:3px;padding:2px 0}
.il-prio{display:inline-block;font-size:9px;font-weight:800;padding:2px 6px;border-radius:3px;text-align:center;letter-spacing:.5px;line-height:1.2}
.il-prio.p0{background:#fef2f2;color:#DC2626}
.il-prio.p1{background:#fff7ed;color:#EA580C}
.il-prio.p2{background:#f0fdf4;color:#059669}
.il-name-area{display:flex;flex-direction:column;gap:2px;min-width:0}
.il-name{font-size:10.5px;font-weight:600;color:var(--ink);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.il-desc{font-size:9.5px;color:var(--muted);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.il-value{display:flex;flex-direction:column;gap:1px}
.il-val-main{font-size:10px;font-weight:700;color:var(--ok)}
.il-roi{font-size:9px;color:var(--muted)}
.il-time{font-size:9.5px;color:var(--ink2);font-family:"JetBrains Mono",Consolas,monospace;text-align:center}
.expected-outcome{margin-top:8px;padding:8px 14px;background:linear-gradient(135deg,var(--card-hl-bg),#fff);border:1px solid var(--brand2);border-radius:4px;font-size:10.5px;color:var(--ink);font-weight:600;flex-shrink:0}
.eo-label{color:var(--brand2);margin-right:4px}

/* ---------- 提示 ---------- */
.hint{position:fixed;bottom:8px;left:50%;transform:translateX(-50%);font-size:10px;color:#94a3b8;z-index:999}

/* ---------- 封面增强 ---------- */
.cover-deco{position:absolute;top:0;right:0;width:400px;height:400px;background:radial-gradient(circle at 80% 20%,var(--brand3),transparent 60%);opacity:.12}
.cover-deco2{position:absolute;bottom:0;left:0;width:300px;height:300px;background:radial-gradient(circle at 10% 90%,var(--brand2),transparent 60%);opacity:.08}
.cover-ornament{position:absolute;bottom:120px;right:56px;text-align:right}
.co-line{width:80px;height:3px;background:var(--cover-band);margin-left:auto;margin-bottom:10px;border-radius:2px}
.co-year{font-family:"JetBrains Mono",Consolas,monospace;font-size:48px;font-weight:800;color:var(--brand);opacity:.25;letter-spacing:2px}

/* ---------- 金字塔 - 全SVG精确对齐版 ---------- */
.pyrm-wrap{flex:1;display:flex;flex-direction:column;min-height:0}
.pyrm-desc{padding:10px 14px;background:linear-gradient(135deg,var(--bg2),#fff);border-radius:4px;font-size:11px;color:var(--ink2);line-height:1.65;margin-bottom:10px;flex-shrink:0;border-left:4px solid var(--brand2)}
.pyrm-body{flex:1;display:flex;align-items:center;justify-content:center;min-height:0}

/* ---------- 屋形模型字体放大 ---------- */
.house-v2-pillar-name{font-size:13px;font-weight:700}
.house-v2-pillar-kp{font-size:10.5px}
.house-v2-bullet{r:3px}

/* ---------- 维度详解 V3 - 2列大卡片，填充页面 ---------- */
.dim-v3-grid{flex:1;display:grid;gap:16px;min-height:0;align-content:stretch}
.strengths-grid{grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr}
.weaknesses-grid{grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr}
.dim-v3-card{background:#fff;border:1px solid var(--line);border-radius:8px;overflow:hidden;display:flex;flex-direction:column;border-top:4px solid var(--ok)}
.dim-v3-card.weak{border-top-color:var(--danger);border-color:rgba(220,38,38,.2)}
.dim-v3-header{display:flex;align-items:center;gap:14px;padding:16px 18px;background:linear-gradient(135deg,var(--ok-bg),#fff);border-bottom:1px solid var(--line)}
.dim-v3-header.weak-hdr{background:linear-gradient(135deg,var(--danger-bg),#fff)}
.dim-v3-score{width:58px;height:58px;border-radius:50%;background:var(--ok);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}
.dim-v3-score.weak-score{background:var(--danger)}
.dvs-num{font-size:22px;font-weight:800;font-family:"JetBrains Mono",Consolas,monospace;line-height:1}
.dvs-lbl{font-size:9px;font-weight:500;opacity:.85;margin-top:2px}
.dim-v3-title{flex:1}
.dvt-name{font-size:15px;font-weight:700;color:var(--ink);line-height:1.3}
.dvt-tag{display:inline-block;font-size:10px;font-weight:700;padding:3px 10px;border-radius:3px;margin-top:5px}
.dvt-tag.strong-tag{background:var(--ok-bg);color:var(--ok-text)}
.dvt-tag.weak-tag{background:var(--danger-bg);color:var(--danger-text)}
.dim-v3-body{padding:16px 18px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;flex:1}
.dv3-sec{display:flex;flex-direction:column;gap:6px}
.dv3-st{font-size:10.5px;font-weight:700;color:var(--muted);letter-spacing:.5px;display:flex;align-items:center;gap:6px}
.dv3-st.danger-st{color:var(--danger)}
.dv3-st-ico{font-size:12px}
.dv3-sc{font-size:12px;color:var(--ink2);line-height:1.7}
.dv3-sc.danger-sc{color:var(--danger-text);font-weight:500}
.dv3-evidence{list-style:none;display:flex;flex-direction:column;gap:7px;margin:0;padding:0}
.dv3-evidence li{font-size:11.5px;color:var(--ink2);line-height:1.6;padding-left:16px;position:relative}
.dv3-evidence li::before{content:"✓";position:absolute;left:0;color:var(--ok);font-weight:700;font-size:11px}
.dv3-value{color:var(--ok-text);font-weight:600;font-size:11.5px;line-height:1.7}
.dv3-value-sec{padding-top:12px;border-top:1px dashed var(--line)}
.dv3-impact{color:var(--danger-text);font-weight:600;font-size:11.5px;line-height:1.7}
.dv3-impact-sec{padding-top:12px;border-top:1px dashed var(--line)}

/* ---------- 条形图差距页优化 ---------- */
.b-v2-chart{gap:4px}
.b-v2-row{padding:10px 0}
.b-v2-track{height:24px}
.gap-interpretation{margin-top:12px;padding:12px 14px;font-size:11.5px;line-height:1.7}
.key-gaps-list{margin-top:10px;gap:8px}
.kg-item{padding:8px 12px;font-size:11px;line-height:1.5}

/* ---------- 路线图已用V2替换 ---------- */

/* ---------- 雷达图评分表（旧版已替换为rs-table-v2） ---------- */

/* ---------- P9差距页 V4 - 上下布局：上对比图+要点，下多列对标 ---------- */
.b-v4-layout{flex:1;display:flex;flex-direction:column;gap:14px;min-height:0;justify-content:center}
.b-v4-top{display:flex;gap:18px;flex-shrink:0}
.b-v4-chart-wrap{flex:1.2;display:flex;flex-direction:column;min-width:0}
.b-v4-insights{flex:1;display:flex;flex-direction:column;min-width:0}
.b-v4-bottom{display:flex;flex-direction:column;flex-shrink:0}
.b-v4-chart{background:#fff;border:1px solid var(--line);border-radius:6px;padding:10px 14px 8px}
.b-v4-header{display:grid;grid-template-columns:80px 1fr 65px;gap:8px;font-size:9.5px;color:var(--muted);font-weight:700;padding-bottom:5px;border-bottom:2px solid var(--line);margin-bottom:3px}
.b-v4-h-lbl{text-align:left}.b-v4-h-track{text-align:center}.b-v4-h-val{text-align:right}
.b-v4-row{display:grid;grid-template-columns:80px 1fr 65px;gap:8px;align-items:center;padding:5px 0;border-bottom:1px solid var(--bg2)}
.b-v4-lbl{font-size:11px;color:var(--ink);font-weight:600;line-height:1.2}
.b-v4-track-wrap{position:relative}
.b-v4-scale{display:flex;justify-content:space-between;font-size:8px;color:var(--muted);font-family:"JetBrains Mono",Consolas,monospace;margin-bottom:2px}
.b-v4-track{height:12px;background:var(--bg2);border-radius:6px;position:relative;overflow:visible}
.b-v4-fill{height:100%;background:var(--bar-fill);border-radius:6px}
.b-v4-peer{position:absolute;top:-2px;width:2px;height:16px;background:var(--warn);border-radius:1px}
.b-v4-val{text-align:right;font-family:"JetBrains Mono",Consolas,monospace;font-size:11px;color:var(--ink)}
.b-v4-val b{font-weight:700;font-size:12px}
.b-v4-gap{font-size:9px;font-weight:700;margin-left:4px;padding:1px 4px;border-radius:2px}
.b-v4-gap.pos{color:var(--ok-text);background:var(--ok-bg)}
.b-v4-gap.neg{color:var(--danger-text);background:var(--danger-bg)}
.b-v4-gap.neu{color:var(--muted);background:var(--bg2)}
/* 差距要点 */
.b-v4-insights-title{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--ink);padding-bottom:8px;border-bottom:2px solid var(--brand2);margin-bottom:8px}
.b4-ti-dot{width:8px;height:8px;border-radius:50%;background:var(--brand2)}
.b-v4-insights-list{display:flex;flex-direction:column;gap:6px;flex:1}
.gp-item{display:flex;gap:8px;padding:7px 10px;background:#fff;border:1px solid var(--line);border-radius:4px;border-left:3px solid var(--brand2)}
.gp-num{font-family:"JetBrains Mono",Consolas,monospace;font-size:10px;font-weight:800;color:var(--brand2);flex-shrink:0;min-width:20px}
.gp-text{font-size:10.5px;color:var(--ink2);line-height:1.5}
/* 下排对标 */
.b-v4-bench-title{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--ink);margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid var(--ok)}
.bench-title-ico{color:var(--warn);font-size:14px}
.b-v4-bench-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.bench-card-v4{background:#fff;border:1px solid var(--line);border-radius:6px;padding:10px 12px;border-top:3px solid var(--ok)}
.bc4-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:2px}
.bc4-name{font-size:12px;font-weight:700;color:var(--ink)}
.bc4-score{font-family:"JetBrains Mono",Consolas,monospace;font-size:14px;font-weight:800;color:var(--ok)}
.bc4-slash{font-size:9px;color:var(--muted);font-weight:500}
.bc4-level{font-size:9px;color:var(--ok);font-weight:600;margin-bottom:6px;background:var(--ok-bg);display:inline-block;padding:1px 6px;border-radius:2px}
.bc4-practices{display:flex;flex-direction:column;gap:3px}
.bc4-p{display:flex;align-items:flex-start;gap:5px;font-size:9.5px;color:var(--ink2);line-height:1.4}
.bc4-p-dot{width:3px;height:3px;border-radius:50%;background:var(--ok);flex-shrink:0;margin-top:5px}

/* ---------- P5关键发现增强：图标+更丰富的卡片式 ---------- */
.metrics-v2-top{flex-shrink:0}
.key-findings{flex:1;display:flex;flex-direction:column;min-height:0;margin-top:12px;justify-content:center}
.kf-title{font-size:12px;font-weight:700;color:var(--brand2);margin-bottom:8px;padding-left:8px;border-left:3px solid var(--brand2);line-height:1}
.kf-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-content:center}
.kf-item{display:flex;gap:10px;padding:10px 12px;background:#fff;border:1px solid var(--line);border-radius:6px;border-left:3px solid var(--brand2)}
.kf-num{font-family:"JetBrains Mono",Consolas,monospace;font-size:20px;font-weight:800;color:var(--brand2);line-height:1;flex-shrink:0;min-width:32px}
.kf-content{flex:1;min-width:0}
.kf-text{font-size:11px;color:var(--ink);font-weight:600;line-height:1.5}
.kf-implication{font-size:10px;color:var(--muted);margin-top:4px;line-height:1.4;padding-top:4px;border-top:1px dashed var(--line)}

/* ====== 访谈纪要 interview ====== */
.iv-header{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-shrink:0}
.iv-role-badge{background:var(--brand);color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:2px;letter-spacing:1px}
.iv-date{font-size:10px;color:var(--muted);font-family:"JetBrains Mono",Consolas,monospace}
.iv-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1;min-height:0}
.iv-col{display:flex;flex-direction:column;min-height:0;overflow:hidden}
.iv-sec-title{font-size:11px;font-weight:700;color:var(--ink);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.iv-st-dot{width:8px;height:8px;border-radius:2px;display:inline-block}
.iv-st-dot.red{background:var(--danger)}
.iv-st-dot.orange{background:var(--accent)}
.iv-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.iv-list li{font-size:11px;line-height:1.55;color:var(--ink2);display:flex;gap:8px;align-items:flex-start}
.iv-bullet{width:6px;height:6px;border-radius:50%;background:var(--brand);flex-shrink:0;margin-top:5px}
.iv-bullet.pain{background:var(--danger)}
.iv-quote{padding:10px 12px;background:#fff;border-left:3px solid var(--brand2);margin-bottom:8px;position:relative;border-radius:0 4px 4px 0;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.iv-q-mark{position:absolute;top:-8px;left:6px;font-family:Georgia,serif;font-size:32px;color:var(--brand2);line-height:1;opacity:.3}
.iv-q-text{font-size:11px;color:var(--ink2);line-height:1.6;font-style:italic;padding-left:12px}
.iv-q-src{font-size:9px;color:var(--muted);text-align:right;margin-top:4px;font-family:"JetBrains Mono",Consolas,monospace}
.iv-signals{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;padding-top:10px;border-top:1px dashed var(--line);flex-shrink:0}
.iv-signal{display:inline-flex;align-items:center;gap:4px;font-size:10px;color:var(--ink2)}
.iv-sig-dot{font-size:10px}

/* ====== 矩阵表格 matrix ====== */
.mx-wrap{flex:1;display:flex;flex-direction:column;min-height:0;border:1px solid var(--line);border-radius:4px;overflow:hidden}
.mx-table{width:100%;border-collapse:collapse;font-size:11px}
.mx-table th{background:var(--brand);color:#fff;font-weight:600;padding:10px 12px;text-align:left;font-size:11px;letter-spacing:.5px}
.mx-table td{padding:10px 12px;border-bottom:1px solid var(--line);border-right:1px solid var(--line);vertical-align:top;line-height:1.55;color:var(--ink2)}
.mx-table td:last-child{border-right:none}
.mx-table tr:last-child td{border-bottom:none}
.mx-table tr:nth-child(even) td{background:var(--bg2)}

/* ====== 风险矩阵 risk ====== */
.risk-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;flex:1;min-height:0;align-content:start}
.risk-card{border-radius:6px;padding:12px 14px;border-left:4px solid var(--line);background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.05)}
.risk-card.risk-high{border-left-color:var(--danger);background:linear-gradient(135deg,#fff5f5,#fff)}
.risk-card.risk-mid{border-left-color:var(--accent);background:linear-gradient(135deg,#fff8f0,#fff)}
.risk-card.risk-low{border-left-color:var(--ok)}
.risk-head{display:flex;gap:8px;align-items:center;margin-bottom:8px;font-family:"JetBrains Mono",Consolas,monospace;font-size:9.5px}
.risk-level{padding:2px 8px;border-radius:2px;background:var(--danger);color:#fff;font-weight:700;font-size:10px}
.risk-card.risk-mid .risk-level{background:var(--accent)}
.risk-card.risk-low .risk-level{background:var(--ok)}
.risk-prob,.risk-impact{color:var(--muted)}
.risk-title{font-size:12px;font-weight:700;color:var(--ink);margin-bottom:6px}
.risk-desc{font-size:10.5px;color:var(--ink2);line-height:1.5;margin-bottom:6px}
.risk-mit,.risk-owner{font-size:10px;color:var(--ink2);padding-top:6px;border-top:1px dashed var(--line);margin-top:4px}
.risk-mit b,.risk-owner b{color:var(--brand);font-weight:600}

/* ====== 组织架构 org ====== */
.org-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:0;min-height:0;padding:10px 0}
.org-top,.org-mid{display:flex;justify-content:center}
.org-connector{width:2px;height:20px;background:var(--line);position:relative}
.org-bottom{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;width:100%;margin-top:0}
.org-box{padding:12px 18px;border-radius:6px;text-align:center;min-width:220px;position:relative}
.org-top-box{background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fff;box-shadow:0 4px 14px var(--hl-shadow)}
.org-top-box .org-box-title{color:#fff}
.org-top-box .org-box-sub,.org-top-box .org-box-resp{color:rgba(255,255,255,.8)}
.org-mid-box{background:#fff;border:2px solid var(--brand2);box-shadow:0 2px 8px var(--hl-shadow-soft)}
.org-box-title{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:4px}
.org-box-sub{font-size:10px;color:var(--muted);font-family:"JetBrains Mono",Consolas,monospace;margin-bottom:4px}
.org-box-resp{font-size:9.5px;color:var(--ink2);line-height:1.4}
.org-team{background:#fff;border:1px solid var(--line);border-radius:6px;padding:10px;text-align:center}
.org-team-name{font-size:12px;font-weight:700;color:var(--brand);margin-bottom:4px}
.org-team-members{font-size:9.5px;color:var(--muted);font-family:"JetBrains Mono",Consolas,monospace;margin-bottom:5px}
.org-team-resp{font-size:10px;color:var(--ink2);line-height:1.4}

/* ====== 预算表 budget ====== */
.bd-wrap{flex:1;display:flex;flex-direction:column;min-height:0}
.bd-table{width:100%;border-collapse:collapse;font-size:11px}
.bd-table th{background:var(--brand);color:#fff;font-weight:600;padding:8px 10px;text-align:left;font-size:10.5px}
.bd-table td{padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}
.bd-cat{color:var(--ink);font-weight:600;width:15%}
.bd-name{width:25%;font-weight:600;color:var(--ink)}
.bd-desc{width:35%;color:var(--ink2);line-height:1.5;font-size:10.5px}
.bd-amount{width:15%;text-align:right;font-family:"JetBrains Mono",Consolas,monospace;font-weight:700;color:var(--brand);font-size:13px}
.bd-amount.bd-total{font-size:15px}
.bd-unit{font-size:10px;font-weight:400;margin-left:2px}
.bd-phase{width:10%;font-size:10px;color:var(--muted)}
.bd-table tfoot td{background:var(--card-hl-bg);font-weight:700}
.bd-roi{margin-top:10px;padding:8px 12px;background:var(--ok-bg);color:var(--ok-text);border-radius:4px;font-size:10.5px;line-height:1.5;border-left:3px solid var(--ok)}

/* ====== MoSCoW范围矩阵 ====== */
.moscow-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:10px;flex:1;min-height:0}
.moscow-col{border-radius:6px;padding:12px;display:flex;flex-direction:column;border:1px solid var(--line);overflow:hidden}
.moscow-must{background:linear-gradient(135deg,#fff5f5,#fff);border-color:var(--danger);border-left:4px solid var(--danger)}
.moscow-should{background:linear-gradient(135deg,#fff8f0,#fff);border-left:4px solid var(--accent)}
.moscow-could{background:linear-gradient(135deg,#fefce8,#fff);border-left:4px solid var(--warn)}
.moscow-wont{background:var(--bg2);border-left:4px solid var(--muted);color:var(--muted)}
.moscow-head{display:flex;align-items:baseline;gap:8px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--line)}
.moscow-label{font-family:"JetBrains Mono",Consolas,monospace;font-size:12px;font-weight:700;color:var(--ink)}
.moscow-must .moscow-label{color:var(--danger)}
.moscow-sub{font-size:10px;color:var(--muted)}
.moscow-body{display:flex;flex-direction:column;gap:5px;overflow-y:auto}
.moscow-item{font-size:10.5px;color:var(--ink2);line-height:1.5;display:flex;gap:6px;align-items:flex-start}
.moscow-dot{width:5px;height:5px;border-radius:50%;background:var(--brand);flex-shrink:0;margin-top:5px}
.moscow-wont .moscow-dot{background:var(--muted)}

/* ====== 场景卡 scenario ====== */
.sc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;flex:1;min-height:0;align-content:start}
.sc-card{background:#fff;border:1px solid var(--line);border-radius:6px;padding:10px 12px;display:flex;flex-direction:column;gap:6px;position:relative;border-top:3px solid var(--brand2)}
.sc-prio-p0{border-top-color:var(--danger)}
.sc-prio-p1{border-top-color:var(--accent)}
.sc-prio-p2{border-top-color:var(--warn)}
.sc-head{display:flex;align-items:center;gap:6px}
.sc-idx{font-family:"JetBrains Mono",Consolas,monospace;font-size:10px;color:var(--muted)}
.sc-name{font-size:12px;font-weight:700;color:var(--ink);flex:1;line-height:1.3}
.sc-prio{font-family:"JetBrains Mono",Consolas,monospace;font-size:9px;font-weight:700;padding:1px 6px;border-radius:2px;background:var(--warn);color:#fff}
.sc-prio-p0{background:var(--danger)}
.sc-prio-p1{background:var(--accent)}
.sc-prio-p2{background:var(--warn);color:var(--ink)}
.sc-desc{font-size:10px;color:var(--ink2);line-height:1.5;flex:1}
.sc-meta{display:flex;flex-wrap:wrap;gap:6px;padding-top:6px;border-top:1px dashed var(--line)}
.sc-meta-item{font-size:9px;color:var(--muted)}
.sc-meta-item b{color:var(--ink);font-weight:600;margin-right:3px}

/* ====== 优先级2x2矩阵 ====== */
.pm-wrap{flex:1;display:flex;flex-direction:column;min-height:0;padding:0 20px 20px;position:relative}
.pm-y-label{position:absolute;left:-4px;top:50%;transform:rotate(-90deg) translateX(50%);transform-origin:left center;font-size:10px;color:var(--muted);font-family:"JetBrains Mono",Consolas,monospace;letter-spacing:1px;white-space:nowrap}
.pm-grid{flex:1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:3px;min-height:0}
.pm-quad{padding:10px 14px;display:flex;flex-direction:column;border-radius:4px}
.pm-q1{background:linear-gradient(135deg,var(--ok-bg),#fff);border:1px solid var(--ok)}
.pm-q2{background:linear-gradient(135deg,#fff5f5,#fff);border:1px solid var(--danger)}
.pm-q3{background:var(--bg2);border:1px solid var(--line)}
.pm-q4{background:linear-gradient(135deg,#fffbeb,#fff);border:1px solid var(--warn)}
.pm-q-label{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}
.pm-q-label b{font-size:12px;color:var(--ink)}
.pm-q-label span{font-size:10px;color:var(--muted)}
.pm-q-items{display:flex;flex-direction:column;gap:4px;flex:1;overflow-y:auto}
.pm-item{font-size:10.5px;color:var(--ink2);padding:4px 8px;background:rgba(255,255,255,.8);border-radius:3px;line-height:1.4}
.pm-x-label{text-align:center;font-size:10px;color:var(--muted);font-family:"JetBrains Mono",Consolas,monospace;letter-spacing:1px;margin-top:4px}

/* ====== KPI目标卡 ====== */
.kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;flex:1;min-height:0;align-content:center}
.kpi-card{padding:16px;background:#fff;border:1px solid var(--line);border-radius:8px;display:flex;flex-direction:column;gap:8px;border-top:4px solid var(--brand2)}
.kpi-label{font-size:12px;font-weight:700;color:var(--ink)}
.kpi-values{display:flex;align-items:center;gap:8px;justify-content:space-between}
.kpi-base,.kpi-target{flex:1;text-align:center}
.kpi-v-label{display:block;font-size:9.5px;color:var(--muted);font-family:"JetBrains Mono",Consolas,monospace;margin-bottom:2px}
.kpi-v-num{font-size:22px;font-weight:800;color:var(--ink);font-family:"JetBrains Mono",Consolas,monospace}
.kpi-v-num small{font-size:11px;font-weight:500;color:var(--muted);margin-left:2px}
.kpi-base .kpi-v-num{color:var(--muted)}
.kpi-target .kpi-v-num{color:var(--brand2);font-size:26px}
.kpi-arrow{font-size:18px;color:var(--accent);font-weight:700}
.kpi-delta{font-size:10px;color:var(--ok);text-align:center;font-weight:600;padding:3px 8px;background:var(--ok-bg);border-radius:3px;align-self:center}
.kpi-measure{font-size:9.5px;color:var(--muted);text-align:center}

/* ====== 甘特图 ====== */
.gantt-wrap{flex:1;display:flex;flex-direction:column;min-height:0}
.gantt-header,.gantt-row{display:flex;align-items:stretch;gap:0}
.gantt-label{width:120px;flex-shrink:0;font-size:10.5px;font-weight:600;color:var(--ink);padding:8px 8px 8px 0;display:flex;align-items:center;border-bottom:1px solid var(--line)}
.gantt-header .gantt-label{border-bottom:2px solid var(--ink)}
.gantt-track{flex:1;position:relative;height:44px;border-bottom:1px solid var(--line);border-left:1px solid var(--line)}
.gantt-header .gantt-track{height:22px;border-bottom:2px solid var(--ink)}
.gantt-tick{position:absolute;top:0;font-size:9px;color:var(--muted);font-family:"JetBrains Mono",Consolas,monospace;transform:translateX(-50%);padding-left:4px;border-left:1px solid var(--line);height:100%;display:flex;align-items:center;line-height:1}
.gantt-bar{position:absolute;top:10px;height:24px;background:linear-gradient(90deg,var(--brand2),var(--brand3));border-radius:3px;display:flex;align-items:center;padding:0 8px;box-shadow:0 1px 4px var(--hl-shadow-soft);overflow:hidden}
.gantt-bar-label{font-size:9px;color:#fff;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gantt-milestone{position:absolute;top:-12px;left:8px;font-size:8.5px;color:var(--brand);background:#fff;padding:1px 4px;border-radius:2px;border:1px solid var(--brand2);white-space:nowrap}

/* ====== 章节分隔页 divider ====== */
.divider{background:linear-gradient(135deg,#fff,#fafafa);justify-content:center;align-items:center;padding:60px}
.divider-band{position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,var(--brand),var(--brand2),var(--brand3))}
.divider-num{font-family:"JetBrains Mono",Consolas,monospace;font-size:80px;font-weight:800;color:var(--brand2);opacity:.2;line-height:1}
.divider-title{font-size:40px;font-weight:800;color:var(--ink);margin-top:10px;letter-spacing:-.5px}
.divider-sub{font-size:16px;color:var(--muted);margin-top:12px}
.divider-points{display:flex;flex-direction:column;gap:8px;margin-top:30px;max-width:700px}
.divider-pt{font-size:13px;color:var(--ink2);padding:8px 14px;background:#fff;border-left:3px solid var(--brand2);border-radius:0 4px 4px 0;box-shadow:0 1px 3px rgba(0,0,0,.05)}

/* ====== 总结/要点 summary ====== */
.sum-top{font-size:13px;color:var(--ink);font-weight:600;padding:10px 14px;background:var(--card-hl-bg);border-left:4px solid var(--brand2);border-radius:0 4px 4px 0;margin-bottom:14px;line-height:1.6}
.sum-list{display:flex;flex-direction:column;gap:10px;flex:1;min-height:0}
.sum-row{display:flex;gap:14px;padding:10px 14px;background:#fff;border:1px solid var(--line);border-radius:6px}
.sum-num{font-family:"JetBrains Mono",Consolas,monospace;font-size:18px;font-weight:800;color:var(--brand2);min-width:36px;line-height:1}
.sum-text{flex:1;font-size:11.5px;color:var(--ink);font-weight:600;line-height:1.5}
.sum-sub{font-size:10px;color:var(--ink2);font-weight:400;margin-top:4px;line-height:1.5}

/* ====== 签字页 signature ====== */
.sig-preamble{font-size:11px;color:var(--ink2);line-height:1.6;margin-bottom:20px;padding:12px;background:var(--card-hl-bg);border-left:3px solid var(--brand2);border-radius:0 4px 4px 0}
.sig-table{width:100%;border-collapse:collapse;margin-top:10px}
.sig-table th{background:var(--brand);color:#fff;font-weight:600;padding:12px 16px;text-align:left;font-size:11px}
.sig-table td{padding:24px 16px;border-bottom:1px solid var(--line);font-size:12px;vertical-align:bottom}
.sig-role{font-weight:600;color:var(--ink);width:35%}
.sig-name,.sig-date{width:30%;position:relative}
.sig-line{position:absolute;bottom:0;left:0;right:10px;border-bottom:1px solid var(--ink);height:28px}

/* ====== 数据表 datatable ====== */
.dt-wrap{flex:1;overflow:auto;border:1px solid var(--line);border-radius:4px}
.dt-table{width:100%;border-collapse:collapse;font-size:10.5px}
.dt-table th{background:var(--brand);color:#fff;font-weight:600;padding:8px 10px;text-align:left;font-size:10px;position:sticky;top:0}
.dt-table td{padding:7px 10px;border-bottom:1px solid var(--line);color:var(--ink2);line-height:1.4}
.dt-table tr:nth-child(even) td{background:var(--bg2)}
.dt-table td.dt-hl{color:var(--brand2);font-weight:600}
.dt-note{font-size:9.5px;color:var(--muted);margin-top:8px}

/* ====== 兜底内容页 fallback ====== */
.fallback-list{flex:1;display:flex;flex-direction:column;gap:10px;overflow-y:auto}
.fallback-item{display:flex;gap:12px;padding:10px 14px;background:#fff;border:1px solid var(--line);border-radius:6px;border-left:4px solid var(--brand2)}
.fb-dot{width:8px;height:8px;border-radius:50%;background:var(--brand2);flex-shrink:0;margin-top:6px}
.fb-text{font-size:11.5px;color:var(--ink);line-height:1.6;font-weight:500}
.fb-sub{font-size:10.5px;color:var(--muted);margin-top:4px;line-height:1.5}
.fallback-text{flex:1;font-size:12px;color:var(--ink2);line-height:1.8;overflow-y:auto}
.fallback-text p{margin-bottom:12px}

</style>
</head>
<body class="theme-${theme}">
<div id="stage"><div id="deck">
${slides.map((s, i) => i === 0 ? s.replace('class="slide', 'class="slide active') : s).join('\n')}
</div></div>
<div class="hint">← → 翻页 · 点击左右区域翻页 · F11 全屏 · 共 <span id="pgTotal">${slides.length}</span> 页</div>
<div id="navBtn" style="display:flex;gap:12px;position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:9999;background:rgba(255,255,255,0.95);padding:8px 14px;border-radius:24px;box-shadow:0 4px 16px rgba(0,0,0,0.15);backdrop-filter:blur(10px)">
  <button id="prevBtn" style="background:rgba(255,255,255,.9);border:1px solid #cbd5e1;border-radius:6px;padding:8px 16px;font-size:13px;font-weight:600;color:#1e293b;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.1);transition:all 0.2s">← 上一页</button>
  <span id="pgIndicator" style="display:flex;align-items:center;font-family:'JetBrains Mono',Consolas,monospace;font-size:13px;color:#475569;font-weight:700;padding:0 8px">01 / ${String(slides.length).padStart(2,'0')}</span>
  <button id="nextBtn" style="background:linear-gradient(135deg,#8B0000,#C7000B);border:none;border-radius:6px;padding:8px 16px;font-size:13px;font-weight:600;color:#fff;cursor:pointer;box-shadow:0 2px 8px rgba(139,0,0,.3);transition:all 0.2s">下一页 →</button>
</div>
<script>
(function(){
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  var deck=document.getElementById('deck');
  var total=slides.length;
  var pgIndicator=document.getElementById('pgIndicator');
  var prevBtn=document.getElementById('prevBtn');
  var nextBtn=document.getElementById('nextBtn');
  function go(n){
    n=Math.max(0,Math.min(total-1,n));
    slides.forEach(function(s,i){s.classList.toggle('active',i===n)});
    slides.forEach(function(s){
      var old=s.querySelector('.pg-num');
      if(old)old.remove();
    });
    var cur=slides[n];
    var pg=document.createElement('div');
    pg.className='pg-num';
    pg.style.cssText='position:absolute;bottom:4px;right:56px;font-family:"JetBrains Mono",Consolas,monospace;font-size:9.5px;color:#64748b;letter-spacing:1px';
    pg.innerHTML='<b style="color:var(--brand2)">'+String(n+1).padStart(2,'0')+'</b> / '+String(total).padStart(2,'0');
    cur.appendChild(pg);
    pgIndicator.textContent=String(n+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');
    prevBtn.disabled=n===0;
    nextBtn.disabled=n===total-1;
    prevBtn.style.opacity=n===0?'0.4':'1';
    nextBtn.style.opacity=n===total-1?'0.4':'1';
  }
  function fit(){
    var s=Math.min(window.innerWidth/1280,window.innerHeight/720)*0.92;
    deck.style.transform='scale('+s+')';
    deck.style.transformOrigin='center center';
  }
  window.addEventListener('resize',fit);
  prevBtn.addEventListener('click',function(){var i=slides.findIndex(function(s){return s.classList.contains('active')});go(i-1)});
  nextBtn.addEventListener('click',function(){var i=slides.findIndex(function(s){return s.classList.contains('active')});go(i+1)});
  document.addEventListener('keydown',function(e){
    if(['ArrowRight','ArrowDown','PageDown',' '].indexOf(e.key)>=0){e.preventDefault();var i=slides.findIndex(function(s){return s.classList.contains('active')});go(i+1)}
    if(['ArrowLeft','ArrowUp','PageUp'].indexOf(e.key)>=0){e.preventDefault();var i=slides.findIndex(function(s){return s.classList.contains('active')});go(i-1)}
    if(e.key==='Home')go(0);
    if(e.key==='End')go(total-1);
  });
  document.addEventListener('click',function(e){
    if(e.target.closest('#deck')||e.target===document.body){
      var i=slides.findIndex(function(s){return s.classList.contains('active')});
      if(e.clientX>window.innerWidth*0.66)go(i+1);
      else if(e.clientX<window.innerWidth*0.34)go(i-1);
    }
  });
  fit();go(0);
})();
</script>
</body>
</html>`;
}

// 为旧版本的 index.html 添加导航按钮支持
export function upgradeNavigation(html) {
  if (!html || typeof html !== 'string') return html;

  const hasNav = html.includes('id="navBtn"');

  const totalMatch = html.match(/class="slide/g);
  const total = totalMatch ? totalMatch.length : 1;
  const pgStr = String(total).padStart(2, '0');

  const navHtml = `<div id="navBtn" style="display:flex;gap:12px;position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:9999;background:rgba(255,255,255,0.95);padding:8px 14px;border-radius:24px;box-shadow:0 4px 16px rgba(0,0,0,0.15);backdrop-filter:blur(10px)">
  <button id="prevBtn" style="background:rgba(255,255,255,.9);border:1px solid #cbd5e1;border-radius:6px;padding:8px 16px;font-size:13px;font-weight:600;color:#1e293b;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.1);transition:all 0.2s">← 上一页</button>
  <span id="pgIndicator" style="display:flex;align-items:center;font-family:'JetBrains Mono',Consolas,monospace;font-size:13px;color:#475569;font-weight:700;padding:0 8px">01 / ${pgStr}</span>
  <button id="nextBtn" style="background:linear-gradient(135deg,#8B0000,#C7000B);border:none;border-radius:6px;padding:8px 16px;font-size:13px;font-weight:600;color:#fff;cursor:pointer;box-shadow:0 2px 8px rgba(139,0,0,.3);transition:all 0.2s">下一页 →</button>
</div>
<script>
(function(){
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  var deck=document.getElementById('deck');
  var total=slides.length;
  var pgIndicator=document.getElementById('pgIndicator');
  var prevBtn=document.getElementById('prevBtn');
  var nextBtn=document.getElementById('nextBtn');
  function go(n){
    n=Math.max(0,Math.min(total-1,n));
    slides.forEach(function(s,i){s.classList.toggle('active',i===n)});
    slides.forEach(function(s){
      var old=s.querySelector('.pg-num');
      if(old)old.remove();
    });
    var cur=slides[n];
    var pg=document.createElement('div');
    pg.className='pg-num';
    pg.style.cssText='position:absolute;bottom:4px;right:56px;font-family:"JetBrains Mono",Consolas,monospace;font-size:9.5px;color:#64748b;letter-spacing:1px';
    pg.innerHTML='<b style="color:var(--brand2)">'+String(n+1).padStart(2,'0')+'</b> / '+String(total).padStart(2,'0');
    cur.appendChild(pg);
    pgIndicator.textContent=String(n+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');
    prevBtn.disabled=n===0;
    nextBtn.disabled=n===total-1;
    prevBtn.style.opacity=n===0?'0.4':'1';
    nextBtn.style.opacity=n===total-1?'0.4':'1';
  }
  function fit(){
    var s=Math.min(window.innerWidth/1280,window.innerHeight/720)*0.96;
    deck.style.transform='scale('+s+')';
    deck.style.transformOrigin='center center';
  }
  window.addEventListener('resize',fit);
  prevBtn.addEventListener('click',function(){var i=slides.findIndex(function(s){return s.classList.contains('active')});go(i-1)});
  nextBtn.addEventListener('click',function(){var i=slides.findIndex(function(s){return s.classList.contains('active')});go(i+1)});
  document.addEventListener('keydown',function(e){
    if(['ArrowRight','ArrowDown','PageDown',' '].indexOf(e.key)>=0){e.preventDefault();var i=slides.findIndex(function(s){return s.classList.contains('active')});go(i+1)}
    if(['ArrowLeft','ArrowUp','PageUp'].indexOf(e.key)>=0){e.preventDefault();var i=slides.findIndex(function(s){return s.classList.contains('active')});go(i-1)}
    if(e.key==='Home')go(0);
    if(e.key==='End')go(total-1);
  });
  document.addEventListener('click',function(e){
    if(e.target.closest('#deck')||e.target===document.body){
      var i=slides.findIndex(function(s){return s.classList.contains('active')});
      if(e.clientX>window.innerWidth*0.66)go(i+1);
      else if(e.clientX<window.innerWidth*0.34)go(i-1);
    }
  });
  fit();go(0);
})();
</script>`;

  let upgraded = html;

  if (!hasNav) {
    // 移除旧的提示和脚本
    upgraded = upgraded
      .replace(/<div class="hint">.*?<\/div>\s*/s, '');

    const scriptMatch = upgraded.match(/<script>\s*\(function\(\)\{[\s\S]*?<\/script>\s*<\/body>/);
    if (scriptMatch) {
      upgraded = upgraded.replace(scriptMatch[0], '</body>');
    } else {
      upgraded = upgraded.replace(/<script>(?:(?!<\/script>)[\s\S])*<\/script>\s*<\/body>/, '</body>');
    }

    // 在 </body> 前插入新的导航
    upgraded = upgraded.replace('</body>', `${navHtml}\n</body>`);
  }

  // 修复 active class：先清除所有 active（class 内或独立属性），再只给第一个 slide 添加
  upgraded = upgraded.replace(/ class="slide active/g, ' class="slide');
  upgraded = upgraded.replace(/ active>/g, '>');
  upgraded = upgraded.replace(
    /<section class="slide([^"]*)"/,
    '<section class="slide active$1"'
  );

  return upgraded;
}
