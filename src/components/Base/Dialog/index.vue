<script lang="ts" setup>
  import { useModal } from '@/hooks/useModal';

  defineOptions({
    name: 'Dialog'
  });

  const {
    title,
    top = '8vh',
    width = '450px',
    center = false,
    showClose = true,
    draggable = true,
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
     * margin-top 值
     * @default 8vh
     */
    top?: string;
    /**
     * 对话框的宽度
     * @default 450px
     */
    width?: string | number;
    /**
     * 是否让 Dialog 的 header 和 footer 部分居中排列
     * @default false
     */
    center?: boolean;
    /**
     * 是否显示关闭按钮
     * @default true
     */
    showClose?: boolean;
    /**
     * 为 Dialog 启用可拖拽功能
     * @default true
     */
    draggable?: boolean;
    /**
     * 当关闭 Dialog 时，销毁其中的元素
     * @default true
     */
    destroyOnClose?: boolean;
    /**
     * 是否可以通过按下 ESC 关闭 Dialog
     * @default true
     */
    closeOnPressEscape?: boolean;
    /**
     * 是否可以通过点击 modal 关闭 Dialog
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
  <el-dialog
    v-model="visible"
    class="dialog-pro"
    :title="title"
    :top="top"
    :width="width"
    :center="center"
    :show-close="showClose"
    :draggable="draggable"
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
  </el-dialog>
</template>

<style lang="scss">
  .dialog-pro {
    padding: 0 !important;
    overflow: hidden;
    border-radius: 6px !important;

    .el-dialog__header {
      flex-shrink: 0;
      padding: 15px 20px;
      background-color: #f9f9f9;

      .el-dialog__title {
        font-size: 16px;
        font-weight: 550;
        color: $color-black;
        letter-spacing: 0.5px;
      }

      .el-dialog__headerbtn {
        z-index: 9;
        height: 54px;
        font-size: 18px;
      }
    }

    .el-dialog__body {
      max-height: 75vh;
      padding: 20px;
      overflow-y: auto;
      color: $color-black;
    }

    .el-dialog__footer {
      padding: 15px 20px;
      border-top: 1px solid #eeeeee;

      button {
        padding: 18px 22px;
      }
    }
  }
</style>
