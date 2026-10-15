import fs from 'fs/promises';
import path from 'path';
import { PROJECTS_DIR, OUTPUT_DIR } from '@/lib/repo';
import { STAGES } from '@/lib/stages';

// 咨询项目管理：基于文件系统存储（projects/{id}.json）

// 写锁队列：按项目ID串行化写操作，防止并发写入导致文件损坏
const writeQueues = new Map();
function withWriteLock(id, fn) {
  const key = id || '_global';
  const prev = writeQueues.get(key) || Promise.resolve();
  const next = prev.then(fn, fn).finally(() => {
    // 队列清空后释放引用
    if (writeQueues.get(key) === next) writeQueues.delete(key);
  });
  writeQueues.set(key, next);
  return next;
}

// 原子写入：先写临时文件再 rename，防止写入中途崩溃导致文件损坏
async function atomicWrite(file, data) {
  const tmp = file + '.tmp.' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  await fs.writeFile(tmp, data, 'utf8');
  await fs.rename(tmp, file);
}

function newId() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function newLogId() {
  return 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

export function createStageLog(type, data = {}) {
  return {
    id: newLogId(),
    type,
    ...data,
    createdAt: new Date().toISOString(),
  };
}

function defaultStages() {
  return STAGES.map((s, i) => ({
    key: s.key,
    status: i === 0 ? 'active' : 'pending',
    notes: '',
    completedAt: null,
    conversations: [],
    timeline: [],
  }));
}

function projectFile(id) {
  // id 仅允许字母数字与连字符，防目录穿越
  if (!/^[\w-]+$/.test(id)) return null;
  return path.join(PROJECTS_DIR, `${id}.json`);
}

export async function listProjects() {
  try {
    const files = await fs.readdir(PROJECTS_DIR);
    const projects = [];
    for (const f of files) {
      if (!f.endsWith('.json')) continue;
      try {
        const raw = await fs.readFile(path.join(PROJECTS_DIR, f), 'utf8');
        projects.push(JSON.parse(raw));
      } catch {}
    }
    projects.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    return projects;
  } catch {
    return [];
  }
}

export async function getProject(id) {
  const file = projectFile(id);
  if (!file) return null;
  try {
    const raw = await fs.readFile(file, 'utf8');
    const project = JSON.parse(raw);
    // 数据迁移：为旧项目添加缺失字段
    let migrated = false;
    if (!project.deliverables) {
      project.deliverables = [];
      migrated = true;
    }
    if (Array.isArray(project.stages)) {
      for (const s of project.stages) {
        if (!s.conversations) {
          s.conversations = [];
          migrated = true;
        }
        if (!s.timeline) {
          s.timeline = [];
          migrated = true;
        }
        // 为active阶段添加初始启动日志（如果timeline为空）
        if (s.status === 'active' && s.timeline.length === 0) {
          s.timeline.push({
            id: 'l' + Date.now().toString(36),
            type: 'stage_start',
            title: '阶段进行中',
            desc: `「${s.key}」阶段正在进行中`,
            createdAt: project.updatedAt || project.createdAt || new Date().toISOString(),
          });
          migrated = true;
        }
      }
    }
    if (migrated) {
      await withWriteLock(id, () => atomicWrite(file, JSON.stringify(project, null, 2)));
    }
    return project;
  } catch {
    return null;
  }
}

export async function createProject(input) {
  const name = String(input.name || '').trim();
  const client = String(input.client || '').trim();
  if (!name) throw new Error('项目名称不能为空');
  if (!client) throw new Error('客户企业名称不能为空');

  await fs.mkdir(PROJECTS_DIR, { recursive: true });
  const now = new Date().toISOString();
  const stages = defaultStages();
  // 给初始阶段（第一阶段）添加项目创建和阶段启动日志
  if (stages[0]) {
    stages[0].timeline.push(createStageLog('stage_start', {
      title: '项目启动',
      desc: `创建项目「${name}」，进入「${stages[0].key}」阶段`,
    }));
  }
  const project = {
    id: newId(),
    name,
    client,
    industry: String(input.industry || '').trim(),
    description: String(input.description || '').trim(),
    status: 'active',
    currentStage: 1,
    stages,
    companyProfile: {
      industry: String(input.industry || '').trim(),
      revenue: '',
      employees: '',
      systems: '',
      dataStatus: '',
      painPoints: String(input.painPoints || '').trim(),
    },
    createdAt: now,
    updatedAt: now,
  };
  await withWriteLock(project.id, () =>
    atomicWrite(path.join(PROJECTS_DIR, `${project.id}.json`), JSON.stringify(project, null, 2))
  );
  // 同步创建交付物目录，便于后续 output 关联
  try {
    await fs.mkdir(path.join(OUTPUT_DIR, project.id), { recursive: true });
  } catch {}
  return project;
}

export async function updateProject(id, patch) {
  return withWriteLock(id, async () => {
    const file = projectFile(id);
    if (!file) return null;
    let project;
    try {
      project = JSON.parse(await fs.readFile(file, 'utf8'));
    } catch {
      return null;
    }

  // 基本信息
  for (const k of ['name', 'client', 'industry', 'description', 'status']) {
    if (typeof patch[k] === 'string' && patch[k].trim()) project[k] = patch[k].trim();
  }

  // 交付物列表（整体替换）
  if (Array.isArray(patch.deliverables)) {
    project.deliverables = patch.deliverables;
  }

  // 企业信息
  if (patch.companyProfile && typeof patch.companyProfile === 'object') {
    const cp = { ...project.companyProfile };
    for (const k of Object.keys(cp)) {
      if (typeof patch.companyProfile[k] === 'string') cp[k] = patch.companyProfile[k];
    }
    project.companyProfile = cp;
  }

  // 阶段更新：单个阶段状态/备注，或整体替换
  if (Array.isArray(patch.stages) && patch.stages.length === project.stages.length) {
    project.stages = patch.stages;
  } else if (patch.stageKey && typeof patch.stageKey === 'string') {
    const st = project.stages.find((s) => s.key === patch.stageKey);
    if (st) {
      st.timeline = st.timeline || [];
      const prevStatus = st.status;

      if (patch.stageStatus === 'done') {
        if (prevStatus !== 'done') {
          st.timeline.push(createStageLog('stage_done', {
            title: '阶段完成',
            desc: `标记「${st.key}」阶段为已完成`,
          }));
        }
        st.status = 'done';
        st.completedAt = new Date().toISOString();
        // 自动推进：完成后激活下一阶段
        const idx = project.stages.findIndex((s) => s.key === patch.stageKey);
        if (idx >= 0 && idx < project.stages.length - 1 && project.stages[idx + 1].status === 'pending') {
          project.stages[idx + 1].status = 'active';
          project.stages[idx + 1].timeline = project.stages[idx + 1].timeline || [];
          project.stages[idx + 1].timeline.push(createStageLog('stage_start', {
            title: '阶段启动',
            desc: `上一阶段完成，自动进入新阶段`,
          }));
        }
        project.currentStage = Math.min(idx + 2, project.stages.length);
      } else if (patch.stageStatus === 'active') {
        if (prevStatus !== 'active') {
          st.timeline.push(createStageLog('stage_start', {
            title: '阶段启动',
            desc: `开始进行「${st.key}」阶段工作`,
          }));
        }
        st.status = 'active';
      } else if (patch.stageStatus === 'pending') {
        st.status = 'pending';
        st.completedAt = null;
      }
      if (typeof patch.stageNotes === 'string' && patch.stageNotes !== st.notes) {
        if (patch.stageNotes.trim()) {
          st.timeline.push(createStageLog('note', {
            title: '笔记更新',
            desc: patch.stageNotes.slice(0, 100) + (patch.stageNotes.length > 100 ? '...' : ''),
            content: patch.stageNotes,
          }));
        }
        st.notes = patch.stageNotes;
      }
      project.currentStage = project.stages.findIndex((s) => s.status !== 'done') + 1 || project.stages.length;
    }
  }

  // 添加时间线条目（直接添加）
  if (patch.stageKey && patch.timelineEntry) {
    const st = project.stages.find((s) => s.key === patch.stageKey);
    if (st) {
      st.timeline = st.timeline || [];
      st.timeline.push(createStageLog(patch.timelineEntry.type, patch.timelineEntry.data || {}));
    }
  }

  project.updatedAt = new Date().toISOString();
  await atomicWrite(file, JSON.stringify(project, null, 2));
  return project;
  });
}

export async function deleteProject(id) {
  const file = projectFile(id);
  if (!file) return false;
  try {
    await fs.unlink(file);
    return true;
  } catch {
    return false;
  }
}
