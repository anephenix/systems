// Dependencies
import { v4 } from 'uuid';
import { LoopSubType } from '../global';

interface LoopProps {
    name: string;
    type: LoopSubType;
}

export default class Loop {
	id: string;
	name: string;
	type: LoopSubType;
	relations: Array<string>;
	entities: Array<string>;

	constructor({name,type}:LoopProps) {
		this.id = v4();
		this.name = name;
		this.type = type;
		this.relations = [];
		this.entities = [];
	}
}