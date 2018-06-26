const asyncHandler = require('express-async-handler')
const express = require('express')

const selectService = require('../services/select.service')
const CustomError = require('../utils/CustomError')

var router = express.Router();


router.get('/paginated', asyncHandler(async (req, res, next) => {
  const obrigatoryParams = ['rowsPerPage', 'page', 'query'];
  if (!Object.keys(req.query).includes(...obrigatoryParams))
    throw new CustomError('Missing obrigatory parameters');

  var result = await selectService.executePaginated(req.query);
  var count = await selectService.executeCount(req.query.query);
  var total = count[0].count;

  res.send({ total, result });
}));

router.get('/:query', asyncHandler(async (req, res, next) => {
  var query = req.params.query;

  var result = await selectService.execute(query);
  res.send(result);
}));

module.exports = router;
