var chai = require('chai')

var expect = chai.expect;
chai.use(require('chai-http'));

var server = require('../server')
var dbi = require('../dbi')


describe('select route', function() {

  describe('/GET requests', function() {

    it('should get the query results as an array if a valid query is sent', async function() {
      var query = 'SELECT 1 as [column1]';

      var response = await chai.request(server).get('/select/' + query);
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');

      var expectedResult = [ { column1:1 } ];
      expect(response.body).to.deep.equal(expectedResult);
    });

    it('should get an error if an invalid query is sent', async function() {
      var query = 'A SELECT 1 as [column1]';

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

});
