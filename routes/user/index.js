const { create } = require('./create');
const { login } = require('./login');
const { logout } = require('./logout');
const { auth } = require('./auth');
const { get } = require('./get');
const { deleteOne } = require('./delete'); 

/**
 * initialize all the routes for todo
 * @param {*} app 
 */


exports.user = (app) => {
   create(app);
   login(app);
   auth(app);
   logout(app);
   get(app);
   deleteOne(app);
}