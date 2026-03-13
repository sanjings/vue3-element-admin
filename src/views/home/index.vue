<script setup lang="ts">
  defineOptions({
    name: '/home'
  });
</script>

<template>
  <div class="home-container">
    <p class="title">Home</p>
    <p class="desc">欢迎登录~</p>
  </div>
</template>

<style lang="scss" scoped>
  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    .title {
      font-size: 50px;
      font-weight: 550;
    }
    .desc {
      margin-top: 10px;
      font-size: 18px;
    }
  }
</style>
