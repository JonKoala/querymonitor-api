var sequelize = require('sequelize')
var db = require('./connection')

var model = db.define('query', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: sequelize.STRING,
  corpo: sequelize.STRING
}, {
  timestamps: false,
  tableName: 'Query'
});

module.exports = model;
