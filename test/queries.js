var chai = require('chai');

var expect = chai.expect;
chai.use(require('chai-http'));
chai.use(require('chai-things'));

var server = require('../server');
var query = require('../dbi/query');


describe('queries route', function() {

  beforeEach(function() {
    return query.destroy({truncate: true});
  });

  describe('/GET requests', function() {

    it('should get an empty array if no query exists', function() {
      return chai.request(server)
        .get('/queries')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');

          expect(res.body).to.have.lengthOf(0);
        });
    });

    it('should get an array of queries if at least one query exists', function() {
      query.create({titulo: 'query 1', corpo: 'select 1'})
      return chai.request(server)
        .get('/queries')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');

          expect(res.body).to.have.lengthOf.at.least(1);
          expect(res.body).all.to.have.keys('id', 'titulo', 'corpo');
        });
    });

    it('should get an empty object if specified id doesn\'t exist', function() {
      return chai.request(server)
        .get('/queries/1')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.null;
        });
    });

    it('should get a query object if specified id exists', function() {
      query.create({titulo: 'query 1', corpo: 'select 1'})
      return chai.request(server)
        .get('/queries/1')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');

          expect(res.body).to.have.keys('id', 'titulo', 'corpo');
        });
    });

  });

  describe('/POST requests', function() {

    it('should persist a valid query object', function() {
      var newQuery = {titulo: 'query 1', corpo: 'select 1'}
      return chai.request(server)
        .post('/queries')
        .send(newQuery)
        .then(function(res) {
          expect(res).to.have.status(200);

          return query.findById(1, {raw:true});
        }).then(function(result) {

          expect(result).to.deep.equal(Object.assign({id: 1}, newQuery));
        });
    });

    it('shouldn\'t persist an invalid query object', function() {
      var newQuery = {titulo: 'query 1'}
      return chai.request(server)
        .post('/queries')
        .send(newQuery)
        .then(function(res) {
          expect(res).to.have.status(500);

          return query.findById(1, {raw:true});
        }).then(function(result) {
          expect(result).to.be.null;
        });
    });

    it('should return the persisted query object', function() {
      var newQuery = {titulo: 'query 1', corpo: 'select 1'}
      return chai.request(server)
        .post('/queries')
        .send(newQuery)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');

          return Promise.all([res.body, query.findById(1, {raw:true})]);
        }).then(function(results) {
          var objectReturnedFromServer = results[0]
          var objectFoundInDatabase = results[1]

          expect(objectReturnedFromServer).to.deep.equal(objectFoundInDatabase);
        });
    });

  });

});
