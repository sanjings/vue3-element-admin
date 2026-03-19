<script setup lang="ts">
  import { computed } from 'vue';
  import MenuList from './MenuList.vue';
  import { useAppStore } from '@/store/app';
  import { usePermissionStore } from '@/store/permission';
  import { useRoute } from 'vue-router';

  defineOptions({
    name: 'Sidebar'
  });

  const { VITE_APP_TITLE } = import.meta.env;

  const $route = useRoute();
  const appStore = useAppStore();
  const permissionStore = usePermissionStore();

  const activeMenu = computed(() => {
    const {
      meta: { activeMenu },
      path
    } = $route;
    return activeMenu ? activeMenu : path;
  });

  const menus = computed(() => permissionStore.routes.find((item) => item.path === '/')?.children || []);
</script>

<template>
  <div class="sidebar-wrap flex-col" :style="{ width: appStore.sidebar.width }">
    <h1 class="app-title">{{ appStore.sidebar.isCollapse ? 'admin' : VITE_APP_TITLE }}</h1>
    <el-menu
      class="sidebar-menu flex-1-scroll"
      :default-active="activeMenu"
      :collapse="appStore.sidebar.isCollapse"
      :collapse-transition="false"
      background-color="var(--menu-bg)"
      text-color="var(--menu-text)"
      active-text-color="var(--menu-active-text)"
      unique-opened
      router
    >
      <MenuList :listData="menus" />
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
  .sidebar-wrap {
    position: relative;
    flex-shrink: 0;
    height: 100%;

    .app-title {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: $header-height;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 1px;
      background-color: $menu-bg;
    }

    .sidebar-menu {
      width: 100%;
      height: 100%;
      border-right: none;

      @include user-select;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
</style>
