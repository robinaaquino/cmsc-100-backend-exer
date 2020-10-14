//idea here is to get all the files
const { getTodos } = require('../../lib/get-todos'); //if getTodos is grey, means unused, if blue, does not exist
const { join } = require('path'); 
const { writeFileSync } = require('fs');
//always check the variables here if true or beforeEach gets automatically added

/**
 * Deletes one todo
 * 
 * @param {*} app 
 */
exports.deleteOne = app => { //arrow function which allows modification of global variables,
    /**
     * This deletes one todo from the database given a unique ID
     * 
     * @param {import('fastify').FastifyRequest} request
     * @param {import('fastify').FastifyReply<Response>} response
     */
    app.delete('/todo/:id', (request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
        const { params } = request; //use url to get info
        const { id } = params;
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

        todos.splice(index,1);
        const newDatabaseStringContents = JSON.stringify({ todos }, null, 2); 
        writeFileSync(filename, newDatabaseStringContents, encoding);

        return {
            success: true
        };
    }); 
}; // dont forget semi-colon
