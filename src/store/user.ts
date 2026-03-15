import { defineStore } from 'pinia';
import { usePermissionStore } from './permission';
import { secureSessionStorage } from './util';
import type { RequestLoginResponse } from '@/services/api/user';

type State = {
  /**
   * token
   */
  token: string;
  /**
   * 登录用户信息
   */
  userInfo: RequestLoginResponse;
};

export const useUserStore = defineStore<
  'user',
  State,
  {
    /**
     * 是否登录
     */
    isLogin: (state: State) => boolean;
  },
  {
    /**
     * 设置token
     */
    setToken: (token: string) => void;
    /**
     * 清空token
     */
    resetToken: () => void;
    /**
     * 设置userInfo
     */
    setUserInfo: (userInfo: RequestLoginResponse) => Promise<void>;
    /**
     * 清空userInfo
     */
    resetUserInfo: () => void;
    /**
     * 退出登录
     * @param redirect 登录后重定向路由
     */
    logout: (redirect?: string) => void;
  }
>('user', {
  state: () => {
    return {
      token: '',
      userInfo: {}
    };
  },
  getters: {
    isLogin: (state) => !!(state.token && Object.keys(state.userInfo)?.length)
  },
  actions: {
    setToken(token) {
      this.token = token;
    },
    resetToken() {
      this.token = '';
    },
    async setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    async resetUserInfo() {
      this.userInfo = {};
    },
    logout(redirect) {
      this.resetToken();
      this.resetUserInfo();
      usePermissionStore()?.clearPermission();
      redirect
        ? this.$router.replace({
            path: '/login',
            query: { redirect: encodeURIComponent(redirect) }
          })
        : this.$router.replace({ path: '/login' });
    }
  },
  // 开启数据缓存
  persist: {
    key: 'STORE_USER',
    storage: {
      getItem: (key) => secureSessionStorage.getItem(key),
      setItem: (key, value) => secureSessionStorage.setItem(key, value)
    }
  }
});
