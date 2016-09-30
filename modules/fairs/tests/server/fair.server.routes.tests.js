'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Fair = mongoose.model('Fair'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  fair;

/**
 * Fair routes tests
 */
describe('Fair CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Fair
    user.save(function () {
      fair = {
        name: 'Fair name'
      };

      done();
    });
  });

  it('should be able to save a Fair if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Fair
        agent.post('/api/fairs')
          .send(fair)
          .expect(200)
          .end(function (fairSaveErr, fairSaveRes) {
            // Handle Fair save error
            if (fairSaveErr) {
              return done(fairSaveErr);
            }

            // Get a list of Fairs
            agent.get('/api/fairs')
              .end(function (fairsGetErr, fairsGetRes) {
                // Handle Fairs save error
                if (fairsGetErr) {
                  return done(fairsGetErr);
                }

                // Get Fairs list
                var fairs = fairsGetRes.body;

                // Set assertions
                (fairs[0].user._id).should.equal(userId);
                (fairs[0].name).should.match('Fair name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Fair if not logged in', function (done) {
    agent.post('/api/fairs')
      .send(fair)
      .expect(403)
      .end(function (fairSaveErr, fairSaveRes) {
        // Call the assertion callback
        done(fairSaveErr);
      });
  });

  it('should not be able to save an Fair if no name is provided', function (done) {
    // Invalidate name field
    fair.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Fair
        agent.post('/api/fairs')
          .send(fair)
          .expect(400)
          .end(function (fairSaveErr, fairSaveRes) {
            // Set message assertion
            (fairSaveRes.body.message).should.match('Please fill Fair name');

            // Handle Fair save error
            done(fairSaveErr);
          });
      });
  });

  it('should be able to update an Fair if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Fair
        agent.post('/api/fairs')
          .send(fair)
          .expect(200)
          .end(function (fairSaveErr, fairSaveRes) {
            // Handle Fair save error
            if (fairSaveErr) {
              return done(fairSaveErr);
            }

            // Update Fair name
            fair.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Fair
            agent.put('/api/fairs/' + fairSaveRes.body._id)
              .send(fair)
              .expect(200)
              .end(function (fairUpdateErr, fairUpdateRes) {
                // Handle Fair update error
                if (fairUpdateErr) {
                  return done(fairUpdateErr);
                }

                // Set assertions
                (fairUpdateRes.body._id).should.equal(fairSaveRes.body._id);
                (fairUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Fairs if not signed in', function (done) {
    // Create new Fair model instance
    var fairObj = new Fair(fair);

    // Save the fair
    fairObj.save(function () {
      // Request Fairs
      request(app).get('/api/fairs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Fair if not signed in', function (done) {
    // Create new Fair model instance
    var fairObj = new Fair(fair);

    // Save the Fair
    fairObj.save(function () {
      request(app).get('/api/fairs/' + fairObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', fair.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Fair with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/fairs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Fair is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Fair which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Fair
    request(app).get('/api/fairs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Fair with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Fair if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Fair
        agent.post('/api/fairs')
          .send(fair)
          .expect(200)
          .end(function (fairSaveErr, fairSaveRes) {
            // Handle Fair save error
            if (fairSaveErr) {
              return done(fairSaveErr);
            }

            // Delete an existing Fair
            agent.delete('/api/fairs/' + fairSaveRes.body._id)
              .send(fair)
              .expect(200)
              .end(function (fairDeleteErr, fairDeleteRes) {
                // Handle fair error error
                if (fairDeleteErr) {
                  return done(fairDeleteErr);
                }

                // Set assertions
                (fairDeleteRes.body._id).should.equal(fairSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Fair if not signed in', function (done) {
    // Set Fair user
    fair.user = user;

    // Create new Fair model instance
    var fairObj = new Fair(fair);

    // Save the Fair
    fairObj.save(function () {
      // Try deleting Fair
      request(app).delete('/api/fairs/' + fairObj._id)
        .expect(403)
        .end(function (fairDeleteErr, fairDeleteRes) {
          // Set message assertion
          (fairDeleteRes.body.message).should.match('User is not authorized');

          // Handle Fair error error
          done(fairDeleteErr);
        });

    });
  });

  it('should be able to get a single Fair that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Fair
          agent.post('/api/fairs')
            .send(fair)
            .expect(200)
            .end(function (fairSaveErr, fairSaveRes) {
              // Handle Fair save error
              if (fairSaveErr) {
                return done(fairSaveErr);
              }

              // Set assertions on new Fair
              (fairSaveRes.body.name).should.equal(fair.name);
              should.exist(fairSaveRes.body.user);
              should.equal(fairSaveRes.body.user._id, orphanId);

              // force the Fair to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Fair
                    agent.get('/api/fairs/' + fairSaveRes.body._id)
                      .expect(200)
                      .end(function (fairInfoErr, fairInfoRes) {
                        // Handle Fair error
                        if (fairInfoErr) {
                          return done(fairInfoErr);
                        }

                        // Set assertions
                        (fairInfoRes.body._id).should.equal(fairSaveRes.body._id);
                        (fairInfoRes.body.name).should.equal(fair.name);
                        should.equal(fairInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Fair.remove().exec(done);
    });
  });
});
