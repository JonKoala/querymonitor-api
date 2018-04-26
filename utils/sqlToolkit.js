const bannedStatements = ['update', 'delete', 'truncate', 'insert', 'create', 'alter', 'drop'];

function isUnsafe(query) {
  return bannedStatements.some(entry => query.toLowerCase().includes(entry));
}

module.exports = {
  bannedStatements: bannedStatements,
  isUnsafe: isUnsafe
}
