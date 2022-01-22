// Dependencies
import { v4 } from 'uuid';

type EntityType = 'quantifiable' | 'non-quantifiable';

interface EntityProps {
    name: string;
    type: EntityType; 
}

class Entity {
    id: string;
    name: string;
    type: EntityType;

    constructor({ name, type }:EntityProps) {
        this.id = v4();
        this.name = name;
        this.type = type;
    }
}

module.exports = Entity;