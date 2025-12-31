---
title: introduction
description: Technology Documentation for DUCO Studio
navigation:
  icon: i-lucide-house
---

::accordion
---
defaultValue:
  - '1'
---

::accordion-item{label="Is Nuxt UI free to use?" icon="i-lucide-circle-help"}
Yes! Nuxt UI is completely free and open source under the MIT license. All 125+ components are available to everyone.
::

::accordion-item{label="Can I use Nuxt UI with Vue without Nuxt?" icon="i-lucide-circle-help"}
Yes! While optimized for Nuxt, Nuxt UI works perfectly with standalone Vue projects via our Vite plugin. You can follow the [installation guide](/docs/getting-started/installation/vue) to get started.
::

::accordion-item{label="Is Nuxt UI production-ready?" icon="i-lucide-circle-help"}
Yes! Nuxt UI is used in production by thousands of applications with extensive tests, regular updates, and active maintenance.
::

::

## Heading

### Heading1

### Heading2

### Heading3

### Heading4

## Text For Format

**Strong text**

*Emphasized text*

[Nuxt documentation](https://nuxt.com)

> Nuxt UI automatically adapts to your theme settings, ensuring consistent typography across your entire application.

| Prop    | Default   | Type                     |
|---------|-----------|--------------------------|
| `name`  |           | `string`{lang="ts-type"} |
| `size`  | `md`      | `string`{lang="ts-type"} |
| `color` | `neutral` | `string`{lang="ts-type"} |

<iframe src="https://www.youtube-nocookie.com/embed/_eQxomah-nA?si=pDSzchUBDKb2NQu7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="aspect-ratio: 16/9; width: 100%;"></iframe>

![image](/images/live_data_list.png){width="1200"}

```vue
<script setup lang="ts">
const message = ref('Hello World!')

function updateMessage() {
  message.value = 'Button clicked!'
}
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
    <UButton @click="updateMessage">
      Click me
    </UButton>
  </div>
</template>
```

::badge
**v4.0.0**
::

::callout{icon="i-lucide-square-play" color="neutral" to="/docs/getting-started/installation/nuxt"}
This is a `callout` with full **markdown** support.
::

::note
Here's some additional information.
::

::tip
Here's a helpful suggestion.
::

::warning
Be careful with this action as it might have unexpected results.
::

::caution
This action cannot be undone.
::

::steps{level="4"}

#### Add the Nuxt UI module in your `nuxt.config.ts`

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

#### Import Tailwind CSS in your CSS

```css [assets/css/main.css]
@import "tailwindcss";
```

#### Start your development server

```bash
npm run dev
```

::

::steps{level="2"}
- `5cb65`—fix:improve focus styles
- `5cb65`—fix:improve focus styles
- `5cb65`—fix:improve focus styles
::

::card{title="Startup" icon="i-lucide-users" color="primary" to="https://nuxt.lemonsqueezy.com" target="_blank"}
Best suited for small teams, startups and agencies with up to 5 developers.
::

::code-collapse

```css [main.css]
@import "tailwindcss";
@import "@nuxt/ui";

@theme static {
  --font-sans: 'Public Sans', sans-serif;

  --breakpoint-3xl: 1920px;

  --color-green-50: #EFFDF5;
  --color-green-100: #D9FBE8;
  --color-green-200: #B3F5D1;
  --color-green-300: #75EDAE;
  --color-green-400: #00DC82;
  --color-green-500: #00C16A;
  --color-green-600: #00A155;
  --color-green-700: #007F45;
  --color-green-800: #016538;
  --color-green-900: #0A5331;
  --color-green-950: #052E16;
}
```

::

::code-group

```bash [pnpm]
pnpm add @nuxt/ui
```

```bash [yarn]
yarn add @nuxt/ui
```

```bash [npm]
npm install @nuxt/ui
```

```bash [bun]
bun add @nuxt/ui
```

::

::code-preview
`inline code`

#code
```mdc
`inline code`
```
::

::code-tree{defaultValue="app/app.config.ts"}

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css']
})

```

```css [app/assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";
```

```ts [app/app.config.ts]
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      colors: 'slate'
    }
  }
})
```

```vue [app/app.vue]
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

```json [package.json]
{
  "name": "nuxt-app",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "typecheck": "nuxt typecheck"
  },
  "dependencies": {
    "@iconify-json/lucide": "^1.2.18",
    "@nuxt/ui": "^4.0.0",
    "nuxt": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vue-tsc": "^3.1.5"
  }
}
```

```json [tsconfig.json]
{
  "extends": "./.nuxt/tsconfig.json"
}
```

````md [README.md]
# Nuxt 4 Minimal Starter

Look at the [Nuxt 4 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
````

::


::collapsible

| Prop    | Default   | Type                     |
|---------|-----------|--------------------------|
| `name`  |           | `string`{lang="ts-type"} |
| `size`  | `md`      | `string`{lang="ts-type"} |
| `color` | `neutral` | `string`{lang="ts-type"} |

::

::field{name="name" type="string" required}
The `description` can be set as prop or in the default slot with full **markdown** support.
::

::field-group
  ::field{name="analytics" type="boolean"}
    Default to `false` - Enables analytics for your project (coming soon).
  ::

  ::field{name="blob" type="boolean"}
    Default to `false` - Enables blob storage to store static assets, such as images, videos and more.
  ::

  ::field{name="cache" type="boolean"}
    Default to `false` - Enables cache storage to cache your server route responses or functions using Nitro's `cachedEventHandler` and `cachedFunction`
  ::

  ::field{name="database" type="boolean"}
    Default to `false` - Enables SQL database to store your application's data.
  ::
::

:icon{name="i-simple-icons-nuxtdotjs"}

:kbd{value="meta"} :kbd{value="K"}

::callout
Lorem velit voluptate ex reprehenderit ullamco et culpa.
::


::tabs

:::tabs-item{label="Code" icon="i-lucide-code"}

```mdc
::callout
Lorem velit voluptate ex reprehenderit ullamco et culpa.
::
```

:::

:::tabs-item{label="Preview" icon="i-lucide-eye"}

::callout
Lorem velit voluptate ex reprehenderit ullamco et culpa.
::

:::

::

## Changelog


::steps{level=3}
### Add new feature
### Fix bug
### Update documentation
### Add new component### Update dependencies
### Add new feature
### Fix bug

::

- `dd81d` — **feat:** add `data-slot` attributes ([#5447](https://github.com/xxx/xxx/pull/5447))
- `5cb65` — **feat:** import `@nuxt/ui-pro` components
- `e6e51` — **fix:** `class` should have priority over `ui` prop
- `39c86` — **fix:** refactor types after `@nuxt/module-builder` upgrade ([#3855](https://github.com/xxx/xxx/pull/3855))


<Changelog>
  <Change hash="dd81d" type="feat">
    add <code>data-slot</code> attributes
    <a href="https://github.com/...">#5447</a>
  </Change>

  <Change hash="5cb65" type="feat">
    import <code>@nuxt/ui-pro</code> components
  </Change>

  <Change hash="e6e51" type="fix">
    <code>class</code> should have priority over <code>ui</code> prop
  </Change>
</Changelog>


## Architecture

### mermaind1

```
::mermaid
flowchart LR
  markdown\["`This **is** _Markdown_`"]
  newLines\["`Line1<br/>
  Line 2<br/>
  Line 3`"]
  markdown --> newLines
::
```

::mermaid
graph TD
A --> B
::

::Mermaid

graph TD
A\[User Id] --> B\[Load Balancer]
B --> C

::




### mermaid2
::mermaid
sequenceDiagram
Alice->>Bob: Hello Bob
Bob-->>Alice: Hi Alice
::
