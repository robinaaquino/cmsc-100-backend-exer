const { v4: uuid } = require('uuid');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');


/**
 * this is the route for creating todos
 * @param {*} app 
 */

exports.create = app => {
    app.post('/todo', {
        /**
         * handles the request for a given route
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            //creates a unique identifier
            const id = uuid();
            const { body } = request;

            //get text and done with default false from body, regardless if it has
            //a object value or null, which makes it return an empty object
            const { text, done = false } = body;

            const filename = join(__dirname, '../../database.json');
            const encoding = 'utf8';
            
            const databaseStringContents = readFileSync(filename, encoding);
            const database = JSON.parse(databaseStringContents);

            const data = {
                id,
                text,
                done,
                dateCreated: new Date().getTime(), //UNIX Epoch Time in ms
                dateUpdated: new Date().getTime()
            };

            database.todos.push(data);

            //we added null and 2 when stringifying the object so that
            //the JSON file looks visually understandable
            const newDatabaseStringContents = JSON.stringify(database, null, 2); 

            writeFileSync(filename, newDatabaseStringContents, encoding);

            return {
                sucess: true,
                data
            }
        }
    

    })
};

//10:50 at crud create part 1