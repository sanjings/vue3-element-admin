import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/components/Layout/index.vue';

/**
 * 静态路由
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hideInMenu: true, hideInTagview: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hideInMenu: true,
      hideInTagview: true
    }
  },
  {
    path: '/',
    name: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          affix: true,
          keepAlive: true
        }
      },
      {
        path: '/error',
        name: '/error',
        redirect: '/error/404',
        meta: {
          title: '页面报错',
          hideInMenu: true
        },
        children: [
          {
            path: '/error/404',
            name: '/error/404',
            meta: {
              title: '404',
              hideInTagview: true
            },
            component: () => import('@/views/error/404/index.vue')
          }
        ]
      }
    ]
  }
];
