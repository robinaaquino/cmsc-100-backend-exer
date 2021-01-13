const { delay } = require('../../lib/delay');
const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for updating one todo PUT: (/todo/:id)', () => {
  let app;
  let authorization = '';
  const ids = [];

  before(async () => {
    // initialize the backend applicaiton
    app = await build();

    const payload = {
      username: 'testuser4',
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

    for (let i = 0; i < 4; i++) {
      const response = await app.inject({
        method: 'POST',
        url: '/todo',
        headers: {
          authorization
        },
        payload: {
          text: `Todo ${i}`,
          isDone: false
        }
      });

      const data = await Todo.findOne().sort({ dateCreated: -1 }).limit(1).exec();
      const { id } = data;

      ids.push(id);
      await delay(1000);
    }
  });

  after(async () => {
    // clean up the database
    for (const id of ids) {
      await Todo.findOneAndDelete({ id });
    }

    await User.findOneAndDelete({ username: 'testuser4' });

    await mongoose.connection.close();
  });

  // happy path
  it('it should return { success: true, data: todo } and has a status code of 200 when called using PUT and updates the item', async () => {
    const idFilter = ids[0];

    const response = await app.inject({
      method: 'PUT',
      url: `/todo/${ids[0]}`,
      headers: {
        authorization
      },
      payload: {
        text: 'New Todo',
        isDone: true
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success } = payload;

    const data = await Todo.findOne({ id: idFilter }).exec();
    const { text, id, isDone } = data;

    console.log(data);
    console.log(payload);

    success.should.equal(true);
    statusCode.should.equal(200);

    const todo = await Todo
      .findOne({ id })
      .exec();

    text.should.equal(todo.text);
    isDone.should.equal(todo.isDone);
    id.should.equal(todo.id);
  });

  it('it should return { success: true, data: todo } and has a status code of 200 when called using PUT and updates the text item only', async () => {
    const idFilter = ids[1];

    const response = await app.inject({
      method: 'PUT',
      url: `/todo/${ids[1]}`,
      headers: {
        authorization
      },
      payload: {
        text: 'New Todo 1'
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success } = payload;

    const data = await Todo.findOne({ id: idFilter }).exec();
    const { text, id, isDone } = data;

    console.log(data);
    console.log(payload);

    success.should.equal(true);
    statusCode.should.equal(200);

    const todo = await Todo
      .findOne({ id })
      .exec();

    text.should.equal('New Todo 1');
    isDone.should.equal(false);

    text.should.equal(todo.text);
    isDone.should.equal(todo.isDone);
    id.should.equal(todo.id);
  });

  it('it should return { success: true, data: todo } and has a status code of 200 when called using PUT and updates the isDone item only', async () => {
    const idFilter = ids[2];

    const response = await app.inject({
      method: 'PUT',
      url: `/todo/${ids[2]}`,
      headers: {
        authorization
      },
      payload: {
        isDone: true
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success } = payload;

    const data = await Todo.findOne({ id: idFilter });
    const { text, id, isDone } = data;

    console.log(data);
    console.log(payload);

    success.should.equal(true);
    statusCode.should.equal(200);

    const todo = await Todo
      .findOne({ id })
      .exec();

      isDone.should.equal(true);

    text.should.equal(todo.text);
    isDone.should.equal(todo.isDone);
    id.should.equal(todo.id);
  });

  it('it should return { success: false, message: error message } and has a status code of 404 when called using PUT and the id of the todo is non-existing', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/todo/non-existing-id`,
      headers: {
        authorization
      },
      payload: {
        text: 'New Todo',
        isDone: true
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success, code, message } = payload;

    success.should.equal(false);
    statusCode.should.equal(404);

    should.exists(code);
    should.exists(message);
  });

  it('it should return { success: false, message: error message } and has a status code of 400 when called using PUT and we didn\'t put a payload', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/todo/${ids[3]}`,
      headers: {
        authorization
      }
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success, code, message } = payload;

    success.should.equal(false);
    statusCode.should.equal(400);

    should.exists(code);
    should.exists(message);
  });

  it('it should return { success: false, message: error message } and has a status code of 400 when called using PUT and we put a payload without text or isDone', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/todo/${ids[3]}`,
      headers: {
        authorization
      },
      payload: {}
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success, code, message } = payload;

    success.should.equal(false);
    statusCode.should.equal(400);

    should.exists(code);
    should.exists(message);
  });
});
