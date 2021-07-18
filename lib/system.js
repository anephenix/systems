// Dependencies
const { v4: uuidv4 } = require('uuid');

class System {
    constructor({name}) {
        this.id = uuidv4();
        this.name = name;
        this.nodes = [];
        this.edges = [];
        // A system can have many nodes
    }

    addNode(node) {
        this.nodes.push(node);
    }

    addEdge(edge) {
        this.edges.add(edge);
    }
}

module.exports = System;