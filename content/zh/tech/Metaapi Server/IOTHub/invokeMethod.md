---
title: Invoke Method
description: Device Direct Method API
---

This API invokes an Azure IoT Hub **Direct Method** on a target device and returns the device-side response.

---

## Endpoint 1: Invoke by deviceId

### Purpose

- Invoke a Direct Method on a device identified by deviceId.

### URL

`POST {{productionURL}}/api/iothubs/{iothubName}/devices/{deviceId}/methods`
 
Example:
`POST {{productionURL}}/api/iothubs/ducohub/devices/tduco014/methods`

### Path Parameters

| Name           | Type   | Required | Description                                                         |
| -------------- | ------ | -------: | ------------------------------------------------------------------- |
| **iothubName** | string |      Yes | IoT Hub identifier used to select the configured connection string. |
| **deviceId**   | string |      Yes | Target device ID in Azure IoT Hub.                                  |

### Request Body

| Field          | Type   | Required | Description                                 |
| -------------- | ------ | -------: | ------------------------------------------- |
| **methodName** | string |      Yes | Direct Method name to invoke on the device. |
| **payload**    | object |      Yes | Payload sent to the device method handler.  |

#### payload fields

| Field         | Type   | Required | Description                                       |
| ------------- | ------ | -------: | ------------------------------------------------- |
| **action**    | string |      Yes | Action to perform (for example: `start`, `stop`). |
| **reason**    | string |       No | Optional reason for the action.                   |
| **commandId** | string |       No | Optional command identifier (UUID recommended).   |

Example:

```json
{
  "methodName": "setRealTimeUpload",
  "payload": {
    "action": "start",
    "reason": "user_action",
    "commandId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

### Success Response

**HTTP 200**

| Field       | Type    | Description                                          |
| ----------- | ------- | ---------------------------------------------------- |
| **success** | boolean | `true` is execution successful                       |
| **status**  | any     | Device method result status (from IoT Hub response). |
| **payload** | any     | Device method response payload.                      |

Example:

```json
{
  "success": true,
  "status": 200,
  "payload": {
    "result": "ok"
  }
}
```

---

## Endpoint 2: Invoke by chassisId

### Purpose

- Same as **Endpoint 1**, but the target device is identified by **chassisId** (the server resolves the corresponding deviceId internally).

### URL

`POST {{productionURL}}/api/iothubs/{iothubName}/vehicles/{chassisId}/methods`
 
Example:
`POST {{productionURL}}/api/iothubs/ducohub/vehicles/JTC_TDUCO014/methods`

### Path Parameters

| Name           | Type   | Required | Description                                                         |
| -------------- | ------ | -------: | ------------------------------------------------------------------- |
| **iothubName** | string |      Yes | IoT Hub identifier used to select the configured connection string. |
| **chassisId**  | string |      Yes | Vehicle chassis identifier used to resolve the target deviceId.     |

### Request Body

- **Identical to Endpoint 1** (same fields, same requirements, same example).

### Success Response

**HTTP 200**

Same response shape as **Endpoint 1**:

| Field       | Type    | Description                                          |
| ----------- | ------- | ---------------------------------------------------- |
| **success** | boolean | `true`                                               |
| **status**  | any     | Device method result status (from IoT Hub response). |
| **payload** | any     | Device method response payload.                      |

Example:

```json
{
  "success": true,
  "status": 200,
  "payload": {
    "result": "ok"
  }
}
```

---

## Error Responses

Errors are returned as HTTP errors (the request is rejected with a status code and message).

### Validation Errors

| Condition                                               | HTTP Status | Message                |
| ------------------------------------------------------- | ----------: | ---------------------- |
| methodName is missing                                   |         400 | methodName is required |
| deviceId is missing (Endpoint 1)                        |         400 | deviceId is required   |
| deviceId cannot be resolved from chassisId (Endpoint 2) |         400 | deviceId is required   |

### Invocation Errors

| Error Type           | HTTP Status | Message Pattern                                      |
| -------------------- | ----------: | ---------------------------------------------------- |
| **DEVICE_NOT_FOUND** |         404 | Device not found: {errorMessage}                     |
| **TIMEOUT**          |         504 | Device Method invocation timed out: {errorMessage}   |
| **UNAUTHORIZED**     |         401 | Unauthorized to invoke device method: {errorMessage} |
| **UNKNOWN**          |         500 | Unknown error invoking device method: {errorMessage} |

---

## Timeout

- Default response timeout for the device method invocation is **5 seconds**.

---

## Configuration

The IoT Hub connection string is resolved from an environment variable:

- `IOTHUB_${iothubName.toUpperCase()}_CONNECTION`

Example:

- If `iothubName = "prod"`, the API reads `IOTHUB_PROD_CONNECTION`.
