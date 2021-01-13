/** Exercise Specification
 * User Module (PUT update a user)
 * - can only be done by the owner of the account or admin type user **finished
- owner of account can take in password, first name, last name but not all are required. **finished
- if admin type user, can only change password or isAdmin **finished
- if no payload has been sent or payload is empty, return bad request (400) **finished
- if owner of account and not admin and updates isAdmin, return forbidden (403) **finished
- if admin type user and updates first name or last name, return forbidden (403) **finished
- if admin type user removes isAdmin status on himself and there are no admins left in the list, it should return forbidden (403) and should not update the database **finished
- if userId in the parameter is not found in the database, return not found (404) **finished
- dateUpdated should be updated with the current date **finished
- if owner of account, should return username, firstname, lastname, isAdmin, dateCreated, dateUpdated **finished
- if admin, should return only username, isAdmin, dateCreated, dateUpdated **finished
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
exports.update = app => {
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
         * This updates one user from the database given a unique ID and a payload
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async (request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            const { params, body, user } = request; //use url to get info
            const { username } = user; //get username and isAdmin from user
            const { userId } = params; //gets userId from params
            const { password, firstName, lastName, isAdmin } = body; //get these properties from a body

            const oldData = await User.findOne({ username: userId}).exec(); //find user with given userId from User database

            if(!oldData){ //error handling if there's no oldData
                return response
                    .notFound('user/not-found');
            }

            if(user.isAdmin == true){ //if user is admin
                if(!password && (isAdmin === null || isAdmin === undefined)){ //assumes there's at least one property in the payload
                    return response
                        .badRequest('request/malformed')
                }

                if(firstName || lastName){ //error handling if there's first name or last name in the payload as an admin
                    return response
                        .forbidden('user/forbidden')
                }

                const update = {}; //create an update object

                if(isAdmin !== null && isAdmin !== undefined){ //if there's a value for isAdmin
                    if(isAdmin == false){ //if isAdmin is false
                        var isAdminDB = await User
                            .find({ isAdmin: true }); //check if there's other admins in the user database

                        if (userId == username){ //if userId is equal to username of user
                            if(isAdminDB.length <= 1){ //error handling if there's only one admin left in the user database
                                return response
                                    .forbidden('user/forbidden');
                            }
                        }
                    }
                    update.isAdmin = isAdmin; //add isAdmin property in update
                }

                if(password){ //if there's a password
                    const hash = await bcrypt.hash(password, saltRounds); //encrypt password
                    update.password = hash; //add password property in update
                }

                update.dateUpdated = new Date().getTime(); //update dateUpdated property to current time in update

                const adminUser = await User.findOneAndUpdate( //update the user info
                    { username: userId },
                    update,
                    { new: true }
                ).exec();
                
                return { //return adminUser info
                    adminUser
                }
            } else { //if not admin
                if(oldData.username != username){ 
                    return response
                        .unauthorized('user/unauthorized');
                } //error handling in trying to update a username aside from own username

                if(!password && !firstName && !lastName){ //at least has one property in payload
                    return response
                        .badRequest('request/malformed')
                }

                if(isAdmin == true || isAdmin == false){ //if trying to change isAdmin as a non-admin
                    return response
                        .forbidden('user/forbidden')
                }

                const update = {} //create an update object

                if(password){ //if there's a password
                    const hash = await bcrypt.hash(password, saltRounds); //encrypt password
                    update.password = hash; //add password property in update
                }

                if(firstName){ //add firstName property in update object
                    update.firstName = firstName;
                }

                if(lastName){ //add lastName property in update object
                    update.lastName = lastName;
                }

                update.dateUpdated = new Date().getTime(); //set dateUpdated property to current time in update object

                const ownerUser = await User.findOneAndUpdate(
                    { username: userId },
                    update,
                    { new: true }
                ).exec(); //update the user info

                return { //return ownerUser info
                    ownerUser
                }
            }
        }
    }); 
};
