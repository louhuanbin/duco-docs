// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit'
  ],

  devtools: {
    enabled: true
  },

   fonts: {
    providers: {
      google: false,
      googleicons: false
    }
  },
  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 2
        }
      }
    }
  },

  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    provider: 'iconify'
  },

  llms: {
    domain: 'http://localhost:3000',
    title: 'DUCO Docs',
    description: 'A documentation with DUCO STUDIO.',
    full: {
      title: 'DUCO STUDIO - Full Documentation',
      description: 'This is the full documentation for DUCO Studio.'
    },
    sections: [
      {
        title: 'Live View',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/live-view%' }
        ]
      },
      {
        title: 'Explore',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/explore%' }
        ]
      },
       {
        title: 'TOA',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/test%' },
          { field: 'path', operator: 'LIKE', value: '/test-reports%' },
          { field: 'path', operator: 'LIKE', value: '/test-cases-library%' },
          { field: 'path', operator: 'LIKE', value: '/test-templates%' }
        ]
      },
      {
        title: 'Mgmt',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/core-service-health%' },
          { field: 'path', operator: 'LIKE', value: '/data-flow-monitor%' },
          { field: 'path', operator: 'LIKE', value: '/devices%' },
          { field: 'path', operator: 'LIKE', value: '/vehicles%' }
        ]
      }
    ]
  },

  mcp: {
    name: 'Docs'
  }
})
