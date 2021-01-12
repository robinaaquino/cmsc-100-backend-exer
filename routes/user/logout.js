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
 * this is the route for logging out a user
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
                200: SuccessResponse //using response we can filter out what we want to show on our response
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
         * handles the request for a given route
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            const { user, query } = request;
            const { username } = user;
            const { tokenQuery } = query;

            if(tokenQuery != request.session.token || !tokenQuery){
                return response
                    .unauthorized('user/unauthorized')
            }

            const data = new DiscardedToken({
                username,
                token: tokenQuery
            });

            await data.save();

            request.destroySession(() => {
                response.send({
                    success: true
                })
            });
        }
    })
};