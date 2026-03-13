import { type RouteRecordRaw } from 'vue-router';
import router from '@/router';
import { useUserStore } from '@/store/user';
import NProgress from '@/utils/nprogress';
import { useTitle } from '@/hooks/useTitle';
import { usePermissionStore } from '@/store/permission';

/** 免登录白名单（匹配路由 path） */
const whiteListByPath: string[] = ['/login'];

NProgress.configure({ showSpinner: false });
const { setTitle } = useTitle();

router.beforeEach(async (to, from) => {
  NProgress.start();
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  if (!userStore.isLogin) {
    // 如果在免登录的白名单中，则直接进入
    if (whiteListByPath.includes(to.path)) return true;
    // 其他没有访问权限的页面将被重定向到登录页面
    return '/login';
  }
  if (to.path === '/login') return { ...from };

  if (permissionStore.dynamicRoutesLoaded) return true;
  try {
    await permissionStore.generatePermission();
    [
      ...permissionStore.dynamicRoutes,
      {
        path: '/:pathMatch(.*)',
        name: 'NotFound',
        redirect: '/error/404',
        meta: {
          hideInMenu: true,
          dynamic: true
        }
      }
    ].forEach((route: RouteRecordRaw) => router.addRoute('/', route));
    return { ...to, replace: true };
  } catch (error) {
    userStore.resetToken();
    userStore.resetUserInfo();
    return {
      path: '/login',
      query: { redirect: encodeURIComponent(to.fullPath) }
    };
  }
});

router.afterEach((to) => {
  setTitle(to.meta.title);
  NProgress.done();
});
