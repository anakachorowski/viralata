'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Animal = mongoose.model('Animal'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  animal;

/**
 * Animal routes tests
 */
describe('Animal CRUD tests', function () {

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

    // Save a user to the test db and create new Animal
    user.save(function () {
      animal = {
        name: 'Animal name'
      };

      done();
    });
  });

  it('should be able to save a Animal if logged in', function (done) {
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

        // Save a new Animal
        agent.post('/api/animals')
          .send(animal)
          .expect(200)
          .end(function (animalSaveErr, animalSaveRes) {
            // Handle Animal save error
            if (animalSaveErr) {
              return done(animalSaveErr);
            }

            // Get a list of Animals
            agent.get('/api/animals')
              .end(function (animalsGetErr, animalsGetRes) {
                // Handle Animals save error
                if (animalsGetErr) {
                  return done(animalsGetErr);
                }

                // Get Animals list
                var animals = animalsGetRes.body;

                // Set assertions
                (animals[0].user._id).should.equal(userId);
                (animals[0].name).should.match('Animal name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Animal if not logged in', function (done) {
    agent.post('/api/animals')
      .send(animal)
      .expect(403)
      .end(function (animalSaveErr, animalSaveRes) {
        // Call the assertion callback
        done(animalSaveErr);
      });
  });

  it('should not be able to save an Animal if no name is provided', function (done) {
    // Invalidate name field
    animal.name = '';

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

        // Save a new Animal
        agent.post('/api/animals')
          .send(animal)
          .expect(400)
          .end(function (animalSaveErr, animalSaveRes) {
            // Set message assertion
            (animalSaveRes.body.message).should.match('Please fill Animal name');

            // Handle Animal save error
            done(animalSaveErr);
          });
      });
  });

  it('should be able to update an Animal if signed in', function (done) {
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

        // Save a new Animal
        agent.post('/api/animals')
          .send(animal)
          .expect(200)
          .end(function (animalSaveErr, animalSaveRes) {
            // Handle Animal save error
            if (animalSaveErr) {
              return done(animalSaveErr);
            }

            // Update Animal name
            animal.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Animal
            agent.put('/api/animals/' + animalSaveRes.body._id)
              .send(animal)
              .expect(200)
              .end(function (animalUpdateErr, animalUpdateRes) {
                // Handle Animal update error
                if (animalUpdateErr) {
                  return done(animalUpdateErr);
                }

                // Set assertions
                (animalUpdateRes.body._id).should.equal(animalSaveRes.body._id);
                (animalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Animals if not signed in', function (done) {
    // Create new Animal model instance
    var animalObj = new Animal(animal);

    // Save the animal
    animalObj.save(function () {
      // Request Animals
      request(app).get('/api/animals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Animal if not signed in', function (done) {
    // Create new Animal model instance
    var animalObj = new Animal(animal);

    // Save the Animal
    animalObj.save(function () {
      request(app).get('/api/animals/' + animalObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', animal.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Animal with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/animals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Animal is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Animal which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Animal
    request(app).get('/api/animals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Animal with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Animal if signed in', function (done) {
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

        // Save a new Animal
        agent.post('/api/animals')
          .send(animal)
          .expect(200)
          .end(function (animalSaveErr, animalSaveRes) {
            // Handle Animal save error
            if (animalSaveErr) {
              return done(animalSaveErr);
            }

            // Delete an existing Animal
            agent.delete('/api/animals/' + animalSaveRes.body._id)
              .send(animal)
              .expect(200)
              .end(function (animalDeleteErr, animalDeleteRes) {
                // Handle animal error error
                if (animalDeleteErr) {
                  return done(animalDeleteErr);
                }

                // Set assertions
                (animalDeleteRes.body._id).should.equal(animalSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Animal if not signed in', function (done) {
    // Set Animal user
    animal.user = user;

    // Create new Animal model instance
    var animalObj = new Animal(animal);

    // Save the Animal
    animalObj.save(function () {
      // Try deleting Animal
      request(app).delete('/api/animals/' + animalObj._id)
        .expect(403)
        .end(function (animalDeleteErr, animalDeleteRes) {
          // Set message assertion
          (animalDeleteRes.body.message).should.match('User is not authorized');

          // Handle Animal error error
          done(animalDeleteErr);
        });

    });
  });

  it('should be able to get a single Animal that has an orphaned user reference', function (done) {
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

          // Save a new Animal
          agent.post('/api/animals')
            .send(animal)
            .expect(200)
            .end(function (animalSaveErr, animalSaveRes) {
              // Handle Animal save error
              if (animalSaveErr) {
                return done(animalSaveErr);
              }

              // Set assertions on new Animal
              (animalSaveRes.body.name).should.equal(animal.name);
              should.exist(animalSaveRes.body.user);
              should.equal(animalSaveRes.body.user._id, orphanId);

              // force the Animal to have an orphaned user reference
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

                    // Get the Animal
                    agent.get('/api/animals/' + animalSaveRes.body._id)
                      .expect(200)
                      .end(function (animalInfoErr, animalInfoRes) {
                        // Handle Animal error
                        if (animalInfoErr) {
                          return done(animalInfoErr);
                        }

                        // Set assertions
                        (animalInfoRes.body._id).should.equal(animalSaveRes.body._id);
                        (animalInfoRes.body.name).should.equal(animal.name);
                        should.equal(animalInfoRes.body.user, undefined);

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
      Animal.remove().exec(done);
    });
  });
});
