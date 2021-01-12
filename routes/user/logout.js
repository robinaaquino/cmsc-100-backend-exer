/**
 * Logout Module
 * - Should return unauthorized if no token or wrong token is given **finished
- Should add token to forbidden list to disallow the reuse of the token **finished
- Should remove the token in the session cookie**finished along with exer
 */

const { DiscardedToken } = require('../../db');
const { definitions } = require('../../definitions');
const { AuthQuery, SuccessResponse } = definitions;
/**
 * Logs out a user
 * @param {*} app 
 */

exports.logout = app => {
    app.get('/logout', {
        schema: {
            description: 'Logs out a user',
            tags: ['User'],
            summary: 'Logs out a user',
            query: AuthQuery,
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
         * This logs out a user from a session
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            const { user, query } = request; 
            const { username } = user; //gets username from user
            const { tokenQuery } = query; //gets tokenQuery from query

            if(tokenQuery != request.session.token || !tokenQuery){ //error handling if there's no tokenQuery or if tokenQuery is not equal to the session token
                return response
                    .unauthorized('user/unauthorized')
            }

            const data = new DiscardedToken({ //creating a new object for the discarded token database
                username,
                token: tokenQuery
            });

            await data.save(); //saves data

            request.destroySession(() => { //destroys the session
                response.send({
                    success: true
                })
            });
        }
    })
};