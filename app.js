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
        *@param {*} req - this is the request parameter that is sent by the client
        */
        handler: async (req) => {
            console.log('Hello World!!!')

            //response in JSON
            return{ success: true }
        }
    });

    return app;
}