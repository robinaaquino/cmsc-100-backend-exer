const { create } = require('./create');
const { login } = require('./login');

/**
 * initialize all the routes for todo
 * @param {*} app 
 */


exports.user = (app) => {
   create(app);
   login(app);
}