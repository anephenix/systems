// Dependencies
import { v4 } from "uuid";
import type { EntitySubType } from "../global.js";

interface EntityProps {
	name: string;
	type: EntitySubType;
}

export default class Entity {
	id: string;
	name: string;
	type: EntitySubType;

	constructor({ name, type }: EntityProps) {
		this.id = v4();
		this.name = name;
		this.type = type;
		this.validate();
	}

	validate() {
		if (this.type !== "quantifiable" && this.type !== "non-quantifiable") {
			throw new Error(
				"Invalid entity type - must be either quantifiable or non-quantifiable",
			);
		}
	}
}
