/* eslint-disable func-names */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();
chai.use(chaiHttp);

describe('Boards', function () {
  let accessToken = null;
  let refreshToken = null;
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
        refreshToken = res.body.refresh_token;
        done();
      });
  });

  describe('Create Board', function () {
    it('It should create a board', function (done) {
      chai
        .request(server)
        .post('/boards/create-board')
        .auth(accessToken, { type: 'bearer' })
        .send({
          title: 'board',
          userId: 1,
        })
        .end(function (err, res) {
          res.should.have.status(201);
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not create a board without a title', function (done) {
      chai
        .request(server)
        .post('/boards/create-board')
        .auth(accessToken, { type: 'bearer' })
        .send({
          userId: 1,
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error_message').eql('MISSING_TITLE');
          done();
        });
    });
  });

  describe('Edit Board', function () {
    it('It should allow users with sufficient permissions to edit the board', function (done) {
      chai
        .request(server)
        .patch('/boards/edit-board')
        .auth(accessToken, { type: 'bearer' })
        .send({
          id: 1,
          name: 'new and improved gitrack board',
          userId: 1,
        })
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not alow users without sufficient permissions to edit the board', function (done) {
      // logout current user
      chai
        .request(server)
        .post('/auth/logout')
        .auth(accessToken, { type: 'bearer' })
        .send({ refresh_token: refreshToken })
        .end(function (err, res) {
          chai
            .request(server)
            .post('/auth/register')
            .send({
              username: 'pedro',
              password: 'generic123',
              email: 'juan@pen.duko',
            })
            .end(function (err1, res1) {
              chai
                .request(server)
                .post('/auth/login')
                .send({
                  username: 'pedro',
                  password: 'generic123',
                })
                .end(function (err2, res2) {
                  accessToken = res2.body.access_token;
                  refreshToken = res2.body.refresh_token;
                  chai
                    .request(server)
                    .patch('/boards/edit-board')
                    .auth(accessToken, { type: 'bearer' })
                    .send({
                      id: 1,
                      name: 'board',
                      userId: 2,
                    })
                    .end(function (errF, resF) {
                      resF.should.have.status(403);
                      resF.body.should.have
                        .property('error_message')
                        .eql('NOT_ENOUGH_PERMISSIONS');
                      done();
                    });
                });
              // register new user
            });
        });
    });

    it('It should not allow an edit which does not change anything', function (done) {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          username: 'juan',
          password: 'generic123',
        })
        .end(function (err, res) {
          accessToken = res.body.access_token;
          refreshToken = res.body.refresh_token;
        });
      chai
        .request(server)
        .patch('/boards/edit-board')
        .auth(accessToken, { type: 'bearer' })
        .send({
          id: 1,
          name: 'new and improved gitrack board',
          userId: 1,
        })
        .end(function (err, res) {
          res.should.have.status(409);
          res.body.should.have.property('error_message').eql('SAME_NAME');
          done();
        });
    });

    it('It should not allow missing boardId', function (done) {
      chai
        .request(server)
        .patch('/boards/edit-board')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'board',
          userId: 1,
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error_message').eql('MISSING_ID');
          done();
        });
    });

    it('It should not allow missing new name', function (done) {
      chai
        .request(server)
        .patch('/boards/edit-board')
        .auth(accessToken, { type: 'bearer' })
        .send({
          id: 1,
          userId: 1,
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error_message').eql('MISSING_NAME');
          done();
        });
    });
  });
});
