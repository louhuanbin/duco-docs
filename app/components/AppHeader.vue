<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { SelectItem } from '@nuxt/ui'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { header } = useAppConfig()
const { locale, setLocale } = useI18n()
const route = useRoute()




const items = ref([
  {
    label: 'English',
    value: 'en',
    avatar: {
      src: '/images/gb4x3.png',
      alt: 'English'
    }
  },
  {
    label: '简体中文',
    value: 'zh',
    avatar: {
      src: '/images/cn.png',
      alt: '简体中文'
    }
  },
  {
    label: 'Svenska',
    value: 'sv',
    avatar: {
      src: '/images/se4x3.png',
      alt: 'Svenska'
    }
  }
] satisfies SelectItem[])


const avatar  = computed(() => items.value.find(item => item.value === locale.value)?.avatar)

const updateValue = (val: string) => {
  locale.value = val as "en" | "zh" | "sv"; 
  const path = `/${val}${route.path.replace(/\/(en|zh|sv)/, '')}`;
  setLocale(val as "en" | "zh" | "sv");
  navigateTo(path);
  
}
</script>

<template>
  <UHeader
    :ui="{ center: 'flex-1' }"
    :to="header?.to || '/'"
  >
    <UContentSearchButton
      v-if="header?.search"
      :collapsed="false"
      class="w-full"
    />

    <template
      v-if="header?.logo?.dark || header?.logo?.light || header?.title"
      #title
    >
      <UColorModeImage
        v-if="header?.logo?.dark || header?.logo?.light"
        :light="header?.logo?.light!"
        :dark="header?.logo?.dark!"
        :alt="header?.logo?.alt"
        class="h-6 w-auto shrink-0"
      />

      <span v-else-if="header?.title">
        {{ header.title }}
      </span>
    </template>

    <template
      v-else
      #left
    >
      <NuxtLink :to="header?.to || '/'">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>

      <TemplateMenu />
    </template>

    <template #right>
      <UContentSearchButton
        v-if="header?.search"
        class="lg:hidden"
      />

      <UColorModeButton v-if="header?.colorMode" />

      <template
      v-if="header?.switchLanguage"
      >
      <USelect 
      v-model="locale" 
      :items="items" 
      value-key="value"
       :avatar="avatar"
        class="w-48"
        @update:model-value="updateValue"
        />
      </template>

      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #body>
      <UContentNavigation
        highlight
        :navigation="navigation"
      />
    </template>
  </UHeader>
</template>
