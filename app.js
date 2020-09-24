const Fastify = require('fastify');
const { routes } = require('./routes');

/** 
*
* @param {{logger: boolean, trustProxy: boolean}} opts
*@returns {*}
*/
exports.build = async(opts = { logger: true, trustProxy: true}) => {
    //initalize our server using fastify
    const app = Fastify(opts)

    routes(app);

    return app;
}