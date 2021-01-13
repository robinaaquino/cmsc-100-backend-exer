/** Exercise Specifications
 * Login Module
 * - Password and username is required and will return bad request 400 if not supplied **finished, comes with exer code
- if username doesn't exist, return not found 404 **finished
- if password is wrong, return unauthorized 401 **finished
- Should authenticate and return JWT only with payload on userId in the token **I don't understand
- Body should also return userId **it returns a token
- Should add a token expiration of 1hr **changed in app.js
 */
const bcrypt = require('bcrypt'); //encrypts password
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { LoginResponse, PostUserRequestLogin } = definitions;
/**
 * Logins a user
 * @param {*} app 
 */

exports.login = app => {
    app.post('/login', {
        schema: {
            description: 'Logs in a user',
            tags: ['User'],
            summary: 'Logs in a user',
            body: PostUserRequestLogin,
            response: {
                200: LoginResponse
            }
        },

        /**
         * Logins a user
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            const { body } = request; //gets body from request
            const { username, password } = body; //gets username and password from body

            if(!username && !password){ //if there's no username and password
                return response
                    .badRequest('request/malformed');
            }

            const user = await User.findOne({ username }).exec(); //finds user givern username
            
            if(!user){ //error handler if there's no username
                return response
                    .notFound('user/not-found')
            }

            if(!(await bcrypt.compare(password, user.password))) { //compare encrypted password with password from user database, error handler if not equal
                return response
                    .unauthorized('auth/wrong-password');
            }

            const data = app.jwt.sign({ 
                username
            }); //enveloping payload with username

            request.session.token = data; //sets the session token with the jwt

            return { //returns success and data
                success: true,
                data
            }
        }
    })
};