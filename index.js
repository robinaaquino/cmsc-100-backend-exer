//"start": "npx nodemon"
//previous line for "start": "node index.js"

const Fastify = require('fastify');

//initialize server thru fastify
const server = Fastify({
    logger: true,
    trustProxy: true
});
//access http://localhost/
server.get('/', {


    /**     
    *@param {*} req - this is the request parameter that is sent by the client
    */
    handler: async (req) => {
        console.log('Hello World!!!')

        //response in JSON
        return{ success: true }
    }
});

async function start() {
    //get port from environment variable
    //export PORT = 8000 & node index.js
    //then port = 8000 else default is 8080
    const port = parseInt(process.env.PORT || '8080');
    const address = '0.0.0.0';

    const addr = await server.listen(port, address);
    console.log('Listening on ${addr}');
}

//JSON used in res api, respond with state of the server
start();