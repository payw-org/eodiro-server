# API Reference

> **_NOTE:_** Every API URL reference begins with the following host.

`https://api2.eodiro.com`

---

- [Authentication](#Authentication)
- Pepero Square

---

### HTTP Status Code Reference

Please refer to this [website](https://httpstatuses.com) for detailed information about the response codes.

### Common Error

- `500`

## Authentication

- [Sign Up](#Sign-Up)
- [Sign In](#Sign-In)
- [Sign Out](#Sign-Out)
- [Verify](#Verify)

### Sign Up

**`POST`** /auth/sign-up

**Response**

- `201`
- `409`

```json
{
  "portalId": boolean,
  "nickname": boolean,
  "password": boolean
}
```

### Sign In

**`POST`** /auth/sign-in

**Body**

```json
{
  "portalId": string,
  "password": string
}
```

- `201`

```json
{
  "accesstoken": string,
  "refreshtoken": string
}
```

- `403`

**Response**

- `201`

### Sign Out

**`GET`** /auth/sign-out

### Verify

**`POST`** /auth/verify

**Body**

| Key   | Value Type |
| ----- | ---------- |
| token | `string`   |
