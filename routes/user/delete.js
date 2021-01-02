/**
 * User Module (DELETE delete a user)
 * - can only be done by owner of the user account or admin type user
- if userId in parameter is not found in database, return bad request (404)
 */

const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserParams, GetOneUserResponse } = definitions //CHANGE GETONEUSERRESPONSE TO SUCCESS RESPONSE

/**
 * Deletes one todo
 * 
 * @param {*} app 
 */
exports.deleteOne = app => { //arrow function which allows modification of global variables,
    
    app.delete('/user/:username', {
        schema: {
            description: 'Delete one user',
            tags: ['User'],
            summary: 'Delete one user',
            params: GetOneUserParams,
            response: {
                200: GetOneUserResponse //CHANGE TO SUCCESS RESPONSE
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
         * This deletes one todo from the database given a unique ID
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            const { params, user } = request; //use url to get info
            const { username, isAdmin } = user;
            const { userId } = params;
          
            const data = await User.findOne({ userId }).exec();

            if (!data){
                return response
                    .notFound('user/not-found')
            }
            
            console.log(username);
            console.log(data.username);

            if(isAdmin == true || data.username === username){
                return {
                    success: true,
                    data
                }
            } else {
                return response
                    .unauthorized('user/unauthorized');
            }
        }
    });
}; // dont forget semi-colon
