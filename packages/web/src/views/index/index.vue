<template>
  <div class="index" :loading="loading">
    index...
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from '../../utils/request.ts'

const loading = ref(false)

onMounted(async () => {
  const res = await axios.get('/config/get')
  console.log(res);

})
</script>

<style scoped lang="stylus" >
</style>
