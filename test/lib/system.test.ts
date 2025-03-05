// Dependencies
import { System, Entity, Relation } from '../../dist/lib';
import { beforeEach } from 'mocha';
import assert from 'assert';

describe('system', () => {

	let system;

	beforeEach(() => {
		system = new System({name: 'Financial market'});
	});

	it('should have a unique id', () => {
		assert(system.id !== undefined);
		assert.strictEqual(system.id.length, 36);
	});
	it('can have a name', () => {
		assert.strictEqual(system.name, 'Financial market');
	});

	it('can have multiple entities', () => {
		const entity1 = new Entity({name: 'Revenue', type: 'quantifiable'});
		const entity2 = new Entity({name: 'Costs', type: 'quantifiable'});
		system.addEntity(entity1);
		system.addEntity(entity2);
		assert.strictEqual(system.entities.length, 2);
	});

	it('can have multiple relations', () => {
		const entity1 = new Entity({name: 'Revenue', type: 'quantifiable'});
		const entity2 = new Entity({name: 'Costs', type: 'quantifiable'});
		const relation = new Relation({name: 'Revenue impact on costs', type: 'positive', from: entity1.id, to: entity2.id});
		system.addRelation(relation);
		const entity3 = new Entity({name: 'Savings', type: 'quantifiable'});
		const entity4 = new Entity({name: 'Interest', type: 'quantifiable'});
		const relation1 = new Relation({name: 'Savings impact on interest', type: 'positive', from: entity3.id, to: entity4.id});
		const relation2 = new Relation({name: 'Interest impact on savings', type: 'positive', from: entity4.id, to: entity3.id});
		system.addEntity(entity3);
		system.addEntity(entity4);
		system.addRelation(relation1);
		system.addRelation(relation2);
		assert.strictEqual(system.relations.length, 3);
	});

	it('can have multiple loops');

	describe("#addEntity", () => {
		it('should add an entity to the system', () => {
			const entity = new Entity({name: 'Revenue', type: 'quantifiable'});
			system.addEntity(entity);
			assert.strictEqual(system.entities.length, 1);
		});
	});

	describe("#addRelation", () => {
		it('should add a relation to the system', () => {
			const entity1 = new Entity({name: 'Revenue', type: 'quantifiable'});
			const entity2 = new Entity({name: 'Costs', type: 'quantifiable'});
			const relation = new Relation({name: 'Revenue impact on costs', type: 'positive', from: entity1.id, to: entity2.id});
			system.addRelation(relation);
			assert.strictEqual(system.relations.length, 1);
		});
	});

	describe('#addLoop', () => {
		it('should add a loop to the system', () => {
			const entity1 = new Entity({name: 'Savings', type: 'quantifiable'});
			const entity2 = new Entity({name: 'Interest', type: 'quantifiable'});
			const relation1 = new Relation({name: 'Savings impact on interest', type: 'positive', from: entity1.id, to: entity2.id});
			const relation2 = new Relation({name: 'Interest impact on savings', type: 'positive', from: entity2.id, to: entity1.id});
			system.addLoop({name: 'Compound interest loop', type: 'reinforcing', entities: [entity1.id, entity2.id], relations: [relation1.id, relation2.id]});
			assert.strictEqual(system.loops.length, 1);
			assert.equal(system.loops[0].name, 'Compound interest loop');
			assert.equal(system.loops[0].type, 'reinforcing');
		});
	});

	describe('#detectLoopType', () => {
		it('should detect either a reinforcing or a balancing loop');
		/* 
		, () => {
			const entity1 = new Entity({name: 'Savings', type: 'quantifiable'});
			const entity2 = new Entity({name: 'Interest', type: 'quantifiable'});
			const entity3 = new Entity({name: 'Expenditure', type: 'quantifiable'});
			const relation1 = new Relation({name: 'Savings impact on interest', type: 'positive', from: entity1.id, to: entity2.id});
			const relation2 = new Relation({name: 'Interest impact on savings', type: 'positive', from: entity2.id, to: entity1.id});
			const relation3 = new Relation({name: 'Expenditure impact on savings', type: 'negative', from: entity3.id, to: entity1.id});
			const relation4 = new Relation({name: 'Savings impact on expenditure', type: 'positive', from: entity1.id, to: entity3.id});
			system.addRelation(relation1);
			system.addRelation(relation2);
			system.addRelation(relation3);
			system.addRelation(relation4);
			const path = [relation1.id, relation2.id];
			assert.equal(system.detectLoopType(path), 'reinforcing');
			const otherPath = [relation3.id, relation4.id];
			assert.equal(system.detectLoopType(otherPath), 'balancing');
		}); */
	});

	describe('#detectEntitiesInLoop', () => {
		it('should detect the entities in a loop');
	});

	describe('#traverse', () => {
		it('should look at all the relations that link entities until it has seen them all');
	});

	describe('#detectLoops', () => {
		it('should detect all the loops in the system');
	});



});
