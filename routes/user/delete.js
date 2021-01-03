/**
 * User Module (DELETE delete a user)
 * - can only be done by owner of the user account or admin type user **finished
- if userId in parameter is not found in database, return bad request (404) **finished
 */

const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserParams, SuccessResponse } = definitions //CHANGE GETONEUSERRESPONSE TO SUCCESS RESPONSE

/**
 * Deletes one todo
 * 
 * @param {*} app 
 */
exports.deleteOne = app => { //arrow function which allows modification of global variables,
    
    app.delete('/user/:userId', {
        schema: {
            description: 'Delete one user',
            tags: ['User'],
            summary: 'Delete one user',
            params: GetOneUserParams,
            response: {
                200: SuccessResponse //CHANGE TO SUCCESS RESPONSE
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

            var data = await User.findOne({ username: userId }).exec();

            if (!data){
                return response
                    .notFound('user/not-found');
            }

            if (isAdmin == true){
                data = await User.findOneAndDelete({ username: userId }).exec();
            } else if (data.username == username){
                data = await User.findOneAndDelete({ username: userId });
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
