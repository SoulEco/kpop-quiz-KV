// functions/api/verify.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const { code } = await request.json();
  
  if (!code || code.length !== 6) {
    return new Response(JSON.stringify({ error: '请输入 6 位有效授权码' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const key = `CODE_${code.toUpperCase().trim()}`;
  
  // 直接从 KV 读取，类型设为 json 会自动解析
  const data = await env.MY_KV.get(key, { type: 'json' });

  if (!data) {
    return new Response(JSON.stringify({ error: '授权码不存在或已过期' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  if (data.is_used) {
    return new Response(JSON.stringify({ error: '该授权码已被使用' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  // 标记已使用
  data.is_used = true;
  data.used_at = new Date().toISOString();
  await env.MY_KV.put(key, JSON.stringify(data));

  // 返回结果
  const { is_used, used_at, ...safeData } = data;
  return new Response(JSON.stringify({ success: true, data: safeData }), { headers: { 'Content-Type': 'application/json' } });
}