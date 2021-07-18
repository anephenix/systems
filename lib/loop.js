// Dependencies
const { v4: uuidv4 } = require('uuid');

class Loop {
    constructor({name,type}) {
        this.id = uuidv4();
        this.name = name;
        this.type = type || 'balancing'; // Balancing or reinforcing
        this.edges = [];
        this.nodes = [];
    }
}

module.exports = Loop;