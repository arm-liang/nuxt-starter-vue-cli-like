<template>
  <div class="index-1">
    <h1>首页</h1>
    <h2>{{ name }}</h2>
    <h3>{{ company }}</h3>
    <!--点击使用浏览器发送请求-->
    <el-button type="primary" @click="loadData">
      点击
    </el-button>
  </div>
</template>

<script>

import { test } from '@/api'

export default {
  async asyncData() {
    try {
      // 使用服务端发送请求
      await test()
    } catch (e) {
      // 使用try,catch 请求格式和github的不相同
      return e
    }
  },
  data() {
    return {
      name: '',
      company: ''
    }
  },
  beforeMount() {
  },
  methods: {
    async loadData() {
      try {
        await test()
      } catch (e) {
        this.name = e.name
        this.company = e.company
      }
    }
  }
}
</script>

<style lang="scss">
</style>
