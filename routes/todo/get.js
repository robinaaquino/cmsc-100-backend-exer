/** Exercise Specifications
 * Task Module (GET get one task)
 * - can only be done by owner of the task or the admin of the task **finished
- the object returned should have the username, text, isDone, dateUpdated, and dateCreated **finished
- if taskId given in parameter is not found in database, return bad request (404) **finished alongside exer
 */

const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoParams, GetOneTodoResponse } = definitions

/**
 * Gets one todo
 * 
 * @param {*} app 
 */
exports.get = app => {
    
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
        handler: async(request, response) => {
            const { params, user } = request;
            const { username, isAdmin } = user; //get username and isAdmin property from user
            const { id } = params; //gets id from params
            
            var data = await Todo.findOne({ id, username }).exec(); //get data

            if(isAdmin == true){ //if admin
                data = await Todo.findOne({ id }).exec(); //get id regardless of username
            } else {
                data = await Todo.findOne({ id, username }).exec(); //get id with regards to username
            } 

            if (!data){ //if there's no todo
                return response
                    .notFound('todo/not-found')
            } 

            return { //returns success and data
                success: true,
                data
            };
        }
    }); 
};
