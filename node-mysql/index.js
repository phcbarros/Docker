const express = require('express')
const mysql = require('mysql2')

const app = express()
const port = 3000

var connection = mysql.createConnection({
  host: 'database', // nome do serviço do docker compose
  user: 'root',
  password: 'senhadoexpress',
  database: 'express_db',
  port: 3306
})

connection.connect()

app.get('/', (req, res) => {
  connection.query('SELECT * FROM produtos', (err, result, fields) => {
    if(err)
      res.send(err.message).status(500)
    res.send(`${result[0].name} - ${result[1].name}`)

    connection.end()
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

