export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code as string;
  const state = query.state as string;

  if (!code) {
    return { error: "Missing OAuth code" };
  }
  const config = useRuntimeConfig();
  // Step 1: 用 code 换取 access_token


  const access_token = await cachedAuthToken(event, code, 'access_token');
  if (!access_token) {
    return { error: "Failed to exchange GitHub token" };
  }

  // Step 2: 用 access_token 获取用户信息
  const user:any = await $fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'User-Agent': 'NuxtApp',
    },
  });
   const ghEmail: any = await $fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "User-Agent": "NuxtApp",
    },
  });

  const primaryEmail = ghEmail.find((e: any) => e.primary)?.email;
  // ===== 白名单校验 =====
  const allowedEmails = config.allowedGithubEmails.split(",").map(s => s.trim());

  const isAllowedUser = allowedEmails.includes(primaryEmail);

  if (!isAllowedUser) {
    return sendRedirect(event, "/login");
  }

  // Step 3: 设置 session cookie（仅存 user.id，不存 access_token）
  setCookie(event, 'session_user', access_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7天
  });

  const lang = await getCookie(event, '__client_lang');

  // Step 4: 跳转到你的前端主页
  return sendRedirect(event, `/${lang}/tech`);
});
