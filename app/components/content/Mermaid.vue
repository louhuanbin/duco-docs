<script setup lang="ts">
import mermaid from 'mermaid'
import { ref, onMounted } from 'vue'

const el = ref<HTMLElement | null>(null)
const id = `mermaid-${Math.random().toString(36).slice(2)}`

mermaid.initialize({ startOnLoad: true  })

function normalize(code: string) {
  return code.trim()
}

onMounted(async () => {
  if (!el.value) return

  const raw = el.value.textContent || ''
  const { svg } = await mermaid.render(id, normalize(raw))
  el.value.innerHTML = svg
})
</script>

<template>
  <div ref="el" class="mermaid">
    <slot />
  </div>

</template>
