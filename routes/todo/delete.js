const { Todo } = require('../../db');

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
    app.delete('/todo/:id', async (request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
        const { params } = request; //use url to get info
        const { id } = params;
        
        const data = await Todo.findOneAndDelete({ id }).exec(); //returns the deleted object

        if (!data){ //it's -1
            return response
                .code(404)
                .send({
                    success: false,
                    code: 'todo/not found',
                    message: 'Todo doesn\'t exist'
                });
        }

        return {
            success: true
        };
    }); 
}; // dont forget semi-colon
