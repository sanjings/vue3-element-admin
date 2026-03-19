import type { Component } from 'vue';

// 自动导入当前目录下所有 .vue 组件
const components = import.meta.glob<{ default: Component }>('./*.vue', { eager: true });

// 自动批量导出所有组件（文件名即组件名）
// 例如 Text.vue → export const Text
export const FormItemComponents = Object.fromEntries(
  Object.entries(components).map(([path, mod]) => {
    const name = path.match(/\/([^/]+)\.vue$/)?.[1] ?? '';
    return [name, mod.default];
  })
);
