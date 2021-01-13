const { mongoose, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for creating a user POST: (/user)', () => {
    let app;
    const usernames = [];

    before(async () => {
        app = await build();
    });

    after(async () => {
        for(const username of usernames){
            await User.findOneAndDelete({ username });
        }

        await mongoose.connection.close();
    });

    //happy path
    it('it should return { success: true } and has a status code of 200 when called using POST', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                username: 'user01',
                firstName: 'test',
                lastName: 'test',
                password: 'passwordpassword'
            }
        });

        const data = await User.findOne().sort({ dateCreated: -1 }).limit(1).exec(); //finding the most recent addition to User database
        const { username } = data;

        const payload = response.json();
        const { statusCode } = response;
        const { success } = payload;

        success.should.equal(true);
        statusCode.should.equal(200);
        username.should.equal('user01');

        const {
            username: usernameDatabase
        } = await User
            .findOne({ username })
            .exec();

        username.should.equal(usernameDatabase);

        usernames.push(username);
    })

    //non-happy path
    it('it should return { success: false, message: error message } and has a status code of 400 when called using POST and there is no username', async() => {
        const response = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                password: 'passwordpassword'
            }
        })

        const payload = response.json();
        const { statusCode } = response;
        const { success, message } = payload;

        success.should.equal(false);
        statusCode.should.equal(400);
        should.exist(message);
    })
})