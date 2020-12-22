/**
 * Task Module (GET get one task)
 * - can only be done by owner of the task or the admin of the task
- the object returned should have the username, text, isDone, dateUpdated, and dateCreated
- if taskId given in parameter is not found in database, return bad request (404)
 */

const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoParams, GetOneTodoResponse } = definitions

/**
 * Gets one todo
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
         * This gets one todo from the database given a unique ID
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async(request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            const { params, user } = request; //use url to get info
            const { username } = user;
            const { id } = params;
        
            const data = await Todo.findOne({ id, username }).exec();

            if (!data){
                return response
                    .notFound('todo/not-found')
            } 

            return {
                success: true,
                data
            };
        }
    }); 
}; // dont forget semi-colon
