/** Exercise Specifications
 * User Module (DELETE delete a user)
 * - can only be done by owner of the user account or admin type user **finished
- if userId in parameter is not found in database, return bad request (404) **finished
 */

const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserParams, SuccessResponse } = definitions

/**
 * Deletes one todo
 * 
 * @param {*} app 
 */
exports.deleteOne = app => {
    
    app.delete('/user/:userId', {
        schema: {
            description: 'Delete one user',
            tags: ['User'],
            summary: 'Delete one user',
            params: GetOneUserParams,
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
         * This deletes one todo from the database given a unique ID
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            const { params, user } = request;
            const { username, isAdmin } = user; //get username and isAdmin property from user
            const { userId } = params; //get userId from params

            var data = await User.findOne({ username: userId }).exec(); //find user with that username

            if (!data){ //error handling if a user with the specified userId wasn't found
                return response
                    .notFound('user/not-found');
            }

            if (isAdmin == true || data.username === username){ //if user is an admin or the data username matchs the username of the user
                data = await User.findOneAndDelete({ username: userId }).exec(); //delete the found data for the user
            } else { //error handling if not an admin
                return response
                    .unauthorized('user/unauthorized');
            }
         
            return { //return success and data
                success: true,
                data
            }
        }
    });
};
