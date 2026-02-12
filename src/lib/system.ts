// Dependencies
import { v4 } from "uuid";
import type {
	EntityType,
	LoopSubType,
	LoopType,
	RelationType,
} from "../global.js";
import Loop from "./loop.js";
import type Relation from "./relation.js";

// Interfaces

interface SystemProps {
	name: string;
}

interface AddLoopProps {
	name: string;
	type: LoopSubType;
	entities: Array<string>;
	relations: Array<string>;
}

/*
	There is a rule in Causal Loop Diagrams that if you count the number of 
	relationships that are negative and that number is even, then the loop is
	reinforcing. If the number is odd, then the loop is balancing.

	I could be wrong, but I think that this assumes that all relationships are
	equal in their effect on entities within a system. I think that this might
	not be the case.
*/
const isEven = (num: number) => num % 2 === 0;

// The System Class

export default class System {
	id: string;
	name: string;
	entities: Array<EntityType>;
	relations: Array<RelationType>;
	loops: Array<LoopType>;

	constructor({ name }: SystemProps) {
		this.id = v4();
		this.name = name;
		this.entities = [];
		this.relations = [];
		this.loops = [];
	}

	addEntity(entity: EntityType) {
		this.entities.push(entity);
	}

	findEntity(id: string) {
		return this.entities.find((e) => e.id === id);
	}

	updateEntity(
		entityId: string,
		entity: Partial<Pick<EntityType, "name" | "type">>,
	) {
		const { name, type } = entity;
		const index = this.entities.findIndex((e) => e.id === entityId);
		if (index === -1) throw new Error("Entity not found");
		if (name) this.entities[index].name = name;
		if (type) this.entities[index].type = type;
	}

	removeEntity(entityId: string) {
		if (!this.findEntity(entityId)) throw new Error("Entity not found");
		// Find any relations that include the entity and remove them
		this.relations = this.relations.filter(
			(r) => r.from !== entityId && r.to !== entityId,
		);
		// Remove the entity
		this.entities = this.entities.filter((e) => e.id !== entityId);
		this.detectLoops();
	}

	addRelation(relation: RelationType) {
		this.relations.push(relation);
	}

	findRelation(id: string) {
		return this.relations.find((r) => r.id === id);
	}

	updateRelation(
		relationId: string,
		relation: Partial<Pick<RelationType, "name" | "from" | "to" | "type">>,
	) {
		const { name, from, to, type } = relation;
		const index = this.relations.findIndex((r) => r.id === relationId);
		if (index === -1) throw new Error("Relation not found");
		if (name) this.relations[index].name = name;
		if (from) this.relations[index].from = from;
		if (to) this.relations[index].to = to;
		if (type) this.relations[index].type = type;
		this.detectLoops();
	}

	removeRelation(relationId: string) {
		if (!this.findRelation(relationId)) throw new Error("Relation not found");
		this.relations = this.relations.filter((r) => r.id !== relationId);
		this.detectLoops();
	}

	addLoop(loop: AddLoopProps) {
		this.loops.push(loop);
	}

	detectLoopType(path: Array<string>) {
		const relations = this.relations.filter((r) => path.includes(r.id));
		const relationTypes = relations.map((r) => r.type);
		if (relationTypes.every((r) => r === "positive")) return "reinforcing";
		// Count the number of negative relations and if it's even, it's reinforcing; if it's odd, it's balancing
		const negativeRelations = relationTypes.filter((r) => r === "negative");
		if (isEven(negativeRelations.length)) return "reinforcing";
		return "balancing";
	}

	detectEntitiesInLoop(path: Array<string>) {
		const entities: Array<string> = [];
		const filteredRelations = this.relations.filter((r) => path.includes(r.id));
		for (const relation of filteredRelations) {
			if (!entities.includes(relation.from)) entities.push(relation.from);
			if (!entities.includes(relation.to)) entities.push(relation.to);
		}
		return entities;
	}

	isClosedLoopRatherThanChain(path: Array<string>) {
		const counts: Record<string, number> = {};
		for (const id of path) {
			const relation = this.relations.find((r) => r.id === id);
			if (!relation) return false;
			const { from, to } = relation;
			if (!counts[from]) counts[from] = 1;
			else counts[from]++;
			if (!counts[to]) counts[to] = 1;
			else counts[to]++;
		}
		const values = Object.values(counts);
		if (values.every((v) => v === 2)) return true;
		return false;
	}

	traverse(relation: Relation, path: Array<string>) {
		const newPath = [...path];
		const { id, to } = relation;

		if (newPath.includes(id)) {
			// We've closed a path. Update an existing loop if it already exists,
			// otherwise create a new one.
			let updatedExisting = false;

			for (let i = 0; i < this.loops.length; i++) {
				const loop = this.loops[i];

				// Same loop if relation sets match (order-agnostic)
				const sameSize =
					Array.isArray(loop.relations) &&
					loop.relations.length === newPath.length;
				const sameSet =
					sameSize &&
					loop.relations.every((rId: string) => newPath.includes(rId));

				if (sameSet) {
					const nextType = this.detectLoopType(newPath);
					const nextEntities = this.detectEntitiesInLoop(newPath);
					// Update in place to preserve loop id and external references
					this.loops[i] = {
						...loop,
						type: nextType,
						entities: nextEntities,
						// relations: newPath, - commented out to preserve the origin order of the loop's relations
					};
					updatedExisting = true;
					break;
				}
			}

			if (!updatedExisting) {
				const nextType = this.detectLoopType(newPath);
				if (this.isClosedLoopRatherThanChain(newPath)) {
					const nextEntities = this.detectEntitiesInLoop(newPath);
					const loop = new Loop({
						name: "Loop",
						type: nextType,
						entities: nextEntities,
						relations: newPath,
					});
					this.loops.push(loop);
				}
			}
		} else {
			newPath.push(id);
			const linkedFromRelations = this.relations.filter((r) => r.from === to);
			if (linkedFromRelations.length === 0) return;
			for (const lfr of linkedFromRelations as Relation[]) {
				this.traverse(lfr, newPath);
			}
		}
	}

	cleanupLoops() {
		// For each loop, check if all the relations still exist
		// If they don't, remove the loop
		this.loops = this.loops.filter((loop: LoopType) => {
			return loop.relations.every((rId: string) => {
				return this.relations.find((r) => r.id === rId);
			});
		});
	}

	detectLoops() {
		for (const relation of this.relations as Relation[]) {
			const path = [relation.id];
			const { to } = relation;
			const linkedFromRelations = this.relations.filter((r) => r.from === to);
			if (linkedFromRelations.length === 0) continue;
			for (const lfr of linkedFromRelations as Relation[]) {
				this.traverse(lfr, path);
			}
		}
		this.cleanupLoops();
	}
}
