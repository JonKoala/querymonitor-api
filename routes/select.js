var asyncHandler = require('express-async-handler')
var express = require('express')
var Sequelize = require('sequelize')

var router = express.Router();

var CustomError = require('../utils/CustomError')
var dbi = require('../dbi')
var sqlToolkit = require('../utils/sqlToolkit')


router.get('/:query', asyncHandler(async (req, res, next) => {
  var userQuery = req.params.query;

  if (sqlToolkit.isUnsafe(userQuery))
    throw new CustomError('Potential SQL injection detected');

  var queryResult = await dbi.connection.query(userQuery, { type: Sequelize.QueryTypes.SELECT });
  res.send(queryResult);
}));

module.exports = router;
