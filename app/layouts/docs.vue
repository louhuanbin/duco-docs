<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute();
const version = computed(() => {
  return (route.params.version as string) || 'customer'
})
const language = computed(() => {
  return (route.params.language as string) || 'en'
})
const fullNavigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const navigation = computed<any[]>(() => {
  if (!fullNavigation?.value) return []

  const findLang = fullNavigation?.value.find(item => item.path === `/${language.value}`)
  if(!findLang){
    return [];
  }
  const filterNavigation = findLang.children?.find(item =>
    item.path === `/${language.value}/${version.value}`
  )
  // filterNavigation.forEach(item => {
  //   if(item.title === 'customer' || item.title === 'tech'){
  //     item.title = 'DUCO Docs'
  //   }
  // })
  return filterNavigation && filterNavigation?.children || [];
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
