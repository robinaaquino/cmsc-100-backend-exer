/**
 * Prehandler Auth Module
 * - Should return unauthorized 401 if no token or a wrong token is given
- Should process token from authorization header **finished alongside exer
- Should process token from the cookie session
 */

const { definitions } = require('../../definitions');
const { AuthQuery, SuccessResponse } = definitions;

/**
 * this is the route for checking if the user is authenticated
 *
 * @param {*} app
 */
exports.auth = app => {
  app.get('/auth', {
    schema: {
      description: 'Check authentication of a user',
      tags: ['User'],
      summary: 'Check authentication of a user',
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
     * handles the request for a given route
     *
     */
    handler: async (request, response) => {
        const { query, session, headers } = request;
        const { tokenQuery } = query;
        const { token: cookieToken } = session;
        const { authorization } = headers;

        let authorizationToken;

        if(authorization){
            [,authorizationToken] = authorization.split('Bearer ');
        }

        const token = cookieToken || authorizationToken

        if(!tokenQuery || tokenQuery !== token ){
            return response
                .unauthorized('user/unauthorized');
        }

        return {
            success: true
        }
    }
  })
};
