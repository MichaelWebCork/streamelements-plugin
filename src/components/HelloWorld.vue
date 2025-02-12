<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1 class="text-red-500 bg-blue-100">{{ msg }}</h1>

  <div>
    <button type="button" @click="count++">count is {{ count }}</button>
  </div>

</template>
