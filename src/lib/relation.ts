// Dependencies
import { v4 } from 'uuid';

import { RelationSubType } from '../global';

interface RelationProps {
    name: string;
    type: RelationSubType;
    from: string;
    to: string;
}

export default class Relation {
	id: string;
	name: string;
	type: RelationSubType;
	from: string;
	to: string;

	constructor({name, type, from, to}:RelationProps) {
		this.id = v4();
		this.name = name;
		this.type = type || 'positive'; // Positive by default
		// An edge is between two entities
		this.from = from; // The ID of the from entity
		this.to = to; // The ID of the to entity
		this.validate();
	}

	validate() {
		if (this.from === this.to) {
			throw new Error('The from and to entities cannot be the same');
		}
	}
}