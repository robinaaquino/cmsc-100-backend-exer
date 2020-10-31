const Fastify = require('fastify');
const swagger = require('fastify-swagger');
const sensible = require('fastify-sensible');
const { errorHandler } = require('./error-handler');
const { definitions } = require('./definitions');
const { routes } = require('./routes');
const { connect } = require('./db');
const { name: title, description, version } = require('./package.json');

/** 
*
* @param {{logger: boolean, trustProxy: boolean}} opts
*@returns {*}
*/
exports.build = async(opts = { logger: false, trustProxy: false}) => {
    //initalize our server using fastify
    const app = Fastify(opts)

    app.register(sensible).after(() => {
        app.setErrorHandler(errorHandler);
    });

    app.register(swagger, {
        routePrefix: '/docs',
        exposeRoute: true,
        swagger: {
            info: {
                title,
                description,
                version
            },
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
            definitions
        }
    })

    await connect();

    routes(app);

    return app;
}