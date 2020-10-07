const { getTodos } = require('../../lib/get-todos');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();


describe('For the route for creating a todo POST: (/todo)', () => {
    let app;
    const ids = [];
    const filename = join(__dirname, '../../database.json');
    const encoding = 'utf8';


    before(async() => {
        //initialize backend application
        app = await build();
    })

    after(async () => {
        //clean up the database
        const todos = getTodos(filename, encoding);
        for (const id of ids){
            //find the index
            const index = todos.findIndex(todo => todo.id === id);

            //delete the id
            if (index >= 0){
                todos.splice(index, 1);
            }

            writeFileSync(filename, JSON.stringify({ todos }, null, 2), encoding);
        }
        
    });

    //happy path
    it('it should return { success: true, data: (new todo object)} and has a status code of 200 when called using POST', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            payload: {
                text: 'This is a todo',
                done: false
            }
        });

        const payload = response.json();

        console.log(payload);
        console.log(response.statusCode);

        const { statusCode } = response;
        const { success, data } = payload;
        const { text, done, id } = data;

        success.should.equal(true);
        statusCode.should.equal(200);
        text.should.equal('This is a todo');
        done.should.equal(false);

        const todos = getTodos(filename, encoding);

        const index = todos.findIndex(todo => todo.id === id);
        index.should.not.equal(-1);
        const { text: textDatabase, done: doneDatabase } = todos[index];
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);

        //add the id in the ids array for cleaning
        ids.push(id);

    });

    //another happy path but a different way of sending data
    it ('should return {success: true, data: (new todo object)} and has a status code of 200 when called using POST even if we don\'t provide the done property. Default of done should still be false', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            payload: {
                text: 'This is a todo 2'
            }
        });
        
        const payload = response.json();

        console.log(payload);
        console.log(response.statusCode);

        const { statusCode } = response;
        const { success, data } = payload;
        const { text, done, id } = data;

        success.should.equal(true);
        statusCode.should.equal(200);
        text.should.equal('This is a todo 2');
        done.should.equal(false);

        const todos = getTodos(filename, encoding);

        const index = todos.findIndex(todo => todo.id === id);
        index.should.not.equal(-1);
        const { text: textDatabase, done: doneDatabase } = todos[index];
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);

        //add the id in the ids array for cleaning
        ids.push(id);
    });

    //non-happy path
    it ('should return {success: false, message: error message)} and has a status code of 400 when called using POST and there is no text', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            payload: {
                done: true
            }
        });

        const payload = response.json();

        console.log(payload);
        console.log(response.statusCode);

        const { statusCode } = response;
        const { success, message } = payload;

        statusCode.should.equal(400);
        success.should.equal(false);
        should.exist(message);
    })

    //another happy path but a different way of sending data
    it ('should return {success: true, data: (new todo object)} and has a status code of 200 when called using POST even if we don\'t provide the done property. Default of done should still be false', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            payload: {
                text: 'This is a todo 2'
            }
        });
        
        const payload = response.json();

        console.log(payload);
        console.log(response.statusCode);

        const { statusCode } = response;
        const { success, data } = payload;
        const { text, done, id } = data;

        success.should.equal(true);
        statusCode.should.equal(200);
        text.should.equal('This is a todo 2');
        done.should.equal(false);

        const todos = getTodos(filename, encoding);

        const index = todos.findIndex(todo => todo.id === id);
        index.should.not.equal(-1);
        const { text: textDatabase, done: doneDatabase } = todos[index];
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);

        //add the id in the ids array for cleaning
        ids.push(id);
    });

    //another non-happy path
    it ('should return {success: false, message: error message)} and has a status code of 400 when called using POST and there is no payload', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/todo'
        });

        const payload = response.json();

        console.log(payload);
        console.log(response.statusCode);

        const { statusCode } = response;
        const { success, message } = payload;

        statusCode.should.equal(400);
        success.should.equal(false);
        should.exist(message);
    })
});