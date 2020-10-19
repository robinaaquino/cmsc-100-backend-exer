const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoParams, GetOneTodoResponse } = definitions

/**
 * Gets one todod
 * 
 * @param {*} app 
 */
exports.get = app => { //arrow function which allows modification of global variables,
    
    app.get('/todo/:id', {
        schema: {
            description: 'Get one todo',
            tags: ['Todo'],
            summary: 'Get one todo',
            params: GetOneTodoParams,
            response: {
                200: GetOneTodoResponse
            }
        },

        /**
         * This gets one todo from the database given a unique ID
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async(request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
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
        }
    }); 
}; // dont forget semi-colon
