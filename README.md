# eodiro API MySQL (eodiro API 2)

An API server for [eodiro](https://github.com/paywteam/eodiro.com) using MySQL database.

## API References

- [Lectures](#Lectures)
- [Vacant](#Vacant)
- [Cafeteria](#Cafeteria)

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
<b>GET</b>  https://api2.eodiro.com/<b>:year</b>/<b>:semester</b>/<b>:campus</b>/lectures
</pre>

**Params**

| Key        | Type                             |
| ---------- | -------------------------------- |
| `year`     | `number`                         |
| `semester` | `'1' \| '여름' \| '2' \| '겨울'` |
| `campus`   | `'서울'`                         |

**Queries**

| Key       | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `amount?` | `number` | The number of lectures you get |
| `offset?` | `number` | The start index of lectures    |

### Search Lectures

<pre>
<b>GET</b>  https://api2.eodiro.com/<b>:year</b>/<b>:semester</b>/<b>:campus</b>/lectures/search
</pre>

**Params**

| Key        | Type                             |
| ---------- | -------------------------------- |
| `year`     | `number`                         |
| `semester` | `'1' \| '여름' \| '2' \| '겨울'` |
| `campus`   | `'서울'`                         |

**Queries**

| Key       | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| `q`       | `string` | Search keyword               |
| `amount?` | `number` | The amount of search results |
| `offset?` | `number` | The offset of search results |

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
