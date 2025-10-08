// Dependencies
import { v4 } from "uuid";
import type { LoopSubType } from "../global.js";

interface LoopProps {
	id?: string;
	name: string;
	type: LoopSubType;
	relations?: Array<string>;
	entities?: Array<string>;
}

export default class Loop {
	id: string;
	name: string;
	type: LoopSubType;
	relations: Array<string>;
	entities: Array<string>;

	constructor({ id, name, type, relations, entities }: LoopProps) {
		this.id = id || v4();
		this.name = name;
		this.type = type;
		this.relations = relations || [];
		this.entities = entities || [];
	}
}
