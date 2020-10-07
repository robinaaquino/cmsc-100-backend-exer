const Fastify = require('fastify');
const { routes } = require('./routes');

/** 
*
* @param {{logger: boolean, trustProxy: boolean}} opts
*@returns {*}
*/
exports.build = async(opts = { logger: false, trustProxy: false}) => {
    //initalize our server using fastify
    const app = Fastify(opts)

    routes(app);

    return app;
}