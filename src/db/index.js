const connection = require('@/db/connection')
connection.connect((err) => {
  if (err) {
    console.log(err)
  }
})
