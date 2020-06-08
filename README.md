<h1 align="center">eodiro 🌏 server</h1>
<p align="center">A Node.js server application that powers the <b><a href="https://github.com/payw-org/eodiro">eodiro</a></b></p>

<p align="center">
  <img src="https://img.shields.io/github/license/payw-org/eodiro-server" />
  <a href="https://github.com/payw-org/eodiro-server/actions">
    <img src="https://github.com/payw-org/eodiro-server/workflows/ci/badge.svg" />
  </a>
  <a href="https://github.com/payw-org/eodiro-server/releases">
    <img src="https://img.shields.io/github/v/release/payw-org/eodiro-server?label=server" />
  </a>
  <a href="https://github.com/payw-org/eodiro-server/tree/master/src/api/eodiro-one-api">
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

We have multiple periodic jobs. Those are including clearing pending users, garbage collecting dangling user-uploaded files, scraping data from websites and much more. Previously these jobs were running inside the main process through so called **node-cron**. Unfortunately we faced the issue([#41](https://github.com/payw-org/eodiro-server/issues/41)) where the headless browsers(Zombie.js and Puppeteer) leak memories on every browser instance creation. So, from `v2.1.0`, they are separated from the main process and moved to **cron**. This approach additionally provides few improvements as well as resolving the memory leak problem which is critical. They are now isolated and run in background even when the main server process got blocked or updating. It means that periodic jobs never halt and always achieve what they have to.

[Configuration](https://github.com/payw-org/eodiro-server/blob/master/src/scripts/crontab.sh)

---

## 📚 API References

**REST API (Legacy)**

- [Common](#Common)
- [Lectures](#Lectures)
- [Vacant](#Vacant)
- [Cafeteria](#Cafeteria)

**[One API](#One-API)**

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
import { oneAPIClient } from '@payw/eodiro-one-api'

oneAPIClient(
  action: 'actionName',
  data: { ... }
).then(payload => {
  ...
})
```

TypeScript will automatically inference the types of request data and payload as you choose the action.

**[Development Guide](https://github.com/payw-org/eodiro-server/tree/master/src/api/one)**

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

---

## Dev Prerequisites

### Dev Tools

**Node >= 13**

**MySQL >= 8**

**Visual Studio Code**: We enforce you to use VSCode as an editor for developing the eodiro server.

- **Essential Extensions**
  - ESLint
  - Prettier
  - sort-imports
  - Prisma

### Config

**eodiro**

Duplicate `src/config/example.ts`, rename it to `index.ts` and fill the information with your environment values.

**Prisma**

Create `prisma/.env` and fill with your database information.

```
DATABASE_URL="mysql://username:password@address:3306/db_name"
```

## NPM Scripts

You can run the scripts below by `npm run [script-name]`.

**Application**

- `dev`: Runs in development mode (listens at port `config.DEV_PORT`)
- `build`: Generate JavaScript artifacts into `build` directory
- `start`: Start the production server using the build outputs (listens at port `config.PORT`)

**Database**

- `sync-db:prod`: Syncs the database models with the database described in `config.DB_NAME`.
- `sync-db:dev`: Same as the previous one but instead syncs with `config.DB_NAME_DEV`.

**CDN**

- `cdn:dev`: Starts the CDN server in development mode (listens at `config.CDN_DEV_PORT`)
- `cdn`: Starts the CDN server in production mode (listens at `config.CDN_PORT`)

**Prisma**

- `introspect`: Looks up the database described in `prisma/.env` and generate a prisma schema file. **Never run this script unless there exists any changes in db models. And if you do run, open `prisma/schema.prisma` and format the file with the Prisma extension in VSCode.**
- `generate`: Generates Prisma Client with `prisma/schema.prisma`. **Run this script before start developing.**
