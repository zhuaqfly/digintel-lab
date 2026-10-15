import { getProvider } from '@/lib/providers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// 大模型对话网关：统一代理 OpenAI 兼容接口，SSE 转 NDJSON 流式输出
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: '请求体格式错误' }, { status: 400 });
  }

  const { providerId, model, messages = [], systemPrompt, temperature } = body;
  const provider = getProvider(providerId);
  if (!provider) {
    return Response.json(
      {
        error: `模型服务不可用：「${providerId || ''}」未配置或不存在。请在 web/.env.local 中配置对应 API Key 并重启服务`,
      },
      { status: 400 }
    );
  }
  if (!model) return Response.json({ error: '缺少模型名称' }, { status: 400 });

  const msgs = [];
  if (systemPrompt && String(systemPrompt).trim()) {
    msgs.push({ role: 'system', content: String(systemPrompt) });
  }
  for (const m of Array.isArray(messages) ? messages : []) {
    if (
      m &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      m.content.trim()
    ) {
      msgs.push({ role: m.role, content: m.content });
    }
  }
  if (msgs.length === 0 || msgs[msgs.length - 1].role !== 'user') {
    return Response.json({ error: '对话内容为空' }, { status: 400 });
  }

  let upstream;
  try {
    upstream = await fetch(`${provider.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: msgs,
        stream: true,
        stream_options: { include_usage: true },
        temperature: typeof temperature === 'number' ? temperature : 0.7,
        max_tokens: 8192,
      }),
    });
  } catch (e) {
    return Response.json({ error: '无法连接模型服务：' + (e.message || e) }, { status: 502 });
  }

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '');
    let hint = text.slice(0, 500);
    try {
      const j = JSON.parse(text);
      hint = (j.error && j.error.message) || j.message || hint;
    } catch {}
    return Response.json(
      { error: `模型服务返回错误 ${upstream.status}：${hint}` },
      { status: 502 }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      const send = (obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));

      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split('\n');
          buf = lines.pop();
          for (const raw of lines) {
            const line = raw.trim();
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === '[DONE]') continue;
            try {
              const json = JSON.parse(payload);
              const choice = json.choices && json.choices[0];
              const delta = choice && choice.delta;
              if (delta) {
                if (delta.reasoning_content) {
                  send({ type: 'reasoning', content: delta.reasoning_content });
                }
                if (delta.content) {
                  send({ type: 'token', content: delta.content });
                }
              }
              // 检测截断：finish_reason === "length" 表示输出达到max_tokens被截断
              if (choice && choice.finish_reason === 'length') {
                send({ type: 'warning', message: '输出已达最大长度被截断，可发送"继续"让AI接着输出' });
              }
            } catch {}
          }
        }
        send({ type: 'done' });
      } catch (e) {
        send({ type: 'error', message: '生成中断：' + (e.message || e) });
      } finally {
        try {
          controller.close();
        } catch {}
      }
    },
    cancel() {
      try {
        upstream.body.cancel();
      } catch {}
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
