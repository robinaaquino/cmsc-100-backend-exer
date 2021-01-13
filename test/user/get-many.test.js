const { delay } = require('../../lib/delay');
const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
require('should');
require('tap').mochaGlobals();

describe('For the route for getting many users GET: (/user)', () => {
  let app;
  let authorization = '';
  const usernames = [];

  before(async () => {
    // initialize the backend applicaiton
    app = await build();

    const payload = {
      username: 'testuser8',
      firstName: 'test',
      lastName: 'test',
      password: 'passwordpassword',
      isAdmin: true
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

    for (let i = 0; i < 12; i++) {
      const response = await app.inject({
        method: 'POST',
        url: '/user',
        headers: {
          authorization
        },
        payload: {
          username: `User ${i}`,
          firstName: 'test',
          lastName: 'test',
          password: 'passwordpassword'
        }
      });

      const data = await User.findOne().sort({ dateCreated: -1 }).limit(1).exec(); 
      const { username } = data;

      usernames.push(username);
      await delay(1000);
    }
  });

  after(async () => {
    // clean up the database
    for (const username of usernames) {
      await User.findOneAndDelete({ username });
    }

    await User.findOneAndDelete({ username: 'testuser8' });

    await mongoose.connection.close();
  });

  // happy path
  it('it should return { success: true, data: array of users } and has a status code of 200 when called using GET and has a default limit of 10 items', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/user',
      headers: {
        authorization
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success, data } = payload;

    console.log(payload);

    success.should.equal(true);
    statusCode.should.equal(200);
    data.length.should.equal(10);

    for (let i = 0; i < 1; i++) {
        const { username } = data[i];

        const user = await User
            .findOne({ username })
            .exec();

        username.should.equal(user.username);
    }
  });

  it('it should return { success: true, data: array of users } and has a status code of 200 when called using GET and has a limit of 5 items', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/user?limit=5',
      headers: {
        authorization
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success, data } = payload;

    console.log(payload);

    success.should.equal(true);
    statusCode.should.equal(200);
    data.length.should.equal(5);

    for (let i = 0; i < 1; i++) {
        const { username } = data[i];

        const user = await User
            .findOne({ username })
            .exec();

        username.should.equal(user.username);
    }
  });

  it('it should return { success: true, data: array of users } and has a status code of 200 when called using GET and has a default limit of 10 items and it should be in descending order', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/user',
      headers: {
        authorization
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success, data } = payload;

    success.should.equal(true);
    statusCode.should.equal(200);
    data.length.should.equal(10);

    for (let i = 0; i < data.length - 1; i++) {
      const prevUser = data[i];
      const nextUser = data[i + 1];

      (nextUser.dateUpdated > prevUser.dateUpdated).should.equal(true);
    }
  });

  it('it should return { success: true, data: array of users } and has a status code of 200 when called using GET and has a default limit of 10 items and it should be in descending order where the last item is updated on or after startDateUpdated', async () => {
    const username = usernames[0];

    const { dateUpdated: startDateUpdated } = await User
      .findOne({ username })
      .exec();

    const response = await app.inject({
      method: 'GET',
      url: `/todo?startDateUpdated=${startDateUpdated}`,
      headers: {
        authorization
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success, data } = payload;

    success.should.equal(true);
    statusCode.should.equal(200);
    (data.length <= 10).should.equal(true);

    for (let i = 0; i < data.length - 1; i++) {
      const prevUser = data[i];
      const nextUser = data[i + 1];

      (nextUser.dateUpdated < prevUser.dateUpdated).should.equal(true);
    }

    // the last data should be equal to the picked id
    data[data.length - 1].username.should.equal(username);
  });

  it('it should return { success: true, data: array of users } and has a status code of 200 when called using GET and has a default limit of 10 items and it should be in descending order where the last item is updated on or before endDateUpdated', async () => {
    const username = usernames[0];
    
    const { dateUpdated: endDateUpdated } = await User
      .findOne({ username })
      .exec();

    const response = await app.inject({
      method: 'GET',
      url: `/todo?endDateUpdated=${endDateUpdated}`,
      headers: {
        authorization
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success, data } = payload;

    success.should.equal(true);
    statusCode.should.equal(200);
    (data.length <= 10).should.equal(true);

    for (let i = 0; i < data.length - 1; i++) {
      const prevUser = data[i];
      const nextUser = data[i + 1];

      (nextUser.dateUpdated < prevUser.dateUpdated).should.equal(true);
    }

    // the last data should be equal to the picked id
    data[0].username.should.equal(username);
  });
});