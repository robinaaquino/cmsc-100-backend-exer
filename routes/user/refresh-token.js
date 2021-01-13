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
 * Refreshes given token
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
                200: JWTResponse
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
            const { tokenQuery } = query; //get tokenQuery from query
            const { username } = user; //get username from user

            if(!tokenQuery){ //error handling if there's no tokenQuery
                return response
                    .forbidden('user/forbidden')
            }

            const foundToken = await DiscardedToken.find({ username: username, token: tokenQuery }).exec(); //find the token from the DiscardedToken database

            var data; //set the data variable

            if(foundToken.length == 0 || !foundToken){ //if token is not there, means it's unexpired
                data = app.jwt.sign({ //get a new jwt
                    username
                });

                request.session.token = data; //replace the session token with the new jwt

                const newDiscardedToken = new DiscardedToken({ //create a new discarded token object
                    username,
                    token: tokenQuery
                });

                await newDiscardedToken.save(); //save to the DiscardedToken database

                return { //return success and data
                    success: true,
                    data
                }
            } else { //if token is in the discardedToken database
                return response
                    .forbidden('user/forbidden');
            }

            
        }
    })
};