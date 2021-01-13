const { mongoose, Todo, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for deleting one todo DELETE: (/todo/:id', () => {
    let app;
    let authorization;
    const usernames = [];

    before(async() => {
        app = await build();

        const payload = {
            username: 'testuser1',
            firstName: 'test',
            lastName: 'test',
            password: 'passwordpassword'
        }

        await app.inject({
            method: 'POST',
            url: '/user',
            payload
        });

        const data = await User.findOne().sort({ dateCreated: -1 }).limit(1).exec();
        const { username } = data;

        usernames.push(username);

        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload
        });

        const { data: token } = response.json();

        authorization = `Bearer ${token}`;
    });

    after(async () => {
        for(const username of usernames) {
            await User.findOneAndDelete({ username });
        }

        await User.findOneAndDelete({
            username: 'testuser1'
        });

        await mongoose.connection.close();
    });

    //happy path
    it('it should return { success: true } and has a status code of 200 when called using DELETE', async() => {
        const username = usernames[0];

        const response = await app.inject({
            method: 'DELETE',
            url: `user/${usernames[0]}`,
            headers: {
                authorization
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success } = payload;

        console.log(payload);
        
        success.should.equal(true);
        statusCode.should.equal(200);

        const user = await User
            .findOne({ username })
            .exec();

        should.not.exists(user);
    })

    //non happy-path
    it('it should return { success: false, message: error message } and has a status code of 401 when called using DELETE and the username of the user is non-existing', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `user/non-existing-id`,
            headers: {
                authorization
            }
        });

        const payload = response.json();
        const { statusCode } = response;
        const { success, code, message } = payload;
        
        success.should.equal(false);
        statusCode.should.equal(401);

        should.exists(code);
        should.exists(message);
    })
})