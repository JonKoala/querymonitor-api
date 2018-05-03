var asyncHandler = require('express-async-handler')
var express = require('express')

var router = express.Router();

var dbi = require('../dbi')
var CustomError = require('../utils/CustomError')


router.get('/', asyncHandler(async (req, res, next) => {
  var queries = await dbi.query.findAll({raw:true});
  res.json(queries);
}));

router.get('/:id', asyncHandler(async (req, res, next) => {
  var id = req.params.id;

  var query = await dbi.query.findById(id, {raw:true});
  res.json(query);
}));

router.post('/', asyncHandler(async (req, res, next) => {
  var query = req.body;

  var persistedQuery = await dbi.query.create(query);
  res.json(persistedQuery);
}));

router.put('/', asyncHandler(async (req, res, next) => {
  var query = req.body;

  var existingQuery = await dbi.query.findOne({where: {id: query.id}});
  if (existingQuery === null)
    throw new CustomError(`No record could be found for the specified ID: ${query.id}`);

  await existingQuery.update(query);
  res.send();
}));

router.delete('/:id', asyncHandler(async (req, res, next) => {
  var id = req.params.id;

  var existingQuery = await dbi.query.findOne({where: {id: id}});
  if (existingQuery === null)
    throw new CustomError(`No record could be found for the specified ID: ${query.id}`);

  await dbi.query.destroy({where: {id: id}});
  res.send();
}));

module.exports = router;
