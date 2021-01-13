const { mongoose } = require('../db');
const { build } = require('../app');
require('tap').mochaGlobals();
require('should');

describe('For the route for root (/)', () => {
    let app;

    before(async() => {
        //initialize backend application
        app = await build();
    });

    after(async () => {
        //close the connection to the database
        await mongoose.connection.close();
    });

    it('it should return { sucess: true} and has a status code of 200 when called using GET', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/'
        });

        const payload = response.json();
        const { statusCode } = response;
        const{ success } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
    });
});