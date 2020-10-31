const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoParams, SuccessResponse } = definitions

/**
 * Deletes one todo
 * 
 * @param {*} app 
 */
exports.deleteOne = app => { //arrow function which allows modification of global variables,
    
    app.delete('/todo/:id', {
        schema: {
            description: 'Delete one todo',
            tags: ['Todo'],
            summary: 'Delete one todo',
            params: GetOneTodoParams,
            response: {
                200: SuccessResponse
            }
        },
        /**
         * This deletes one todo from the database given a unique ID
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            const { params } = request; //use url to get info
            const { id } = params;
            
            const data = await Todo.findOneAndDelete({ id }).exec(); //returns the deleted object

            if (!data){
                return response
                    .notFound('todo/not-found')
            } 

            return {
                success: true
            };
        }
    });
}; // dont forget semi-colon
