/* eslint-disable func-names */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();
chai.use(chaiHttp);

describe('Tasks', function () {
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
        done();
      });
  });

  describe('Add Tasks', function () {
    it('It should add a task', function (done) {
      chai
        .request(server)
        .post('/tasks/add-task')
        .auth(accessToken, { type: 'bearer' })
        .send({
          id: 1,
          title: 'Sample Task',
          description: 'This is a sample task',
        })
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not add a task without title', function (done) {
      chai
        .request(server)
        .post('/tasks/add-task')
        .auth(accessToken, { type: 'bearer' })
        .send({
          id: 1,
          description: 'This is a sample task',
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error_message').eql('MISSING_TITLE');
          done();
        });
    });

    it('It should not add a task without desciption', function (done) {
      chai
        .request(server)
        .post('/tasks/add-task')
        .auth(accessToken, { type: 'bearer' })
        .send({
          id: 1,
          title: 'sample',
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.have.property('error_message').eql('MISSING_DESCRIPTION');
          done();
        });
    });
  });

  describe('Remove Tasks', function () {
    it('It should remove a task', function (done) {
      chai
        .request(server)
        .delete('/tasks/remove-task')
        .auth(accessToken, { type: 'bearer' })
        .send({
          id: 1,
          boardId: 1,
        })
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('error_message').eql(null);
          done();
        });
    });

    it('It should not remove a non-existing task', function (done) {
      chai
        .request(server)
        .delete('/tasks/remove-task')
        .auth(accessToken, { type: 'bearer' })
        .send({
          id: 2,
          boardId: 1,
        })
        .end(function (err, res) {
          res.should.have.status(404);
          res.body.should.have.property('error_message').eql('TASK_NOT_FOUND');
          done();
        });
    });

    it('It should not allow users without sufficient permissions to remove a task', function (done) {
      chai
        .request(server)
        .delete('/tasks/remove-task')
        .auth(accessToken, { type: 'bearer' })
        .send({
          id: 2,
          boardId: 1,
        })
        .end(function (err, res) {
          chai
            .request(server)
            .post('/auth/logout')
            .auth(accessToken, { type: 'bearer' })
            .send({ refresh_token: refreshToken })
            .end(function () {
              chai
                .request(server)
                .post('/auth/register')
                .send({
                  username: 'pedro',
                  password: 'generic123',
                  email: 'juan@pen.duko',
                })
                .end(function () {
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
                        .delete('/boards/delete-board')
                        .auth(accessToken, { type: 'bearer' })
                        .send({
                          id: 1,
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
            });
        });
    });
  });
});
