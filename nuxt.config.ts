// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit',
    'nuxt-studio',
    '@nuxtjs/i18n'
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
  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.yaml', name: 'English' },
      { code: 'zh', language: 'zh-CN', file: 'zh.yaml', name: '简体中文' },
      { code: 'sv', language: 'sv-SE', file: 'sv.yaml', name: 'Svenska' }
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: '__client_lang'
    },
    vueI18n: 'i18n.config.ts'
  },
  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2024-07-11',
  studio: {
    route: '/',
    repository: {
      provider: 'github', // 'github' or 'gitlab'
      owner: 'louhuanbin', // your GitHub/GitLab username or organization
      repo: 'duco-docs', // your repository name
      branch: 'main', // the branch to commit to (default: main)
    },
    i18n: {
      defaultLocale: 'en' // 'en', 'fr' or 'de'
    },
    dev: true
  },
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
  },
  runtimeConfig: {
    // 服务端可用（不会暴露给浏览器）
    allowedGithubEmails: process.env.STUDIO_GITHUB_MODERATORS,
    githubClientId: process.env.STUDIO_GITHUB_CLIENT_ID,
    githubClientSecret: process.env.STUDIO_GITHUB_CLIENT_SECRET,
     redirectBaseUrl: process.env.STUDIO_REDIRECT_BASE_URL,
    // public 内的会暴露到浏览器（不要存密钥）
    public: {
     clientId: process.env.STUDIO_GITHUB_CLIENT_ID,
    }
  }
})