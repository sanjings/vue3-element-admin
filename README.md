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

## Docker 开发与部署

### 前置条件

- 已安装 Docker Desktop（或 Docker Engine + Compose）

### 开发环境（dev）

```bash
# 首次或配置变更后建议带 --build
docker compose up --build

# 或使用 npm 脚本（推荐统一团队命令）
npm run docker:up
```

启动后访问：

- `http://localhost:16666`

开发环境常用命令：

```bash
# 启动
docker compose up
# 后台启动
docker compose up -d --build
# 或 npm run docker:dev:detach

# 停止并移除容器
docker compose down
# 或 npm run docker:down

# 进入容器
docker compose exec dev sh
```

开发环境说明：

- 源码目录会挂载到容器内，保留宿主机 IDE 开发体验（改代码即热更新）。
- `node_modules` 使用容器内独立卷，避免宿主机与容器平台差异导致依赖冲突。
- 容器使用 Node 22，与项目 `engines.node >=22` 保持一致。
- 容器内使用 `pnpm` 安装依赖，并配置淘宝镜像源 `https://registry.npmmirror.com`，降低安装失败概率。
- 开发环境安装依赖使用 `pnpm install --no-frozen-lockfile`，优先保证团队本地可启动。
- 不要在每次启动时删除 `node_modules/.vite`，否则容易与 Vite 依赖预构建并发冲突，出现白屏或 “deps 文件不存在”。若偶发缓存损坏，可手动进容器执行：`rm -rf node_modules/.vite` 后重启一次。
- Windows + Docker 挂载源码时：compose 里设置 `DOCKER_DEV=1`，由 Vite 使用**低频轮询**（`VITE_WATCH_POLL_INTERVAL`，默认 1200ms）保证热更新；`VITE_DEV_HMR_CLIENT_PORT` 与 `ports` 里宿主机端口一致（当前 `16666`），否则 HMR 可能连错端口导致“改了不刷新”。全局 `CHOKIDAR_USEPOLLING` 易拖慢整站，不推荐与上述方案叠用。
- 需要把 `/api` 转到真实后端时，在 `docker-compose.yml` 里为 `dev` 服务设置环境变量 `DEV_API_PROXY_TARGET`（例如 `http://host.docker.internal:8080`）；不配则不在 Vite 里代理 `/api`，无需改 `.env`。

### 部署环境（prod）

```bash
# 构建生产镜像
npm run docker:prod:build

# 启动生产容器
npm run docker:prod:up

# 停止生产容器
npm run docker:prod:down
```

生产环境访问：

- `http://localhost:8080`

部署环境说明：

- 使用 `Dockerfile.prod` 多阶段构建：Node + pnpm 构建产物，Nginx 托管静态文件。
- 生产构建安装依赖使用 `pnpm install --frozen-lockfile`，确保锁文件一致性与可复现构建。

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
