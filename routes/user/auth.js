const { definitions } = require('../../definitions');
const { SuccessResponse } = definitions;

/**
 * this is the route for checking if a user is authenticated
 * @param {*} app 
 */

exports.auth = app => {
    app.get('/auth', {
        schema: {
            description: 'Check authentication of a user',
            tags: ['User'],
            summary: 'Check authentication of a user',
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
         */
        handler: async () => {
            return {
                success: true
            }
        }
    })
};