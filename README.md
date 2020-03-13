<h1 align="center">eodiro API 2</h1>
<p align="center">The next generation API server for <a href="https://eodiro.com"><b>eodiro</b></a></p>

<p align="center">
  <img src="https://img.shields.io/github/license/paywteam/eodiro-api2" />
  <a href="https://github.com/paywteam/eodiro-api2/actions">
    <img src="https://github.com/paywteam/eodiro-api2/workflows/ci/badge.svg" />
  </a>
  <a href="https://github.com/paywteam/eodiro-api2/releases">
    <img src="https://img.shields.io/github/v/release/paywteam/eodiro-api2?label=server" />
  </a>
  <a href="https://github.com/paywteam/eodiro-api2/tree/master/src/api/eodiro-one-api">
    <img alt="npm" src="https://img.shields.io/npm/v/@payw/eodiro-one-api?label=one-api">
  </a>
  <a href="https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V13.md#13.10.1">
    <img alt="npm" src="https://img.shields.io/badge/node-v13.10.1-brightgreen">
  </a>
</p>

---

## Server

Node.js running on NGINX using reverse proxy.

## Database

It uses MySQL internally as its database.

## Build

- Babel
  - Entire project
- TSC
  - One API

---

## API References

**[One API](#One-API)**

**Legacy APIs**

- [Common](#Common)
- [Lectures](#Lectures)
- [Vacant](#Vacant)
- [Cafeteria](#Cafeteria)

---

## One API

Introducing a new way to create APIs on server side and to use them on client side.

**One API** does not follow the traditional RESTful way. It has only **one** endpoint for all of its APIs. All you have to do is send a `post` request with an `action` and `data`.

```
https://api2.eodiro.com/one
```

### [One API Client](https://www.npmjs.com/package/@payw/eodiro-one-api)

Another amazing thing is that the One API provides client side npm module ready to be used right now. Thanks to this module, you don't have to write duplicate type definitions or AJAX calls every time the new APIs are added. Just npm update and you're good to go.

**Install**

```zsh
npm install @payw/eodiro-one-api
```

**Dependencies**

- Axios

**Usage**

```ts
import { oneAPIClient } from '@payw/eodiro-one-api/client'

oneAPIClient<ActionType>(
  action: 'actionName',
  data: { ... }
).then(payload => {
  ...
})
```

### [API References](https://github.com/paywteam/eodiro-api2/tree/master/src/api/eodiro-one-api/scheme)

They are written in TypeScript interfaces.

```ts
export interface ActionType {
  actions: 'actionName'
  data: { ... }
  payload: { ... }
}
```

---

## Common

### Response

- Server responds with `500` HTTP response code when there are some problems while processing the APIs

### Types

We share some specific types across the APIs.

| Type       | Detailed Type                                                 |
| ---------- | ------------------------------------------------------------- |
| `Day`      | `'sun' \| 'mon' \| 'tue' \| 'wed' \| 'thu' \| 'fri' \| 'sat'` |
| `Semester` | `'1' \| '하계' \| '2' \| '동계'`                              |
| `Campus`   | `'서울' \| '안성'`                                            |

---

## Lectures

- [Get Lectures](#Get-Lectures)
- [Search Lectures](#Search-Lectures)

### Get Lectures

<pre>
<b>GET</b>  https://api2.eodiro.com/lectures/<b>:year</b>/<b>:semester</b>/<b>:campus</b>/list
</pre>

**Params**

| Key        | Type       |
| ---------- | ---------- |
| `year`     | `number`   |
| `semester` | `Semester` |
| `campus`   | `Campus`   |

**Queries**

| Key       | Type     | Description                                 |
| --------- | -------- | ------------------------------------------- |
| `amount?` | `number` | The number of lectures you get. Default 20. |
| `offset?` | `number` | The start index of lectures. Initial 0.     |

### Search Lectures

<pre>
<b>GET</b>  https://api2.eodiro.com/lectures/<b>:year</b>/<b>:semester</b>/<b>:campus</b>/search
</pre>

**Params**

| Key        | Type       |
| ---------- | ---------- |
| `year`     | `number`   |
| `semester` | `Semester` |
| `campus`   | `Campus`   |

**Queries**

| Key       | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `q`       | `string` | Search keyword                            |
| `amount?` | `number` | The amount of search results. Default 20. |
| `offset?` | `number` | The offset of search results. Initial 0.  |

---

## Vacant

- [Get Buildings Vacant](#Get-Buildings-Vacant)
- [Get Classrooms](#Get-Classrooms)

### Get Buildings Vacant

<pre>
<b>GET</b>  https://api2.eodiro.com/vacant/<b>:year</b>/<b>:semester</b>/<b>:campus</b>/buildings
</pre>

**Params**

| Key        | Type       |
| ---------- | ---------- |
| `year`     | `number`   |
| `semester` | `Semester` |
| `campus`   | `Campus`   |

**Queries**

| Key       | Type     |
| --------- | -------- |
| `day?`    | `Day`    |
| `hour?`   | `number` |
| `minute?` | `number` |

### Get Classrooms

<pre>
<b>GET</b>  https://api2.eodiro.com/vacant/<b>:year</b>/<b>:semester</b>/<b>:campus</b>/buildings/<b>:building</b>/classrooms
</pre>

**Params**

| Key        | Type       |
| ---------- | ---------- |
| `year`     | `number`   |
| `semester` | `Semester` |
| `campus`   | `Campus`   |
| `building` | `string`   |

**Queries**

| Key    | Type  |
| ------ | ----- |
| `day?` | `Day` |

## Cafeteria

### Get Menus

<pre>
<b>GET</b>  https://api2.eodiro.com/cafeteria/<b>:servedAt</b>/<b>:campus</b>/menus
</pre>

**Params**

| Key        | Type         |
| ---------- | ------------ |
| `servedAt` | `YYYY-MM-DD` |
| `campus`   | `Campus`     |

**Response**

| Code | Description              |
| ---- | ------------------------ |
| 204  | No menus data on the day |
