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
     * 
     * @param {import('fastify').FastifyRequest} request
     */
    app.get('/todo', (request) => { //since we aren't using responses?? might need to consult what this means, request allows pagination, get method will not read the payload so we use query params
        const { query } = request; //use url to get info
        const { limit = 3, startDate } = query;
        const encoding = 'utf8';
        const filename = join(__dirname, '../../database.json'); //__dirname gets current directory, you can't just combine strings and expect it to be a path here so as such, make sure it's double underline
        const todos = getTodos(filename, encoding); //which is basically getting the function from ../../lib/get-todos, to read the database
        const data = []; //initialize an array
    
        if (!startDate){
            //if there is no startDate, we should sort the todos in a descending order based on
            //dateUpdated
            todos.sort((prev,next) => next.dateUpdated - prev.dateUpdated); //makes the first item to be the latest item
        } else{
            todos.sort((prev,next) => prev.dateUpdated - next.dateUpdated);
        }

        for(const todo of todos) {
            //if there is no startDate (which is default)
            //or the todoUpdated is within the startDate range
            //it should do inside
            if(!startDate || startDate <= todo.dateUpdated){ //if we have a starting date, we start at startItem first
                //if data.length is still below the specified limit
                if(data.length < limit) {
                    data.push(todo);
                }
            } //if params give a startDate

        };
        
        //if we want to sort it in a descending order
        //we should put next first and subtract it with
        //the previous.
        data.sort((prev, next) => next.dateUpdated - prev.dateUpdated);

        return {
            success: true,
            data
        };
    }); 
}; // dont forget semi-colon
