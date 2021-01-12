/** Exercise Specifications
 * Task Module (GET get many)
 * - can be done by owner of the tasks or admin type only **finished
- when owner gets, should only return their own tasks **finished
- when admin types, should return all tasks or when there's a filter of username **finished
- both owner and admin can further filter their list by isDone property **finished
- can have a limit with not more than 50. Default is 10. **finished
- each object in the array should have: username, text, isDone , dateUpdated, dateCreated **finished
- it should sort the array in terms of dateCreated or dateUpdated in a descending order only **finished
- it should do pagination in terms of startDateCreated, endDateCreated, startDateUpdated, endDateUpdated (all can be used in one query) **finished
 */

const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetManyTodoResponse, GetManyTodoQuery } = definitions;

/**
 * Gets many todos
 * 
 * @param {*} app 
 */
exports.getMany = app => {
/**
 * Gets many todos
 * 
 * @param {*} app
 */
    app.get('/todo', {
        schema: {
            description: 'Gets many todos',
            tags: ['Todo'],
            summary: 'Gets many todos',
            query: GetManyTodoQuery,
            response: {
                200: GetManyTodoResponse
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
         * Gets many todos given a sorting and pagination query
         * 
         * @param {import('fastify').FastifyRequest} request
         */
        handler: async(request) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            const { query, user } = request; //use url to get info
            const { username } = user; //gets username from user
            const { usernameFilter, isDone, startDateCreated, endDateCreated, startDateUpdated, endDateUpdated } = query; //gets these properties from query

            var { limit = 10 } = query; //sets query default as 10

            if(limit > 50){ //if limit is greater than 50, set to 50
                limit = 50;
            }

            var options = {}; //object for sorting and pagination
            
            //if statements for sorting and pagination
            if(user.isAdmin != true){
                options = { username };
            } 

            if(usernameFilter && (user.isAdmin == true || usernameFilter == username)){ //if usernameFilter exists and the user is an admin
                options.username = {};
                options.username.$gte = usernameFilter;
                options.username.$lte = usernameFilter;
            }

            if (startDateUpdated){ //if startDateUpdated exists, put in options as an object
                options.dateUpdated = {};
                options.dateUpdated.$gte = startDateUpdated;
            }

            if(endDateUpdated){ //if endDateUpdates exists, put in options as an object
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

            if(isDone == true || isDone == false){ //if to be filtered by isDone, put in options as an object
                options.isDone = {};
                options.isDone.$gte = isDone;
                options.isDone.$lte = isDone;
            }

            const data = await Todo //get an array of todos given the options object
                .find(options)
                .limit(parseInt(limit))
                .sort({
                    username: usernameFilter ? 1 : -1,
                    isDone: isDone ? 1 : -1,
                    dateCreated: startDateCreated && !endDateCreated ? 1 : -1,
                    dateUpdated: startDateUpdated && !endDateUpdated ? 1 : -1
                })
                .exec();
            
            if (startDateUpdated && !endDateUpdated){ //if there's a startDateUpdated, force sort to descending order
                data.sort((prev,next) => next.dateUpdated - prev.dateUpdated);
            }

            if (startDateCreated && !endDateCreated){ //if there's a startDateCreated, force sort to descending order
                data.sort((prev,next) => next.dateCreated - prev.dateCreated);
            }
            
            return { //return success and data
                success: true,
                data
            };
        }
    }); 
};
