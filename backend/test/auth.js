const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();
chai.use(chaiHttp);

describe('Authentication', () => {
  describe('Register', () => {
    it('It should create a user', (done) => {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          username: 'juan',
          password: 'generic123',
          email: 'juan@dela.cruz',
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not create a duplicate user with the same username', (done) => {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          username: 'juan',
          password: 'generic123',
          email: 'juan1@dela.cruz',
        })
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('error_message');
          res.body.error_message.should.eq('DUPLICATE_USER');
          done();
        });
    });

    it('It should not create a duplicate user with the same email', (done) => {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          username: 'juan1',
          password: 'generic123',
          email: 'juan@dela.cruz',
        })
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('error_message');
          done();
        });
    });

    it('It should not allow missing usernames', (done) => {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          password: 'generic123',
          email: 'juan@dela.cruz',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error_message');
          res.body.error_message.should.eq('MISSING_USERNAME');
          done();
        });
    });

    it('It should not allow missing passwords', (done) => {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          username: 'juan',
          email: 'juan@dela.cruz',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error_message');
          res.body.error_message.should.eq('MISSING_PASSWORD');
          done();
        });
    });

    it('It should not allow missing email', (done) => {
      chai
        .request(server)
        .post('/auth/register')
        .send({
          username: 'juan',
          password: 'generic123',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error_message');
          res.body.error_message.should.eq('MISSING_EMAIL');
          done();
        });
    });
  });

  describe('Login', () => {
    it('It should allow logging in with correct credentials', (done) => {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          username: 'juan',
          password: 'generic123',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.id.should.eq(1);
          res.body.username.should.eq('juan');
          done();
        });
    });

    it('It should not allow logging in with incorrect credentials', (done) => {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          username: 'juan',
          password: 'generic123456',
        })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.error_message.should.eq('USER_NOT_FOUND');
          done();
        });
    });

    it('It should not allow logging in with missing user', (done) => {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          username: 'juandelacruz',
          password: 'generic123456',
        })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.error_message.should.eq('USER_NOT_FOUND');
          done();
        });
    });

    it('It should not allow missing username', (done) => {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          password: 'generic123456',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.error_message.should.eq('MISSING_USERNAME');
          done();
        });
    });

    it('It should not allow missing password', (done) => {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          user: 'juan',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.error_message.should.eq('MISSING_PASSWORD');
          done();
        });
    });
  });
});
