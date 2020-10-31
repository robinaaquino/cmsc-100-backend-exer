const bcrypt = require('bcrypt'); //encrypts password
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserResponse, PostUserRequest } = definitions
const saltRounds = 10;
/**
 * this is the route for creating a user
 * @param {*} app 
 */

exports.create = app => {
    app.post('/user', {
        schema: {
            description: 'Create one user',
            tags: ['User'],
            summary: 'Create one user',
            body: PostUserRequest,
            response: {
                200: GetOneUserResponse //using response we can filter out what we want to show on our response
            }
        },

        /**
         * handles the request for a given route
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            const { body } = request;
            const { username, password } = body;

            const hash = await bcrypt.hash(password, saltRounds);

            const data = new User ({
                username,
                password: hash
            });

            await data.save();

            // console.log(data.toJSON()); //shows all data including password

            return {
                success: true,
                data
            }
        }
    

    })
};

//10:50 at crud create part 1