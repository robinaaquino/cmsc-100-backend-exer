/** Exercise Specification
 * User Module (GET one user)
 * - can only be done by the owner of the account or an admin type user **finished
- should not show the password **finished
- should show only the username, first name, last name, isAdmin, dateCreated, dateUpdated **finished alongside exer
- if userId given in parameter is not found in database, return bad request (404) **finished
 */

const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserParams, GetOneUserResponse } = definitions

/**
 * Gets one user
 * 
 * @param {*} app 
 */
exports.get = app => {
    
    app.get('/user/:userId', {
        schema: {
            description: 'Get one user',
            tags: ['User'],
            summary: 'Get one user',
            params: GetOneUserParams,
            response: {
                200: GetOneUserResponse
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
         * This gets one user from the database given a unique ID
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async(request, response) => {
            const { params, user } = request;
            const { username, isAdmin } = user; //getting username and isAdmin of user
            const { userId } = params; //getting userId of params
        
            var data = await User.findOne({ username: userId }).exec(); //find the user with the given userId

            if (!data){ //error handling if there's no data
                return response
                    .notFound('user/not-found');
            }

            if (isAdmin == true || data.username == username){ //if user is an admin or the username of the data matches the user's username
                data = await User.findOne({ username: userId }).exec();
            } else { //error handler if not authorized
                return response
                    .unauthorized('user/unauthorized');
            }
         
            return { //returns success and data
                success: true,
                data
            }
        }
    }); 
};
