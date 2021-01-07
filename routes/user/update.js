/**
 * User Module (PUT update a user)
 * - can only be done by the owner of the account or admin type user
- owner of account can take in password, first name, last name but not all are required.
- if admin type user, can only change password or isAdmin 
- if no payload has been sent or payload is empty, return bad request (400)
- if owner of account and not admin and updates isAdmin, return forbidden (403)
- if admin type user and updates first name or last name, return forbidden (403)
- if admin type user removes isAdmin status on himself and there are no admins left in the list, it should return forbidden (403) and should not update the database
- if userId in the parameter is not found in the database, return not found (404)
- dateUpdated should be updated with the current date
- if owner of account, should return username, firstname, lastname, isAdmin, dateCreated, dateUpdated
- if admin, should return only username, isAdmin, dateCreated, dateUpdated
 */

const bcrypt = require('bcrypt');
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { UpdateOneUserResponse, PutUserRequest, GetOneUserParams } = definitions
const saltRounds = 10;
/**
 * Updates one user
 * 
 * @param {*} app 
 */
exports.update = app => { //arrow function which allows modification of global variables,
    app.put('/user/:userId', {
        schema: {
            description: 'Update one user',
            tags: ['User'],
            summary: 'Update one user',
            body: PutUserRequest,
            params: GetOneUserParams,
            response: {
                200: UpdateOneUserResponse
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
         * This updates one todo from the database given a unique ID and a payload
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            const { params, body, user } = request; //use url to get info
            const { username } = user; //get username and isAdmin from user
            const { userId } = params;
            //get text and isDone from body
            //ensure that when using Postman to check this that it's set to json not text

            const { password, firstName, lastName, isAdmin } = body;

            const oldData = await User.findOne({ username: userId}).exec();

            if(!oldData){
                return response
                    .notFound('user/not-found');
            }
            
            if(user.isAdmin == true){ //if user is admin
                // const { password, isAdmin } = body;

                if(!password && (isAdmin === null || isAdmin === undefined)){ //at least has one
                    return response
                        .badRequest('request/malformed')
                }

                if(firstName && lastName){ //if there's first name or last name
                    return response
                        .forbidden('user/forbidden')
                }

                const update = {};

                if(isAdmin !== null && isAdmin !== undefined){
                    update.isAdmin = isAdmin;
                }

                if(password){
                    const hash = await bcrypt.hash(password, saltRounds);
                    update.password = hash;
                }

                update.dateUpdated = new Date().getTime();

                console.log(update);

                const adminUser = await User.findOneAndUpdate(
                    { username: userId },
                    update,
                    { new: true }
                )
                

                return {
                    success: true,
                    adminUser
                }
            } else { //if not admin
                if(oldData.username != username){
                    return response
                        .unauthorized('user/unauthorized');
                }

                // const { password, firstName, lastName } = body;

                if(!password && !firstName && !lastName){ //at least has one
                    return response
                        .badRequest('request/malformed')
                }

                if(isAdmin || oldData.isAdmin == false){ //if trying to change isAdmin
                    return response
                        .forbidden('user/forbidden')
                }

                const update = {}

                if(password){
                    const hash = await bcrypt.hash(password, saltRounds);
                    update.password = hash;
                }

                if(firstName){
                    update.firstName = firstName;
                }

                if(lastName){
                    update.lastName = lastName;
                }

                update.dateUpdated = new Date().getTime();

                // console.log(update);

                const ownerUser = await User.findOneAndUpdate(
                    { username: userId },
                    update,
                    { new: true }
                )

                return {
                    success: true,
                    ownerUser
                }
            }
        }
    }); 
}; // dont forget semi-colon
