var _ = require('lodash')
var chai = require('chai')

var expect = chai.expect;
chai.use(require('chai-http'));

var server = require('../server')
var dbi = require('../dbi')


describe('select route', function() {

  describe('/GET request', function() {

    it('should get the query results as an array if a valid query is sent', async function() {
      var query = 'SELECT 1 AS [column1]';

      var response = await chai.request(server).get('/select/' + query);
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');

      var expectedResult = [ { column1: 1 } ];
      expect(response.body).to.deep.equal(expectedResult);
    });

    it('should get an error if an invalid query is sent', async function() {
      var query = 'A SELECT 1 AS [column1]';

      var response = await chai.request(server).get('/select/' + query);
      expect(response).to.have.status(500);
    });

    it('should get an error if the query sent is not just a SELECT statement', async function() {
      var query = 'INSERT INTO Query VALUES (\'titulo 1\', \'select 1\')';

      var response = await chai.request(server).get('/select/' + query);
      expect(response).to.have.status(500);
    });

    it('shouldn\'t chage the database', async function() {
      await dbi.query.destroy({truncate: true});

      var query = 'INSERT INTO Query VALUES (\'titulo 1\', \'select 1\')';
      await chai.request(server).get('/select/' + query);

      var databaseSelectResult = await dbi.query.findAll({raw:true});
      expect(databaseSelectResult).to.be.an('array');
      expect(databaseSelectResult).to.have.lengthOf(0);
    });

  });

  describe('/GET/paginated request', function() {

    it('Should get an error if missing an obrigatory parameter', async function() {
      var params = { rowsPerPage: 1, page: 1, query: 'SELECT 1 AS [column1]' };

      var response = await chai.request(server).get('/select/paginated').query(_.omit(params, ['rowsPerPage']));
      expect(response).to.have.status(500);
      response = await chai.request(server).get('/select/paginated').query(_.omit(params, ['page']));
      expect(response).to.have.status(500);
      response = await chai.request(server).get('/select/paginated').query(_.omit(params, ['query']));
      expect(response).to.have.status(500);
    });

    it('should get an error if an invalid query is sent', async function() {
      var params = { rowsPerPage: 1, page: 1, query: 'A SELECT 1 AS [column1]' };

      var response = await chai.request(server).get('/select/paginated').query(params);
      expect(response).to.have.status(500);
    });

    it('should get an error if the query sent is not just a SELECT statement', async function() {
      var params = { rowsPerPage: 1, page: 1, query: 'INSERT INTO Query VALUES (\'titulo 1\', \'select 1\')' };

      var response = await chai.request(server).get('/select/paginated').query(params);
      expect(response).to.have.status(500);
    });

    it('shouldn\'t chage the database', async function() {
      await dbi.query.destroy({truncate: true});

      var params = { rowsPerPage: 1, page: 1, query: 'INSERT INTO Query VALUES (\'titulo 1\', \'select 1\')' };
      await chai.request(server).get('/select/paginated').query(params);

      var databaseSelectResult = await dbi.query.findAll({raw:true});
      expect(databaseSelectResult).to.be.an('array');
      expect(databaseSelectResult).to.have.lengthOf(0);
    });

    it('should get a { total, result } object if valid parameters are sent', async function() {
      var params = { rowsPerPage: 1, page: 1, query: 'SELECT 1 AS [column1]' };

      var response = await chai.request(server).get('/select/paginated').query(params);
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.keys('total', 'result');
    });

    it('should get { result } as an array if valid parameters are sent', async function() {
      var params = { rowsPerPage: 1, page: 1, query: 'SELECT 1 AS [column1]' };

      var response = await chai.request(server).get('/select/paginated').query(params);
      expect(response).to.have.status(200);
      expect(response.body.result).to.be.an('array');

      var expectedResult = [ { column1: 1 } ];
      expect(response.body.result).to.deep.equal(expectedResult);
    });

    it('should get { total } as a number if valid parameters are sent', async function() {
      var params = { rowsPerPage: 1, page: 1, query: 'SELECT 1 AS [column1]' };

      var response = await chai.request(server).get('/select/paginated').query(params);
      expect(response).to.have.status(200);
      expect(response.body.total).to.be.a('number');

      var expectedTotal = 1;
      expect(response.body.total).to.equal(expectedTotal);
    });

    it('Should paginate the { result } according to the sent parameters', async function() {

      // first page
      var params = { rowsPerPage: 1, page: 1, query: 'SELECT 1 AS [column1] UNION ALL SELECT 2' };

      var response = await chai.request(server).get('/select/paginated').query(params);
      expect(response).to.have.status(200);

      var expectedResult = [ { column1: 1 } ];
      var expectedTotal = 2;
      expect(response.body.result).to.deep.equal(expectedResult);
      expect(response.body.total).to.equal(expectedTotal);

      // second page
      params = { rowsPerPage: 1, page: 2, query: 'SELECT 1 AS [column1] UNION ALL SELECT 2' };

      response = await chai.request(server).get('/select/paginated').query(params);
      expect(response).to.have.status(200);

      expectedResult = [ { column1: 2 } ];
      expectedTotal = 2;
      expect(response.body.result).to.deep.equal(expectedResult);
      expect(response.body.total).to.equal(expectedTotal);
    });

  });

});
