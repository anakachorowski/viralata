'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adopter = mongoose.model('Adopter'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  adopter;

/**
 * Adopter routes tests
 */
describe('Adopter CRUD tests', function () {

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

    // Save a user to the test db and create new Adopter
    user.save(function () {
      adopter = {
        name: 'Adopter name'
      };

      done();
    });
  });

  it('should be able to save a Adopter if logged in', function (done) {
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

        // Save a new Adopter
        agent.post('/api/adopters')
          .send(adopter)
          .expect(200)
          .end(function (adopterSaveErr, adopterSaveRes) {
            // Handle Adopter save error
            if (adopterSaveErr) {
              return done(adopterSaveErr);
            }

            // Get a list of Adopters
            agent.get('/api/adopters')
              .end(function (adoptersGetErr, adoptersGetRes) {
                // Handle Adopters save error
                if (adoptersGetErr) {
                  return done(adoptersGetErr);
                }

                // Get Adopters list
                var adopters = adoptersGetRes.body;

                // Set assertions
                (adopters[0].user._id).should.equal(userId);
                (adopters[0].name).should.match('Adopter name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Adopter if not logged in', function (done) {
    agent.post('/api/adopters')
      .send(adopter)
      .expect(403)
      .end(function (adopterSaveErr, adopterSaveRes) {
        // Call the assertion callback
        done(adopterSaveErr);
      });
  });

  it('should not be able to save an Adopter if no name is provided', function (done) {
    // Invalidate name field
    adopter.name = '';

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

        // Save a new Adopter
        agent.post('/api/adopters')
          .send(adopter)
          .expect(400)
          .end(function (adopterSaveErr, adopterSaveRes) {
            // Set message assertion
            (adopterSaveRes.body.message).should.match('Please fill Adopter name');

            // Handle Adopter save error
            done(adopterSaveErr);
          });
      });
  });

  it('should be able to update an Adopter if signed in', function (done) {
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

        // Save a new Adopter
        agent.post('/api/adopters')
          .send(adopter)
          .expect(200)
          .end(function (adopterSaveErr, adopterSaveRes) {
            // Handle Adopter save error
            if (adopterSaveErr) {
              return done(adopterSaveErr);
            }

            // Update Adopter name
            adopter.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Adopter
            agent.put('/api/adopters/' + adopterSaveRes.body._id)
              .send(adopter)
              .expect(200)
              .end(function (adopterUpdateErr, adopterUpdateRes) {
                // Handle Adopter update error
                if (adopterUpdateErr) {
                  return done(adopterUpdateErr);
                }

                // Set assertions
                (adopterUpdateRes.body._id).should.equal(adopterSaveRes.body._id);
                (adopterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Adopters if not signed in', function (done) {
    // Create new Adopter model instance
    var adopterObj = new Adopter(adopter);

    // Save the adopter
    adopterObj.save(function () {
      // Request Adopters
      request(app).get('/api/adopters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Adopter if not signed in', function (done) {
    // Create new Adopter model instance
    var adopterObj = new Adopter(adopter);

    // Save the Adopter
    adopterObj.save(function () {
      request(app).get('/api/adopters/' + adopterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', adopter.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Adopter with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/adopters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Adopter is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Adopter which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Adopter
    request(app).get('/api/adopters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Adopter with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Adopter if signed in', function (done) {
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

        // Save a new Adopter
        agent.post('/api/adopters')
          .send(adopter)
          .expect(200)
          .end(function (adopterSaveErr, adopterSaveRes) {
            // Handle Adopter save error
            if (adopterSaveErr) {
              return done(adopterSaveErr);
            }

            // Delete an existing Adopter
            agent.delete('/api/adopters/' + adopterSaveRes.body._id)
              .send(adopter)
              .expect(200)
              .end(function (adopterDeleteErr, adopterDeleteRes) {
                // Handle adopter error error
                if (adopterDeleteErr) {
                  return done(adopterDeleteErr);
                }

                // Set assertions
                (adopterDeleteRes.body._id).should.equal(adopterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Adopter if not signed in', function (done) {
    // Set Adopter user
    adopter.user = user;

    // Create new Adopter model instance
    var adopterObj = new Adopter(adopter);

    // Save the Adopter
    adopterObj.save(function () {
      // Try deleting Adopter
      request(app).delete('/api/adopters/' + adopterObj._id)
        .expect(403)
        .end(function (adopterDeleteErr, adopterDeleteRes) {
          // Set message assertion
          (adopterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Adopter error error
          done(adopterDeleteErr);
        });

    });
  });

  it('should be able to get a single Adopter that has an orphaned user reference', function (done) {
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

          // Save a new Adopter
          agent.post('/api/adopters')
            .send(adopter)
            .expect(200)
            .end(function (adopterSaveErr, adopterSaveRes) {
              // Handle Adopter save error
              if (adopterSaveErr) {
                return done(adopterSaveErr);
              }

              // Set assertions on new Adopter
              (adopterSaveRes.body.name).should.equal(adopter.name);
              should.exist(adopterSaveRes.body.user);
              should.equal(adopterSaveRes.body.user._id, orphanId);

              // force the Adopter to have an orphaned user reference
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

                    // Get the Adopter
                    agent.get('/api/adopters/' + adopterSaveRes.body._id)
                      .expect(200)
                      .end(function (adopterInfoErr, adopterInfoRes) {
                        // Handle Adopter error
                        if (adopterInfoErr) {
                          return done(adopterInfoErr);
                        }

                        // Set assertions
                        (adopterInfoRes.body._id).should.equal(adopterSaveRes.body._id);
                        (adopterInfoRes.body.name).should.equal(adopter.name);
                        should.equal(adopterInfoRes.body.user, undefined);

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
      Adopter.remove().exec(done);
    });
  });
});
