const Fastify = require('fastify');
const { routes } = require('./routes');
const { connect } = require('./db');

/** 
*
* @param {{logger: boolean, trustProxy: boolean}} opts
*@returns {*}
*/
exports.build = async(opts = { logger: false, trustProxy: false}) => {
    //initalize our server using fastify
    const app = Fastify(opts)

    await connect();

    routes(app);

    return app;
}