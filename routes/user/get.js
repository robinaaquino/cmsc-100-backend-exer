/**
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
exports.get = app => { //arrow function which allows modification of global variables,
    
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
         * This gets one todo from the database given a unique ID
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async(request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            const { params, user } = request; //use url to get info
            const { username, isAdmin } = user; //getting username and isAdmin of user
            const { userId } = params; //getting userId of params
        
            var data = await User.findOne({ username: userId }).exec();

            if (!data){
                return response
                    .notFound('user/not-found');
            }

            if (isAdmin == true){
                data = await User.findOne({ username: userId }).exec();
            } else if (data.username == username){
                data = await User.findOne({ username: userId });
            } else {
                return response
                    .unauthorized('user/unauthorized');
            }
         
            return {
                success: true,
                data
            }
        }
    }); 
}; // dont forget semi-colon
