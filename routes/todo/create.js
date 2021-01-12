/** Exercise Specifications
 * Task Module (POST create one task)
 * - can be done by a logged in user **finished
- needs to take in text (required) and will return bad request (400) if no text is sent **finished
- can also take isDone property in the payload **finished
- dateUpdated and dateCreated are of type number in UNIX Epoch type and created automatically in the model's schema **finished
- username is saved in the database based on the current username that is got from the token **finished
- should return only success true when an account has been created **finished
 */

const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { SuccessResponse, PostTodoRequest } = definitions 

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
         * handles the request for a given route
         * 
         * @param {import('fastify').FastifyRequest} request
         */
        handler: async (request) => {
            const { body, user } = request;
            const { text, isDone = false } = body; //sets the body
            const { username } = user;

            const data = new Todo ({ //creates a new Todo with text, isDone and username property
                text,
                isDone,
                username
            });

            await data.save(); //saves the data object

            return { //returns a success
                success: true
            }
        }
    

    })
};

//10:50 at crud create part 1