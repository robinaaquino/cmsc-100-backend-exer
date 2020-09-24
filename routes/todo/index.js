const { create } = require('./create');

/**
 * initialize all the routes for todo
 * @param {*} app 
 */


exports.todo = (app) => {
   create(app);
}