<h1 align="center">eodiro 🌏 server</h1>
<p align="center">A Node.js server application that powers the <b><a href="https://github.com/paywteam/eodiro">eodiro</a></b></p>

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
    <img alt="npm" src="https://img.shields.io/badge/node-v13.14.0-brightgreen">
  </a>
</p>

---

## 📦 Spec

Node.js running on NGINX using reverse proxy.

### NGINX

**SSL:** [Let's Encrypt](https://letsencrypt.org/) and [Certbot](https://certbot.eff.org/) python plugin

[Configuration](https://gist.github.com/jhaemin/218cc4f45c28062c3f3c6b96347a401a)

**Resolve 413 Request Entity Too Large**

```nginx
server {
    client_max_body_size 100M;
}
```

**Don't forget**

- to set timezone correctly of both system and database

### Database

It uses MySQL internally as its database.

[Installation](https://gist.github.com/jhaemin/651e335525f002011bd90d75f0e49c8e)

### Cron

We have multiple periodic jobs. Those are including clearing pending users, garbage collecting dangling user-uploaded files, scraping data from websites and much more. Previously these jobs were running inside the main process through so called **node-cron**. Unfortunately we faced the issue([#41](https://github.com/paywteam/eodiro-server/issues/41)) where the headless browsers(Zombie.js and Puppeteer) leak memories on every browser instance creation. So, from `v2.1.0`, they are separated from the main process and moved to **cron**. This approach additionally provides few improvements as well as resolving the memory leak problem which is critical. They are now isolated and run in background even when the main server process got blocked or updating. It means that periodic jobs never halt and always achieve what they have to.

[Configuration](https://github.com/paywteam/eodiro-server/blob/master/src/scripts/crontab.sh)

---

## 📚 API References

**REST API (Legacy)**

- [Common](#Common)
- [Lectures](#Lectures)
- [Vacant](#Vacant)
- [Cafeteria](#Cafeteria)

**[One API (Deprecated in favor of GraphQL)](#One-API)**

**GraphQL (WIP)**

---

## One API

> Deprecated in favor of GraphQL which means there will be no more updates and all of the features provided by the One API will be replaced by GraphQL in the near future.

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
import { oneAPIClient } from '@payw/eodiro-one-api'

oneAPIClient(
  action: 'actionName',
  data: { ... }
).then(payload => {
  ...
})
```

TypeScript will automatically inference the types of request data and payload as you choose the action.

**[Development Guide](https://github.com/paywteam/eodiro-api2/tree/master/src/api/one)**

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
<b>[ GET ]</b>  https://api2.eodiro.com/lectures/<b>:year</b>/<b>:semester</b>/<b>:campus</b>/list
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
<b>[ GET ]</b>  https://api2.eodiro.com/lectures/<b>:year</b>/<b>:semester</b>/<b>:campus</b>/search
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
<b>[ GET ]</b>  https://api2.eodiro.com/vacant/<b>:year</b>/<b>:semester</b>/<b>:campus</b>/buildings
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
<b>[ GET ]</b>  https://api2.eodiro.com/vacant/<b>:year</b>/<b>:semester</b>/<b>:campus</b>/buildings/<b>:building</b>/classrooms
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
<b>[ GET ]</b>  https://api2.eodiro.com/cafeteria/<b>:servedAt</b>/<b>:campus</b>/menus
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

## LICENSE

MIT License

Copyright (c) 2020 PAYW

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
