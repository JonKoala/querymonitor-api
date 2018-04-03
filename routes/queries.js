var dbi = require('../dbi')
var express = require('express')
var router = express.Router();

router.get('/', (req, res) => {

  dbi.query.findAll()
  .then(queries => {
    res.send(queries);
  }).catch(err => {
    res.status(500).send(err);
  });
});

router.get('/:id', (req, res) => {

  let id = req.params.id;

  dbi.query.findById(id)
  .then(query => {
    res.send(query);
  }).catch(err => {
    res.status(500).send(err);
  });
});

router.post('/', (req, res) => {

  var query = req.body;

  dbi.query.create(query)
  .then(() => {
    res.send();
  }).catch(err => {
    res.status(500).send(err);
  });
});

module.exports = router;
