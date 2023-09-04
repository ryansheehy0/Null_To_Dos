const express = require(`express`)
const app = express()

app.use(express.static('public'))

const server = app.listen(process.env.PORT || 3001, () =>{
  console.log(`Server is listening on port ${server.address().port}.`)
})