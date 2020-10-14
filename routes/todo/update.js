//idea here is to get all the files
const { getTodos } = require('../../lib/get-todos'); //if getTodos is grey, means unused, if blue, does not exist
const { join } = require('path'); 
const { writeFileSync } = require('fs');
//always check the variables here if true or beforeEach gets automatically added

/**
 * Updates one todo
 * 
 * @param {*} app 
 */
exports.update = app => { //arrow function which allows modification of global variables,
    /**
     * This updates one todo from the database given a unique ID and a payload
     * 
     * @param {import('fastify').FastifyRequest} request
     * @param {import('fastify').FastifyReply<Response>} response
     */
    app.put('/todo/:id', (request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
        const { params, body } = request; //use url to get info
        const { id } = params;
        //get text and done from body
        //ensure that when using Postman to check this that it's set to json not text
        const { text, done } = body || {};
        const encoding = 'utf8';
        const filename = join(__dirname, '../../database.json'); //__dirname gets current directory, you can't just combine strings and expect it to be a path here so as such, make sure it's double underline
        const todos = getTodos(filename, encoding); //which is basically getting the function from ../../lib/get-todos, to read the database

        const index = todos.findIndex(todo => todo.id === id);

        if (index < 0){ //it's -1
            return response
                .code(404)
                .send({
                    success: false,
                    code: 'todo/not found',
                    message: 'Todo doesn\'t exist'
                });
        } 

        //expect that we should be getting at least a test or a done property
        if (!text && (done === null || done === undefined)){ 
            return response
                .code(400)
                .send({
                    success: false,
                    code: 'todo/malformed',
                    message: 'Payload doesn\'t have text property'
                });
        } 

        const data = todos[index];

        if(text){
            data.text = text;
        }

        if(done){
            data.done = done;
        }

        todos[index] = data;

        const newDatabaseStringContents = JSON.stringify({ todos }, null, 2); 
        writeFileSync(filename, newDatabaseStringContents, encoding);

        return {
            success: true,
            data
        };
    }); 
}; // dont forget semi-colon
