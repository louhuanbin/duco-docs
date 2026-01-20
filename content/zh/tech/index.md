---
title: 介绍
description: 数据流
navigation:
  icon: i-lucide-house
---

## 数据流

::steps
### 数据采集

DUCO 应用程序从 CAN 总线和其他数据源采集数据，并将全部原始数据上报至 Azure IoT Hub。

- 消息类型: `vehicle_can`, `vehicle_dtc`, `vehicle_position`, `vehicle_log`, `vehicle_event`, `client_raw_data`.

### 数据处理

1. Ingestor 服务器从 Azure IoT Hub 订阅所有原始数据。
   - 在接收到原始数据后，系统会将其发布到 Kafka。
   - 如果原始数据为实时数据，系统将对其进行单独解析，并发布到 Redis Pub/Sub。
2. 数据处理模块从 Kafka 订阅所有原始数据，并对其进行处理。
   - 原始数据将被校验并解析。
   - 原始数据将持久化存储至 **ClickHouse**。
   - 解析后的数据将发布至 **Kafka**。
3. 已校验并解析的数据逻辑从 Meta API 获取。

### 数据分发

1. Distributor 层负责订阅来自 Kafka 的全部解析后数据。
   - 解析后的数据将持久化至 **Redis Snapshot**。
   - 解析后的数据将存储至 **ClickHouse**。
::

---

::mermaid
flowchart TB
subgraph Machine\["Machine"]
subgraph DUCOAPP\[DUCO app]
CAN\[vehicle\_can]
ClientRawData\[Client Raw Data]
DTC\[vehicle\_dtc]
Position\[vehicle\_position]
Log\[vehicle\_log]
Event\[vehicle\_event]
end
end
subgraph IOTHUB\["IOTHUB"]
IOT\[Azure IoT Hub]
end
DUCOAPP -->|Pub All Raw Data| IOT
subgraph Ingestor\["Ingestor Server"]
RawData\[Get All Raw Data]
RT\[Real-time Raw Data]
ProcessRawData\[Process Raw Data]
ValidateAndParsed\[Validate And Parse Data]
end
subgraph KafkaServer\["Kafka Server"]
Kafka\[(Kafka)]
end
IOT -->|Sub All Raw Data| RawData
RawData -->|Pub All Raw Data
Traffic distribution
\| Kafka
RawData -->|If Real-time Raw Data| RT
Kafka -->|ReSub Raw Data| ProcessRawData
ValidateAndParsed <--> |validate and Parse Raw Data| RT
ValidateAndParsed <-->|Validate and Parse Raw Data| ProcessRawData
subgraph MetaAPI\["MetaApi Server "]
CMSAPI\[API]
end
CMSAPI -->|Get Validate And Parsed Logic Data| ValidateAndParsed
subgraph PgSql\["PostgreSQL"]
Pg\[(PostgreSQL)]
end
Pg <--> MetaAPI
subgraph Redis\["SnapShot and RT Redis server"]
RTRedis\[(RealTime)]
SnapShotRedis\[(SnapShot)]
end
RT -->|Pub Parsed RT Data To redis| RTRedis
subgraph CH\["ClickHouse"]
CHCe\[(ce\_technology)]
CHRaw\[(raw\_data\_cache\_store)]
end
RT-->|Write Raw Data to CH| CHRaw
ProcessRawData-->|Write Raw Data to CH| CHRaw
ProcessRawData-->|Pub Parsed Data| Kafka
subgraph Distributor\["Distributor layer"]
ParsedData\[Get Parsed Data]
end
Kafka -->|Sub Parsed Data| ParsedData
ParsedData -->|Write Parsed Data| SnapShotRedis
ParsedData -->|Write Parsed Data| CHCe
::

## 组件交互

本文档旨在说明 DUCO 实时监控与仪表盘系统的数据流转过程及组件间的交互机制。
整个流程整合了 Redis、ClickHouse、Grafana、DUCO Studio 前后端、IoT Hub 和 PostgreSQL 等关键组件。
----------------------------------------------------------------------------

### Redis 服务

Redis 服务分为两类：RealTime Redis 和 Snapshot Redis。


1. RealTime Redis

- Stores parsed real-time streaming data.
- Publishes messages through Redis Pub/Sub for immediate delivery to WebSocket clients.
- Data is consumed by DUCO Studio → Backend (WebSocket).

2. Snapshot Redis

- Stores pre-computed snapshot data for quick UI access.
- The backend (CMS API) pulls snapshot data when needed.`to be phased out`
- Used by Data API Server → Redis Snapshot API.`to be introduced`

### DUCO Studio

The DUCO Studio platform contains two main components: Frontend and Backend.

1. Frontend

- The main Page communicates with backend services using:
- Request / Response calls to the Backend API.
- WebSocket connections for receiving real-time data.
- Proxy Grafana calls to request dashboard rendering.

2. Backend

- Backend API
- Acts as the API proxy layer for the frontend.
- Communicates with CMS API and reads historical data from ClickHouse via Data API.
- WebSocket Service
- Subscribes to real-time parsed data from Redis (Pub/Sub).
- Pushes live messages directly to the frontend page.
- Proxy Grafana
- Forwards dashboard rendering requests from the frontend to Grafana.

### Grafana Server

- Contains Dashboards that visualize metrics.
- Dashboards are embedded into the DUCO Studio frontend.
- Proxy Grafana requests data directly from the Grafana Server.
- Grafana also reads variable configurations from MetaAPI for dashboard setup.

### MetaAPI Server

- Meta API is responsible for:
- Managing metadata and configurations.
- Handling commands sent from/to IoT Hub.
- Reading/writing metadata to PostgreSQL.
- Retrieving snapshot data from Redis.

### PostgreSQL

- Used for structured metadata storage.
- Meta API performs read/write operations.
- Device metadata
- Variable Data
- Parsed Login Data

### Azure IoT Hub

- Acts as the message gateway between cloud and device.
- Supports:
- Send Command
- Receive Command Result
- Two-way communication exists between:
- Meta API ↔ IoT Hub
- IoT Hub ↔ DUCO App

### DUCO App (On-Device)

- Installed on the machine device.
- Sends command results back to IoT Hub.
- Executes commands received from the cloud.
- Provides raw data to the IOT Hub.

### ClickHouse Database

- Stores large-scale telemetry and historical real-time data.
- Queried by:
- Backend API (via ClickHouse API)
- Data API Server
- Data API has separate endpoints for:
- ClickHouse API — Reading historical data

## The green dashed arrows in the diagram represent traffic that is moving toward the new Data API Server, which will replace older direct connections.

**Legend**

- 🟧 Orange line (`#ffa500`): *This connection will be phased out soon*
- 🟩 Green dashed line (`#00aa00`): *This connection will be introduced soon*

### Studio Data Flow

::mermaid
flowchart TD
subgraph Redis\["Redis Server"]
RTRedis\[(RealTime Redis)]
SnapShotRedis\[(SnapShot Redis)]
end
subgraph DUCOStudio\["DUCO Studio"]
subgraph Frontend\["Frontend Page"]
Page\[Page]
end
subgraph Backend\["Backend Server"]
BackendAPI\[API Proxy]
WS\[Websocket]
ProxyGfana\[Proxy Grafana]
end
Page <--> | Request / Response| BackendAPI
Page <--> | Connection / Receive & Send Message| WS
Page --> | Request Dashboard| ProxyGfana
end
RTRedis -->|Sub Parsed Real-time Data| WS
subgraph Grafana\["Grafana Server"]
Dashboard\[Dashboard]
end
Dashboard -->| Embbed Dashboard|Page
ProxyGfana -->|Request GF Server| Grafana
subgraph MetaAPI\["MetaApi Server "]
CMSAPI\[API]
end
subgraph PgSql\["PostgreSQL"]
Pg\[(PostgreSQL)]
end
Pg <-->| Write and Read| MetaAPI
BackendAPI <-->|Request / Response| CMSAPI
subgraph IOTHUB\["IOTHUB"]
IOT\[Azure IoT Hub]
end
CMSAPI <-->|Send Command / Received Command Result| IOT
subgraph DUCOAPP\[DUCO app]
APP\[APP]
end
IOT <-->|Send Command / Received Command Result| APP
subgraph CH\["ClickHouse"]
CHCe\[(ce\_technology)]
end
CHCe --> |Read Data| BackendAPI
linkStyle 10 stroke:#ffa500,stroke-width:2px;
SnapShotRedis --> |Read SnapShotData| CMSAPI
linkStyle 11 stroke:#ffa500,stroke-width:2px;
subgraph DataAPI\["Data API Server"]
DataCH\[Clickhouse API]
DataSnapShot\[Redis SnapShot API]
end
CHCe -.-> |Read Data| DataCH
SnapShotRedis -.-> |Read SnapShotData| DataSnapShot
linkStyle 12 stroke:#00aa00,stroke-width:2px;
linkStyle 13 stroke:#00aa00,stroke-width:2px;
DataAPI -.-> |Read Data| BackendAPI
linkStyle 14 stroke:#00aa00,stroke-width:2px;
CMSAPI --> |Get Variables Data| Grafana
::
