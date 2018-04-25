var Sequelize = require('sequelize')
var express = require('express')

var dbi = require('../dbi')
var CustomError = require('../utils/CustomError')

var router = express.Router();


function isInjection(query) {
  var blacklist = ['update', 'delete', 'insert', 'create', 'alter', 'drop']
  return blacklist.some(entry => query.toLowerCase().includes(entry));
}

router.get('/:query', (req, res, next) => {
  var userQuery = req.params.query;

  if (isInjection(userQuery))
    return next(new CustomError('sql injection detected'))

  dbi.connection.query(userQuery, { type: Sequelize.QueryTypes.SELECT })
    .then(result => {
      res.send(result);
    }).catch(next);
});

module.exports = router;
