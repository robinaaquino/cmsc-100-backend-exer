const { create } = require('./create');
const { login } = require('./login');
const { logout } = require('./logout');
const { auth } = require('./auth');
const { get } = require('./get');
const { deleteOne } = require('./delete');
const { getMany } = require('./get-many'); 
const { update } = require('./update');
const { refresh } = require('./refresh-token');

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
   getMany(app);
   update(app);
   refresh(app);
}