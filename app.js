const Fastify = require('fastify');
const swagger = require('fastify-swagger');
const sensible = require('fastify-sensible');
const jwt = require('fastify-jwt');
const { readFileSync } = require('fs');
const { errorHandler } = require('./error-handler');
const { definitions } = require('./definitions');
const { routes } = require('./routes');
const { connect } = require('./db');
const { name: title, description, version } = require('./package.json');

const audience = 'this-audience';
const issuer = 'localhost';

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

    app.register(jwt, {
        secret: {
            private: readFileSync('./cert/keyfile', 'utf8'), //at 5 mins
            public: readFileSync('./cert/keyfile.key.pub', 'utf8')
        },
        sign: {
            algorithm: 'RS256',
            audience,
            issuer,
            expiresIn: '1h'
        },
        verify: {
            audience,
            issuer
        }
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