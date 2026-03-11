<script setup lang="ts">
  import { debounce } from 'lodash-es';

  defineOptions({
    name: 'Button'
  });

  const props = defineProps<{
    /**
     * 是否占满一行
     */
    block?: boolean;
    /**
     * 防抖时间 默认300
     */
    debounce?: number;
    /**
     * 是否立即执行 默认true
     */
    debounceImmediate?: boolean;
  }>();

  const $emit = defineEmits<{
    (e: 'click'): void;
  }>();

  const handleClick = debounce(
    () => {
      $emit('click');
    },
    props.debounce ?? 300,
    { leading: props.debounceImmediate ?? true, trailing: !(props.debounceImmediate ?? true) }
  );
</script>

<template>
  <el-button v-bind="props" :style="{ width: props.block ? '100%' : 'auto' }" @click="handleClick()">
    <slot />
  </el-button>
</template>
