const { delay } = require('../../lib/delay');
const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();


describe('For the route for getting many todos GET: (/todo)', () => {
    let app;
    let authorization = '';
    const ids = [];

    before(async() => {
        //initialize backend application
        app = await build();

        const payload = {
            username: 'testuser2',
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

        for(let i = 0; i<5; i++){
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

        await User.findOneAndDelete({ username: 'testuser2' });

        await mongoose.connection.close();
    });


    it('it should return { success: true, data: array of todos} and has a status code of 200 when called using GET and has a default limit of 3 items', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/todo',
            headers: {
                authorization
            },
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(3);

        for(const todo of data){ //checking if it really exists in the database 
            const { text, isDone, id } = todo;

            const { 
                text: textDatabase, 
                isDone: isDoneDatabase 
            } = await Todo
                .findOne({ id })
                .exec();

            text.should.equal(textDatabase);
            isDone.should.equal(isDoneDatabase);
        }
    });

    it('it should return { success: true, data: array of todos} and has a status code of 200 when called using GET and has a limit of 2 items', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/todo?limit=2',
            headers: {
                authorization
            },
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(2);

        for(const todo of data){ //checking if it really exists in the database 
            const { text, isDone, id } = todo;

            const { 
                text: textDatabase, 
                isDone: isDoneDatabase 
            } = await Todo
                .findOne({ id })
                .exec();

            text.should.equal(textDatabase);
            isDone.should.equal(isDoneDatabase);
        }
    });

    it('it should return { success: true, data: array of todos} and has a status code of 200 when called using GET and has a default limit of 3 items and it should be in descending order', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/todo',
            headers: {
                authorization
            },
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(3);

        for(let i = 0; i < data.length - 1; i++){
            const prevTodo = data[i];
            const nextTodo = data[i+1];

            (nextTodo.dateUpdated < prevTodo.dateUpdated).should.equal(true); //remember, next first then previous for descending order
        }
    });

    it('it should return { success: true, data: array of todos} and has a status code of 200 when called using GET and has a default limit of 3 items and it should be in descending order where the first item should be the latest updated item in the database', async () => { //this will break the system??
        const response = await app.inject({
            method: 'GET',
            url: '/todo',
            headers: {
                authorization
            },
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(3);

        for(let i = 0; i < data.length - 1; i++){
            const prevTodo = data[i];
            const nextTodo = data[i+1];

            (nextTodo.dateUpdated < prevTodo.dateUpdated).should.equal(true); //remember, next first then previous for descending order
        }

        const todos = await Todo
            .find({
                username: 'testuser2'
            })
            .limit(3)
            .sort({
                dateUpdated: -1 //sorted in descending order
            })
            .exec();
        
        const todo = todos[0];
        const responseTodo = data[0];

        todo.id.should.equal(responseTodo.id);
    });

    it('it should return { success: true, data: array of todos} and has a status code of 200 when called using GET and has a default limit of 3 items and it should be in descending order where the last item is updated on or after startDate', async () => { //this will break the system??
        const id = ids[parseInt(Math.random() * ids.length)];

        const { dateUpdated: startDate } = await Todo
            .findOne({ id })
            .exec();

        const response = await app.inject({
            method: 'GET',
            url: `todo?startDate=${startDate}`,
            headers: {
                authorization
            },
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
        (data.length <= 3).should.equal(true);

        for(let i = 0; i < data.length - 1; i++){
            const prevTodo = data[i];
            const nextTodo = data[i+1];

            (nextTodo.dateUpdated < prevTodo.dateUpdated).should.equal(true); //remember, next first then previous for descending order
        }

        //the last data should be equal to the picked id
        data[data.length - 1].id.should.equal(id);
    });

    //not mentioned in the video but is shown briefly in the working tree when committing
    it('it should return { success: true, data: array of todos} and has a status code of 200 when called using GET ', async () => { 
        const id = ids[parseInt(Math.random() * ids.length)];

        const { dateUpdated: endDate } = await Todo
            .findOne({ id })
            .exec();

        const response = await app.inject({
            method: 'GET',
            url: `todo?endDate=${endDate}`,
            headers: {
                authorization
            },
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
        (data.length <= 3).should.equal(true);

        for(let i = 0; i < data.length - 1; i++){
            const prevTodo = data[i];
            const nextTodo = data[i+1];

            (nextTodo.dateUpdated < prevTodo.dateUpdated).should.equal(true); //remember, next first then previous for descending order
        }

        //the last data should be equal to the picked id
        // data[data.length - 1].id.should.equal(id);
    });
});