/**
 * Task Module (GET get many)
 * - can be done by owner of the tasks or admin type only
- when owner gets, should only return their own tasks
- when admin types, should return all tasks or when there's a filter of username
- both owner and admin can further filter their list by isDone property **finished
- can have a limit with not more than 50. Default is 10. **finished
- each object in the array should have: username, text, isDone , dateUpdated, dateCreated
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
exports.getMany = app => { //arrow function which allows modification of global variables,
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
         * handles the request for a given route
         * 
         * @param {import('fastify').FastifyRequest} request
         */
        handler: async(request) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            const { query, user } = request; //use url to get info
            const { username } = user;
            const { isDone, startDateCreated, endDateCreated, startDateUpdated, endDateUpdated } = query; //whenever we get a query, it's returned as a string so we need to transform it into a number
            var { limit = 10 } = query;

            if(limit > 50){
                limit = 50;
            }

            var options = {};
            if(user.isAdmin != true){
                options = { username };
            }

            if (startDateUpdated){
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

            if(isDone == true || isDone == false){
                options.isDone = {};
                options.isDone.$gte = isDone;
            }

            //check just before 32mins on validation and open api

            const data = await Todo
                .find(options)
                .limit(parseInt(limit))
                .sort({
                    // this forces to start the query on startDate if and when
                    //startDate only exists
                    isDone: isDone ? 1 : -1,
                    dateCreated: startDateCreated && !endDateCreated ? 1 : -1,
                    dateUpdated: startDateUpdated && !endDateUpdated ? 1 : -1
                })
                .exec();
            
            //force sort to do a descending order
            if (startDateUpdated && !endDateUpdated){
                data.sort((prev,next) => next.dateUpdated - prev.dateUpdated);
            }

            if (startDateCreated && !endDateCreated){
                data.sort((prev,next) => next.dateCreated - prev.dateCreated);
            }
            
            return {
                success: true,
                data
            };
        }
    }); 
}; // dont forget semi-colon
