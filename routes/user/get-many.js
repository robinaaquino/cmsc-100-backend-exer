/** Exercise Specification
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
 * Gets many users
 * 
 * @param {*} app 
 */
exports.getMany = app => {
    
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
         * This gets many todos from the database
         * 
         * @param {import('fastify').FastifyRequest} request
         * @param {import('fastify').FastifyReply<Response>} response
         */
        handler: async(request, response) => {
            const { query, user } = request;
            const { startDateCreated, endDateCreated, startDateUpdated, endDateUpdated, startUsername, endUsername, ifSortByDateCreated, ifSortByDateUpdated, ifSortByUsername, isAscendingElseDescending } = query;
            const { isAdminFilter } = query;
            var { limit = 10 } = query; //set default limit to 10

            if(limit > 50){ //if limit is greater than 50, set limit to 50
                limit = 50;
            }

            var options = {}; //make an options object for finding getMany

            if(user.isAdmin == true){ //if user is an admin
                //for sorting to ascending order first
                if(startDateUpdated){ //if startDateUpdated exists, put in options as an object
                    options.dateUpdated = {};
                    options.dateUpdated.$gte = startDateUpdated;
                }

                if(endDateUpdated){ //if endDateUpdated exists, put in options as an object
                    options.dateUpdated = options.dateUpdated || {};
                    options.dateUpdated.$lte = endDateUpdated;
                }

                if (startDateCreated){ //if startDateCreated exists, put in options as an object
                    options.dateCreated = {};
                    options.dateCreated.$gte = startDateCreated;
                }

                if(endDateCreated){ //if endDateCreated exists, put in options as an object
                    options.dateCreated = options.dateUpdated || {};
                    options.dateCreated.$lte = endDateCreated;
                }

                if(startUsername){ //if startUsername exists, put in options as an object
                    options.username = {};
                    options.username.$gte = startUsername;
                }

                if(endUsername){ //if endUsername exists, put in options as an object
                    options.username = options.username || {};
                    options.username.$lte = endUsername;
                }

                if(isAdminFilter == true || isAdminFilter == false){ //if the user list is to be filted by isAdmin, put in options as an object
                    options.isAdmin = {};
                    options.isAdmin.$gte = isAdminFilter;
                    options.isAdmin.$lte = isAdminFilter;
                }

                const data = await User
                    .find(options)
                    .limit(parseInt(limit))
                    .sort({
                        isAdmin: isAdminFilter ? 1 : -1,
                        username: startUsername && !endUsername ? 1 : - 1,
                        dateCreated: startDateCreated && !endDateCreated ? 1 : -1,
                        dateUpdated: startDateUpdated && !endDateUpdated ? 1 : -1
                    }); //gets an array of users, automatically sorts to ascending order, in username it's descending order
                             
                
                
                if(ifSortByDateCreated || ifSortByDateUpdated || ifSortByUsername){ //if there's value for any property for sorting the array of users
                    if(ifSortByDateCreated == true && (ifSortByDateUpdated != true && ifSortByUsername != true)) { //sort by date created
                        if(isAscendingElseDescending == false){ //if sort in descending order
                            data.sort((prev,next) => next.dateCreated - prev.dateCreated);
                        } else if (isAscendingElseDescending == true){
                            data.sort((prev,next) => prev.dateCreated - next.dateCreated);
                        }
                    } else if (ifSortByDateUpdated == true && (ifSortByDateCreated != true && ifSortByUsername != true)){ //sort by date updated
                        if(isAscendingElseDescending == false){ //if sort in descending order
                            data.sort((prev,next) => next.dateUpdated - prev.dateUpdated);
                        } else if(isAscendingElseDescending == true){
                            data.sort((prev,next) => prev.dateUpdated - next.dateUpdated);
                        }
                    } else if (ifSortByUsername == true && (ifSortByDateUpdated != true && ifSortByDateCreated != true)){ //sort by username
                        if(isAscendingElseDescending == true){ //opposite for username
                            data.sort((a,b) => (a.username > b.username) ? 1 : ((b.username > a.username) ? -1 : 0)); //ascending for username works
                        }
                    } else { //error handling for other cases
                        return response
                            .forbidden('user/forbidden/get-many');
                    }
                }   
                return { //return success and data
                    success: true,
                    data
                }
            } else { //error handling if not an admin
                return response
                    .unauthorized('user/unauthorized');
            }
        }
    }); 
}; 
