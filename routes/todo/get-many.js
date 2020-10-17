const { Todo } = require('../../db');

/**
 * Gets many todos
 * 
 * @param {*} app 
 */
exports.getMany = app => { //arrow function which allows modification of global variables,
    /**
     * This gets the todos from the database
     * 
     * @param {import('fastify').FastifyRequest} request
     */
    app.get('/todo', async(request) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
        const { query } = request; //use url to get info
        const { limit = 3, startDate } = query; //whenever we get a query, it's returned as a string so we need to transform it into a number

        //if there is a start date, the query
        //should search the dateUpdated property
        //if dateUpdated is greater than or equal
        //to the startDate
        //
        //if there is no startDate, it will search for
        //all given the limit
        const options = startDate
            ? {
                dateUpdated: {
                    $gte: startDate
                }
            }
            : {};

        const data = await Todo
            .find(options)
            .limit(parseInt(limit))
            .sort({
                dateUpdated: -1
            })
            .exec();
    
        return {
            success: true,
            data
        };
    }); 
}; // dont forget semi-colon
