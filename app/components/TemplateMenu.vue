<script setup lang="ts">
const route = useRoute()

// 1️⃣ 当前版本（从路由推断，刷新不丢）
const currentVersion = computed<'customer' | 'tech'>(() => {
  return route.params.version as 'customer' | 'tech';
})
const lang = computed(() => route.params.language as 'en' | 'zh' | 'sv')

// 2️⃣ 下拉菜单项
const items:any = computed(() => [
  {
    label: 'Docs Customer',
    checked: currentVersion.value === 'customer',
    color: currentVersion.value === 'customer' ? 'primary' : '',
    type: 'checkbox',
    onSelect: () => {
      navigateTo(`/${lang.value}/customer`)
    }

  },
  {
    label: 'Docs Tech',
    checked: currentVersion.value === 'tech',
    color: currentVersion.value === 'tech' ? 'primary' : '',
    type: 'checkbox',
    onSelect: () => {
      navigateTo(`/${lang.value}/tech`)
    }
  }
])
</script>
<template>
  <UDropdownMenu
    v-slot="{ open }"
    :modal="false"
    :items="items"
    :content="{ align: 'start' }"
    :ui="{ content: 'min-w-fit' }"
    size="xs"
  >
    <UButton
      :label="currentVersion == 'customer' ? 'Docs Customer' : 'Docs Tech'"
      variant="subtle"
      trailing-icon="i-lucide-chevron-down"
      size="xs"
      class="-mb-[6px] font-semibold rounded-full truncate"
      :class="[open && 'bg-primary/15']"
      :ui="{
        trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ')
      }"
    />
  </UDropdownMenu>
</template>
