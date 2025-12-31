<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute();
const version = computed(() => {
  return (route.params.version as string) || 'customer'
})
const fullNavigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const navigation = computed<any[]>(() => {
  if (!fullNavigation?.value) return []

  const filterNavigation =  fullNavigation?.value.filter(item =>
    item.path?.startsWith(`/${version.value}`)
  )
  // filterNavigation.forEach(item => {
  //   if(item.title === 'customer' || item.title === 'tech'){
  //     item.title = 'DUCO Docs'
  //   }
  // })
  return filterNavigation;
})
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UContentNavigation
            highlight
            :navigation="navigation"
          />
        </UPageAside>
      </template>

      <slot />
    </UPage>
  </UContainer>
</template>
