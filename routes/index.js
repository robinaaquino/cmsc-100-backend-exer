const { todo } = require('./todo');
const { user } = require('./user');
const { definitions } = require('../definitions');
const { SuccessResponse } = definitions;

/**
 * initialize all the routes
 * @param {*} app 
 */


exports.routes = (app) => {
    app.get('/', { //if you pass an object in a function, you're doing pass by reference, who knew that? i didnt
        schema: {
            description: 'Server root route',
            tags: ['Root'],
            summary: 'Server root route',
            response: {
                200: SuccessResponse
            }
        },
        /**     
        *handles the request for a given route which is get
        */
        handler: async (req) => {
            //response in JSON
            return{ success: true }
        }
    });

    todo(app);
    user(app);
}