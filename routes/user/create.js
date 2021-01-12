/** Exercise Specifications
 * User module (POST create one user)
 * - should create a user using username, password, first name and last name **finished
- username, password, first name, and last name should be strings and are required in the database with username to be unique and index. **finished
- dateUpdated and dateCreated are of type number in UNIX Epoch type and created automatically in the model's schema **finished
- isAdmin property is default false **finished
- should encrypt the password before saving in the database **finished
- should return a 403 (forbidden) if a similar username already exists **finished
- should return a 400 (bad request) if password is less than 12 characters and has numbers and special characters **finished
- should return only success true when an account has been created **finished
 */

const bcrypt = require('bcrypt');
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { SuccessResponse, PostUserRequest } = definitions
const saltRounds = 10;
/**
 * this is the route for creating a user
 * @param {*} app 
 */

exports.create = app => {
    app.post('/user', {
        schema: {
            description: 'Create one user',
            tags: ['User'],
            summary: 'Create one user',
            body: PostUserRequest,
            response: {
                200: SuccessResponse
            }
        },

        /**
         * Create a user
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => {
            const { body } = request;
            const { username, password, firstName, lastName, isAdmin = false } = body; //get these properties from body

            if(!username || !password || !firstName || !lastName){ //if there's no payload of any property
                return response
                    .badRequest('request/malformed');
            }

            const passwordRegex = /^([A-Z]|[a-z]| ){12,}$/; //regex for the password

            if(passwordRegex.test(password) == false){ //check the string if it fits the regex
                return response
                    .badRequest('user/bad-request');
            }

            const hash = await bcrypt.hash(password, saltRounds); //encrypt the password

            const user = await User.findOne({ username }).exec(); //check if the username is already in the database
        
            if(user){ //error handler if there's already a user with that username
                return response
                    .forbidden('user/forbidden');
            }

            const data = new User ({ //create a new user wit the given properties
                username,
                firstName,
                lastName,
                isAdmin,
                password: hash
            });

            await data.save(); //save the data

            return { //return success
                success: true
            }
        }
    })
};