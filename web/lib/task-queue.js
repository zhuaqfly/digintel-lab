// 内存任务队列 - 用于异步生成交付物
// 使用 globalThis 避免 Next.js 开发模式下 HMR（热更新）清空模块内存导致任务丢失
const GLOBAL_KEY = '__digintel_task_queue__';

if (!globalThis[GLOBAL_KEY]) {
  globalThis[GLOBAL_KEY] = new Map();
}
const tasks = globalThis[GLOBAL_KEY];

export function createTask(initialData = {}) {
  const id = 'task_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const task = {
    id,
    status: 'pending', // pending → generating → parsing → rendering → saving → done / error
    progress: 0,
    message: '任务已创建',
    result: null,
    error: null,
    createdAt: Date.now(),
    ...initialData,
  };
  tasks.set(id, task);
  return task;
}

export function updateTask(id, updates) {
  const task = tasks.get(id);
  if (!task) return null;
  Object.assign(task, updates, { updatedAt: Date.now() });
  return task;
}

export function getTask(id) {
  return tasks.get(id) || null;
}

export function cleanupOldTasks() {
  const cutoff = Date.now() - 30 * 60 * 1000; // 清理30分钟前的任务
  for (const [id, task] of tasks) {
    if ((task.updatedAt || task.createdAt) < cutoff) {
      tasks.delete(id);
    }
  }
}

// 定期清理（避免重复注册interval）
if (typeof setInterval !== 'undefined' && !globalThis.__digintel_task_cleanup__) {
  globalThis.__digintel_task_cleanup__ = setInterval(cleanupOldTasks, 5 * 60 * 1000);
}
