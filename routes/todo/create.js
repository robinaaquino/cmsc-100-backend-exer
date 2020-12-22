/**
 * Task Module (POST create one task)
 * - can be done by a logged in user
- needs to take in text (required) and will return bad request (400) if no text is sent
- can also take isDone property in the payload
- dateUpdated and dateCreated are of type number in UNIX Epoch type and created automatically in the model's schema
- username is saved in the database based on the current username that is got from the token
- should return only success true when an account has been created
 */

const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoResponse, PostTodoRequest } = definitions

/**
 * this is the route for creating todos
 * @param {*} app 
 */

exports.create = app => {
    app.post('/todo', {
        schema: {
            description: 'Create one todo',
            tags: ['Todo'],
            summary: 'Create one todo',
            body: PostTodoRequest,
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
         * handles the request for a given route
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            const { body, user } = request;

            //get text and isDone with default false from body, regardless if it has
            //a object value or null, which makes it return an empty object

            //ensure that when using Postman to check this that it's set to json not text
            const { text, isDone = false } = body;
            const { username } = user;

            const data = new Todo ({
                text,
                isDone,
                username
            });

            await data.save();

            return {
                success: true,
                data
            }
        }
    

    })
};

//10:50 at crud create part 1