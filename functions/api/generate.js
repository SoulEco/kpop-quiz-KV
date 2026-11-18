// functions/api/generate.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const { password } = await request.json();

  // ⚠️ 请修改这里的密码！这是你生成授权码的钥匙
  if (password !== 'my_secret_password_123') {
    return new Response(JSON.stringify({ error: '密码错误' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  // 偶像库
  const idols = [
    { name: 'Irene (裴珠泫) 型', desc: '完美主义的清冷队长', detail: '你外表看似高冷，实则是团队最坚实的后盾。' },
    { name: 'Soyeon (田小娟) 型', desc: '掌控全场的天才制作人', detail: '你拥有极强的目标感和领导力，敢于打破规则。' },
    { name: 'Ningning (宁艺卓) 型', desc: '真实不做作的综艺天才', detail: '你是团队的人间维他命！直觉系行动派。' },
    { name: 'Wendy 型', desc: '温暖包容的团队太阳', detail: '你拥有极强的共情能力，总是优先考虑他人感受。' },
    { name: 'Jennie 型', desc: '慵懒随性的时尚Icon', detail: '你懂得在努力与松弛之间找到完美的平衡。' },
    { name: 'Sakura (宫胁咲良) 型', desc: '极致努力的野心家', detail: '你目标明确，拥有燃烧自己也要达成目标的坚韧。' }
  ];

  // 生成 6 位随机码
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去掉易混淆的 I,1,O,0
  let code = '';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));

  const randomIdol = idols[Math.floor(Math.random() * idols.length)];
  const key = `CODE_${code}`;
  const value = { ...randomIdol, is_used: false, created_at: new Date().toISOString() };

  // 存入 KV，设置过期时间 (可选，这里设为 30 天 = 2592000 秒)
  await env.MY_KV.put(key, JSON.stringify(value), { expirationTtl: 2592000 });

  return new Response(JSON.stringify({ success: true, code: code }), { headers: { 'Content-Type': 'application/json' } });
}