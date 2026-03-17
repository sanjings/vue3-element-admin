import { requestPermissionMenu, type RequestPermissionMenuResponse } from '@/services/api/user';
import { defineStore } from 'pinia';
import { type RouteRecordRaw } from 'vue-router';
import { constantRoutes } from '@/router/routes';

const modules = import.meta.glob('../views/**/**.vue');

type State = {
  /**
   * 是否加载动态权限
   */
  dynamicRoutesLoaded: boolean;
  /**
   * 动态权限路由
   */
  dynamicRoutes: RouteRecordRaw[];
  /**
   * 按钮/功能权限列表
   */
  perms: string[];
};

const transformRoutes = (routes: RequestPermissionMenuResponse): RouteRecordRaw[] => {
  return routes.map((route) => {
    const tmpRoute: RouteRecordRaw = {
      path: route.redirect!,
      name: route.redirect!,
      meta: {
        title: route.name,
        icon: route.icon,
        hideInMenu: !!route.hideInMenu,
        activeMenu: route.activeMenu,
        keepAlive: !!route.keepAlive,
        dynamic: true
      }
    } as RouteRecordRaw;
    if (route.type === 1) {
      if (route.children?.length && +route.children[0].type! === 1) {
        tmpRoute.redirect = route.children[0].redirect;
      } else {
        const component = modules[`../views${route.redirect}/index.vue`];
        if (component) {
          tmpRoute.component = component;
        } else {
          tmpRoute.component = modules[`../views/error/404/index.vue`];
        }
      }
    }
    if (route.children?.length && +route.children[0].type! === 1) {
      tmpRoute.children = transformRoutes(route.children);
    }
    return tmpRoute;
  });
};

const transformPerms = (routes: RequestPermissionMenuResponse, perms: string[]) => {
  routes.forEach((route) => {
    if (+route.type! === 2 && route.permission) {
      perms.push(route.permission);
    }
    if (route.children?.length) {
      transformPerms(route.children, perms);
    }
  });
};

export const usePermissionStore = defineStore<
  'permission',
  State,
  {
    /**
     * 所有路由，包括静态和动态路由
     */
    routes: (state: State) => RouteRecordRaw[];
  },
  {
    /**
     * 生成权限
     */
    generatePermission: () => void;
    /**
     * 清空权限
     */
    clearPermission: () => void;
  }
>('permission', {
  state: () => {
    return {
      dynamicRoutesLoaded: false,
      dynamicRoutes: [],
      perms: []
    };
  },
  getters: {
    routes: (state) =>
      constantRoutes.map((item) => ({
        ...item,
        children:
          item.path === '/' && item.name === '/' ? [...(item.children || []), ...state.dynamicRoutes] : item.children!
      }))
  },
  actions: {
    async generatePermission() {
      const res = await requestPermissionMenu();
      if (res.code === 200) {
        this.dynamicRoutes = transformRoutes(res.data || []);
        transformPerms(res.data || [], this.perms);
        this.dynamicRoutesLoaded = true;
      } else {
        ElMessage.error(res.message);
        throw Error(res.message);
      }
    },
    clearPermission() {
      this.dynamicRoutes = [];
      this.perms = [];
      this.dynamicRoutesLoaded = false;
      try {
        this.$router.getRoutes().forEach((route: RouteRecordRaw) => {
          const { name, meta } = route;
          if (meta?.dynamic) {
            this.$router.hasRoute(name) && this.$router.removeRoute(name);
          }
        });
      } catch {
        // 强制刷新浏览器也行，只是交互体验不是很好
        window.location.reload();
      }
    }
  }
});
