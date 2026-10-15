import path from 'path';

// digintel-lab 仓库根目录（web/ 的上一级），可用环境变量 DIGINTEL_ROOT 覆盖
export const ROOT = process.env.DIGINTEL_ROOT
  ? path.resolve(process.env.DIGINTEL_ROOT)
  : path.resolve(process.cwd(), '..');

export const AGENTS_DIR = path.join(ROOT, 'agents');
export const SKILLS_DIR = path.join(ROOT, 'skills');
export const OUTPUT_DIR = path.join(ROOT, 'output');
export const PROJECTS_DIR = path.join(ROOT, 'projects');

// 防目录穿越：确保拼接后的绝对路径仍在 base 目录内
export function safeJoin(base, rel) {
  const abs = path.resolve(base, rel);
  const normBase = path.resolve(base);
  if (abs !== normBase && !abs.startsWith(normBase + path.sep)) return null;
  return abs;
}
