var asyncHandler = require('express-async-handler')
var express = require('express')

var router = express.Router();

var dbi = require('../dbi')


router.get('/', asyncHandler(async (req, res, next) => {
    var queries = await dbi.query.findAll({raw:true});
    res.json(queries);
}));

router.get('/:id', asyncHandler(async (req, res, next) => {
  let id = req.params.id;

  var query = await dbi.query.findById(id, {raw:true});
  res.json(query);
}));

router.post('/', asyncHandler(async (req, res, next) => {
  var query = req.body;

  var persistedQuery = await dbi.query.create(query);
  res.json(persistedQuery);
}));

module.exports = router;
