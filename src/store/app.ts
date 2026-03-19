import { defineStore } from 'pinia';
import { getCssVar } from '@/utils/css-var';

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
        width:
          window.innerWidth <= MIN_SCREEN_WIDTH ? getCssVar('--sidebar-width-collapse') : getCssVar('--sidebar-width')
      }
    };
  },
  actions: {
    toggleSidebar() {
      this.sidebar.isCollapse = !this.sidebar.isCollapse;
      this.sidebar.width = this.sidebar.isCollapse
        ? getCssVar('--sidebar-width-collapse')
        : getCssVar('--sidebar-width');
    }
  }
});
