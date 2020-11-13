/**
 * Task Module (GET get many)
 * - can be done by owner of the tasks or admin type only
- when owner gets, should only return their own tasks
- when admin types, should return all tasks or when there's a filter of username
- both owner and admin can further filter their list by isDone property
- can have a limit with not more than 50. Default is 10.
- each object in the array should have: username, text, isDone , dateUpdated, dateCreated
- it should sort the array in terms of dateCreated or dateUpdated in a descending order only
- it should do pagination in terms of startDateCreated, endDateCreated, startDateUpdated, endDateUpdated (all can be used in one query)
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
            const { limit = 3, startDate, endDate } = query; //whenever we get a query, it's returned as a string so we need to transform it into a number

            const options = {
                username
            };

            if (startDate){
                options.dateUpdated = {};
                options.dateUpdated.$gte = startDate;
            }

            if(endDate){
                options.dateUpdated = options.dateUpdated || {};
                options.dateUpdated.$lte = endDate;
            }

            //check just before 32mins on validation and open api

            const data = await Todo
                .find(options)
                .limit(parseInt(limit))
                .sort({
                    // this forces to start the query on startDAte if and when
                    //startDate only exists
                    dateUpdated: startDate && !endDate ? 1 : -1
                })
                .exec();
            
            //force sort to do a descending order
            if (startDate && !endDate){
                data.sort((prev,next) => next.dateUpdated - prev.dateUpdated);
            }
            
            return {
                success: true,
                data
            };
        }
    }); 
}; // dont forget semi-colon
