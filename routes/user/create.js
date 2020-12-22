/**
 * User module (POST create one user)
 * - should create a user using username, password, first name and last name
- username, password, first name, and last name should be strings and are required in the database with username to be unique and index.
- dateUpdated and dateCreated are of type number in UNIX Epoch type and created automatically in the model's schema
- isAdmin property is default false
- should encrypt the password before saving in the database
- should return a 403 (forbidden) if a similar username already exists
- should return a 400 (bad request) if password is less than 12 characters and has numbers and special characters
- should return only success true when an account has been created
 */

const bcrypt = require('bcrypt'); //encrypts password
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserResponse, PostUserRequest } = definitions
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
                200: GetOneUserResponse //using response we can filter out what we want to show on our response
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
            const { username, password, firstName, lastName, isAdmin = false } = body;

            const hash = await bcrypt.hash(password, saltRounds);

            const data = new User ({
                username,
                firstName,
                lastName,
                isAdmin,
                password: hash
            });

            await data.save();

            // console.log(data.toJSON()); //shows all data including password

            return {
                success: true,
                data
            }
        }
    

    })
};

//10:50 at crud create part 1