/**
 * CSS 变量操作工具集（箭头函数 + TS 注释）
 * 兼容 LightningCSS，不依赖 CSS Modules
 */

/**
 * 获取根元素 CSS 变量值
 * @param key 变量名（带 --）
 * @returns 去空格后的值
 */
export const getCssVar = (key: string): string => {
  const rootStyle = getComputedStyle(document.documentElement);
  return rootStyle.getPropertyValue(key).trim();
};

/**
 * 设置根元素 CSS 变量
 * @param key 变量名（带 --）
 * @param value 变量值
 */
export const setCssVar = (key: string, value: string): void => {
  document.documentElement.style.setProperty(key, value);
};

/**
 * 批量设置根元素 CSS 变量
 * @param variables 键值对对象，key 带 --
 */
export const setCssVars = (variables: Record<string, string>): void => {
  Object.entries(variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
};

/**
 * 移除根元素 CSS 变量（恢复为 :root 定义）
 * @param key 变量名（带 --）
 */
export const removeCssVar = (key: string): void => {
  document.documentElement.style.removeProperty(key);
};
