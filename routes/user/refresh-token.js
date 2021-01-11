/**
 * Refresh Token Module
 * 
- When called with an expired token, it should not work **finished
- When called with an unexpired token, it should replace the token and return that token in both the session and in payload response **finished
 */

const { DiscardedToken } = require('../../db');
const { definitions } = require('../../definitions');
const { JWTResponse, AuthQuery } = definitions;

/**
 * this is the route for checking if a user is authenticated
 * @param {*} app 
 */

exports.refresh = app => {
    app.get('/refresh', {
        schema: {
            description: 'Refresh the JWT Token',
            tags: ['User'],
            summary: 'Refresh the JWT Token',
            query: AuthQuery,
            response: {
                200: JWTResponse //using response we can filter out what we want to show on our response
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
        handler: async (request, response) => {
            const { query, user } = request;
            const { tokenQuery } = query;
            const { username } = user;

            if(!tokenQuery){
                return response
                    .forbidden('user/forbidden')
            }

            const foundToken = await DiscardedToken.find({ username: username, token: tokenQuery }).exec();

            var data;

            if(foundToken.length == 0 || !foundToken){ //if token is not there, means it's unexpired
                data = app.jwt.sign({
                    username
                });

                request.session.token = data;

                const newDiscardedToken = new DiscardedToken({
                    username,
                    token: tokenQuery
                });

                await newDiscardedToken.save();

                return {
                    success: true,
                    data
                }
            } else {
                return response
                    .forbidden('user/forbidden');
            }

            
        }
    })
};