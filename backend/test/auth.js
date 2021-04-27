/* eslint-disable func-names */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();
chai.use(chaiHttp);

describe('Authentication', function () {
  describe('Register', function () {
    it('It should create a user', function (done) {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          username: 'juan',
          password: 'generic123',
          email: 'juan@dela.cruz',
        })
        .end(function (err, res) {
          res.should.have.status(201);
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not create a duplicate user with the same username', function (done) {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          username: 'juan',
          password: 'generic123',
          email: 'juan1@dela.cruz',
        })
        .end(function (err, res) {
          res.should.have.status(409);
          res.body.should.have.property('error_message').eql('DUPLICATE_USER');
          done();
        });
    });

    it('It should not create a duplicate user with the same email', function (done) {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          username: 'juan1',
          password: 'generic123',
          email: 'juan@dela.cruz',
        })
        .end(function (err, res) {
          res.should.have.status(409);
          res.body.should.have.property('error_message').eql('DUPLICATE_EMAIL');
          done();
        });
    });

    it('It should not allow missing usernames', function (done) {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          password: 'generic123',
          email: 'juan@dela.cruz',
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error_message').eql('MISSING_USERNAME');
          done();
        });
    });

    it('It should not allow missing passwords', function (done) {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          username: 'juan',
          email: 'juan@dela.cruz',
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error_message').eql('MISSING_PASSWORD');
          done();
        });
    });

    it('It should not allow missing email', function (done) {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          username: 'juan',
          password: 'generic123',
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error_message').eql('MISSING_EMAIL');
          done();
        });
    });

    it('It should allow creating another user', function (done) {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          username: 'pedro',
          password: 'generic123',
          email: 'juan@pen.duko',
        })
        .end(function (err, res) {
          res.should.have.status(201);
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });
  });

  describe('Login', function () {
    it('It should allow logging in with correct credentials', function (done) {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          username: 'juan',
          password: 'generic123',
        })
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('id').eql(1);
          res.body.should.have.property('username').eql('juan');
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not allow logging in with incorrect credentials', function (done) {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          username: 'juan',
          password: 'generic123456',
        })
        .end(function (err, res) {
          res.should.have.status(403);
          res.body.should.have.property('error_message').eql('USER_NOT_FOUND');
          done();
        });
    });

    it('It should not allow logging in with missing user', function (done) {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          username: 'juandelacruz',
          password: 'generic123456',
        })
        .end(function (err, res) {
          res.should.have.status(403);
          res.body.should.have.property('error_message').eql('USER_NOT_FOUND');
          done();
        });
    });

    it('It should not allow missing username', function (done) {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          password: 'generic123456',
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error_message').eql('MISSING_USERNAME');
          done();
        });
    });

    it('It should not allow missing password', function (done) {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          user: 'juan',
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error_message').eql('MISSING_PASSWORD');
          done();
        });
    });
  });

  describe('Logout', function () {
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

    it('It should allow logging out', function (done) {
      chai
        .request(server)
        .post('/auth/logout')
        .auth(accessToken, { type: 'bearer' })
        .send({ refresh_token: refreshToken })
        .end(function (err, res) {
          res.should.have.status('200');
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not allow logging out without auth token', function (done) {
      chai
        .request(server)
        .post('/auth/logout')
        .send({ refresh_token: refreshToken })
        .end(function (err, res) {
          res.should.have.status('403');
          res.body.should.have.property('error_message').eql('AUTH_NOT_FOUND');
          done();
        });
    });

    it('It should not allow missing refresh token', function (done) {
      chai
        .request(server)
        .post('/auth/logout')
        .auth(accessToken, { type: 'bearer' })
        .end(function (err, res) {
          res.should.have.status('400');
          res.body.should.have.property('error_message').eql('MISSING_REFRESH_TOKEN');
          done();
        });
    });
  });

  describe('Refresh Token', function () {
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
          refreshToken = res.body.refresh_token;
          done();
        });
    });

    it('It should allow getting new access token', function (done) {
      chai
        .request(server)
        .post('/auth/refresh-token')
        .send({
          refresh_token: refreshToken,
        })
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('access_token').not.eql(null);
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not allow missing refresh token', function (done) {
      chai
        .request(server)
        .post('/auth/refresh-token')
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error_message').eql('MISSING_REFRESH_TOKEN');
          done();
        });
    });

    it('It should not allow invalid refresh token', function (done) {
      chai
        .request(server)
        .post('/auth/refresh-token')
        .send({
          refresh_token: '123',
        })
        .end(function (err, res) {
          res.should.have.status(403);
          res.body.should.have.property('error_message').eql('TOKEN_INVALID');
          done();
        });
    });
  });
});
