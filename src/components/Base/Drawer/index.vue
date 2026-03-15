<script lang="ts" setup>
  import { useModal } from '@/hooks/useModal';

  defineOptions({
    name: 'Drawer'
  });

  const {
    title,
    width = '30%',
    showClose = true,
    destroyOnClose = true,
    closeOnPressEscape = false,
    closeOnClickModal = false,
    showFooter = true,
    showConfirm = true,
    showCancel = true,
    confirmText = '确 认',
    cancelText = '取消'
  } = defineProps<{
    /**
     * 标题
     */
    title?: string;
    /**
     * 宽度
     * @default 30%
     */
    width?: string | number;
    /**
     * 是否显示关闭按钮
     * @default true
     */
    showClose?: boolean;
    /**
     * 当关闭时，销毁其中的元素
     * @default true
     */
    destroyOnClose?: boolean;
    /**
     * 是否可以通过按下 ESC 关闭
     * @default true
     */
    closeOnPressEscape?: boolean;
    /**
     * 是否可以通过点击 modal 关闭
     * @default true
     */
    closeOnClickModal?: boolean;
    /**
     * 是否展示footer区域
     * @default true
     */
    showFooter?: boolean;
    /**
     * 是否展示确认按钮
     * @default true
     */
    showConfirm?: boolean;
    /**
     * 是否展示关闭按钮
     * @default true
     */
    showCancel?: boolean;
    /**
     * 确认按钮文字
     * @default 确认
     */
    confirmText?: string;
    /**
     * 关闭按钮文字
     * @default 取消
     */
    cancelText?: string;
  }>();

  const $slots = defineSlots<{
    header?: () => VNode[];
    default?: () => VNode[];
    footer?: () => VNode[];
  }>();
  const visible = defineModel<boolean>();
  const { confirmLoading, handleOpen, handleClose, handleConfirm } = useModal();
</script>

<template>
  <el-drawer
    v-model="visible"
    class="drawer-pro"
    :title="title"
    :size="width"
    :show-close="showClose"
    append-to="#app"
    :destroy-on-close="destroyOnClose"
    :close-on-press-escape="closeOnPressEscape"
    :close-on-click-modal="closeOnClickModal"
    @open="handleOpen()"
    @close="handleClose()"
  >
    <template #header v-if="$slots.header">
      <slot name="header"></slot>
    </template>
    <slot name="default"></slot>
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
    <template #footer v-else-if="showFooter">
      <el-button v-if="showCancel" auto-insert-space :disabled="confirmLoading" @click="visible = false">
        {{ cancelText }}
      </el-button>
      <Button v-if="showConfirm" type="primary" :loading="confirmLoading" @click="handleConfirm()">
        {{ confirmText }}
      </Button>
    </template>
  </el-drawer>
</template>

<style lang="scss">
  .drawer-pro {
    max-width: calc(100vw - $sidebar-width);

    .el-drawer__header {
      padding: 15px 20px;
      margin-bottom: 0;
      background-color: #f9f9f9;

      .el-drawer__title {
        font-size: 16px;
        font-weight: 550;
        color: $color-black;
        letter-spacing: 0.5px;
      }
    }

    .el-drawer__body {
      padding: 20px;
      color: $color-black;
    }

    .el-drawer__footer {
      padding: 15px 20px;
      border-top: 1px solid #eeeeee;

      button {
        padding: 18px 22px;
      }
    }
  }
</style>
