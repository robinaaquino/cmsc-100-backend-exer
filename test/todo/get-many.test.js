const { delay } = require('../../lib/delay');
const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
require('should');
require('tap').mochaGlobals();

describe('For the route for getting many todos GET: (/todo)', () => {
  let app;
  let authorization = '';
  const ids = [];

  before(async () => {
    // initialize the backend applicaiton
    app = await build();

    const payload = {
      username: 'testuser2',
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

    for (let i = 0; i < 12; i++) {
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

    await User.findOneAndDelete({ username: 'testuser2' });

    await mongoose.connection.close();
  });

  // happy path
  it('it should return { success: true, data: array of todos } and has a status code of 200 when called using GET and has a default limit of 10 items', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/todo',
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
        const { text, isDone } = data[i];
        const { id } = ids[i]

    //   console.log(todo);
    //   console.log(text);
    //   console.log(data[i]);
    //   console.log(ids[i]);

        const todo = await Todo
            .findOne({ id })
            .exec();

        text.should.equal(todo.text);
        isDone.should.equal(todo.isDone);
    }
  });

//   it('it should return { success: true, data: array of todos } and has a status code of 200 when called using GET and has a limit of 5 items', async () => {
//     const response = await app.inject({
//       method: 'GET',
//       url: '/todo?limit=5',
//       headers: {
//         authorization
//       }
//     });

//     const payload = response.json();
//     const { statusCode } = response;
//     const { success, data } = payload;

//     success.should.equal(true);
//     statusCode.should.equal(200);
//     data.length.should.equal(5);

//     for (const todo of data) {
//       const { text, isDone, id } = todo;

//       const {
//         text: textDatabase,
//         isDone: isDoneDatabase
//       } = await Todo
//         .findOne({ id })
//         .exec();

//       text.should.equal(textDatabase);
//       isDone.should.equal(isDoneDatabase);
//     }
//   });

//   it('it should return { success: true, data: array of todos } and has a status code of 200 when called using GET and has a default limit of 10 items and it should be in descending order', async () => {
//     const response = await app.inject({
//       method: 'GET',
//       url: '/todo',
//       headers: {
//         authorization
//       }
//     });

//     const payload = response.json();
//     const { statusCode } = response;
//     const { success, data } = payload;

//     success.should.equal(true);
//     statusCode.should.equal(200);
//     data.length.should.equal(10);

//     console.log(data);

//     for (let i = 0; i < data.length - 1; i++) {
//       const prevTodo = data[i];
//       const nextTodo = data[i + 1];

//       (nextTodo.dateUpdated < prevTodo.dateUpdated).should.equal(true);
//     }
//   });

//   it('it should return { success: true, data: array of todos } and has a status code of 200 when called using GET and has a default limit of 10 items and it should be in descending order where the first item should be the latest updated item in the database', async () => {
//     const response = await app.inject({
//       method: 'GET',
//       url: '/todo',
//       headers: {
//         authorization
//       }
//     });

//     const payload = response.json();
//     const { statusCode } = response;
//     const { success, data } = payload;

//     success.should.equal(true);
//     statusCode.should.equal(200);
//     data.length.should.equal(10);

//     for (let i = 0; i < data.length - 1; i++) {
//       const prevTodo = data[i];
//       const nextTodo = data[i + 1];

//       (nextTodo.dateUpdated < prevTodo.dateUpdated).should.equal(true);
//     }

//     const todos = await Todo
//       .find({
//         username: 'testuser2'
//       })
//       .limit(10)
//       .sort({
//         dateUpdated: -1
//       })
//       .exec();

//     const todo = todos[0];
//     const responseTodo = data[0];

//     todo.id.should.equal(responseTodo.id);
//   });

//   it('it should return { success: true, data: array of todos } and has a status code of 200 when called using GET and has a default limit of 10 items and it should be in descending order where the last item is updated on or after startDateUpdated', async () => {
//     const id = ids[parseInt(Math.random() * ids.length)];

//     const { dateUpdated: startDateUpdated } = await Todo
//       .findOne({ id })
//       .exec();

//     const response = await app.inject({
//       method: 'GET',
//       url: `/todo?startDateUpdated=${startDateUpdated}`,
//       headers: {
//         authorization
//       }
//     });

//     const payload = response.json();
//     const { statusCode } = response;
//     const { success, data } = payload;

//     success.should.equal(true);
//     statusCode.should.equal(200);
//     (data.length <= 10).should.equal(true);

//     for (let i = 0; i < data.length - 1; i++) {
//       const prevTodo = data[i];
//       const nextTodo = data[i + 1];

//       (nextTodo.dateUpdated < prevTodo.dateUpdated).should.equal(true);
//     }

//     // the last data should be equal to the picked id
//     data[data.length - 1].id.should.equal(id);
//   });

//   it('it should return { success: true, data: array of todos } and has a status code of 200 when called using GET and has a default limit of 10 items and it should be in descending order where the last item is updated on or before endDateUpdated', async () => {
//     const id = ids[parseInt(Math.random() * ids.length)];

//     const { dateUpdated: endDateUpdated } = await Todo
//       .findOne({ id })
//       .exec();

//     const response = await app.inject({
//       method: 'GET',
//       url: `/todo?endDateUpdated=${endDateUpdated}`,
//       headers: {
//         authorization
//       }
//     });

//     const payload = response.json();
//     const { statusCode } = response;
//     const { success, data } = payload;

//     success.should.equal(true);
//     statusCode.should.equal(200);
//     (data.length <= 10).should.equal(true);

//     for (let i = 0; i < data.length - 1; i++) {
//       const prevTodo = data[i];
//       const nextTodo = data[i + 1];

//       (nextTodo.dateUpdated < prevTodo.dateUpdated).should.equal(true);
//     }

//     // the last data should be equal to the picked id
//     data[0].id.should.equal(id);
//   });
});