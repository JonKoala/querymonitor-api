const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const appconfig = require('./appconfig')

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/select', require('./routes/select'));

var port = appconfig['server']['port'];
app.listen(port, function() {
  console.log('Server up and running! Listening on ' + port + '...');
});
