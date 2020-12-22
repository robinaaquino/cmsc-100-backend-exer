/**
 * User Module (GET one user)
 * - can only be done by the owner of the account or an admin type user
- should not show the password
- should show only the username, first name, last name, isAdmin, dateCreated, dateUpdated
- if userId given in parameter is not found in database, return bad request (404)
 */

const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserParams, GetOneUserResponse } = definitions

/**
 * Gets one user
 * 
 * @param {*} app 
 */
exports.get = app => { //arrow function which allows modification of global variables,
    
    app.get('/user/:username', {
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
         * This gets one todo from the database given a unique ID
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async(request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            const { params, user } = request; //use url to get info
            const { username } = user; //getting username of user
            const { isAdmin } = user; //getting isAdmin property of user
            const { userId } = params; //getting userId of params

        
            const data = await User.findOne({ userId, username }).exec();

            if (!data){
                return response
                    .notFound('user/not-found')
            }

            if ((username === userId) || (isAdmin == true)){
                return {
                    success: true,
                    data
                };
            } else {
                return response
                    .unauthorized('auth/unauthorized')
            } 
        }
    }); 
}; // dont forget semi-colon
