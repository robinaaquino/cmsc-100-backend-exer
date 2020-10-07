/**
 * Delays the run of the next code line
 * @param {number} delay 
 */
exports.delay = (delay) => new Promise(resolve => setTimeout(resolve, delay));