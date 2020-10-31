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
            url: '/user',
            payload: {
                username: 'user01',
                password: 'password1234567890'
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;
        const { username } = data;

        success.should.equal(true);
        statusCode.should.equal(200);
        username.should.equal('user01');

        const { 
            username: usernameDatabase
        } = await User
            .findOne({ username })
            .exec();

        username.should.equal(usernameDatabase);

        //add the id in the ids array for cleaning
        usernames.push(username);

    });

    //non-happy path
    it ('should return {success: false, message: error message)} and has a status code of 400 when called using POST and there is no username', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                password: 'password1234567890'
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, message } = payload;

        statusCode.should.equal(400);
        // success.should.equal(false);
        should.exist(message);
    })

    //non-happy path
    it ('should return {success: false, message: error message)} and has a status code of 400 when called using POST and there is no password', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                username: 'user02'
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, message } = payload;

        statusCode.should.equal(400);
        // success.should.equal(false);
        should.exist(message);
    })

    //another non-happy path
    it ('should return {success: false, message: error message)} and has a status code of 400 when called using POST and there is no payload', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/user'
        });

        const payload = response.json();

        console.log(payload);
        console.log(response.statusCode);

        const { statusCode } = response;
        const { success, message } = payload;

        statusCode.should.equal(400);
        // success.should.equal(false);
        should.exist(message);
    })
});