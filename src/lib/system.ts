// Dependencies
import { v4 } from 'uuid';
import Relation from './relation';
import { EntityType, RelationType, LoopSubType, LoopType } from '../global';

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

// The System Class

export default class System {
	id: string;
	name: string;
	entities: Array<EntityType>;
	relations: Array<RelationType>;
	loops: Array<LoopType>;

	constructor({name}:SystemProps) {
		this.id = v4();
		this.name = name;
		this.entities = [];
		this.relations = [];
		this.loops = [];
	}

	addEntity(entity:EntityType) {
		this.entities.push(entity);
	}

	addRelation(relation:RelationType) {
		this.relations.push(relation);
	}

	addLoop(loop:AddLoopProps) {
		this.loops.push(loop);
	}

	detectLoopType(path:Array<string>) {
		const relations = this.relations.filter(r => path.includes(r.id));
		const negativeAmount = relations.map(r => r.type === 'negative').length;
		if (negativeAmount === 0 || negativeAmount % 2 === 0) return 'reinforcing';
		return 'balancing';
	}

	detectEntitiesInLoop(path:Array<string>) {
		const entities:Array<string> = [];
		this.relations.filter(r => path.includes(r.id)).forEach(relation => {
			if (!entities.includes(relation.from)) entities.push(relation.from);
			if (!entities.includes(relation.to)) entities.push(relation.to);
		});
		return entities;
	}

	traverse(relation:Relation, path:Array<string>) {
		const { id, to } = relation;
		if (path.includes(id)) {
			// We have looped, now check if the system has that loop, albeit in a different order?
			let matchFound = false;
			this.loops.forEach((loop:any) => {
				if (loop.relations.every((rId:string) => path.includes(rId))) {
					matchFound = true;
				}
			});
			if (!matchFound) {
				const type = this.detectLoopType(path);
				const entities = this.detectEntitiesInLoop(path);
				this.loops.push({type, relations: path, entities});
			}
		} else {
			path.push(relation.id);
			const linkedFromRelations = this.relations.filter(r => r.from === to);
			// No links onwards, end the loop
			if (linkedFromRelations.length === 0) return;
			// send the path and the linkedFromRelations to the next function
			linkedFromRelations.forEach((lfr:Relation) => {
				this.traverse(lfr, path);
			});    
		}
	}

	detectLoops() {
		// for each relation in the system
		// take the first one
		this.relations.forEach((relation:Relation) => {
			const path:Array<string> = [];
			path.push(relation.id);
			const { to } = relation;
			const linkedFromRelations = this.relations.filter(r => r.from === to);
			// No links onwards, end the loop
			if (linkedFromRelations.length === 0) return;
			linkedFromRelations.forEach((lfr:Relation) => {
				this.traverse(lfr, path);
			});
		});
	}
}