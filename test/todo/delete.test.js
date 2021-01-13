const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for deleting one todo DELETE: (/todo/:id)', () => {
    let app;
    let authorization;
    const ids = [];

    before(async () => {
        app = await build();

        const payload = {
            username: 'testuser1',
            password: 'passwordpassword',
            firstName: 'user',
            lastName: 'user',
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
        })

        const { data: token } = response.json();
        
        authorization = `Bearer ${token}`;

        for(let i = 0; i < 1; i++){
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
            const payload = response.json();
            const { id } = data;
            ids.push(id);
        }
        
    });

    after(async () => {
        for(const id of ids){
            await Todo.findOneAndDelete({ id, username: 'testuser1' });
        }

        await User.findOneAndDelete({ username: 'testuser1' });

        await mongoose.connection.close();
    });

    //happy path
    it('it should return { success: true } and has a status code of 200 when called using DELETE', async () => {
        const id = ids[0];

        const response = await app.inject({
            method: 'DELETE',
            url: `/todo/${ids[0]}`,
            headers: {
                authorization
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success } = payload;
        
        success.should.equal(true);
        statusCode.should.equal(200);

        const todo = await Todo
            .findOne({ id })
            .exec();

        should.not.exists(todo);
    })

    //non-happy path
    it('it should return { success: false, message: error message } and has a status code of 404 when called using DELETE and the id of the todo is non-existing', async() => {
        const response = await app.inject({
            method: 'DELETE',
            url: '/todo/non-existing-id',
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