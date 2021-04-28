/* eslint-disable func-names */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();
chai.use(chaiHttp);

describe('Tasks', function () {
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

  describe('Add Tasks', function () {
    it('It should add a task', function (done) {
      chai
        .request(server)
        .post('/task')
        .auth(accessToken, { type: 'bearer' })
        .send({
          board_id: 1,
          title: 'Sample Task',
          description: 'This is a sample task',
        })
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('id').eql(1);
          res.body.should.have.property('column_id').eql(0);
          res.body.should.have.property('board_id').eql(1);
          res.body.should.have.property('title').eql('Sample Task');
          res.body.should.have.property('description').eql('This is a sample task');
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should add a second task', function (done) {
      chai
        .request(server)
        .post('/task')
        .auth(accessToken, { type: 'bearer' })
        .send({
          board_id: 1,
          title: 'Sample Task 2',
          description: 'This is a sample task',
        })
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('id').eql(2);
          res.body.should.have.property('column_id').eql(0);
          res.body.should.have.property('board_id').eql(1);
          res.body.should.have.property('title').eql('Sample Task 2');
          res.body.should.have.property('description').eql('This is a sample task');
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not add a task without title', function (done) {
      chai
        .request(server)
        .post('/task')
        .auth(accessToken, { type: 'bearer' })
        .send({
          board_id: 1,
          description: 'This is a sample task',
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('id').eql(null);
          res.body.should.have.property('column_id').eql(null);
          res.body.should.have.property('board_id').eql(null);
          res.body.should.have.property('title').eql(null);
          res.body.should.have.property('description').eql(null);
          res.body.should.have.property('error_message').eql('MISSING_TITLE');
          done();
        });
    });

    it('It should not add a task without description', function (done) {
      chai
        .request(server)
        .post('/task')
        .auth(accessToken, { type: 'bearer' })
        .send({
          board_id: 1,
          title: 'sample',
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('id').eql(null);
          res.body.should.have.property('column_id').eql(null);
          res.body.should.have.property('board_id').eql(null);
          res.body.should.have.property('title').eql(null);
          res.body.should.have.property('description').eql(null);
          res.body.should.have.property('error_message').eql('MISSING_DESCRIPTION');
          done();
        });
    });

    it('It should not add a task without description a board id', function (done) {
      chai
        .request(server)
        .post('/task')
        .auth(accessToken, { type: 'bearer' })
        .send({
          description: 'sample desc',
          title: 'sample',
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('id').eql(null);
          res.body.should.have.property('column_id').eql(null);
          res.body.should.have.property('board_id').eql(null);
          res.body.should.have.property('title').eql(null);
          res.body.should.have.property('description').eql(null);
          res.body.should.have.property('error_message').eql('MISSING_BOARD_ID');
          done();
        });
    });
  });

  describe('Remove Tasks', function () {
    it('It should remove a task', function (done) {
      chai
        .request(server)
        .delete('/task/2')
        .auth(accessToken, { type: 'bearer' })
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not remove a non-existing task', function (done) {
      chai
        .request(server)
        .delete('/task/100')
        .auth(accessToken, { type: 'bearer' })
        .end(function (err, res) {
          res.should.have.status(403);
          res.body.should.have.property('error_message').eql('NOT_ENOUGH_PERMISSIONS');
          done();
        });
    });

    it('It should not allow users without sufficient permissions to remove a task', function (done) {
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
            .delete('/task/1')
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
  });
});
