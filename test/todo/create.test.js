const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for creating a todo POST: (/todo)', () => {
    let app;
    let authorization = '';
    const ids = [];

    before(async () => {
        app = await build();
        const payload = {
            username: 'testuser',
            firstName: 'user',
            lastName: 'user',
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

        authorization = `Bearer ${ token }`;


    });

    after(async () => {
        for (const id of ids){
            await Todo.findOneAndDelete({ id });
        }

        await User.findOneAndDelete({ username: 'testuser' });

        await mongoose.connection.close();
    });

    //happy path
    it('it should return { success: true } and has a status code of 200 when called using POST', async() => {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            headers: {
                authorization
            },
            payload: {
                text: 'This is a todo',
                isDone: false
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);

        const data = await Todo.findOne().sort({ dateCreated: -1 }).limit(1).exec(); //finding the most recent addition to the document

        const { id } = data;

        ids.push(id);
    });

    //non-happy path
    it('it should return { success: true } and has a status code of 200 when called using POST even if we don\'t provide the done property. Default of done should still be false', async() => {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            headers: {
                authorization
            },
            payload: {
                text: 'This is a todo 2'
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success } = payload;
        
        success.should.equal(true);
        statusCode.should.equal(200);

        const newData = await Todo.findOne().sort({ dateCreated: -1 }).limit(1).exec(); //finding the most recent addition to the document

        const { id } = newData

        ids.push(id);
    })
});