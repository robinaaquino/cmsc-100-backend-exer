const { readFileSync } = require('fs');
const { join } = require('path');
const { build } = require('../../app');
require('tap').mochaGlobals();
require('should');

describe('For the route for creating a todo POST: (/todo)', () => {
    let app;


    before(async() => {
        //initialize backend application
        app = await build();
    })

    it('it should return { sucess: true, data: (new todo object)} and has a status code of 200 when called using POST', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            payload: {
                text: 'This is a todo',
                done: false
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;
        const { text, done, id } = data;

        success.should.equal(true);
        statusCode.should.equal(200);
        text.should.equal('This is a todo');
        done.should.equal(false);

        const filename = join(__dirname, '../../database.json');
        const encoding = 'utf8';
        const databaseString = readFileSync(filename, encoding );
        const database = JSON.parse(daabaseString);

        const{ todos } = database;
        const index = todos.findIndex(todo => todo.id === id);
        index.should.not.equal(-1);
        const { text: textDatabase, done: doneDatabase } = todos[index];
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);

    })
});