const { mongoose, User } = require('../../db');
const { build } = require('../../app');
const should = require('should');
require('tap').mochaGlobals();

describe('For the route for creating a user POST: (/user', () => {
    let app;
    const usernames = [];
    
    before(async () => {
        app = await build();
        for(let i = 0; i < 1; i++){
            const response = await app.inject({
                method: 'POST',
                url: '/user',
                payload: {
                    username: `user${i}`,
                    firstName: 'test',
                    lastName: 'test',
                    password: 'passwordpassword'
                }
            });

            const data = await User.findOne().sort({ dateCreated: -1 }).limit(1).exec();
            const { username } = data;

            usernames.push(username);

        }
    });

    after(async () => {
        for(const username of usernames){
            await User.findOneAndDelete({ username });
        }

        await mongoose.connection.close();
    });

    it('it should return { success: true, data: jwt } and has a status code of 200 when called using POST', async() => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: usernames[0],
                password: 'passwordpassword'
            }
        })

        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;
        
        success.should.equal(true);
        statusCode.should.equal(200);
        should.exist(data);
    })

    //non-happy
    it('it should return { success: true, message: error message } and has a status code of 401 when called using POST and there\'s no username in payload', async() => {
        const response = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                password: 'passwordpassword'
            }
        })

        const payload = response.json();
        const { statusCode } = response;
        const { success, message } = payload;

        statusCode.should.equal(400);
        success.should.equal(false);
        should.exist(message);
    })
})