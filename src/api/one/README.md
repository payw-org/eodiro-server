# eodiro One API development guide

## Action

One API distinguishes each API with an **action** instead of url and request method. Action name should be unique and each of them has corresponding interface and function.

## Structure

Actions are placed under `src/api/one/scheme`.

### Folder

You can create an action by creating a folder which name is in a form of `[action-name].action`. Subdirectories don't matter.

For example,

- `scheme/square/get-posts.action`
- `scheme/square/upload-post.action`
- `scheme/square/comments/get-comments.action`
- `scheme/cafeteria/get-today-meals.action`

Then you have to create two files [`interface.ts`](#interface), [`function.ts`](#function).

### Interface

It exports an interface with the name `Interface`.

```ts
export interface Action {
  data: {} // Request data
  payload: {
    err: OneApiError // additional err types using union type
    data: {} // Response data
  }
}
```

> ~~You have to import other types only within `eodiro-one-api` using **_relative path_**.~~ Now supports absolute paths like `@/database/...` and the compiler converts them to relative paths.

### Function

It exports a default async function where it gets request data as an argument and returns the payload.

```ts
export default async function (
  data: Interface['data']
): Promise<Interface['payload']> {
  // do something
  // ...

  return payload
}
```

## Refresh and auto-generate imports

After created new actions or modified the existing ones, you have to refresh the package by running the script `refresh` in `one/package.json`.

```zsh
npm run refresh
```

It automatically generates named imports and exports while adding or creatting several universal interface properties and union types.

### Refresh inside the root project

Also we provide an alias script for refreshing that runs in the project's root directory.

```zsh
npm run one-api:refresh
```

## Types

### `OneApiError`

This is an Enum consisting of some general errors. By default, you should set the payload's error type with it and furthermore extend using union types.

**Example**

```ts
export interface Action {
  payload: {
    err: OneApiError | 'No Title' | ...
  }
}
```

### `AuthReqired<T>`

This is an utility type for the actions where the authentication is required. This type simply includes `accessToken` property to your reqeust data type.

**Example**

```ts
export interface Action {
  data: AuthRequired<{
    title: string
    body: string
  }>
}
```

It is same as

```ts
export interface Action {
  data: AuthRequired<{
    accessToken: string
    title: string
    body: string
  }>
}
```
