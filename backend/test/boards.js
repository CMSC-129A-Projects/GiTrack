/* eslint-disable func-names */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();
chai.use(chaiHttp);

describe('Boards', function () {
  let accessToken = null;
  beforeEach(function (done) {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        username: 'juan',
        password: 'generic123',
      })
      .end(function (err, res) {
        accessToken = res.body.access_token;
        done();
      });
  });

  describe('Create Board', function () {
    it('It should create a board', function (done) {
      chai
        .request(server)
        .post('/board')
        .auth(accessToken, { type: 'bearer' })
        .send({
          title: 'board',
        })
        .end(function (err, res) {
          res.should.have.status(201);
          res.body.should.have.property('id').eql(1);
          res.body.should.have.property('title').eql('board');
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not create a board without a title', function (done) {
      chai
        .request(server)
        .post('/board')
        .auth(accessToken, { type: 'bearer' })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('id').eql(null);
          res.body.should.have.property('title').eql(null);
          res.body.should.have.property('error_message').eql('MISSING_TITLE');
          done();
        });
    });

    it('It should create another board', function (done) {
      chai
        .request(server)
        .post('/board')
        .auth(accessToken, { type: 'bearer' })
        .send({
          title: 'MinimaLine',
        })
        .end(function (err, res) {
          res.should.have.status(201);
          res.body.should.have.property('id').eql(2);
          res.body.should.have.property('title').eql('MinimaLine');
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });
  });

  describe('Get Board', function () {
    it('It should get a specific board', function (done) {
      chai
        .request(server)
        .get('/board/1')
        .auth(accessToken, { type: 'bearer' })
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('id').eql(1);
          res.body.should.have.property('title').eql('board');
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not get a specific board with incorrect board id', function (done) {
      chai
        .request(server)
        .get('/board/23')
        .auth(accessToken, { type: 'bearer' })
        .end(function (err, res) {
          res.should.have.status(403);
          res.body.should.have.property('id').eql(null);
          res.body.should.have.property('title').eql(null);
          res.body.should.have.property('error_message').eql('NOT_ENOUGH_PERMISSIONS');
          done();
        });
    });

    it('It should get all boards', function (done) {
      chai
        .request(server)
        .get('/board')
        .auth(accessToken, { type: 'bearer' })
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.boards.length.should.be.eql(2);
          res.body.boards[0].should.have.property('id').eql(1);
          res.body.boards[0].should.have.property('title').eql('board');
          res.body.boards[1].should.have.property('id').eql(2);
          res.body.boards[1].should.have.property('title').eql('MinimaLine');
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });
  });

  describe('Edit Board', function () {
    it('It should allow users with sufficient permissions to edit the board', function (done) {
      chai
        .request(server)
        .patch('/board/1')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Ayo',
        })
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not allow users without sufficient permissions to edit the board', function (done) {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          username: 'pedro',
          password: 'generic123',
        })
        .end(function (err2, res2) {
          accessToken = res2.body.access_token;
          chai
            .request(server)
            .patch('/board/1')
            .auth(accessToken, { type: 'bearer' })
            .send({
              name: 'Mercado',
            })
            .end(function (errF, resF) {
              resF.should.have.status(403);
              resF.body.should.have
                .property('error_message')
                .eql('NOT_ENOUGH_PERMISSIONS');
              done();
            });
        });
    });

    it('It should not allow missing new name', function (done) {
      chai
        .request(server)
        .patch('/board/1')
        .auth(accessToken, { type: 'bearer' })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error_message').eql('MISSING_NAME');
          done();
        });
    });
  });

  describe('Delete Board', function () {
    it('It should not allow users without sufficient permissions to delete the board', function (done) {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          username: 'pedro',
          password: 'generic123',
        })
        .end(function (midErr, midRes) {
          accessToken = midRes.body.access_token;
          chai
            .request(server)
            .delete('/board/1')
            .auth(accessToken, { type: 'bearer' })
            .end(function (err, res) {
              res.should.have.status(403);
              res.body.should.have
                .property('error_message')
                .eql('NOT_ENOUGH_PERMISSIONS');
              done();
            });
        });
    });

    it('It should allow users with sufficient permissions to delete the board', function (done) {
      chai
        .request(server)
        .delete('/board/1')
        .auth(accessToken, { type: 'bearer' })
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not allow users to delete non-existent boards', function (done) {
      chai
        .request(server)
        .delete('/board/100')
        .auth(accessToken, { type: 'bearer' })
        .end(function (err, res) {
          res.should.have.status(403);
          res.body.should.have.property('error_message').eql('NOT_ENOUGH_PERMISSIONS');
          done();
        });
    });
  });
});
