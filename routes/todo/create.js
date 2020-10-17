const { Todo } = require('../../db');

/**
 * this is the route for creating todos
 * @param {*} app 
 */

exports.create = app => {
    app.post('/todo', {
        /**
         * handles the request for a given route
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            const { body } = request;

            //get text and done with default false from body, regardless if it has
            //a object value or null, which makes it return an empty object

            //ensure that when using Postman to check this that it's set to json not text
            const { text, done = false } = body || {};

            if (!text) {
                return response
                    .code(400)
                    .send({
                        success: false,
                        code: 'todo/malformed',
                        message: 'Payload doesn\'t have text property'
                    });
            }

            const data = new Todo ({
                text,
                done
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