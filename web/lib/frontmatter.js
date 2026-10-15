// 极简 YAML frontmatter 解析
// 仅覆盖本项目 AGENT.md / SKILL.md 用到的扁平字段、行内列表与简单数组

export function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const fm = m[1];
  const body = m[2];
  const meta = {};
  let listKey = null;

  for (const line of fm.split(/\r?\n/)) {
    // 列表项（含嵌套结构的行，按原始字符串收集）
    if (/^\s*-\s+/.test(line)) {
      if (listKey && Array.isArray(meta[listKey])) {
        meta[listKey].push(line.replace(/^\s*-\s+/, '').trim());
      }
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      const val = kv[2].trim();
      if (val === '') {
        meta[key] = [];
        listKey = key;
      } else {
        listKey = null;
        let v = val;
        if (v.startsWith('[') && v.endsWith(']')) {
          v = v
            .slice(1, -1)
            .split(',')
            .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
            .filter(Boolean);
        } else {
          v = v.replace(/^['"]|['"]$/g, '');
        }
        meta[key] = v;
      }
    } else if (line.trim() !== '') {
      // 非列表且非键值 → 视为嵌套结构结束
      listKey = null;
    }
  }

  return { meta, body };
}
