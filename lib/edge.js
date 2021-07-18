// Dependencies
const { v4: uuidv4 } = require('uuid');

class Edge {
    constructor({name, type, from, to}) {
        this.id = uuidv4();
        this.name = name;
        this.type = type || 'positive'; // Positive by default
        // An edge is between two nodes
        this.from = from; // The ID of the from node
        this.to = to; // The ID of the to node
    }
}

module.exports = Edge;