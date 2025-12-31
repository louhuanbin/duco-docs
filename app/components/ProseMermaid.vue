<script setup lang="ts">
import mermaid from 'mermaid'

const props = defineProps<{
  code: string
}>()

const el = ref<HTMLElement | null>(null)

onMounted(async () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default'
  })

  await nextTick()

  if (el.value) {
    el.value.innerHTML = props.code.trim()
    await mermaid.run({
      nodes: [el.value]
    })
  }
})
</script>

<template>
  <ClientOnly>
    <div ref="el" class="mermaid" />
  </ClientOnly>
</template>
