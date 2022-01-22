// Dependencies
import { v4 } from 'uuid';

interface RelationProps {
    name: string;
    type: 'positive' | 'negative';
    from: string;
    to: string;
}

class Relation {
    id: string;
    name: string;
    type: 'positive' | 'negative';
    from: string;
    to: string;

    constructor({name, type, from, to}:RelationProps) {
        this.id = v4();
        this.name = name;
        this.type = type || 'positive'; // Positive by default
        // An edge is between two entities
        this.from = from; // The ID of the from entity
        this.to = to; // The ID of the to entity
    }
}

module.exports = Relation;