<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1 class="!text-[16px] mx-4">{{ msg }}</h1>

  <div class="card">
    <van-button type="primary" @click="count++">count is {{ count }}</van-button>
  </div>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
