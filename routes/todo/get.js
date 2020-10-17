const { Todo } = require('../../db');

/**
 * Gets one todod
 * 
 * @param {*} app 
 */
exports.get = app => { //arrow function which allows modification of global variables,
    /**
     * This gets one todo from the database given a unique ID
     * 
     * @param {import('fastify').FastifyRequest} request
     * @param {import('fastify').FastifyReply<Response>} response
     */
    app.get('/todo/:id', async(request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
        const { params } = request; //use url to get info
        const { id } = params;
    
        const data = await Todo.findOne({ id }).exec();

        if (!data){
            return response
                .code(404)
                .send({
                    success: false,
                    code: 'todo/not found',
                    message: 'Todo doesn\'t exist'
                });
        }

        return {
            success: true,
            data
        };
    }); 
}; // dont forget semi-colon
