const { mongoose, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for authenticating a user: (/auth', () => {
    let app;
    let authorization;
    const usernames = [];
    let tokenInput;
    
    before(async () => {
        app = await build();
        
        const payload = {
            username: `testuser7`,
            firstName: 'test',
            lastName: 'test',
            password: 'passwordpassword'
        }

        await app.inject({
            method: 'POST',
            url: '/user',
            payload
        });

        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload
        })

        const { data: token } = response.json();

        tokenInput = token;

        authorization = `Bearer ${token}`;

        const data = await User.findOne().sort({ dateCreated: -1 }).limit(1).exec();

        const { username } = data;

        usernames.push(username);
        
    });

    after(async () => {
        for(const username of usernames){
            await User.findOneAndDelete({ username });
        }

        await mongoose.connection.close();
    });

    it('it should return { success: true } and has a status code of 200 when called using GET', async() => {
        const response = await app.inject({
            method: 'GET',
            url: `/auth?tokenQuery=${tokenInput}`,
            headers: {
                authorization
            }
        })

        const payload = response.json();
        const { statusCode } = response;
        const { success } = payload;
        
        console.log(payload);

        success.should.equal(true);
        statusCode.should.equal(200);
    })

    //non-happy
    it('it should return { success: false, message: error message } and has a status code of 401 when called using GET and there\'s no token in query', async() => {
        const response = await app.inject({
            method: 'GET',
            url: `/auth?tokenQuery=null`,
            headers: {
                authorization
            }
        })

        const payload = response.json();
        const { statusCode } = response;
        const { success, message } = payload;

        statusCode.should.equal(401);
        success.should.equal(false);
        should.exist(message);
    })
})