// Dependencies
const { v4 } = require('uuid');

interface EntityProps {
    name: string;
    type: 'quantifiable' | 'non-quantifiable'; 
}

class Entity {
    id: string;
    name: string;
    type: 'quantifiable' | 'non-quantifiable';

    constructor({ name, type }:EntityProps) {
        this.id = v4();
        this.name = name;
        this.type = type;
    }
}

module.exports = Entity;