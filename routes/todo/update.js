/** Exercise Specifications
 * Task Module (PUT update task)
 * - Can be done by the owner or admin type **finished
- owner can update text or isDone but not all are required **finished alongside exer
- admin type can only update isDone **finished
- if no payload has been sent or payload is empty, return bad request (400) **finished alongside exer
- if admin type updates text, return forbidden (403) **finished
- if taskId in the parameter is not found in the database, return no found (404) **finished alongside exer
- dateUpdated should be updated with the current date **finished alongside exer
_ should return text, username, isDone, dateCreated, and dateUpdated **finished alongside exer
 */

const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoResponse, PutTodoRequest, GetOneTodoParams } = definitions

/**
 * Updates one todo
 * 
 * @param {*} app 
 */
exports.update = app => {
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
        handler: async (request, response) => {
            const { params, body, user } = request;
            const { username, isAdmin } = user; //get username and isAdmin from user
            const { id } = params; //gets id from params
            const { text, isDone } = body; //gets text and isDone from body

            var data = await Todo.findOne({ id, username }).exec(); //creates a data given id and username
            
            if (!text && (isDone === null || isDone === undefined)){ //assumes we get one property, if not
                return response
                    .badRequest('request/malformed')
            }

            if (isAdmin == true){ //if admin
                if(text){ //if tries to change text
                    return response
                        .forbidden('todo/forbidden')
                }

                const oldData = await Todo.findOne({id}).exec(); //gets oldData given id

                if(!oldData){ //if there's no oldData
                    return response
                        .notFound('todo/not-found')
                }

                const update = {}; //creates an update object

                if(isDone !== undefined && isDone !== null){ //updates isDone
                    update.isDone = isDone;
                }

                update.dateUpdated = new Date().getTime(); //updates dateUpdated with current time

                data = await Todo.findOneAndUpdate( //finds a todo from the Todo database and updates with update object and given id
                    { id },
                    update
                )
                    .exec();
            } else { //if not admin
                const oldData = await Todo.findOne({ id, username }).exec(); //get oldData given id and username

                if (!oldData){ //if there's no task
                    return response
                        .notFound('todo/not-found')
                } 

                const update = {}; //creates an update object

                if(text){ //updates text
                    update.text = text;
                }

                if(isDone !== undefined && isDone !== null){ //updates isDone
                    update.isDone = isDone;
                }

                update.dateUpdated = new Date().getTime(); //updates dateUpdated

                data = await Todo.findOneAndUpdate( //finds a todo from the Todo database and updates with update object and given id
                    { id },
                    update
                )
                    .exec();
            }

            return { //returns success and data
                success: true,
                data
            };
        }
    }); 
};
