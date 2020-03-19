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
export interface Interface {
  data: {} // Request data
  payload: {
    err: OneApiError // additional err types using union type
    data: {} // Response data
  }
}
```

> You have to import other types only within `eodiro-one-api` using **_relative path_**.

### Function

It exports a default async function where it gets request data as an argument and returns the payload.

```ts
export default async function(data: Interface['data']): Promise<Interface['payload']> {
  // do something
  // ...

  return payload
}
```

## Refresh

After creating an action, you have to refresh the package by running the script `refresh` in `one/package.json`.

```zsh
npm run refresh
```

It automatically generates named imports and exports. It also adds some universal interface properties and creates union types.
