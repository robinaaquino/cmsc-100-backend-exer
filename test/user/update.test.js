const { delay } = require('../../lib/delay');
const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for updating one user PUT: (/todo/:user)', () => {
  let app;
  let authorization = '';
  const usernames = [];

  before(async () => {
    // initialize the backend applicaiton
    app = await build();

    const payload = {
      username: 'testuser5',
      firstName: 'test',
      lastName: 'test',
      password: 'passwordpassword'
    }

    await app.inject({
      method: 'POST',
      url: '/user',
      payload
    });

    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload
    });
    const { data: token } = response.json();

    authorization = `Bearer ${token}`;

    const user = await User.findOne().sort({ dateCreated: -1 }).limit(1).exec();
    usernames.push(user.username);

  });

  after(async () => {
    // clean up the database
    for (const username of usernames) {
      await User.findOneAndDelete({ username });
    }

    await mongoose.connection.close();
  });

  // happy path
  it('it should return { ownerUser: user } and has a status code of 200 when called using PUT and updates the item', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/user/${usernames[0]}`,
      headers: {
        authorization
      },
      payload: {
        password: 'passwordpassword',
        firstName: 'firstname',
        lastName: 'lastname'
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { ownerUser } = payload;
    const { username, firstName, lastName } = ownerUser;

    statusCode.should.equal(200);

    const user = await User
      .findOne({ username })
      .exec();

    username.should.equal(user.username);
    firstName.should.equal(user.firstName);
    lastName.should.equal(user.lastName);
  });

  it('it should return { ownerUser: data } and has a status code of 200 when called using PUT and updates the firstName item only', async () => {

    const response = await app.inject({
      method: 'PUT',
      url: `/user/${usernames[0]}`,
      headers: {
        authorization
      },
      payload: {
        firstName: 'New first name'
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { ownerUser } = payload
    const { username, firstName, lastName } = ownerUser;
    
    statusCode.should.equal(200);

    const user = await User
      .findOne({ username })
      .exec();

    username.should.equal(user.username);
    firstName.should.equal(user.firstName);
    lastName.should.equal(user.lastName);
  });

  it('it should return { ownerUser: data } and has a status code of 200 when called using PUT and updates the lastName item only', async () => {

    const response = await app.inject({
      method: 'PUT',
      url: `/user/${usernames[0]}`,
      headers: {
        authorization
      },
      payload: {
        lastName: 'New last name'
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { ownerUser } = payload
    const { username, firstName, lastName } = ownerUser;
    
    statusCode.should.equal(200);

    const user = await User
      .findOne({ username })
      .exec();

    username.should.equal(user.username);
    firstName.should.equal(user.firstName);
    lastName.should.equal(user.lastName);
  });

  it('it should return { ownerUser: data } and has a status code of 200 when called using PUT and updates the password item only', async () => {

    const response = await app.inject({
      method: 'PUT',
      url: `/user/${usernames[0]}`,
      headers: {
        authorization
      },
      payload: {
        password: 'newpasswordpassword'
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { ownerUser } = payload
    const { username, firstName, lastName } = ownerUser;
    
    statusCode.should.equal(200);

    const user = await User
      .findOne({ username })
      .exec();

    username.should.equal(user.username);
    firstName.should.equal(user.firstName);
    lastName.should.equal(user.lastName);
  });

  it('it should return { message: error message } and has a status code of 404 when called using PUT and the username of the user is non-existing', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/user/non-existing-username`,
      headers: {
        authorization
      },
      payload: {
        firstName: "firstName",
        lastName: "lastName"
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { code, message } = payload;

    statusCode.should.equal(404);

    should.exists(code);
    should.exists(message);
  });

  it('it should return { message: error message } and has a status code of 400 when called using PUT and we didn\'t put a payload', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/user/${usernames[0]}`,
      headers: {
        authorization
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { code, message } = payload;

    statusCode.should.equal(400);

    should.exists(code);
    should.exists(message);
  });

  it('it should return { message: error message } and has a status code of 400 when called using PUT and we put a payload without text or isDone', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/user/${usernames[0]}`,
      headers: {
        authorization
      },
      payload: {}
    });

    const payload = response.json();
    const { statusCode } = response;
    const { code, message } = payload;

    statusCode.should.equal(400);

    should.exists(code);
    should.exists(message);
  });
});
