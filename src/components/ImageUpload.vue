<template>
  <section v-show="visible" id="upload" :data-current="current">
    <el-upload
      ref="upload"
      :list-type="listType"
      :limit="limit"
      :action="action"
      :headers="headers"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-error="onError"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :on-success="onSuccess"
      :disabled="isDisabled"
      :accept="accept"
      :multiple="multiple"
      :class="isDisabled ? 'disabled' : ''"
      :on-progress="onProgress"
    >
      <el-button ref="btn" v-loading.fullscreen.lock="isLoading && isVideo" type="text" element-loading-text="视频上传可能需要较长的时间，请耐心等待"><i class="el-icon-plus" /></el-button>
    </el-upload>
    <el-dialog :visible.sync="dialog" :width="isVideo ? '60%' : '40%'" @closed="modalClose">
      <img v-if="!isVideo" width="100%" :src="dialogImageUrl">
      <video v-else width="100%" height="300px" :src="videoUrl" controls="controls">您的浏览器暂不支持在线播放，请更新！</video>
    </el-dialog>
  </section>
</template>

<script>
export default {
  props: {
    listType: {
      type: String,
      default: 'picture-card'
    },
    limit: {
      type: Number,
      default: 1
    },
    action: {
      type: String,
      default() {
        return ''
      }
    },
    headers: {
      type: Object,
      default() {
        return {}
      }
    },
    fileList: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default() {
        return false
      }
    },
    isDisabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    allowFileType: {
      type: Array,
      default: () => ([])
    },
    accept: {
      type: String,
      default() {
        return '.png,.jpg,.jpeg'
      }
    },
    visible: {
      type: Boolean,
      default: true
    },
    isVideo: {
      type: Boolean,
      default: false
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
      videoUrl: '',
      dialogImageUrl: '',
      count: 0,
      uploadEl: null,
      current: new Date().getTime() + Math.random(),
      isLoading: false
    }
  },
  watch: {
    fileList: {
      immediate: true,
      handler(currentFile) {
        this.$nextTick(() => {
          if (currentFile[0] && this.isVideo) {
            this.setVideoDom(currentFile[0].url)
          }
          const el = document.querySelector(`[data-current="${this.current}"] .el-upload.el-upload--picture-card`)
          if (currentFile.length >= this.limit) {
            el.style.display = 'none'
          } else {
            el.style.display = 'inline-block'
          }
          this.count = currentFile.length
        })
      }
    }
  },
  mounted() {
    this.$on('trigger', this.trigger)
    this.uploadEl = document.querySelector(`[data-current="${this.current}"] .el-upload.el-upload--picture-card`)
  },
  methods: {
    setVideoDom(videoSrc) {
      this.$nextTick(() => {
        // 支持单个视频
        const parent = document.querySelector(`[data-current="${this.current}"] .el-upload-list__item.is-success`)
        const child = document.querySelector(`[data-current="${this.current}"] .el-upload-list--picture-card .el-upload-list__item-thumbnail`)
        if (!parent || !child) return false
        const video = document.createElement('video')
        video.setAttribute('src', videoSrc)
        video.setAttribute('class', 'el-upload-list--picture-card el-upload-list__item-thumbnail')
        parent.insertBefore(video, child)
        parent.removeChild(child)
      })
    },
    onSuccess(response, file, fileList) {
      this.isLoading = false
      this.$emit('success', { response, file, fileList })
      typeof this.successCallback === 'function' && this.successCallback({ response, file, fileList })
      if (this.isVideo) this.setVideoDom(response.data)
    },
    onRemove(file, fileList) {
      if (this.limit > --this.count) {
        this.uploadEl.style.display = 'inline-block'
      }
      this.$emit('remove', { file, fileList })
      typeof this.removeCallback === 'function' && this.removeCallback({ file, fileList })
    },
    onPreview(file) {
      if (this.isVideo) {
        this.videoUrl = file.response ? file.response.data : file.url
      } else {
        this.dialogImageUrl = file.url
      }
      this.dialog = true
      this.$emit('preview', file)
    },
    beforeUpload(file) {
      if (this.limit === ++this.count) {
        this.uploadEl.style.display = 'none'
      }
      if (this.allowFileType.length && !this.allowFileType.includes(file.type)) {
        this.$message({ message: '文件格式错误', type: 'error' })
        return false
      }
      this.isLoading = true
    },
    onError(err, file, fileList) {
      if (this.limit > --this.count) {
        this.uploadEl.style.display = 'inline-block'
      }
      this.isLoading = false
      this.$emit('error', { err, file, fileList })
    },
    trigger() {
      this.$refs.btn.$el.click()
    },
    onProgress(event, file, fileList) {
    },
    modalClose() {
      this.videoUrl = ''
      this.dialogImageUrl = ''
    }
  }
}
</script>

<style lang="less">
  #upload {
    min-height: 148px;
    .el-dialog__body {
      img {
        vertical-align: middle;
      }
    }
    .el-upload-list__item.is-success {
      img {
        object-fit: cover
      }
    }
  }
</style>
