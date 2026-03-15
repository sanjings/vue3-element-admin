/**
 * 时间区间默认时分秒
 */
export const DEFAULT_DATE_RANGE_TIME: [Date, Date] = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
] as const;

/**
 * 时间区间选择器快捷选项
 */
export const DATE_RANGE_SHORTCUTS = [
  {
    text: '昨日',
    value: () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const start = yesterday.setHours(0, 0, 0, 0);
      const end = yesterday.setHours(23, 59, 59, 0);
      return [start, end];
    }
  },
  {
    text: '本月',
    value: () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const start = firstDay.setHours(0, 0, 0, 0);
      const end = today.setHours(23, 59, 59, 0);
      return [start, end];
    }
  },
  {
    text: '近一周',
    value: () => {
      const end = new Date().setHours(23, 59, 59, 0);
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      start.setHours(0, 0, 0, 0);
      return [start, end];
    }
  },
  {
    text: '近一月',
    value: () => {
      const end = new Date().setHours(23, 59, 59, 0);
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      start.setHours(0, 0, 0, 0);
      return [start, end];
    }
  },
  {
    text: '近三月',
    value: () => {
      const end = new Date().setHours(23, 59, 59, 0);
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      start.setHours(0, 0, 0, 0);
      return [start, end];
    }
  }
  // {
  //   text: '近半年',
  //   value: () => {
  //     const end = new Date().setHours(23, 59, 59, 0);
  //     const start = new Date();
  //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
  //     start.setHours(0, 0, 0, 0);
  //     return [start, end];
  //   }
  // }
];

/**
 * messageBox通用配置
 */
export const MESSAGE_BOX_OPTION = {
  closeOnClickModal: false,
  closeOnPressEscape: false,
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  draggable: true,
  dangerouslyUseHTMLString: true,
  showClose: true,
  appendTo: 'body'
} as const;
