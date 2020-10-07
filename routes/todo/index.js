const { create } = require('./create');
const { getMany } = require('./get-many'); //imports todos from the other js files in routes

/**
 * initialize all the routes for todo
 * @param {*} app 
 */


exports.todo = (app) => {
   create(app);
   getMany(app);
}