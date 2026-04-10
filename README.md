# Vue 3 Element Admin

基于 Vue 3 + TypeScript + Vite 8 + Element Plus 的后台管理系统模板。

## 技术栈

| 类别     | 技术                 |
| -------- | -------------------- |
| 框架     | Vue 3.5 + TypeScript |
| 构建     | Vite 8               |
| UI       | Element Plus 2.x     |
| 状态管理 | Pinia 3.x            |
| 路由     | Vue Router 5.x       |
| 样式     | SCSS                 |
| 请求     | Axios                |

## 功能特性

- **组件自动导入**：Element Plus 组件和 Vue Composition API 自动按需导入
- **权限管理**：基于角色的路由权限控制
- **状态持久化**：Pinia 状态管理，支持本地存储持久化
- **代码规范**：Prettier + Stylelint + Husky + Commitlint
- **打包优化**：图片压缩、Gzip 压缩、打包体积分析
- **开发体验**：Vue DevTools、热更新、SCSS 嵌套

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 类型检查
npm run type-check

# 构建生产版本
npm run build

# 代码格式化
npm run format
```

## 项目结构

```
src
├── assets/          # 静态资源
├── components/      # 公共组件
│   ├── Base/        # 基础组件
│   ├── Layout/      # 布局组件
│   └── TablePro/    # 增强表格
├── directives/      # 自定义指令
├── hooks/           # Composition API 钩子
├── plugins/         # 插件配置
├── router/          # 路由配置
├── services/        # 接口请求
├── store/           # 状态管理
├── styles/          # 全局样式
├── utils/           # 工具函数
└── views/           # 页面组件
```

## 组件示例

### 基础按钮

```vue
<template>
  <BaseButton type="primary" @click="handleClick">点击</BaseButton>
</template>

<script setup lang="ts">
  import BaseButton from '@/components/Base/Button/index.vue';

  const handleClick = () => {
    console.log('clicked');
  };
</script>
```

### 增强表格

```vue
<template>
  <TablePro :columns="columns" :request-api="getList" :search-param="searchParam">
    <template #action="{ row }">
      <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
    </template>
  </TablePro>
</template>
```

## 环境变量

```bash
VITE_PUBLIC_PATH     # 部署路径，默认 /
VITE_HTTP_BASE_URL   # 接口基础路径
```

## 代码规范

- 提交代码前先执行 `npm run type-check` 进行类型检查
- 使用 `npm run format` 格式化代码后再提交
- Commit message 遵循 Conventional Commits 规范

## License

MIT
