<template>
  <div class="img-gallery">
    <el-carousel :key="initialIndex" ref="carousel" :initial-index="initialIndex" arrow="always" :autoplay="false" trigger="click">
      <slot />
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'ImgGallery',
  props: {
    initialIndex: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="less" scoped>
.img-gallery {
  width: 50rem;
  display: flex;
  justify-content: center;
  /deep/ .el-carousel {
    .el-carousel__indicators {
      .el-carousel__indicator {
        padding: 7px;
        margin-bottom: 8px;
        .el-carousel__button {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
