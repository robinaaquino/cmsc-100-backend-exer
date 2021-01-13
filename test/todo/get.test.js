const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for getting one todo GET: (/todo/:id)', () => {
    let app;
    let authorization = '';
    const ids = [];

    before(async () => {
        app = await build();

        const payload = {
            username: 'testuser3',
            firstName: 'test',
            lastName: 'test',
            password: 'passwordpassword'
        }

        await app.inject({
            method: 'POST',
            url: '/user',
            payload
        })

        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload
        });

        const { data: token } = response.json();

        authorization = `Bearer ${token}`;

        for(let i = 0; i < 1; i ++){
            const response = await app.inject ({
                method: 'POST',
                url: '/todo',
                headers: {
                    authorization
                },
                payload: {
                    text: `Todo ${i}`,
                    isDone: false
                }
            })

            const data = await Todo.findOne().sort({ dateCreated: -1 }).limit(1).exec(); 
            const { id } = data;

            ids.push(id);
        }
    });

    after(async () =>{
        for(const id of ids) {
            await Todo.findOneAndDelete({ id });
        }

        await User.findOneAndDelete({ username: 'testuser3' });

        await mongoose.connection.close();
    })

    it('it should return { success: true, data: todo } and has a status code of 200 when called using GET', async () => {
        const idFilter = ids[0];

        const response = await app.inject({
            method: 'GET',
            url: `/todo/${ids[0]}`,
            headers: {
                authorization
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;
        const { username, text, isDone } = data;

        const todo = await Todo.findOne({ id: idFilter }).exec();

        statusCode.should.equal(200);
        success.should.equal(true);
        username.should.equal(todo.username);
        text.should.equal(todo.text);
        isDone.should.equal(todo.isDone);

    });

    it('it should return { succes: false, message: error message } and has a status code of 404 when called using GET and the id of the todo is non-existing', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/todo/non-existing-id`,
            headers: {
                authorization
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, code, message } = payload;

        success.should.equal(false);
        statusCode.should.equal(404);

        should.exists(code);
        should.exists(message);
    })
})