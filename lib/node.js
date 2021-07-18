// Dependencies
const { v4: uuidv4 } = require('uuid');

class Node {
    constructor({ name, type }) {
        this.id = uuidv4();
        this.name = name;
        this.type = type; // quantifiable, non-quantifiable - might be good to get typescript to verify this
    }
}

module.exports = Node;