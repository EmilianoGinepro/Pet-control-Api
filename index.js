const fileUpload = require('express-fileupload')
const express = require('express');
var cors = require('cors')
const app = express();
const { Port, Host } = require('./src/config/config');


app.use(express.json());
app.use(cors())
app.use(fileUpload())

app.get('/', function (req, res) {
  res.send('Pet Control API')

})

app.use('/login', require('./src/routes/login-routes'))
app.use('/pet', require('./src/routes/mascota-routes'))
app.use('/control', require('./src/routes/control.routes'))

app.listen(Port, () => {
  console.log(`Escuchando en ${Host} puerto ${Port}`)
})