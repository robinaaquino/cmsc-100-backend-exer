const mongoose = require('mongoose');

//setup a connection configuration to the mongodb instance
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/**
 * This creates a connection to the database
 * @returns { Promise }
 */
exports.connect = () => new Promise((resolve, rejct) => {
    const { connection } = mongoose;
    connection.on('error', reject);
    connection.once('open', resolve);
});

exports.Todo = require('./models/todo')(mongoose);
exports.mongoose = mongoose;