// Dependencies
const uuid = require('uuid');

interface LoopProps {
    name: string;
    type: 'reinforcing' | 'balancing';
}

class Loop {

    id: string;
    name: string;
    type: 'reinforcing' | 'balancing';
    relations: Array<string>;
    entities: Array<string>;

    constructor({name,type}:LoopProps) {
        this.id = uuid.v4();
        this.name = name;
        this.type = type || 'balancing'; // Balancing or reinforcing
        this.relations = [];
        this.entities = [];
    }
}

module.exports = Loop;