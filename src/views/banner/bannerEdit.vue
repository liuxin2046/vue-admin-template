<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="validate" label-width="70px" size="small" class="allForm">
      <el-form-item label="轮播图" label-width="90px" prop="image">
        <el-col>
          <upload
            :remove-callback="uploadRemove"
            :success-callback="uploadSuccess"
            :allow-file-type="['image/png', 'image/jpeg']"
            :headers="upload.headers"
            :file-list="upload.fileList"
            :action="upload.action"
            :limit="1"
          />
          <span class="tips">建议尺寸为750x1206px, 图片格式支持 jpg / png </span>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import $api from '@/network/loginSet'
import { getBanners } from '@/api/shop'
import upload from '@/components/ImageUpload'
// import { host } from '@/utils/request'
// import user from '@/network/user'

// const currentUser = user.current()
import { getTokenType, getToken } from '@/utils/auth'
// const ERR_OK = 200
export default {
  components: {
    upload
  },
  data() {
    return {
      lists: [],
      articleList: [],
      loading: false,
      index: '',
      form: {
        article: '',
        hide: true,
        image: []
      },
      upload: {
        // 测试action地址
        action: `http://10.0.0.11:8082/api/common/upload`,
        fileList: [],
        headers: {
          Authorization: `${getTokenType()} ${getToken()}`
        }
      },
      validate: {
        article: [
          { required: true, message: '请输入说明信息', trigger: 'blur' }
        ]
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/logoSet') {
      to.meta.keepAlive = false
    }
    next()
  },
  created() {
    // const { id } = this.$route.params
    const id = 1
    getBanners(id).then(({ data }) => {
      console.log('data: ', data)
      this.form = data
      if (data.article) {
        const { id, title } = data.article
        this.articleList.push({ id, title })
        this.form.article = id
        Array.isArray(data.image) && data.image.forEach((url, idx) => {
          this.upload.fileList.push({ name: new Date().getTime() + idx, url })
        })
      }
    })
    const index = this.$route.params.number
    this.index = index + 1
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.articleList = this.lists.filter(item => {
            return item.title.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.articleList = []
      }
    },
    uploadRemove({ file }) {
      const url = file.response ? file.response.data : file.url
      this.form = Object.assign({}, this.form, {
        image: this.form.image.filter(item => item !== url)
      })
    },
    uploadSuccess({ response: { data }}) {
      this.form.image.push(data)
    },
    saveForm() {
      // this.$refs.form.validate().then((valid) => {
      //   if (!valid) return
      //   // this.loading = true
      //   const { id } = this.$route.params
      //   $api.postSlide({ id: id, ...this.form }).then(({ status }) => {
      //     if (status === ERR_OK) {
      //       this.$message({ message: '保存成功', type: 'success' })
      //       this.$router.back()
      //     } else {
      //       this.$message({ message: '保存失败', type: 'error' })
      //     }
      //   })
      // })
    },
    cancelBtn() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less">
#addRole {
  .role-message{
    left: 13em;
    line-height: 35px;
  }
  .action-wrapper-save{
    margin-left: 1em
  }
  .action-wrapper {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 16px;
    .spacer{
      flex-grow: 1;
    }
  }
  .saveBut{
    width: 150px;
    position: relative;
    margin-left: 20%;
    margin-top: 50px
  }
  .cancel-btn{
    width: 150px;
  }
  .allForm{
    margin-left:100px
  }
  .el-tree-node {
    user-select: none;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409EFF;
    border-color: #409EFF;
    &::after {
      border-color: white;
    }
  }
}
</style>
