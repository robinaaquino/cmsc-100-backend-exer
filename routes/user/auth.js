/** Exercise Specifications
 * Prehandler Auth Module
 * - Should return unauthorized 401 if no token or a wrong token is given **finished
- Should process token from authorization header **finished alongside exer
- Should process token from the cookie session **Finished
 */

const { definitions } = require('../../definitions');
const { AuthQuery, SuccessResponse } = definitions;

/**
 * Check if a user is authenticated
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
     * This checks if a user is authenticated given a token
     *
     */
    handler: async (request, response) => {
        const { query, session, headers } = request;
        const { tokenQuery } = query; //gets tokenQuery from query
        const { token: cookieToken } = session; //gets token from session
        const { authorization } = headers; //gets authorization from headers

        let authorizationToken; //sets a variable

        if(authorization){ //if there's authorization, split the array
            [,authorizationToken] = authorization.split('Bearer ');
        }

        const token = cookieToken || authorizationToken //set token as either cookieToken or authorization Token

        if(!tokenQuery || tokenQuery !== token ){ //if there's no tokenQuery or tokenQuery is not equal to token from session or authorization header
            return response
                .unauthorized('user/unauthorized');
        }

        return { //return success
            success: true
        }
    }
  })
};
