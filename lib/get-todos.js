const { readFileSync } = require('fs');

/**
 * This reads the file and gets the todos
 * @param {string} filename 
 * @param {string} encoding
 * @returns {[{done: boolean, id: string, text: string}]} 
 */
exports.getTodos = (filename, encoding) => {
    const databaseString = readFileSync(filename, encoding );
    const database = JSON.parse(databaseString);
    const{ todos } = database;
    return todos;
}