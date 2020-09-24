const { todo } = require('./todo');

/**
 * initialize all the routes
 * @param {*} app 
 */


exports.routes = (app) => {
    app.get('/', { //if you pass an object in a function, you're doing pass by reference, who knew that? i didnt

        /**     
        *handles the request for a given route which is get
        */
        handler: async (req) => {
            //response in JSON
            return{ success: true }
        }
    });

    todo(app);
}