<template>
  <div class="relative flex gap-3">
    <span class="absolute left-[-18px] top-2 w-2 h-2 rounded-full bg-gray-400" />

    <span class="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
      {{ hash }}
    </span>

    <div class="text-sm">
      <strong>{{ type }}:</strong>
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  hash: string;
  type: string;
}>();
</script>
