export default defineNuxtRouteMiddleware(async (to) => {
  //  if (import.meta.server) return
  // const { isLoggedIn, fetchUser } = useAuth()

  // // 如果刷新后 user 为空，尝试加载一次
  // if (!isLoggedIn.value) {
  //   await fetchUser()
  // }

  // // 不需要登录的路由放这里
  // const publicRoutes = ['/', '/login', '/unauthorized']

  // if (publicRoutes.includes(to.path)) {
  //   return;
  // }
  // if (!isLoggedIn.value) {
  //   return navigateTo('/login')
  // }
  return;
})
