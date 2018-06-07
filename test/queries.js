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

  describe('/PUT requests', function() {

    it('should update a valid query object', async function() {
      var newQuery = {titulo: 'query 1', corpo: 'select 1'};
      var insertedQuery = (await query.create(newQuery)).dataValues;

      var queryToUpdate = Object.assign(insertedQuery, {titulo: 'query 2'});
      var serverResponse = await chai.request(server).put('/queries').send(queryToUpdate);
      expect(serverResponse).to.have.status(200);

      var databaseSelectResult = await query.findById(1, {raw:true});
      expect(databaseSelectResult).to.deep.equal(queryToUpdate);
    });

    it('should get an error if trying to update a nonexistent query', async function() {
      var nonexistentQuery = {id: 1, titulo: 'query 1', corpo: 'select 1'};

      var serverResponse = await chai.request(server).put('/queries').send(nonexistentQuery);
      expect(serverResponse).to.have.status(500);
    });

    it('shouldn\'t change the database if trying to update a nonexistent query', async function() {
      var newQuery = {titulo: 'query 1', corpo: 'select 1'};
      var insertedQuery = (await query.create(newQuery)).dataValues;

      var nonexistentQuery = {id: 2, titulo: 'query 2', corpo: 'select 2'};
      var serverResponse = await chai.request(server).put('/queries').send(nonexistentQuery);
      expect(serverResponse).to.have.status(500);

      var databaseSelectResult = await query.findAll({raw:true});
      expect(databaseSelectResult).to.be.an('array');
      expect(databaseSelectResult).to.have.lengthOf(1);
      expect(databaseSelectResult[0]).to.deep.equal(insertedQuery);
    });

    it('should return the updated query object', async function() {
      var newQuery = {titulo: 'query 1', corpo: 'select 1'};
      var insertedQuery = (await query.create(newQuery)).dataValues;

      var queryToUpdate = Object.assign(insertedQuery, {titulo: 'query 2'});
      var serverResponse = await chai.request(server).put('/queries').send(queryToUpdate);
      expect(serverResponse).to.have.status(200);
      expect(serverResponse.body).to.be.an('object');

      var databaseSelectResult = await query.findById(1, {raw:true});
      expect(databaseSelectResult).to.deep.equal(serverResponse.body);
    });

  });

  describe('/DELETE requests', function() {

    it('should delete a query if specified id exists', async function() {
      await query.create({titulo: 'query 1', corpo: 'select 1'});

      var serverResponse = await chai.request(server).delete('/queries/1');
      expect(serverResponse).to.have.status(200);

      var databaseSelectResult = await query.findById(1, {raw:true});
      expect(databaseSelectResult).to.be.null;
    });

    it('should get an error if specified id doesn\'t exist', async function() {
      var newQuery = {titulo: 'query 1', corpo: 'select 1'};

      await query.create(newQuery);

      var serverResponse = await chai.request(server).delete('/queries/2');
      expect(serverResponse).to.have.status(500);
    });

    it('shouldn\'t change the database if specified id doesn\'t exist', async function() {
      var newQuery = {titulo: 'query 1', corpo: 'select 1'};

      await query.create(newQuery);

      var serverResponse = await chai.request(server).delete('/queries/2');
      expect(serverResponse).to.have.status(500);

      var expectedDatabaseSelectResult = Object.assign({id: 1}, newQuery);
      var databaseSelectResult = await query.findById(1, {raw:true});
      expect(databaseSelectResult).to.deep.equal(expectedDatabaseSelectResult);
    });

  });

});
