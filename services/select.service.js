const Sequelize = require('sequelize')

const CustomError = require('../utils/CustomError')
const dbi = require('../dbi')
const queryCollection = require('./query.collection')


const bannedStatements = ['update', 'delete', 'truncate', 'insert', 'create', 'alter', 'drop'];

async function execute(query) {
  if (isUnsafe(query))
    throw new CustomError('Potential SQL injection detected');

  return await dbi.connection.query(query, { type: Sequelize.QueryTypes.SELECT });
}

async function executeCount(query) {
  var countQuery = queryCollection.selectRowCount(query);
  return await execute(countQuery);
}

async function executePaginated({ descending, rowsPerPage, page, query, sortBy }) {

  // pagination
  var end = Number(rowsPerPage) * Number(page);
  var start = end - Number(rowsPerPage) + 1;

  // sorting
  var orderBy = Boolean(sortBy) ? sortBy : 'SELECT NULL';
  var orderAs = (descending === 'true') ? 'DESC' : 'ASC';

  var paginatedQuery = queryCollection.selectPaginated(query, start, end, orderBy, orderAs);

  // remove the 'row_num' column
  var result = await execute(paginatedQuery);
  result.forEach(entry => delete entry['row_num']);

  return result
}

function isUnsafe(query) {
  return bannedStatements.some(entry => query.toLowerCase().includes(entry));
}

module.exports = {
  bannedStatements,
  execute,
  executeCount,
  executePaginated,
  isUnsafe
}
