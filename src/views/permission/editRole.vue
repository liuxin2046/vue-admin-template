<template>
  <div class="app-container">
    <el-form ref="form" :model="roleForm" :rules="rules" label-width="100px" class="main-form">
      <el-form-item label="角色名称：" prop="name">
        <el-input v-model.trim="roleForm.name" style="width: 300px" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="权限列表：" prop="privileges">
        <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
        <el-tree
          :key="k"
          :data="data"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkedKeys"
          highlight-current
          node-key="name"
          :props="defaultProps"
          @check="handleChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchList, getRoleDetail } from '@/api/role'
export default {
  data() {
    return {
      roleForm: {
        name: '',
        privileges: []
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        privileges: [
          { required: true, message: '请设置权限', trigger: 'blur' }
        ]
      },
      id: '',
      k: 0,
      isIndeterminate: false,
      selectAll: false,
      allPrivilege: [],
      privilegeList: [],
      privileges: [],
      data: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    this.id = this.$route.params.id
    if (this.id) {
      this.getRoleDetail(this.id)
    }
    this.getAllPrivilege()
  },
  methods: {
    getAllPrivilege() {
      fetchList().then(res => {
        this.allPrivilege = res.data
        this.privilegeList = res.data.map(v => {
          return v.name
        })
        const data = this.formatPrivilege()
        this.data = data
      })
    },
    getRoleDetail(id) {
      getRoleDetail(id).then(res => {
        const { data: { name, privileges }} = res
        this.roleForm.name = name
        const temp = privileges.map(v => {
          return v.name
        })
        this.checkedKeys = temp
        this.privileges = this.checkedKeys.concat()
        this.roleForm.privileges = this.checkedKeys.concat()
      })
    },
    formatPrivilege() {
      const formatData = []
      this.allPrivilege.forEach((v, index) => {
      // 找到category为空的对象设置为第一层
        if (!v.category) {
        // v.id = v.name
          v.label = v.nameCN
          formatData.push(v)
        } else {
          if (!v.group) {
          // 找到group为空的对象设置为第二层
          // 寻找是否有所属第一层
            const first = formatData.find(k => k.label === v.category)
            if (first) {
            // 有所属第一层则添加
              formatData.forEach(m => {
                if (m.label === first.label) {
                  v.label = v.nameCN
                  m.children.push(v)
                }
              })
            } else {
            // 创建第一层再添加
              v.label = v.nameCN
              // v.group = v.nameCN
              const first = { label: v.category, children: [v] }
              formatData.push(first)
            }
          } else {
          // 寻找是否有所属第一层
            const first = formatData.find(k => k.label === v.category)
            if (first) {
            // 寻在是否有所属第二层
              if (first.children.length) {
                const second = first.children.find(s => s.group === v.group)
                if (second) {
                // 有所属第二层则添加
                  formatData.forEach(j => {
                    if (j.label === first.label) {
                      j.children.forEach(l => {
                        if (l.label === second.label) {
                          v.label = v.nameCN
                          l.children.push(v)
                        }
                      })
                    }
                  })
                } else {
                // 没有所属第二层则创建再添加
                  v.label = v.nameCN
                  const second = { label: v.group, group: v.group, children: [v] }
                  formatData.forEach(u => {
                    if (u.label === first.label) {
                      u.children.push(second)
                    }
                  })
                }
              } else {
              // tudo
              }
            } else {
            // 创建第一层，第二层
              const second = { label: v.group, group: v.group, children: [v] }
              const first = { label: v.category, children: [second] }
              formatData.push(first)
            }
          }
        }
      })
      return formatData
    },
    handleChange(val) {
      const res = this.getPrivileges(val)
      const finalValue = this.duplicateRemoval(res)
      this.privileges = finalValue
      this.roleForm.privileges = finalValue
    },
    duplicateRemoval(val) {
      const RemoveSame = [...new Set([...this.privileges, ...val])]
      const SamePart = this.privileges.filter(item => val.includes(item))
      const Difference = RemoveSame.filter(item => !SamePart.includes(item))
      return Difference
    },
    getPrivileges(val) {
      const res = []
      if (val.children) {
        val.children.forEach(v => {
          if (v.children) {
            v.children.forEach(k => {
              res.push(k.name)
            })
          } else {
            res.push(v.name)
          }
        })
      } else {
        res.push(val.name)
      }
      return res
    },
    checkSelectAll() {
      this.selectAll = this.roleForm.privileges.length === this.privilegeList.length
    },
    handleSelectAll() {
      if (this.selectAll) {
        this.checkedKeys = this.privilegeList
        this.privileges = this.privilegeList
        this.roleForm.privileges = this.privilegeList
        this.k++
      } else {
        this.checkedKeys = []
        this.privileges = []
        this.roleForm.privileges = []
        this.k++
      }
    },
    save() {
      console.log('form: ', this.roleForm)
      // this.$refs.form.validate((valid) => {
      //   if (valid) {
      //     if (this.id) {
      //       RoleApi.updateRole(this.id, this.roleForm).then(res => {
      //         this.$message({
      //           message: '编辑角色成功',
      //           type: 'success',
      //           duration: 1500
      //         })
      //         this.$router.push('/role')
      //       })
      //     } else {
      //       RoleApi.createRole(this.roleForm).then(res => {
      //         this.$message({
      //           message: '新建角色成功',
      //           type: 'success',
      //           duration: 1500
      //         })
      //         this.$router.push('/role')
      //       })
      //     }
      //   } else {
      //     return false
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-form{
  /deep/ .el-input__inner{
    border: 1px solid #DCDFE6
  }
}
</style>
