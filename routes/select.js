var dbi = require('../dbi')
var Sequelize = require('sequelize')
var express = require('express')
var router = express.Router();

function isInjection(query) {
  var blacklist = ['update', 'delete', 'insert', 'create', 'alter', 'drop']
  return blacklist.some(entry => query.toLowerCase().includes(entry));
}

router.get('/:query', (req, res) => {
  var userQuery = req.params.query;

  if (isInjection(userQuery)) {
    res.status(500).send({msg: 'sql injection!'});
    return;
  }

  dbi.connection.query(userQuery, { type: Sequelize.QueryTypes.SELECT })
    .then(result => {
      res.send(result);
    }).catch()
    .catch(err => {
      if (err instanceof Sequelize.DatabaseError)
        err = {msg: err.parent.toString()};
      res.status(500).send(err);
    });
});

module.exports = router;
