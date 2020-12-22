const fastify = require('fastify');
const swagger = require('fastify-swagger');
const sensible = require('fastify-sensible');
const auth = require('fastify-auth');
const jwt = require('fastify-jwt');
const cookie = require('fastify-cookie');
const session = require('fastify-session');
const cors = require('fastify-cors');
const { readFileSync } = require('fs');
const { errorHandler } = require('./error-handler');
const { definitions } = require('./definitions');
const { routes } = require('./routes');
const { connect, User, DiscardedToken } = require('./db');
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
    const app = fastify(opts);

    app.register(cors, {
        origin: true, //can call this api anywhere
        credentials: true //we can use session cookie for this one, allows web app to send cookies for auth
    })

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

    app.register(cookie);
    app.register(session, {
        cookieName: 'sessionToken',
        secret: readFileSync('./cert/keyfile', 'utf8'),
        cookie: {
            secure: false, //http is false https is true
            httpOnly: true
        },
        maxAge: 60 * 60 * 1000 //one hour
    });

    await app
        .decorate('verifyJWT', async (request, response) => {
        const { headers, session } = request;
        const { authorization } = headers;
        const { token: cookieToken } = session;
        
        let authorizationToken;

        if(!authorization && !cookieToken){
            return response.unauthorized('auth/no-authorization-header')
        }

        if(authorization){ //why not use else?
            //expecting to have the authorization to be "Bearer [token]"
            //that means if we split it, we create '' (Bearer ) 'token'
            //then we just get the second element of that array
            [, authorizationToken] = authorization.split('Bearer ');
        }

        const token = authorizationToken || cookieToken;

        try {
            await app.jwt.verify(token);
            const { username } = app.jwt.decode(token);

            const discarded = await DiscardedToken.findOne({ username, token }).exec()

            if (discarded){
                return response.unauthorized('auth/discarded');
            }

            const user = await User.findOne({ username }).exec();

            if(!user){
                return response.unauthorized('auth/no-user');
            }

            //save the user and token here, used for logout.js
            request.user = user;
            request.token = token;
        } catch(error){
            console.error(error);

            if(error.message === 'jwt expired'){
                return response.unauthorized('auth/expired');
            }
            return response.unauthorized('auth/unauthorized');
        }
    })
    .register(auth);

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
            definitions,
            securityDefinitions: {
                bearer: {
                    type: 'apiKey',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'authorization',
                    in: 'header'
                }
            }
        }
    })

    await connect();

    routes(app);

    return app;
}