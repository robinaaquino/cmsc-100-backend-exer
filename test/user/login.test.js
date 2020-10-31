const { mongoose, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();


describe('For the route for creating a user POST: (/user)', () => {
    let app;
    const usernames = [];


    before(async() => {
        //initialize backend application
        app = await build();

        for(let i = 0; i<1; i++){
            const response = await app.inject({
                method: 'POST',
                url: '/user',
                payload: {
                    username: `user ${i}`, //usage of backticks for addresses
                    password: 'password1234567890'
                }
            });

            const payload = response.json();
            const { data } = payload;
            const { username } = data; //we need ids

            usernames.push(username); //allows the deletion later on
        }

        //best case is to use a control data set
    })

    after(async () => {
        //clean up the database
        for (const username of usernames){
            await User.findOneAndDelete({ username });
        }

        await mongoose.connection.close();
    });

    //happy path
    it('it should return { success: true, data: (new user object)} and has a status code of 200 when called using POST', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: usernames[0],
                password: 'password1234567890'
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;
        // const { username } = data;

        success.should.equal(true);
        statusCode.should.equal(200);
        // username.should.equal('user01');
    });

    //non-happy path
    it ('should return {success: false, message: error message)} and has a status code of 401 when called using POST and we use a different password', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: usernames[0],
                password: 'password123'
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, message } = payload;

        statusCode.should.equal(401);
        success.should.equal(false);
        should.exist(message);
    })
});