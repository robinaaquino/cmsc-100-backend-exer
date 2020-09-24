const Fastify = require('fastify');

/** 
*
* @param {{logger: boolean, trustProxy: boolean}} opts
*@returns {*}
*/
exports.build = async(opts = { logger: true, trustProxy: true}) => {
    //initalize our server using fastify
    const app = Fastify(opts)

    //access http://localhost/
    app.get('/', {

        /**     
        *handles the request for a given route which is get
        */
        handler: async (req) => {
            //response in JSON
            return{ success: true }
        }
    });

    return app;
}