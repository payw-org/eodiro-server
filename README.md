# eodiro API MySQL (eodiro API 2)

An API server for [eodiro](https://github.com/paywteam/eodiro.com) using MySQL database.

## References

- [Lectures](#Lectures)
- [Vacant](#Vacant)

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

- [Get Buildings](#Get-Buildings)

### Get Buildings Vacant

<pre>
<b>GET</b>  https://api2.eodiro.com/<b>:year</b>/<b>:semester</b>/<b>:campus</b>/vacant/buildings
</pre>

**Params**

| Key        | Type                             |
| ---------- | -------------------------------- |
| `year`     | `number`                         |
| `semester` | `'1' \| '여름' \| '2' \| '겨울'` |
| `campus`   | `'서울'`                         |

**Queries**

| Key       | Type                                                          |
| --------- | ------------------------------------------------------------- |
| `day?`    | `'sun' \| 'mon' \| 'tue' \| 'wed' \| 'thu' \| 'fri' \| 'sat'` |
| `hour?`   | `number`                                                      |
| `minute?` | `number`                                                      |
