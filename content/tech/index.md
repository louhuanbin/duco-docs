---
title: Introduction
description: Technical documentation intended for R&D engineers, 
navigation:
  icon: i-lucide-house
---
## Common Signals Data Flow

::mermaid

flowchart TB
subgraph Machine\["Machine"]
  subgraph DUCOAPP\[DUCO app]
    CAN\[vehicle_can]
    ClientRawData\[Client Raw Data]
    DTC\[vehicle_dtc]
    Position\[vehicle_position]
    Log\[vehicle_log]
    Event\[vehicle_event]
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
| Kafka
RawData -->|If Real-time Raw Data| RT
Kafka -->|RESub Raw Data| ProcessRawData
RT --> ValidateAndParsed
ProcessRawData --> ValidateAndParsed
subgraph MetaAPI\["MetaApi Server "]
  CMSAPI\[API]
end
CMSAPI -->|Get Validate And Parsed Logic Data| ValidateAndParsed
subgraph PgSql\["PostgreSQL"]
  Pg\[(PostgreSQL)]
end
Pg <--> MetaAPI
subgraph Redis\["Redis Server"]
  RTRedis\[(RealTime Redis)]
  SnapShotRedis\[(SnapShot Redis)]
end
ValidateAndParsed -->|Pub Parsed Real-time Data| RTRedis
subgraph CH\["ClickHouse"]
  CHCe\[(ce_technology)]
  CHRaw\[(raw_data_cache_store)]
end
ValidateAndParsed -->|Write Raw Data| CHRaw
ValidateAndParsed -->|Pub Parsed Data| Kafka
subgraph Distributor\["Distributor layer"]
  ParsedData\[Get Parsed Data]
end
Kafka -->|Sub Parsed Data| ParsedData
ParsedData -->|Write Parsed Data| SnapShotRedis
ParsedData -->|Write Parsed Data| CHCe
::


## Common Studio Data FLow
**Legend**
- 🟧 Orange line (`#ffa500`): *This connection will be phased out soon*
- 🟩 Green dashed line (`#00aa00`): *This connection will be introduced soon*

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
  CHCe\[(ce_technology)]
end
CHCe --> |Read Data| BackendAPI
linkStyle 9 stroke:#ffa500,stroke-width:2px;
SnapShotRedis --> |Read SnapShotData| CMSAPI
linkStyle 10 stroke:#ffa500,stroke-width:2px;
subgraph DataAPI\["Data API Server"]
  DataCH\[Clickhouse API]
  DataSnapShot\[Redis SnapShot API]
end
CHCe -.-> |Read Data| DataCH
SnapShotRedis -.-> |Read SnapShotData| DataSnapShot
linkStyle 11 stroke:#00aa00,stroke-width:2px;
linkStyle 12 stroke:#00aa00,stroke-width:2px;
DataAPI -.-> |Read Data| BackendAPI
linkStyle 13 stroke:#00aa00,stroke-width:2px;
::




