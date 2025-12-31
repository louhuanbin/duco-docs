---
title: Live Data
description: End-to-End Second-Level Real-Time Data Streaming Pipeline and Dynamic Trend Visualization in ECharts Line Charts
navigation:
  icon: i-fluent:pulse-24-filled
---


## 1. Data Collection

After the machine is **key-on**, the **DUCO App** starts collecting data from the machine **once per second**.

Currently, the message types collected for **Live Data** include:

- **vehicle_can**  
  Full raw data from the CAN bus.  
  This data **requires parsing** before it can be used.

- **client_raw_data**  
  Data that does **not require parsing**, including:
  - DUCO App performance metrics
  - Overall machine application performance data

The DUCO App service connects to **Azure IoT Hub** and sends the collected data to the hub.

---

## 2. Data Processing

### 2.1 Ingestor Server

The **Ingestor Server** connects to **Azure IoT Hub** and receives the data collected by the DUCO App.

Using parsing logic configured in **MetaAPI**, the raw data is parsed into **human-readable data**.

After parsing:
- One copy of the parsed data is stored in **ClickHouse**
- Another copy is **published to Kafka**

---

### 2.2 Distributor Server

The **Distributor Server** subscribes to the Kafka service and receives the parsed data.

For data of type **realTime**:
- The data is published to **Redis Pub/Sub**
- The topic format is:

`live-stream/{tenant}/consumer-{chassisId}/{msgType}`

---

## 3. Data Consumption

### 3.1 DUCO Studio Server – WebSocket Service

The **DUCO Studio Server** starts a **WebSocket service** to deliver **second-level real-time data** for the **Live Data** page.

The WebSocket URL format is:
`/api/resources/{orgId}/_common/datasets/{chassisId}/live?msgType={msgType}`

When a client connects:
- The WebSocket peer is stored in a `Map` structure , variable as `clientConnections`
- The key is constructed as:
`{chassisId}:{msgType}`

- The peer is added to the corresponding connection set:

```ts
clientConnections.get(key)!.add(peer);
```
- Client Field Mapping per Peer
  > 1. Each peer receives a fieldList from the client.
  > 2. The field list is stored in a Map called clientFields.
  > 3. The peer is used as the key to associate the corresponding field list.
  >  ```ts
  >  clientFields.set(peer, fieldList)
  >  ```

### 3.2 Redis Subscription and Message Dispatching

The **DUCO Studio Server** connects to the **Redis Pub/Sub** service used by the **Distributor Server**.

Based on parameters received from the frontend, the server subscribes to all streams under:

`live-stream/*`
For each message received from Redis:

- 1. The server compares the Redis channel with the user-subscribed channel

- 2. If the channels match, the message is dispatched to all WebSocket peers stored in clientConnections

- 3. Messages are picked by filedList and sent:
```ts
const filedList = clientFields.get(peer)!;
const payload = JSON.parse(message).payload;

const filteredPayload = _.pick(payload, filedList)
peer.send(JSON.stringify({
  type: 'LIVE_DATA',
  payload: filteredPayload
}));
```
### 3.3 Live Data Configuration in DUCO Studio Portal

In **DUCO Studio Portal → Live View → Live Data**, users configure **ECharts Line Group** parameters.

After the configuration is completed, the group list is displayed as shown below:

![Group list](/images/live_data_group.png)

For details on how to configure groups, please refer to  
[Config Group](/customer/live-view/livedata).

By default, each ECharts Line Group in the Group List displays data from the past 2 minutes.

When the Live Data page is initialized:
- The frontend calls a DUCO Studio API to request historical data.
- The DUCO Studio API connects to ClickHouse.
- ClickHouse is queried to retrieve data from the previous two minutes.
- The queried data is returned to the frontend and rendered in the corresponding ECharts line charts.
This ensures that users can immediately see recent historical data before real-time data starts streaming.


### 3.4 WebSocket Initialization on Page Mount

When the **Live Data** page is mounted:

1. Field List Initialization & Filtering via WebSocket
- Retrieve the fields list under the Group List for both:
  - `vehicle_can`
  - `client_raw_data`
- After the WebSocket connection is successfully established, send the retrieved fields lists to the WebSocket server.
- The WebSocket server stores the fields lists separately on the server side.
- When the socket sends a message, it picks only the requested fields and returns only the required fields to the client.

2. The frontend initializes WebSocket connections by calling the following msg Type:

- `vehicle_can`
- `client_raw_data`

These codes establish connections to the **DUCO Studio WebSocket server** using the logic shown below:

```ts[vehicle_can]
const connectionUrl = `/api/resources/${props.orgId}/_common/datasets/${props.chassisId}/live?msgType=vehicle_can`;
const wsUrl = resolveWebSocketUrl(connectionUrl);

if (!wsUrl) {
  return;
}

client = new WebSocket(wsUrl);
const fieldList = [
    'speed',
    'engine_rpm',
    'brake_status'
  ];
client.onopen = () => {
  client.send(JSON.stringify({
    type: 'INIT_FIELD_LIST',
    payload: fieldList
  }))
}

```

For metrics data, a separate WebSocket connection is created:

```ts[client_raw_data]
const connectionUrl = `/api/resources/${props.orgId}/_common/datasets/${props.chassisId}/live?msgType=client_raw_data`;
const wsUrl = resolveWebSocketUrl(connectionUrl);

if (!wsUrl) {
  return;
}

metricClient = new WebSocket(wsUrl);
const fieldList = [
    'gps_lat',
    'gps_lng',
    'timestamp'
  ];
metricClient.onopen = () => {
  metricClient.send(JSON.stringify({
    type: 'INIT_FIELD_LIST',
    payload: fieldList
  }))
}

```
After the WebSocket connection is successfully established, the frontend listens
for messages from the server. Each incoming message is parsed and immediately
applied to the corresponding **ECharts line series**, allowing the chart to be
updated dynamically in real time.
### 3.5 Real-time Architecture Diagram
::mermaid

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
M2 -->|vehicle_can / client_raw_data| IOT
IOT -->|Raw Data| ING
ING --> META
META -->|Parsed Data| CH
META -->|Parsed Data| KAFKA
end
subgraph Metaapi\["Metaapi Server"]
  METAAPI\[API Server]
METAAPI -->|Get Parsed Data Logic| META
end
subgraph Distribution\["Distribution Layer"]
  DIST\[Distributor Server]
  REDIS\[(Redis Pub/Sub)]
end
KAFKA --> DIST
DIST -->|realTime data| REDIS
subgraph Studio\["DUCO Studio Server"]
  API\[DUCO Studio API]
  WS\[WebSocket Service]
end
REDIS -->|topic:live-stream/**tenantId**/consumer-**chassisId**/**msgType**| WS
subgraph Frontend\["DUCO Studio Frontend"]
  PAGE\["Live Data Page"]
  ECHARTS\[ECharts Line Charts]
end
API -->|Query historical data| CH
API -->|Initial Echarts data| ECHARTS
CH -->|Get Historical data past 2 min| API
WS -->|Filtered Live Data| ECHARTS
ECHARTS -->|Render Charts| PAGE
PAGE -->|Create WebSocket and Send INIT_FIELD_LIST| WS
::

---

## 4. Testing Real-Time Data Control via Command
After the Live Data page is loaded, the frontend queries MetaAPI to retrieve the current real-time status of the selected machine.

The status is displayed in the Group Management Panel, with one status indicator shown per group:
- 🟢 Real-Time is running
  > Indicates that real-time data transmission is currently enabled.
- 🔴 Real-Time is stopped
  > Indicates that real-time data transmission is currently disabled.

Manual Start / Stop Control

When a user manually clicks Start or Stop button in the Group Management Panel, the Live Data page calls a MetaAPI interface to control the real-time data transmission state of the machine.
`POST /api/iothubs/${iothubName}/devices/${deviceId}/methods`

Body:
```json[start]
{
  "methodName": "startMs",
  "payload": {
    "reason": "user_action",
    "commandId": "userId"
  }
}
```
```json[stop]
{
  "methodName": "endMs",
  "payload": {
    "reason": "user_action",
    "commandId": "userId"
 }
}
```
### 4.1 Real-Time Command Delivery and Execution Flow
After a request is sent to MetaAPI, the MetaAPI service connects to Azure IoT Hub and delivers real-time control commands to the target machine.
Command Delivery
- MetaAPI sends Start or Stop real-time commands to the machine through Azure IoT Hub.
- The commands are delivered to the device associated with the specified machine.
Command Execution on Machine
- When the machine is running or powered on, it receives the command from IoT Hub.
- Upon receiving the command:
  - A Start command enables the DUCO App to begin sending real-time data.
  - A Stop command disables the DUCO App from sending real-time data.
Impact on Live Data Page
- When real-time transmission is enabled:
  - The Live Data page receives real-time data via WebSocket.
  - Data is dynamically rendered and updated in ECharts line charts.
- When real-time transmission is disabled:
 - The machine stops sending real-time data.
 - The Live Data page stops receiving and displaying real-time updates.

 ### 4.2 Test Command Architecture Diagram (Logical View)

::mermaid
flowchart TB
subgraph Machine\["Machine Side"]
  M2\[DUCO App]
end
subgraph Cloud\["Cloud Ingestion"]
  IOT\[Azure IoT Hub]
end
M2 <-->|MQTT  Receive Command&Response Result | IOT
subgraph Metaapi\["Metaapi Server"]
  METAAPI\[API Server]
end
IOT <-->|MQTT Send Command & Response Result / Ack| METAAPI
subgraph Studio\["DUCO Studio Server"]
  API\[DUCO Studio API]
end
API -->|Request Metaapi| METAAPI
METAAPI -->|Get Metaapi Data| API
subgraph Frontend\["DUCO Studio Frontend"]
  subgraph PAGE\[Live Data Page]
    RTStatus\[Real-Time Status]
    RTStart\[Real-Time Start]
    RTStop\[Real-Time Stop]
  end
end
API -->|Response Metaapi data| PAGE
PAGE -->|Request Proxy Metaapi| API
::

---

## 5. ALL Architecture Diagram (Logical View)
::mermaid

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
M2 -->|vehicle_can / client_raw_data| IOT
IOT -->|Raw Data| ING
ING --> META
META -->|Parsed Data| CH
META -->|Parsed Data| KAFKA
IOT <-->|Mqtt Receive Command & Response Result| M2
end
subgraph Metaapi\["Metaapi Server"]
  METAAPI\[API Server]
METAAPI -->|Get Parsed Data Logic| META
METAAPI <-->|MQTT Send Command& Response Result/ACK| IOT
end
subgraph Distribution\["Distribution Layer"]
  DIST\[Distributor Server]
  REDIS\[(Redis Pub/Sub)]
end
KAFKA --> DIST
DIST -->|realTime data| REDIS
subgraph Studio\["DUCO Studio Server"]
  API\[DUCO Studio API]
  WS\[WebSocket Service]
API -->|Request Metaapi| METAAPI
end
REDIS -->|topic:live-stream/**tenantId**/consumer-**chassisId**/**msgType**| WS
subgraph Frontend\["DUCO Studio Frontend"]
  PAGE\["Live Data Page"]
  ECHARTS\[ECharts Line Charts]
end
PAGE -->|Request last 2 minutes data| API
PAGE -->|Request Proxy MetaAPI| API
PAGE -->|Create WebSocket Connection & Send INIT_FIELD_LIST| WS
API -->|Query historical data| CH
API -->|Initial Echarts data| ECHARTS
API -->|Get Metaapi data| PAGE
CH -->|Get Historical data past 2 min| API
WS -->|Filtered Live Data| ECHARTS
ECHARTS -->|Render Charts| PAGE
::







