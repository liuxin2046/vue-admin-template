<template>
  <div class="editor">
    <quill-editor
      ref="editor"
      :content="content"
      :options="editorOption"
      @change="onEditorChange($event)"
    />
    <image-upload ref="imgUploader" :remove-callback="uploadRemove" :visible="false" :success-callback="uploadSuccess" :headers="uploadHeader" :action="uploadAction" />
    <!-- <image-upload
      v-if="uploadHeader"
      ref="uploader"
      :visible="false"
      :action="uploadAction"
      :headers="uploadHeader"
      :limit="999"
      :multiple="true"
      @success="uploadSuccess"
    /> -->
    <!-- <Upload
      v-if="uploadHeader"
      ref="videoUploader"
      :action="uploadAction"
      :headers="uploadHeader"
      :limit="99"
      accept=".avi,.mp4,.mkv,.mov"
      :visible="false"
      :is-video="true"
      @success="uploadVideoSuccess"
    /> -->
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import Quill from 'quill'
import ImageUpload from '@/components/ImageUpload'
import ImageResize from 'quill-image-resize-module'
// import { host } from '@/utils/request'
import { getTokenType, getToken } from '@/utils/auth'
const SizeStyle = Quill.import('attributors/style/size')
SizeStyle.whitelist = ['12px', '14px', '16px', '18px', '20px', '22px']
Quill.register(SizeStyle, true)
Quill.register('modules/imageResize', ImageResize)
const BlockEmbed = Quill.import('blots/block/embed')
class MyVideoBlot extends BlockEmbed {
  static create(value) {
    const node = super.create()
    node.setAttribute('src', value.url)
    node.setAttribute('controls', '')
    node.setAttribute('width', '100%')
    return node
  }

  static value(node) {
    return {
      url: node.getAttribute('src')
    }
  }
}
MyVideoBlot.blotName = 'myVideo'
MyVideoBlot.tagName = 'video'
Quill.register(MyVideoBlot)

export default {
  name: 'Editor',
  components: {
    quillEditor,
    ImageUpload
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    change: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: [
            [{ align: '' }, { align: 'center' }, { align: 'right' }],
            [{ size: ['12px', '14px', '16px', '18px', '20px', '22px'] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['image', 'video']
          ],
          imageResize: true
        }
      },
      uploadAction: '',
      uploadHeader: null
    }
  },
  computed: {
    content() {
      return this.value
    }
  },
  mounted() {
    this.$refs.editor.quill.getModule('toolbar').addHandler('image', this.uploadImage)
    this.$refs.editor.quill.getModule('toolbar').addHandler('video', this.uploadVideo)
    this.configUpload()
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      this.change(html)
    },
    uploadImage(state) {
      if (state) {
        this.$refs.imgUploader.$emit('trigger')
      }
    },
    uploadVideo(state) {
      if (state) {
        this.$refs.videoUploader.$emit('trigger')
      }
    },
    uploadSuccess(url) {
      const imgUrl = url.length ? url[url.length - 1] : ''
      const selection = this.$refs.editor.quill.getSelection()
      const index = selection != null ? selection.index : this.content.length
      console.log('url: ', url)
      this.$refs.editor.quill.insertEmbed(index, 'image', imgUrl, Quill.sources.USER)
      this.$refs.editor.quill.setSelection(index + 1, 0)
    },
    uploadRemove(url) {

    },
    configUpload() {
      this.uploadHeader = {
        Authorization: `${getTokenType()} ${getToken()}`
      }
      this.uploadAction = `http://10.0.0.11:8082/api/common/upload`
    },
    uploadVideoSuccess({ response }) {
      const selection = this.$refs.editor.quill.getSelection()
      const index = selection != null ? selection.index : this.content.length
      this.$refs.editor.quill.insertEmbed(index, 'myVideo', { url: response.data }, Quill.sources.USER)
      this.$refs.editor.quill.setSelection(index + 1, 0)
    }
  }
}
</script>

<style lang="less">
.editor {
  .ql-editor {
    height: 500px;
  }
  .ql-toolbar.ql-snow,  .ql-container.ql-snow {
    border-color: rgba(0, 0, 0, 0.1);
  }
  .ql-toolbar.ql-snow .ql-formats:not(:last-child) {
    border-right: 1px solid lightgray;
    padding-right: 15px;
  }
  .quill-editor iframe {
    pointer-events: none;
  }
  .ql-snow .ql-picker {
    height: auto;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
    content: '12px';
    font-size: 14px !important;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
    content: '14px';
    font-size: 14px !important;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
    content: '16px';
    font-size: 14px !important;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
      content: '18px';
      font-size: 16px !important;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
      content: '20px';
      font-size: 18px !important;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="22px"]::before {
      content: '22px';
      font-size: 18px !important;
  }
  .ql-picker-label[data-value="12px"]::before { content: '12px' !important; }
  .ql-picker-label[data-value="14px"]::before { content: '14px' !important; }
  .ql-picker-label[data-value="16px"]::before { content: '16px' !important; }
  .ql-picker-label[data-value="18px"]::before { content: '18px' !important; }
  .ql-picker-label[data-value="20px"]::before { content: '20px' !important; }
  .ql-picker-label[data-value="22px"]::before { content: '22px' !important; }
}
</style>
