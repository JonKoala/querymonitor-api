var chai = require('chai');

var expect = chai.expect;
chai.use(require('chai-http'));
chai.use(require('chai-things'));

var server = require('../server');
var query = require('../dbi/query');


describe('queries route', function() {

  beforeEach(function(done) {
    query.destroy({truncate: true}).then(done);
  });

  describe('/GET queries', function() {

    it('sould get an empty array if no query exists', function(done) {
      chai.request(server)
        .get('/queries')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');

          expect(res.body).to.have.lengthOf(0);

          done();
        });
    });

    it('sould get an array of queries if at least one query exists', function(done) {
      query.create({titulo: 'query 1', corpo: 'corpo 1'})
      chai.request(server)
        .get('/queries')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');

          expect(res.body).to.have.lengthOf.at.least(1);
          expect(res.body).all.to.have.keys('id', 'titulo', 'corpo');

          done();
        });
    });

    it('should get an empty object if specified id doesn\'t exist', function(done) {
      chai.request(server)
        .get('/queries/1')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');

          expect(Object.keys(res.body)).to.have.lengthOf(0);

          done();
        });
    });

    it('should get a query object if specified id exists', function(done) {
      query.create({titulo: 'query 1', corpo: 'corpo 1'})
      chai.request(server)
        .get('/queries/1')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');

          expect(res.body).to.have.keys('id', 'titulo', 'corpo');

          done();
        });
    });

  });

});
