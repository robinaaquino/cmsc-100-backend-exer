//idea here is to get all the files
const { getTodos } = require('./../../lib/get-todos'); //if getTodos is grey, means unused, if blue, does not exist
const { join } = require('path'); 
//always check the variables here if true or beforeEach gets automatically added

/**
 * Gets many todos
 * 
 * @param {*} app 
 */
exports.getMany = app => { //arrow function which allows modification of global variables,
    /**
     * This gets the todos from the database
     */
    app.get('/todo', (request) => { //since we aren't using responses?? might need to consult what this means, request allows pagination
        const encoding = 'utf8';
        const filename = join(__dirname, '../../database.json'); //__dirname gets current directory, you can't just combine strings and expect it to be a path here so as such, make sure it's double underline
        const todos = getTodos(filename, encoding); //which is basically getting the function from ../../lib/get-todos, to read the database
        const data = []; //initialize an array
    
        for(const todo of todos) {
            data.push(todo);
        };
    
        return {
            success: true,
            data
        };
    }); 
}; // dont forget semi-colon
