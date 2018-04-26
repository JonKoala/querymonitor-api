var chai = require('chai')

var expect = chai.expect;
chai.use(require('chai-http'));
chai.use(require('chai-things'));

var server = require('../server')
var query = require('../dbi/query')


describe('queries route', function() {

  beforeEach(function() {
    return query.destroy({truncate: true});
  });

  describe('/GET requests', function() {

    it('should get an empty array if no query exists', async function() {
      var response = await chai.request(server).get('/queries')
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');

      expect(response.body).to.have.lengthOf(0);
    });

    it('should get an array of queries if at least one query exists', async function() {
      await query.create({titulo: 'query 1', corpo: 'select 1'});

      var response = await chai.request(server).get('/queries');
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');

      expect(response.body).to.have.lengthOf.at.least(1);
      expect(response.body).all.to.have.keys('id', 'titulo', 'corpo');
    });

    it('should get null as response if specified id doesn\'t exist', async function() {
      var response = await chai.request(server).get('/queries/1');
      expect(response).to.have.status(200);
      expect(response.body).to.be.null;
    });

    it('should get a query object if specified id exists', async function() {
      await query.create({titulo: 'query 1', corpo: 'select 1'});

      var response = await chai.request(server).get('/queries/1');
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');

      expect(response.body).to.have.keys('id', 'titulo', 'corpo');
    });

  });

  describe('/POST requests', function() {

    it('should persist a valid query object', async function() {
      var newQuery = {titulo: 'query 1', corpo: 'select 1'};

      var serverResponse = await chai.request(server).post('/queries').send(newQuery);
      expect(serverResponse).to.have.status(200);

      var expectedDatabaseSelectResult = Object.assign({id: 1}, newQuery);
      var databaseSelectResult = await query.findById(1, {raw:true});
      expect(databaseSelectResult).to.deep.equal(expectedDatabaseSelectResult);
    });

    it('shouldn\'t persist an invalid query object', async function() {
      var newInvalidQuery = {titulo: 'query 1'};

      var serverResponse = await chai.request(server).post('/queries').send(newInvalidQuery);
      expect(serverResponse).to.have.status(500);

      var databaseSelectResult = await query.findById(1, {raw:true});
      expect(databaseSelectResult).to.be.null;
    });

    it('should return the persisted query object', async function() {
      var newQuery = {titulo: 'query 1', corpo: 'select 1'};

      var serverResponse = await chai.request(server).post('/queries').send(newQuery);
      expect(serverResponse).to.have.status(200);
      expect(serverResponse.body).to.be.an('object');

      var databaseSelectResult = await query.findById(1, {raw:true});
      expect(databaseSelectResult).to.deep.equal(serverResponse.body);
    });

  });

});
