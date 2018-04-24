const Sequelize = require('sequelize')

const config = require('config')

var connection = new Sequelize({
  dialect: 'mssql',
  dialectModulePath: 'sequelize-msnodesqlv8',
  dialectOptions: {
  	driver: config.get('db.driver'),
    trustedConnection: true
  },
  host: config.get('db.host'),
  database: config.get('db.database'),

  operatorsAliases: false,
  logging: false
});

module.exports = connection;
