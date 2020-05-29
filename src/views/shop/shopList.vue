<template>
  <section class="app-container">
    <List
      ref="list"
      :fetch-list="fetchList"
      :search-form="searchForm"
    >
      <template slot="form">
        <div>
          <el-button class="add-btn" type="primary" @click="addProducts">添加商品</el-button>
        </div>
        <el-form-item label="状态" prop="publish">
          <el-select v-model="searchForm.publish">
            <el-option
              label="全部"
              :value="null"
            />
            <el-option
              label="未上架"
              :value="false"
            />
            <el-option
              label="上架"
              :value="true"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="q">
          <el-input
            v-model="searchForm.q"
            placeholder="请输入关键词搜索"
          />
        </el-form-item>
      </template>

      <template slot="table">
        <el-table-column label="商品名称" prop="name" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="价格(元)" align="center">
          <template slot-scope="scope">
            {{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column label="浏览量" align="center">
          <template slot-scope="scope">
            {{ scope.row.view ? scope.row.view : 0 }}
          </template>
        </el-table-column>
        <el-table-column label="库存" a lign="center" width="60px">
          <template slot-scope="scope">
            {{ scope.row.quantity ? scope.row.quantity : 0 }}
          </template>
        </el-table-column>
        <el-table-column label="销量" prop="createAt" align="center" width="160px">
          <template slot-scope="scope">
            {{ scope.row.sales ? scope.row.sales : 0 }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="创建时间" prop="createAt" align="center" width="160px">
            <template slot-scope="scope">
              {{ $transformTime.transformTime(scope.row.createAt) }}
            </template>
          </el-table-column> -->
        <el-table-column label="商品状态" align="center">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.publish | publish" placement="top">
              <el-switch v-model="scope.row.publish" style="display: block" active-color="#13ce66" inactive-color="#ff4949" @change="swicthChange(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="text" class="pointer" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" class="pointer" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </List>
  </section>
</template>

<script>
import { getList, deleteProduct } from '@/api/shop'
import List from '@/components/List'

export default {
  name: 'ShopList',
  components: {
    List
  },
  filters: {
    publish(val) {
      if (val === true) {
        return '启用'
      } else if (val === false) {
        return '禁用'
      } else {
        return '无'
      }
    }
  },
  data() {
    return {
      searchForm: {
        categoryId: '',
        publish: null,
        q: ''
      }
    }
  },
  methods: {
    addProducts() {
      this.$router.push({ name: 'addProducts', params: { handle: 'add' }})
    },
    swicthChange({ id, publish }) {
      if (publish) {
        // shelves(id)
        this.$message({
          type: 'success',
          message: '上架成功!'
        })
      } else {
        // takeOff(id)
        this.$message({
          type: 'success',
          message: '下架成功!'
        })
      }
    },
    fetchList(params) {
      // 获取列表
      return getList(params).then(res => {
        this.content = res.data.content
        return res.data
      })
    },
    handleEdit(val) {
      const { id } = val
      this.$router.push({ name: 'addProducts', params: { handle: 'edit', id }})
    },
    handleDelete(val) {
      const { id } = val
      this.$confirm('确认删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.refresh()
        })
      }).catch((err) => {
        console.error(err)
      })
    },
    handleDetail(row) {
      const { id } = row
      this.$router.push({ name: 'memberManagementDetails', params: { id }})
    },
    exchange(row) {
      const { id } = row
      this.$router.push({ name: 'exchange', params: { id }})
    },
    integralData(row) {
      const { id } = row
      this.$router.push({ name: 'integral', params: { id }})
    },
    activityData(row) {
      this.$router.push({ name: '', params: { ...row }})
    },
    importSubmit() {
      this.$refs.upload.submit()
    },
    refresh() {
      this.$refs.list.refreshCurrentPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 20px;
}
</style>
