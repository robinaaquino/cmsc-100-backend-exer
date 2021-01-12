/**
 * Task Module (DELETE delete one task)
 * can only be done by the owner of the task **finished
 * if taskId in parameter is not found in database, return bad request(404) **finished
 */

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
            },
            security: [
                {
                    bearer: []
                }
            ]
        },
        preHandler: app.auth([
            app.verifyJWT
        ]),
        /**
         * This deletes one todo from the database given a unique ID
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            const { params, user } = request; //use url to get info
            const { id } = params;
            const { username } = user;

            const data = await Todo.findOneAndDelete({ id }).exec(); //returns the deleted object

            if (!data){
                return response
                    .notFound('todo/not-found')
            } 

            if(data.username != username){
                return response
                    .unauthorized('todo/unauthorized')
            }

            return {
                success: true
            };
        }
    });
}; // dont forget semi-colon
