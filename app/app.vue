<script setup lang="ts">
const { seo } = useAppConfig()
const route = useRoute()
// const version = computed(() => {
//   return (route.params.version as string) || 'v1'
// })

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
// const { data: fullNavigation } = await useAsyncData(
//   'navigation',
//   () => queryCollectionNavigation('docs')
// )
// const navigation = computed<any[]>(() => {
//   if (!fullNavigation.value) return []

//   return fullNavigation.value.filter(item =>
//     item.path?.startsWith(`/${version.value}`)
//   )
// })
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

// const { data: fullFiles } = useLazyAsyncData(
//   'search',
//   () => queryCollectionSearchSections('docs'),
//   { server: false }
// )

// const files = computed(() => {
//   if (!fullFiles.value) return []

//   return fullFiles.value.filter((section:any) =>
//     section.id?.startsWith(`/${version.value}`)
//   )
// })

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image'
})
provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
<style lang="css">
/* nuxt-studio{
  display: none !important;
} */
</style>
