import { defineStore } from 'pinia';
import variables from '@/styles/variables.module.scss';

type State = {
  /**
   * 侧边栏
   */
  sidebar: {
    /**
     * 是否收起
     */
    isCollapse: boolean;
    /**
     * 宽度
     */
    width: string;
  };
};

const MIN_SCREEN_WIDTH = 1366;

export const useAppStore = defineStore<
  'app',
  State,
  {},
  {
    /**
     * 切换侧边栏
     */
    toggleSidebar: () => void;
  }
>('app', {
  state: () => {
    return {
      sidebar: {
        isCollapse: window.innerWidth <= MIN_SCREEN_WIDTH,
        width: variables[window.innerWidth <= MIN_SCREEN_WIDTH ? 'sidebar-width-collapse' : 'sidebar-width']
      }
    };
  },
  actions: {
    toggleSidebar() {
      this.sidebar.isCollapse = !this.sidebar.isCollapse;
      this.sidebar.width = variables[this.sidebar.isCollapse ? 'sidebar-width-collapse' : 'sidebar-width'];
    }
  }
});
