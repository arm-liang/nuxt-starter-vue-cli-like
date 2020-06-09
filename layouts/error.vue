<template>
  <div>
    <h1>{{ error.statusCode }}</h1>
    <h2>{{ error.path }}</h2>
    <el-alert>{{ error.message }}</el-alert>
  </div>
</template>

<script>
export default {
  name: 'Error',
  props: {
    error: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
