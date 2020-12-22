/**
 * Login Module
 * - Password and username is required and will return bad request 400 if not supplied
- if username doesn't exist, return not found 404
- if password is wrong, return unauthorized 401
- Should authenticate and return JWT only with payload on userId in the token
- Body should also return userId
- Should add a token expiration of 1hr
 */
const bcrypt = require('bcrypt'); //encrypts password
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { LoginResponse, PostUserRequestLogin } = definitions;
/**
 * this is the route for creating a user
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
                200: LoginResponse //using response we can filter out what we want to show on our response
            }
        },

        /**
         * handles the request for a given route
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            const { body } = request;
            const { username, password } = body;

            const user = await User.findOne({ username }).exec();
            
            if(!user){
                return response
                    .notFound('user/not-found')
            }

            if(!(await bcrypt.compare(password, user.password))) {
                return response
                    .unauthorized('auth/wrong-password');
            }

            const data = app.jwt.sign({
                username
            }); //enveloping payload with username

            request.session.token = data;

            return {
                success: true,
                data
            }
        }
    

    })
};

//10:50 at crud create part 1