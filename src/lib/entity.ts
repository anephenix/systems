// Dependencies
import { v4 } from 'uuid';
import { EntitySubType } from '../global';

interface EntityProps {
    name: string;
    type: EntitySubType; 
}

export default class Entity {
	id: string;
	name: string;
	type: EntitySubType;

	constructor({ name, type }:EntityProps) {
		this.id = v4();
		this.name = name;
		this.type = type;
	}
}