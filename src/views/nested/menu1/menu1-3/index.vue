<template>
  <div style="padding:30px;">
    <!-- <el-alert :closable="false" title="menu 1-3" type="success" /> -->
    <el-button v-permission="['CREATE_RELEASE']" type="primary">新增按钮</el-button>
  </div>
</template>
<script>
import permission from '@/directive/permission/index'
// import checkPermission from '@/utils/permission'
export default {
  directives: { permission },
  methods: {
    // checkPermission
  }
}
</script>
