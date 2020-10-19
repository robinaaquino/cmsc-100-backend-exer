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
            }
        },
        
        /**
         * handles the request for a given route
         * 
         * @param {import('fastify').FastifyRequest} request
         */
        handler: async(request) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
            const { query } = request; //use url to get info
            const { limit = 3, startDate, endDate } = query; //whenever we get a query, it's returned as a string so we need to transform it into a number

            const options = {};

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
