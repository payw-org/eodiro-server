# eodiro API MySQL (eodiro API 2)

An API server for [eodiro](https://github.com/paywteam/eodiro.com) using MySQL database.

## References

- [Lectures](#Lectures)

---

## Lectures

- [Get Lectures](#Get-Lectures)
- [Search Lectures](#Search-Lectures)

### Get Lectures

<pre>
<b>GET</b>  https://api2.eodiro.com/<b>:year</b>/<b>:semester</b>/<b>:campus</b>/lectures
</pre>

**Params**

| Key      | Type                             |
| -------- | -------------------------------- |
| year     | `number`                         |
| semester | `'1' \| '여름' \| '2' \| '겨울'` |
| campus   | `'서울'`                         |

**Queries**

| Key      | Type     |
| -------- | -------- |
| `amount` | `number` |
| `offset` | `number` |

### Search Lectures

<pre>
<b>GET</b>  https://api2.eodiro.com/lectures/search
</pre>

**Queries**

| Key | Type     |
| --- | -------- |
| `q` | `string` |
