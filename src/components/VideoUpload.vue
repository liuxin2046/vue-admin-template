<template>
  <div v-show="visible" class="uploadWrapper">
    <vuedraggable
      v-model="imgList"
      class="vue-draggable"
      :class="{ single: isSingle, maxHidden: isMaxHidden }"
      tag="ul"
      draggable=".draggable-item"
      @start="onDragStart"
      @end="onDragEnd"
    >
      <!-- 拖拽元素 -->
      <li
        v-for="(item, index) in imgList"
        :key="item + index"
        class="draggable-item"
        :style="{ width: width + 'px', height: height + 'px' }"
      >
        <img :src="compressedImage(item)" :width="width" :height="height" @click="handlePreview(item)">
        <div class="shadow" @click="onRemoveHandler(index)">
          <i class="el-icon-delete" />
        </div>
      </li>
      <!-- 上传按钮 -->
      <el-upload
        ref="uploadRef"
        class="uploadBox"
        :style="{ width: width + 'px', height: height + 'px' }"
        :action="action"
        :headers="headers"
        :accept="accept"
        :show-file-list="false"
        :multiple="!isSingle"
        :limit="limit"
        :before-upload="beforeUpload"
        :on-success="onSuccessUpload"
        :on-exceed="onExceed"
      >
        <i ref="btn" class="el-icon-plus uploadIcon">
          <span v-show="isUploading" class="uploading">正在上传...</span>
          <span
            v-if="!isUploading && limit && limit!==99 && !isSingle"
            class="limitTxt"
          >最多{{ limit }}张</span>
        </i>
      </el-upload>
    </vuedraggable>
    <el-dialog :visible.sync="dialog" width="40%" @closed="modalClose">
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
// import { getToken } from '@/utils/auth' // 获取token，用于后端接口登录校验，根据公司的业务自行移除或替换就行
// import { validImgUpload } from '@/utils/validate'
// import lrz from 'lrz' // 前端图片压缩插件
import { createUniqueString, compressedImage } from '@/utils/tools'
export default {
  name: 'VideoUpload',
  components: { vuedraggable },
  props: {
    // 图片数据(图片url组成的数组) 通过v-model传递
    value: {
      type: Array,
      default() {
        return []
      }
    },
    headers: {
      type: Object,
      default() {
        return {}
      }
    },
    action: {
      type: String,
      default: ''
    },
    // 限制上传的图片数量
    limit: {
      type: Number,
      default: 99
    },
    // 限制上传图片的文件大小(kb)
    size: {
      type: Number,
      default: 10240
    },
    // 是否是单图上传(单图上传就是已传图片和上传按钮重叠)
    isSingle: {
      type: Boolean,
      default: false
    },
    // 是否使用图片压缩
    useCompress: {
      type: Boolean,
      default: false
    },
    // 图片显示的宽度(px)
    width: {
      type: Number,
      default: 150
    },
    // 图片显示的高度(px)
    height: {
      type: Number,
      default: 150
    },
    visible: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default() {
        return '.avi,.mp4,.mkv,.mov'
      }
    },
    successCallback: {
      type: Function,
      default() {
        return () => {}
      }
    },
    removeCallback: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },

  data() {
    return {
      dialog: false,
      dialogImageUrl: '',
      // headers: { token: getToken() },
      isUploading: false, // 正在上传状态
      isFirstMount: true // 控制防止重复回显
    }
  },

  computed: {
    // 图片数组数据
    imgList: {
      get() {
        return this.value
      },
      set(val) {
        if (val.length < this.imgList.length) {
          console.log('123: ')
          // 判断是删除图片时同步el-upload数据
          this.syncElUpload(val)
        }
        // 同步v-model
        this.$emit('input', val)
      }
    },
    // 控制达到最大限制时隐藏上传按钮
    isMaxHidden() {
      return this.imgList.length >= this.limit
    }
  },

  watch: {
    value: {
      handler(val) {
        if (this.isFirstMount && this.value.length > 0) {
          this.syncElUpload()
        }
      },
      deep: true
    }
  },

  mounted() {
    if (this.value.length > 0) {
      this.syncElUpload()
    }
    this.$on('trigger', this.trigger)
  },

  methods: {
    compressedImage,
    // 同步el-upload数据
    syncElUpload(val) {
      const imgList = val || this.imgList
      this.$refs.uploadRef.uploadFiles = imgList.map((v, i) => {
        return {
          name: 'pic' + i,
          url: v,
          status: 'success',
          uid: createUniqueString()
        }
      })
      this.isFirstMount = false
    },
    // 上传图片之前
    beforeUpload(file) {
      this.isFirstMount = false
      this.isUploading = true
      console.log('file: ', file)
      return true
      // if (this.useCompress) {
      //   // 图片压缩
      //   return new Promise((resolve, reject) => {
      //     lrz(file, { width: 1920 }).then((rst) => {
      //       file = rst.file
      //     }).always(() => {
      //       if (validImgUpload(file, this.size)) {
      //         this.isUploading = true
      //         resolve()
      //       } else {
      //         reject(new Error())
      //       }
      //     })
      //   })
      // } else {
      //   if (validImgUpload(file, this.size)) {
      //     this.isUploading = true
      //     return true
      //   } else {
      //     return false
      //   }
      // }
    },
    // 上传完单张图片
    onSuccessUpload(res, file, fileList) {
      console.log('111: ', res)
      if (res.status === 200) {
        if (this.imgList.length < this.limit) {
          this.imgList.push(res.data)
          this.successCallback(this.imgList)
        }
      } else {
        this.syncElUpload()
        this.$message({ type: 'error', message: res.message })
      }
      this.isUploading = false
    },
    // 移除单张图片
    onRemoveHandler(index) {
      console.log('index: ', index)
      this.$confirm('确定删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.imgList = this.imgList.filter((v, i) => {
            return i !== index
          })
          const images = this.$refs.uploadRef.uploadFiles.map(v => v.url)
          this.removeCallback(images)
        })
        .catch(() => {})
    },
    // 超限
    onExceed() {
      this.$refs.uploadRef.abort() // 取消剩余接口请求
      this.syncElUpload()
      this.$message({
        type: 'warning',
        message: `图片超限，最多可上传${this.limit}张图片`
      })
    },
    onDragStart(e) {
      e.target.classList.add('hideShadow')
    },
    onDragEnd(e) {
      e.target.classList.remove('hideShadow')
      console.log('after sort: ', this.imgList)
    },
    handlePreview(url) {
      this.dialogImageUrl = url
      this.dialog = true
      console.log('url: ', url)
    },
    modalClose() {
      this.dialogImageUrl = ''
    },
    trigger() {
      this.$refs.btn.click()
      // console.log('ref: ', this.$refs.=)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-upload {
  width: 100%;
  height: 100%;
}

// 上传按钮
.uploadIcon {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #c0ccda;
  background-color: #fbfdff;
  border-radius: 6px;
  font-size: 20px;
  color: #999;

  .limitTxt,
  .uploading {
    position: absolute;
    bottom: 10%;
    left: 0;
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
}

// 拖拽
.vue-draggable {
  display: flex;
  flex-wrap: wrap;

  .draggable-item {
    margin-right: 5px;
    margin-bottom: 5px;
    border: 1px solid #ddd;
    border-radius: 6px;
    position: relative;
    overflow: hidden;

    img {
      object-fit: cover;
    }
    .shadow {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0,0,0,.5);
      opacity: 0;
      transition: opacity .3s;
      color: #fff;
      font-size: 20px;
      line-height: 20px;
      padding: 2px;
      cursor: pointer;
    }
    &:hover {
      .shadow {
        opacity: 1;
      }
    }
  }
  &.hideShadow {
    .shadow {
      display: none;
    }
  }
  &.single {
    overflow: hidden;
    position: relative;

    .draggable-item {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
  }
  &.maxHidden {
    .uploadBox {
      display: none;
    }
  }
}
// el-image
.el-image-viewer__wrapper {
  .el-image-viewer__mask {
    opacity: .8;
  }
  .el-icon-circle-close {
    color: #fff;
  }
}
</style>
