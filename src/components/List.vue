<template>
  <div class="common-list">
    <div class="listName">
      <slot name="listName" />
    </div>
    <div class="header">
      <el-form ref="searchForm" :inline="true" :rules="searchRules" :model="searchForm" class="search-form" label-position="right" label-width="80px" size="small">
        <slot name="form" />
        <slot name="action">
          <el-button type="primary" size="small" @click="handleSubmit">搜索</el-button>
          <el-button size="small" @click="reset">清空</el-button>
          <!-- <el-button @click="refreshCurrentPage" size="small">刷新</el-button> -->
        </slot>
        <div class="action-wrapper">
          <slot name="extra-action" />
        </div>
      </el-form>
    </div>
    <el-table
      ref="table"
      v-loading="loadingList"
      :data="tableData"
      border
      :header-cell-style="background"
      :default-expand-all="true"
      row-key="id"
      :tree-props="{children: 'children'}"
      element-loading-text="拼命加载中"
      style="width: 100%"
      stripe
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <slot name="table" />
    </el-table>
    <div class="padding">
      <slot name="footer-action" />
    </div>
    <el-row v-if="showPagination">
      <div class="block">
        <el-pagination
          background
          :current-page="currentPage"
          :page-size="size"
          :page-sizes="pageSizes"
          :layout="pageLayout"
          :total="totalCount"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'List',
  props: {
    searchRules: Object,
    searchForm: Object,
    clearEvaluation: {
      type: Function,
      default: () => {}
    },
    params: {
      type: Object,
      default() {
        return {
          page: 0,
          size: 20
        }
      }
    },
    showPagination: {
      type: Boolean,
      default() {
        return true
      }
    },
    pageSizes: {
      type: Array,
      default() {
        return [20, 30, 50]
      }
    },
    pageLayout: {
      type: String,
      default: 'total, prev, pager, next, jumper'
    },
    fetchList: {
      type: Function,
      required: true
    },
    targetId: {
      type: Number,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      tableData: [],
      totalCount: 0,
      size: 20,
      currentPage: 0,
      loadingList: true,
      background: {
        'background': 'rgba(0, 0, 0, 0.02)'
      }
    }
  },
  beforeCreated() {
    this.size = this.params.size
  },
  mounted() {
    if (this.tableData.length === 0) {
      this.fetch()
    }
  },
  methods: {
    filterObj(obj) {
      Object.keys(obj).forEach(key => {
        const item = obj[key]
        if (item === '' || item === undefined || item === null) {
          delete obj[key]
        }
      })
    },
    fetch(data = {}) {
      this.loadingList = true
      const params = this.targetId ? Object.assign(this.params, this.searchForm, data, { id: this.targetId }) : Object.assign(this.params, this.searchForm, data)
      this.filterObj(params)
      this.fetchList(params)
        .then(data => {
          this.tableData = data.content || data.data || data || []
          this.totalCount = data.totalElements ? data.totalElements : this.tableData.length
          this.loadingList = false
        })
        .catch(() => {
          this.loadingList = false
        })
    },
    refreshList() {
      const page = (this.currentPage = 0)
      this.fetch({ page })
    },
    refreshCurrentPage() {
      this.fetch()
    },
    handleSizeChange(size) {
      this.size = size
      this.fetch({ size })
    },
    handleCurrentChange(page) {
      this.currentPage = page
      --page
      this.fetch({ page })
    },
    handleSubmit() {
      if (this.rules) {
        this.$refs.searchForm.validate(valid => {
          if (valid) {
            this.submit()
          } else {
            return false
          }
        })
      } else {
        this.submit()
      }
    },
    submit() {
      this.currentPage = 0
      const page = this.currentPage
      this.fetch({ page })
    },
    reset() {
      this.$refs.searchForm.resetFields()
      this.clearEvaluation()
      this.refreshList()
    },
    sortChange({ column, prop, order }) {
      this.$emit('sort-change', { column, prop, order })
    },
    handleSelectionChange(val) {
      this.$emit('handleSelect', val)
    }
  }
}
</script>
<style lang="scss">
.common-list {
  padding: 0px 30px 30px 30px;
  background: white;
  border-radius: 4px;
  .search-form {
    .el-input .el-input__inner {
      width: 150px;
    }
  }
  .el-pagination {
    text-align: right;
    margin-top: 1em;
  }
  .el-form-item__label {
    text-align: left;
  }
  .action-wrapper {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 16px;
  }
  .padding {
    margin-top: 8px;
  }
}
</style>
