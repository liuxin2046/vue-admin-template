<template>
  <div class="app-container">
    <editor :value="content" :change="changeContent" />
  </div>
</template>

<script>
import Editor from '@/components/Editor'
export default {
  name: 'RichText',
  components: {
    Editor
  },
  data() {
    return {
      content: '<div>wtf</div>'
    }
  },
  methods: {
    changeContent(val) {
      this.content = val
      console.log('text:', val)
    }
  }
}
</script>

<style scoped>

</style>
