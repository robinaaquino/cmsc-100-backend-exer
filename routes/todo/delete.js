/** Exercise Specifications
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
exports.deleteOne = app => {
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
        handler: async (request, response) => { 
            const { params, user } = request; 
            const { id } = params;
            const { username } = user;

            const data = await Todo.findOneAndDelete({ id }).exec(); //returns the deleted object

            if (!data){ //if no data
                return response
                    .notFound('todo/not-found')
            } 

            if(data.username != username){ //if data username does not match username of user
                return response
                    .unauthorized('todo/unauthorized')
            }

            return {
                success: true
            };
        }
    });
}; 