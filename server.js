const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const config = require('config')

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/select', require('./routes/select'));
app.use('/queries', require('./routes/queries'));

app.use(require('./utils/CustomErrorHandler'))

module.exports = app.listen(config.get('server.port'));
