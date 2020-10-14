const { create } = require('./create');
const { getMany } = require('./get-many'); //imports todos from the other js files in routes
const { get } = require('./get');

/**
 * initialize all the routes for todo
 * @param {*} app 
 */


exports.todo = (app) => {
   create(app);
   getMany(app);
   get(app);
}