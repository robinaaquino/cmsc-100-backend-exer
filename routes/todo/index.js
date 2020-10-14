const { create } = require('./create');
const { getMany } = require('./get-many'); //imports todos from the other js files in routes
const { get } = require('./get');
const { update } = require('./update');
const { deleteOne } = require('./delete');

/**
 * initialize all the routes for todo
 * @param {*} app 
 */


exports.todo = (app) => {
   create(app);
   getMany(app);
   get(app);
   update(app);
   deleteOne(app);
}