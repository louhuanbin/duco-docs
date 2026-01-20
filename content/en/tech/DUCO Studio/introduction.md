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


::mermaid

flowchart TB
subgraph Machine\["ZippleBack"]
  subgraph M1\[DUCO app]
    subgraph CAN\["vehicle_can"]
      LIVEDATA\[LiveData 
      Second Level]
      Regular\[Regular
      minute Level]
      TOACAN\[TOA
      millisecond Level]
    end
    subgraph ClientRawData\["Client Raw Data"]
      Metrics\[Runtime Metrics 
      Second Level]
      TOAMetrics\[TOA]
    end
    subgraph DTC\["vehicle_dtc"]
      Listener\[Real-time DTC]
      keyon\[Key On DTC]
      TOADTC\[TOA]
    end
    subgraph Position\["vehicle_position"]
      RLPosition\[Real-times
      second Level]
      RegularPosition\[Regular
      sampled per two meters]
      TOAPosition\[TOA]
    end
    subgraph Event\["vehicle_log"]
      RegularLog\[Regular
      Key On]
      TOALog\[TOA]
    end
    subgraph Event\["vehicle_event"]
      ListenerEvent\[Real-time]
      TOAEvent\[TOA]
    end
  end
end
subgraph IOTHUB\["IOTHUB"]
  IOT\[Azure IoT Hub]
end
M1 -->|Raw Data| IOT
::



::mermaid

%%{init: {
  "themeVariables": {
    "fontSize": "32px",          
    "nodeTextColor": "#000000",  
    "nodePadding": "20px",
    "lineHeight": "22px"              
  },
  "flowchart": {
    "rankSpacing": 150,
    "nodeSpacing": 120,
    "htmlLabels": true           
  }
}}%%
flowchart TB
subgraph Machine\["Machine Side"]
  M1\[Machine Sensors]
  M2\[DUCO App]
  M1 -->|Raw Data per second| M2
end
subgraph Cloud\["Cloud Ingestion"]
  IOT\[Azure IoT Hub]
  ING\[Ingestor Server]
  META\[MetaAPI Parsing Logic]
  CH\[(ClickHouse)]
  KAFKA\[(Kafka)]
  REDIS\[(Redis Pub/Sub)]
M2 -->|No Command > 3 min 
Stop Stream| M2
M2 -->|vehicle_can / client_raw_data| IOT
IOT -->|Raw Data| ING
ING --> META
META -->|Parsed Data| CH
META -->|Parsed Data| KAFKA
META -->|Parsed Data -> Pub| REDIS
end
subgraph Metaapi\["Metaapi Server"]
  METAAPI\[API Server]
METAAPI -->|Get Parsed Data Logic| META
end
subgraph Frontend\["DUCO Studio Frontend"]
  PAGE\["Live Data Page
UI Mounted"]
  ECHARTS\[ECharts Line Charts]
end
subgraph Studio\["DUCO Studio Server"]
  API\[API Proxy]
  WS\[WebSocket Service]
  REDIS_Job\[(Redis
  1 min TTL)]
  CRON\[Cron Job
  Every 1 min]
end
API -->|Store Access| REDIS_Job
REDIS_Job -->|Check Active Requests| CRON
CRON -->|Invoke MetaAPI if Active| METAAPI
REDIS -->|Sub live-stream/*| WS
PAGE -->|Heartbeat 1 min| API
API -->|Forward First Request| METAAPI
METAAPI -->|Invoke Direct Method| IOT
IOT -->|Command| M2
M2 -->|Execution Result| IOT
IOT -->|Result / Ack| METAAPI
API -->|Initial Echarts data| ECHARTS
CH -->|Get 2 min data| API
WS -->|Filtered Live Data| ECHARTS
ECHARTS -->|Render Charts| PAGE
PAGE -->|Create WebSocket and Send INIT_FIELD_LIST| WS

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


# E2E Second-level Live Data Streaming Pipeline

## Processing Overview

This document describes the **end-to-end (E2E) second-level live data processing pipeline** for vehicle **CAN** and **Metrics** signals, covering the full path from data ingestion on the machine to real-time visualization in the frontend via **WebSocket**.

The system is designed to support:

- High-frequency signal collection (1 Hz)
- Tenant isolation
- Per-user and per-field filtering
- Real-time streaming to multiple concurrent users

---

## High-level Data Flow

The overall live data flow is as follows:

1. The machine boots up
2. Raw CAN signals are collected every second
3. Data is validated, parsed, and published to Kafka
4. Live data is distributed via Redis Pub/Sub
5. WebSocket service authenticates frontend users
6. Real-time data is filtered and pushed to clients
7. Grouped ECharts line charts update dynamically

---

## Detailed Flow Description

### 1. Data Collection (Machine Side)

After the machine starts, the **Duco App Service** running on the vehicle performs the following actions:

- Collects raw CAN signals from the CAN bus
- Sampling frequency: **once per second (1 Hz)**
- Sends raw data to the **Ingestion Service**

This stage ensures reliable and continuous signal acquisition directly from the vehicle.

---

### 2. Ingestion & Validation

The **Ingestion Service** is responsible for processing incoming raw data:

- Validates incoming request parameters
- Parses raw CAN frames into structured signal data
- Produces processed data into Kafka topics

**Purpose of this stage:**

- Decouple upstream data collection from downstream consumers
- Enable horizontal scalability
- Improve system fault tolerance

---

### 3. Data Distribution

The **Distributor Service** handles live data fan-out:

- Consumes second-level signal data from Kafka
- Publishes live data using **Redis Pub/Sub**

#### Redis Topic Naming Convention

```bash
live-stream/{tenant}/consumer-{chassisId}/{msgType}

```
Where:

tenant → Tenant isolation

chassisId → Unique machine identifier

msgType → Signal category or message type

## 4. WebSocket Service (Duco Studio)

Duco Studio exposes a **WebSocket server** responsible for:

- Managing frontend connections
- Performing user authentication and authorization
- Handling connection and subscription lifecycles

### Connection Lifecycle

1. The frontend establishes a WebSocket connection
2. Authentication is performed
3. The client sends an initial subscription message containing:
   - User context
   - Machine identifier
   - Required signal fields

#### Example Subscription Payload

```json
{
  "fields": ["speed", "rpm"]
}
```

## 5. Subscription Management (WebSocket Server)

For each active WebSocket connection:

- Required signal fields are stored in memory
- The server subscribes to the corresponding **Redis Pub/Sub topics**
- Multiple users can subscribe to the **same machine** simultaneously

This design enables:

- Efficient fan-out
- Per-user data isolation
- Flexible subscription management

---

## 6. Redis to WebSocket Forwarding

When Redis receives new live data messages, the WebSocket service performs the following steps:

1. Identifies all active WebSocket connections
2. Applies **per-user field filtering** using `pick(fields)`
3. Forwards only the required signal fields to each client

### Benefits

- Reduced payload size
- Per-user and per-field data isolation
- Efficient real-time broadcasting

---

## 7. Frontend Rendering

On the frontend side:

- Second-level live data is received via WebSocket
- Signals are logically grouped
- **ECharts line charts** are dynamically updated
- Near real-time visualization is achieved

---

## Data Processing Characteristics

### Latency

- Approximately **1 second**

### Transport Layers

- **Kafka**: Durable and scalable data streaming
- **Redis Pub/Sub**: Low-latency real-time fan-out
- **WebSocket**: Push-based frontend delivery

### Filtering Strategy

- Per-user
- Per-machine
- Per-field

### Scalability

- Kafka supports horizontal scaling
- Redis Pub/Sub enables efficient real-time distribution
- WebSocket nodes remain stateless (except in-memory subscriptions)

---

## Architecture Diagram (Logical View)

### ASCII Diagram (Markdown-friendly)

```text
+-------------+        +----------------+        +--------+
|   Machine   |        |  Ingestion     |        | Kafka  |
| Duco App    | -----> |  Service       | -----> |        |
| (CAN Data)  |        | (Validate &    |        |        |
+-------------+        |  Parse)        |        +--------+
                       +----------------+
                                |
                                v
                      +------------------+
                      |  Distributor     |
                      |  Service         |
                      +------------------+
                                |
                                v
                       Redis Pub/Sub (Live)
                                |
                                v
                      +------------------+
                      | WebSocket Server |
                      | (Duco Studio)    |
                      +------------------+
                                |
                                v
                      Frontend (ECharts)

```
