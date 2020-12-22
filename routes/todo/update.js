/**
 * Task Module (PUT update task)
 * - Can be done by the owner or admin type
- owner can update text or isDone but not all are required
- admin type can only update isDone
- if no payload has been sent or payload is empty, return bad request (400)
- if admin type updates text, return forbidden (403)
- if taskId in the parameter is not found in the database, return no found (404)
- dateUpdated should be updated with the current date
_ should return text, username, isDone, dateCreated, and dateUpdated
 */

const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoResponse, PutTodoRequest, GetOneTodoParams } = definitions

/**
 * Updates one todo
 * 
 * @param {*} app 
 */
exports.update = app => { //arrow function which allows modification of global variables,
    app.put('/todo/:id', {
        schema: {
            description: 'Update one todo',
            tags: ['Todo'],
            summary: 'Update one todo',
            body: PutTodoRequest,
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
         * This updates one todo from the database given a unique ID and a payload
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            const { params, body, user } = request; //use url to get info
            const { username } = user;
            const { id } = params;
            //get text and isDone from body
            //ensure that when using Postman to check this that it's set to json not text
            const { text, isDone } = body;
        
            //expect that we should be getting at least a text or a isDone property
            if (!text && (isDone === null || isDone === undefined)){ 
                return response
                    .badRequest('request/malformed')
            }

            const oldData = await Todo.findOne({ id, username }).exec();

            if (!oldData){ //it's -1
                return response
                    .notFound('todo/not-found')
            } 

            const update = {};

            if(text){
                update.text = text;
            }

            if(isDone !== undefined && isDone !== null){
                update.isDone = isDone;
            }

            update.dateUpdated = new Date().getTime();

            const data = await Todo.findOneAndUpdate(
                { id },
                update,
                { new: true } //i want to see new object that I created
            )
                .exec();

            return {
                success: true,
                data
            };
        }
    }); 
}; // dont forget semi-colon
