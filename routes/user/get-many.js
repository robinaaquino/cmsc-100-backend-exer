/**
 * User Module (GET get many users)
 * - Should only be done by an admin type user **finished
- Should show only username, isAdmin, dateCreated, dateUpdated in each object in an array **finished
- Can be sorted by username, dateCreated, or dateUpdated (exclusive or) either by ascending or descending **finished
- Should send a limit of at most 50, default is 10 **finished
- Can be filtered with isAdmin **finished
- Can have pagination either by startDateCreated, endDateCreated, startDateUpdated, endDateUpdated, startUsername, endUsername (all can be used in one query) **finished
 */

const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetManyUserQuery, GetManyUserResponse } = definitions

/**
 * Gets many user
 * 
 * @param {*} app 
 */
exports.getMany = app => { //arrow function which allows modification of global variables,
    
    app.get('/user', {
        schema: {
            description: 'Get many users',
            tags: ['User'],
            summary: 'Get many user',
            query: GetManyUserQuery,
            response: {
                200: GetManyUserResponse
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
         * This gets one todo from the database given a unique ID
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async(request, response) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            console.log("test?");
            const { query, user } = request;
            const { username } = user;
            const { startDateCreated, endDateCreated, startDateUpdated, endDateUpdated, startUsername, endUsername, ifSortByDateCreated, ifSortByDateUpdated, ifSortByUsername, isAscendingElseDescending } = query;
            const { isAdminFilter } = query;
            var { limit = 10 } = query;

            if(limit > 50){
                limit = 50;
            }

            var options = {};

            if(user.isAdmin == true){
                //for sorting to ascending order first
                if(startDateUpdated){
                    options.dateUpdated = {};
                    options.dateUpdated.$gte = startDateUpdated;
                }

                if(endDateUpdated){
                    options.dateUpdated = options.dateUpdated || {};
                    options.dateUpdated.$lte = endDateUpdated;
                }

                if (startDateCreated){
                    options.dateCreated = {};
                    options.dateCreated.$gte = startDateCreated;
                }

                if(endDateCreated){
                    options.dateCreated = options.dateUpdated || {};
                    options.dateCreated.$lte = endDateCreated;
                }

                if(startUsername){
                    options.username = {};
                    options.username.$gte = startUsername;
                }

                if(endUsername){
                    options.username = options.username || {};
                    options.username.$lte = endUsername;
                }

                if(isAdminFilter == true || isAdminFilter == false){
                    options.isAdmin = {};
                    options.isAdmin.$gte = isAdminFilter;
                    options.isAdmin.$lte = isAdminFilter;
                }


                //it's doing ABCabc, no AaBbCc, i dunno how to lowercase
                const data = await User
                    .find(options)
                    .limit(parseInt(limit))
                    .sort({
                        isAdmin: isAdminFilter ? 1 : -1,
                        username: startUsername && !endUsername ? 1 : - 1,
                        dateCreated: startDateCreated && !endDateCreated ? 1 : -1,
                        dateUpdated: startDateUpdated && !endDateUpdated ? 1 : -1
                    }); //automatically sorts to ascending order, in username it's descending order
                             
                
                
                if(ifSortByDateCreated || ifSortByDateUpdated || ifSortByUsername){ //how tf do i do xor on three foking variables
                    if(ifSortByDateCreated == true && (ifSortByDateUpdated != true && ifSortByUsername != true)) { //sort by date created
                        if(isAscendingElseDescending == false){ //if sort in descending order
                            data.sort((prev,next) => next.dateCreated - prev.dateCreated);
                            // if(startDateCreated && !endDateCreated){
                            //     data.sort((prev,next) => next.dateCreated - prev.dateCreated);
                            // }
                        } else if (isAscendingElseDescending == true){
                            data.sort((prev,next) => prev.dateCreated - next.dateCreated);
                        }
                    } else if (ifSortByDateUpdated == true && (ifSortByDateCreated != true && ifSortByUsername != true)){ //sort by date updated
                        if(isAscendingElseDescending == false){ //if sort in descending order
                            data.sort((prev,next) => next.dateUpdated - prev.dateUpdated);
                            // data.sort((a,b) => (a.dateUpdated > b.dateUpdated) ? 1 : ((b.dateUpdated > a.dateUpdated) ? -1 : 0));
                            // if(startDateUpdated && !endDateUpdated){
                            //     data.sort((prev,next) => next.dateUpdated - prev.dateUpdated);
                            // }
                        } else if(isAscendingElseDescending == true){
                            data.sort((prev,next) => prev.dateUpdated - next.dateUpdated);
                        }

                    } else if (ifSortByUsername == true && (ifSortByDateUpdated != true && ifSortByDateCreated != true)){ //sort by username
                        if(isAscendingElseDescending == true){ //opposite for username
                            data.sort((a,b) => (a.username > b.username) ? 1 : ((b.username > a.username) ? -1 : 0)); //ascending for username works
                            // if(startUsername && !endUsername){
                            //     data.sort((prev,next) => next.username - prev.username);
                            // }
                        }
                    } else {
                        return response
                            .forbidden('user/forbidden/get-many');
                    }
                }   

                return {
                    success: true,
                    data
                }
            } else {
                return response
                    .unauthorized('user/unauthorized');
            }
        }
    }); 
}; // dont forget semi-colon
