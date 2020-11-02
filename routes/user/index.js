const { create } = require('./create');
const { login } = require('./login');
const { logout } = require('./logout');
const { auth } = require('./auth');

/**
 * initialize all the routes for todo
 * @param {*} app 
 */


exports.user = (app) => {
   create(app);
   login(app);
   auth(app);
   logout(app);
}