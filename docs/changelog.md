# Changelog

## v2.3.0

### Feature

- **api:** `getLecturesYears`
- **cnw:** dormitory blue mir notice now redirect to the notice page

### Dev

- **snippet:** `oneres` auto completes `oneApiResponse<Action>($0)`
- **script:** watch One API schemes and auto-refresh on change (included in `dev` script)

### Refactor

- **api:** tip apis are updated with the latest one api types

### Fix

- **lectures:** now search with current year and semester ([7210a5c](https://github.com/payw-org/eodiro-server/commit/7210a5c8c8f925b07bfc7d7247e441fc189c9ed2))
- **lectures:** fix table attribute name ([834daf1](https://github.com/payw-org/eodiro-server/commit/834daf12ebc95341f91805b97be354671ef3b272))

### Chore

- **deps:** remove graphql, dts-gen
- **seed:** quit timetable seeder after finished the process ([b851a35](https://github.com/payw-org/eodiro-server/commit/b851a350b86f17c01bf78014cb42cfd370eef857))

## v2.2.1

### `Time.getPrismaCurrent()`

Returns the current time for using with Prisma.

```ts
const currentTime = Time.getPrismaCurrent()

await prisma.tip.create({
  data: {
    user: {
      connect: {
        id: userId,
      },
    },
    title,
    topic,
    body,
    randomNickname: randomNick,
    createdAt: currentTime,
    editedAt: currentTime,
  },
})
```

> ⚠️ `Time.getIsoString()` is deprecated

### `prismaTimeMod()`

We assume that prisma treats the time in database as UTC time. Wrapping the result of Prisma client with this function resolves the issue by merely subtracting 9 hours from the UTC time (UTC+9:00 is KST).

First argument could be any variable which includes `Date`.

## v2.2.0

### Features

- [CAU Notice Watcher](https://github.com/payw-org/eodiro-server/tree/master/src/modules/cau-notice-watcher)
- [Tips API](https://github.com/payw-org/eodiro-server/tree/master/src/api/one/scheme/tip)
- eodiro LIVE

### Dev

- Expose a lot of changes to One API ([types](https://github.com/payw-org/eodiro-server/releases/tag/v2.2.0-beta.1), [code snippets](https://github.com/payw-org/eodiro-server/releases/tag/v2.2.0-beta.2))
- Integrate repository pattern (#55)

### Contributors

- @97e57e

## v2.2.0 Beta 2

### New VSCode code snippets

**Action Types**

`onetype`

It replaces the previous `oneint`(One Interface) snippet and constructs `Action` type boilerplate.

![onetype](https://user-images.githubusercontent.com/19797697/84985873-82fc8300-b178-11ea-9e9d-886e0fc48420.gif)

`onetypeauth`

It replaces the previous `oneintauth`(One Interface Auth Required) snippet and constructs `Action` type boilerplate with `AuthRequired` injected.

![onetypeauth](https://user-images.githubusercontent.com/19797697/84985993-ba6b2f80-b178-11ea-89e6-0a7759ea1f08.gif)

`onetypeauthonly`

Constructs `Action` type boilerplate with `AuthOnly` type injected where the API only accepts the `accessToken`.

![onetypeauthonly](https://user-images.githubusercontent.com/19797697/84986211-23eb3e00-b179-11ea-9b42-3f53dc74fb9c.gif)

`onetypeauthoptional`

Constructs `Action` type boilerplate with `AuthOptional` type injected where the API optionally requires the authentication.

![onetypeauthoptional](https://user-images.githubusercontent.com/19797697/84986406-77f62280-b179-11ea-93a9-1b465f9e4ef5.gif)

`onetypenodata`

Constructs `Action` type boilerplate without the request data.

![onetypenodata](https://user-images.githubusercontent.com/19797697/84986520-a7a52a80-b179-11ea-887e-6ca503da5c2a.gif)

**Function Types**

`onefunc`

It slightly updates the previous `onefunc` snippet with the new type declarations.

![onefunc](https://user-images.githubusercontent.com/19797697/84986596-c73c5300-b179-11ea-8477-009217131403.gif)

`onefuncnodata`

The resolvers(functions) for the Actions that don't require any request data.

![onefuncnodata](https://user-images.githubusercontent.com/19797697/84986777-15515680-b17a-11ea-9132-aa43073db887.gif)

## v2.2.0 Beta 1

This version introduces some new ways to build One APIs.

### Removed deprecated utility types

- `OneAPIData`: Replaced with using direct access to the property, `T['data']`
- `OneAPIPayload`: Replaced with using direct access to the property, `T['payload']`
- `OneAPIError<T>`: Replaced with `OneApiError` combined with union types, `OneApiError | 'Other Error' | ...`

### Removed the universal `OneApiAction` type

At the beginning of its creation, we standardized the One APIs' interface and they could be expressed in the same, single interface called `OneApiAction` which is an union of all the One APIs. However, the number of APIs are increasing and we found they can be differed in four different structures.

| Request Data | Response Data | Response Error |
| :----------: | :-----------: | :------------: |
|      ✅      |      ✅       |       ✅       |
|      ❌      |      ✅       |       ✅       |
|      ✅      |      ❌       |       ✅       |
|      ❌      |      ❌       |       ✅       |

> For the APIs which provide no response data, the payload data is `null`.

### `AuthOptional` (#48)

Added this type alongside `AuthRequired` and `AuthOnly`. It makes the `accessToken` field optional in request data and `oneApiClient` can call them with or without the token. This type is suitable for the APIs that act differently in unauthorized session.

### One API Templates

Now you can define actions interface with two types of One API templates.

**`OneApiActionTemplate<D, P>`**

This type accepts data and payload types.

Here is an example, suppose there is an action interface like below,

```ts
// bookmark-tip.action/interface.ts

export interface Action {
  data: AuthRequired<{
    tipId: number
  }>
  payload: {
    err: OneApiError
    data: {
      isBookmarked: boolean
    }
  }
}
```

You can rewrite the interface with the new types

```ts
export type Action = OneApiActionTemplate<
  AuthRequired<
    tipId: number
  >
  OneApiActionTemplatePayload<
    OneApiError,
    {
      isBookmarked: boolean
    }
  >
>
```

**`OneApiActionTemplateWithoutRequestData<P>`** (#48)

This type accepts only the payload type.

`get-notice-catalog.action` for example, doesn't require any reqeust data. Currently it is defined by filling the data with `undefined`. It doesn't make sense and `oneApiClient` always infers the `data` as required(or optional) property.

```ts
// get-notice-catalog.action/interface.ts

export interface Action {
  data: undefined
  payload: {
    err: OneApiError
    data: {
      noticeCatalog: NoticeItem[]
    }
  }
}
```

But now it can be defined in a much explicit way.

```ts
export type Action = OneApiActionTemplateWithoutRequestData<
  OneApiActionTemplatePayload<
    OneApiError,
    {
      noticeCatalog: NoticeItem[]
    }
  >
>
```

If there is no response data(payload data), pass `null` to `OneApiActionTemplatePayload` as the second template type.

```ts
export type Action = OneApiActionTemplateWithoutRequestData<
  OneApiActionTemplatePayload<OneApiError, null>
>
```

> In default, you should pass `OneApiError` as the first template type of `OneApiActionTemplatePayload`. Use union types if you need additional error types.

### Return the response with `oneApiResponse` (#49)

Previously you're returning the response inside the One API functions like this.

```ts
return {
  err: OneApiError.UNAUTHORIZED,
  data: {
    some: 'data',
  },
}
```

By using the `oneApiResponse<Action>()`, you can return the response in a much simpler and intuitive way.

**Response with only an error**

```ts
return oneApiResponse<Action>(OneApiError.UNAUTHORIZED)
```

> `data` will be automatically filled with `null`

**Response with only the data**

```ts
return oneApiResponse<Action>({
  some: 'data',
})
```

> `err` will be automatically filled with `null`

**Response with both an error and the data**

```ts
return oneApiResponse<Action>('Some Error', null)
```

> Don't forget to pass the template type `Action`. Without doing this, type inferences will be broken.

### One API function declaration

Define the One API function with one of these types.

- `OneApiFunc`
- `OneApiFuncWithoutRequestData`

They accept a template type that extends `OneApiActionTemplate` and `OneApiActionTemplateWithoutRequestData` each.

```ts
const func: OneApiFunc<Action> = async (data) => {
  const response = oneApiResponse<Action>(OneApiError.UNAUTHORIZED)

  return response
}
```

> _`OneApiFunction` is now deprecated_

### `oneAPIClient` is now `oneApiClient`

In JavaScript, variable naming convention is often using `camelCase`. And we are trying to keep consistent variable names even if a name is using an abbreviation like `API`. So we changed `oneAPIClient` to `oneApiClient`.

## v2.1.0

### Cron

We have multiple periodic jobs. Those are including clearing pending users, garbage collecting dangling user-uploaded files, scraping data from websites and much more. Previously these jobs were running inside the main process through so called **node-cron**. Unfortunately we faced the issue([#41](https://github.com/paywteam/eodiro-server/issues/41)) where the headless browsers(Zombie.js and Puppeteer) leak memories on every browser instance creation. So, from `v2.1.0`, they are separated from the main process and moved to **cron**. This approach additionally provides few improvements as well as resolving the memory leak problem which is critical. They are now isolated and run in background even when the main server process got blocked or updating. It means that periodic jobs never halt and always achieve what they have to.

[Configuration](https://github.com/paywteam/eodiro-server/blob/master/src/scripts/crontab.sh)

## v2.0.0

### Feature

- CAU Notice Watcher
- **(Experimental)** GraphQL and Prisma

### Chore

- Integrate Prettier with ESLint

---

Checkout [GitHub](https://github.com/payw-org/eodiro-server/releases) for the previous releases.
