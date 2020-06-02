<template>
  <div class="fixed-panel">
    <i v-if="hasCloseButton" class="el-icon-close" @click="close" />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FixedDardPanel',
  props: {
    hasCloseButton: Boolean,
    close: {
      type: Function,
      default() {
        return () => {}
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fixed-panel {
  z-index: 20000;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  .el-icon-close {
    cursor: pointer;
    position: absolute;
    top: .4rem;
    right: .4rem;
    color: white;
    font-size: 4rem;
  }
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
