// 模型提供方配置（统一走 OpenAI 兼容接口）
// API Key 从环境变量读取（web/.env.local）

const PROVIDERS = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
  {
    id: 'qwen',
    name: '通义千问',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKeyEnv: 'DASHSCOPE_API_KEY',
    models: ['qwen-max', 'qwen-plus', 'qwen-turbo'],
  },
  {
    id: 'zhipu',
    name: '智谱 GLM',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKeyEnv: 'ZHIPU_API_KEY',
    models: ['glm-4-plus', 'glm-4-air', 'glm-4-flash'],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyEnv: 'OPENAI_API_KEY',
    models: ['gpt-4o', 'gpt-4o-mini'],
  },
];

function customProvider() {
  const baseUrl = process.env.CUSTOM_BASE_URL;
  const models = (process.env.CUSTOM_MODELS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!baseUrl || models.length === 0) return null;
  return {
    id: 'custom',
    name: process.env.CUSTOM_PROVIDER_NAME || '自定义服务',
    baseUrl,
    apiKeyEnv: 'CUSTOM_API_KEY',
    models,
  };
}

export function listProviders() {
  const custom = customProvider();
  const all = custom ? [...PROVIDERS, custom] : PROVIDERS;
  return all.map((p) => ({
    id: p.id,
    name: p.name,
    baseUrl: p.baseUrl,
    apiKeyEnv: p.apiKeyEnv,
    models: p.models,
    configured: Boolean(process.env[p.apiKeyEnv]),
  }));
}

export function getProvider(id) {
  const p = listProviders().find((x) => x.id === id);
  if (!p || !p.configured) return null;
  return { ...p, apiKey: process.env[p.apiKeyEnv] };
}
