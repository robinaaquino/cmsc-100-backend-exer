const { mongoose, Todo, User } = require('../../db');
const { delay } = require('../../lib/delay');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();


describe('For the route for getting one todo GET: (/todo/:id)', () => {
    let app;
    let authorization = '';
    const ids = [];

    before(async() => {
        //initialize backend application
        app = await build();

        const payload = {
            username: 'testuser3',
            password: 'password1234567890'
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

        for(let i = 0; i<1; i++){
            const response = await app.inject({
                method: 'POST',
                url: '/todo',
                headers: {
                    authorization
                },
                payload: {
                    text: `Todo ${i}`, //usage of backticks for addresses
                    isDone: false
                }
            });


            const payload = response.json();

            console.log(payload);
            const { data } = payload;
            const { id } = data; //we need ids

            ids.push(id); //allows the deletion later on
            await delay(1000);
        }

        //best case is to use a control data set


        
    })

    after(async () => {
        //clean up the database
        for (const id of ids){
            await Todo.findOneAndDelete({ id });
        }

        await User.findOneAndDelete({ username: 'testuser3' });

        await mongoose.connection.close();
    });


    it('it should return { success: true, data: todo} and has a status code of 200 when called using GET', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/todo/${ids[0]}`,
            headers: {
                authorization
            },
        });

        const payload = response.json();

        console.log(payload);
        console.log(response.statusCode);

        const { statusCode } = response;
        const { success, data } = payload;
        const { text,id,isDone } = data;

        success.should.equal(true);
        statusCode.should.equal(200);

        const todo = await Todo
            .findOne({ id })
            .exec();

        text.should.equal(todo.text);
        isDone.should.equal(todo.isDone);
        id.should.equal(todo.id);
    });

    it('it should return { success: false, message: error message} and has a status code of 404 when called using GET and the id of the todo is non-existing', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/todo/non-existing-id`,
            headers: {
                authorization
            },
        });

        const payload = response.json();

        console.log(payload);
        console.log(response.statusCode);

        const { statusCode } = response;
        const { success, code, message } = payload;

        success.should.equal(false);
        statusCode.should.equal(404);

        should.exists(code);
        should.exists(message);

    });
});