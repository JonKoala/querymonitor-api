var asyncHandler = require('express-async-handler')
var express = require('express')
var Sequelize = require('sequelize')

var router = express.Router();

var CustomError = require('../utils/CustomError')
var dbi = require('../dbi')


function isInjection(query) {
  var blacklist = ['update', 'delete', 'insert', 'create', 'alter', 'drop']
  return blacklist.some(entry => query.toLowerCase().includes(entry));
}

router.get('/:query', asyncHandler(async (req, res, next) => {
  var userQuery = req.params.query;

  if (isInjection(userQuery))
    throw new CustomError('sql injection detected');

  var queryResult = await dbi.connection.query(userQuery, { type: Sequelize.QueryTypes.SELECT });
  res.send(queryResult);
}));

module.exports = router;
