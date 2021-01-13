//"start": "npx nodemon"
//previous line for "start": "node index.js"

const { build } = require('./app');


/**
*starts the application
*/
async function start() {
    //calls to build an app
    const app = await build({
        logger: true,
        trustProxy: true
    });

    //get port from environment variable
    //export PORT = 8000 & node index.js
    //then port = 8000 else default is 8080
    const port = parseInt(process.env.PORT || '8080');
    const address = '0.0.0.0';

    const addr = await app.listen(port, address);
    console.log('Listening on ${addr}');
}

//JSON used in res api, respond with state of the server
start();