const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for getting one user GET: (/user/:userId)', () => {
    let app;
    let authorization = '';
    const usernames = [];

    before(async () => {
        app = await build();

        const payload = {
            username: 'testuser5',
            firstName: 'test',
            lastName: 'test',
            password: 'passwordpassword'
        }

        await app.inject({
            method: 'POST',
            url: '/user',
            payload
        })

        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload
        });

        const { data: token } = response.json();

        authorization = `Bearer ${token}`;

        const data = await User.findOne({ username: 'testuser5' }).exec();
        usernames.push(data.username);
    });

    after(async () =>{
        await User.findOneAndDelete({ username: 'testuser3' });

        await mongoose.connection.close();
    })

    it('it should return { success: true, data: user } and has a status code of 200 when called using GET', async () => {
        const userIdFilter = usernames[0];

        const response = await app.inject({
            method: 'GET',
            url: `/user/${usernames[0]}`,
            headers: {
                authorization
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;
        const { username, firstName, lastName } = data;

        const user = await User.findOne({ username: userIdFilter }).exec();

        statusCode.should.equal(200);
        success.should.equal(true);
        username.should.equal(user.username);
        firstName.should.equal(user.firstName);
        lastName.should.equal(user.lastName);

    });

    it('it should return { success: false, message: error message } and has a status code of 404 when called using GET and the username of the user is non-existing', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/todo/non-existing-id`,
            headers: {
                authorization
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, code, message } = payload;

        success.should.equal(false);
        statusCode.should.equal(404);

        should.exists(code);
        should.exists(message);
    })
})