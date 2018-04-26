var express = require('express')

var dbi = require('../dbi')

var router = express.Router();


router.get('/', (req, res, next) => {

  dbi.query.findAll({raw:true})
    .then(queries => {
      res.json(queries);
    }).catch(next);
});

router.get('/:id', (req, res, next) => {

  let id = req.params.id;

  dbi.query.findById(id, {raw:true})
    .then(query => {
      res.json(query);
    }).catch(next);
});

router.post('/', (req, res, next) => {

  var query = req.body;

  dbi.query.create(query)
    .then(query => {
      res.json(query);
    }).catch(next);
});

module.exports = router;
