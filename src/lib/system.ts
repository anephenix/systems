// Dependencies
const { v4: uuidv4 } = require('uuid');

interface SystemProps {
    name: string;
}

interface AddEntityProps {
    entity: any;
}

interface AddRelationProps {
    relation: any;
}

class System {

    id: string;
    name: string;
    entities: Array<any>;
    relations: Array<any>;

    constructor({name}:SystemProps) {
        this.id = uuidv4();
        this.name = name;
        this.entities = [];
        this.relations = [];
    }

    addEntity(entity:AddEntityProps) {
        this.entities.push(entity);
    }

    addRelation(relation:AddRelationProps) {
        this.relations.push(relation);
    }
}

module.exports = System;