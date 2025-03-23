// Dependencies
import { System, Entity, Relation } from '../../src/lib';
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

	it('can have multiple loops', () => {
			const entity1 = new Entity({name: 'Savings', type: 'quantifiable'});
			const entity2 = new Entity({name: 'Interest', type: 'quantifiable'});
			const entity3 = new Entity({name: 'Expenditure', type: 'quantifiable'});
			const relation1 = new Relation({name: 'Savings impact on interest', type: 'positive', from: entity1.id, to: entity2.id});
			const relation2 = new Relation({name: 'Interest impact on savings', type: 'positive', from: entity2.id, to: entity1.id});
			const relation3 = new Relation({name: 'Expenditure impact on savings', type: 'negative', from: entity3.id, to: entity1.id});
			const relation4 = new Relation({name: 'Savings impact on expenditure', type: 'positive', from: entity1.id, to: entity3.id});
			system.addEntity(entity1);
			system.addEntity(entity2);
			system.addEntity(entity3);
			system.addRelation(relation1);
			system.addRelation(relation2);
			system.addRelation(relation3);
			system.addRelation(relation4);
			const path = [relation1.id, relation2.id];
			const otherPath = [relation3.id, relation4.id];
			system.traverse(relation1, path);
			system.traverse(relation3, otherPath);
			assert.strictEqual(system.loops.length, 2);
	});

	describe("#addEntity", () => {
		it('should add an entity to the system', () => {
			const entity = new Entity({name: 'Revenue', type: 'quantifiable'});
			system.addEntity(entity);
			assert.strictEqual(system.entities.length, 1);
		});
	});

	describe('#removeEntity', () => {

		describe('when a valid entity id is provided', () => {

			it('should remove an entity from the system', () => {
				const entity = new Entity({name: 'Revenue', type: 'quantifiable'});
				system.addEntity(entity);
				assert.strictEqual(system.entities.length, 1);
				system.removeEntity(entity.id);
				assert.strictEqual(system.entities.length, 0);
			});
		});

		describe('when an invalid entity id is provided', () => {
			it('should throw an error', () => {
				assert.throws(() => {
					system.removeEntity('123');
				}, /Entity not found/);
			});
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
		it('should detect either a reinforcing or a balancing loop', () => {
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
		});
	});

	describe('#detectEntitiesInLoop', () => {
		it('should detect the entities in a loop', () => {
			const entity1 = new Entity({name: 'Savings', type: 'quantifiable'});
			const entity2 = new Entity({name: 'Interest', type: 'quantifiable'});
			const entity3 = new Entity({name: 'Expenditure', type: 'quantifiable'});
			const relation1 = new Relation({name: 'Savings impact on interest', type: 'positive', from: entity1.id, to: entity2.id});
			const relation2 = new Relation({name: 'Interest impact on savings', type: 'positive', from: entity2.id, to: entity1.id});
			const relation3 = new Relation({name: 'Expenditure impact on savings', type: 'negative', from: entity3.id, to: entity1.id});
			const relation4 = new Relation({name: 'Savings impact on expenditure', type: 'positive', from: entity1.id, to: entity3.id});
			system.addEntity(entity1);
			system.addEntity(entity2);
			system.addEntity(entity3);
			system.addRelation(relation1);
			system.addRelation(relation2);
			system.addRelation(relation3);
			system.addRelation(relation4);
			const path = [relation1.id, relation2.id];
			assert.deepEqual(system.detectEntitiesInLoop(path), [entity1.id, entity2.id]);
			const otherPath = [relation3.id, relation4.id];
			assert.deepEqual(system.detectEntitiesInLoop(otherPath), [entity3.id, entity1.id]);
		});
	});

	describe('#isClosedLoopRatherThanChain', () => {
		it('should return true if the loop is closed', () => {
			const entity1 = new Entity({name: 'Savings', type: 'quantifiable'});
			const entity2 = new Entity({name: 'Interest', type: 'quantifiable'});
			const relation1 = new Relation({name: 'Savings impact on interest', type: 'positive', from: entity1.id, to: entity2.id});
			const relation2 = new Relation({name: 'Interest impact on savings', type: 'positive', from: entity2.id, to: entity1.id});
			system.addEntity(entity1);
			system.addEntity(entity2);
			system.addRelation(relation1);
			system.addRelation(relation2);
			const path = [relation1.id, relation2.id];
			assert(system.isClosedLoopRatherThanChain(path));
		});

		it('should return false if the loop is a chain that connects to an entity more than 2 times', () => {
			const entity1 = new Entity({name: 'Savings', type: 'quantifiable'});
			const entity2 = new Entity({name: 'Interest', type: 'quantifiable'});
			const entity3 = new Entity({name: 'Expenditure', type: 'quantifiable'});
			const relation1 = new Relation({name: 'Savings impact on interest', type: 'positive', from: entity1.id, to: entity2.id});
			const relation2 = new Relation({name: 'Interest impact on savings', type: 'positive', from: entity2.id, to: entity1.id});
			const relation3 = new Relation({name: 'Expenditure impact on savings', type: 'negative', from: entity3.id, to: entity1.id});
			const relation4 = new Relation({name: 'Savings impact on expenditure', type: 'positive', from: entity1.id, to: entity3.id});
			system.addEntity(entity1);
			system.addEntity(entity2);
			system.addEntity(entity3);
			system.addRelation(relation1);
			system.addRelation(relation2);
			system.addRelation(relation3);
			const path = [relation1.id, relation2.id, relation3.id, relation4.id];
			assert(!system.isClosedLoopRatherThanChain(path));
		});
	});

	describe('#traverse', () => {
		it('should look at all the relations that link entities until it has seen them all', () => {
			const entity1 = new Entity({name: 'Savings', type: 'quantifiable'});
			const entity2 = new Entity({name: 'Interest', type: 'quantifiable'});
			const entity3 = new Entity({name: 'Expenditure', type: 'quantifiable'});
			const relation1 = new Relation({name: 'Savings impact on interest', type: 'positive', from: entity1.id, to: entity2.id});
			const relation2 = new Relation({name: 'Interest impact on savings', type: 'positive', from: entity2.id, to: entity1.id});
			const relation3 = new Relation({name: 'Expenditure impact on savings', type: 'negative', from: entity3.id, to: entity1.id});
			const relation4 = new Relation({name: 'Savings impact on expenditure', type: 'positive', from: entity1.id, to: entity3.id});
			system.addEntity(entity1);
			system.addEntity(entity2);
			system.addEntity(entity3);
			system.addRelation(relation1);
			system.addRelation(relation2);
			system.addRelation(relation3);
			system.addRelation(relation4);

			const path = [relation1.id, relation2.id];
			const otherPath = [relation3.id, relation4.id];
			system.traverse(relation1, path);
			system.traverse(relation3, otherPath);
			assert.strictEqual(system.loops.length, 2);
			assert.deepEqual(system.loops[0].relations, path);
			assert.deepEqual(system.loops[1].relations, otherPath);
			assert.deepEqual(system.loops[0].entities, [entity1.id, entity2.id]);
			assert.deepEqual(system.loops[1].entities, [entity3.id, entity1.id]);
			assert.equal(system.loops[0].type, 'reinforcing');
			assert.equal(system.loops[1].type, 'balancing');
		});
	});

	describe('#detectLoops', () => {
		it('should detect all the loops in the system', () => {
			const entity1 = new Entity({name: 'Savings', type: 'quantifiable'});
			const entity2 = new Entity({name: 'Interest', type: 'quantifiable'});
			const entity3 = new Entity({name: 'Expenditure', type: 'quantifiable'});
			const relation1 = new Relation({name: 'Savings impact on interest', type: 'positive', from: entity1.id, to: entity2.id});
			const relation2 = new Relation({name: 'Interest impact on savings', type: 'positive', from: entity2.id, to: entity1.id});
			const relation3 = new Relation({name: 'Expenditure impact on savings', type: 'negative', from: entity3.id, to: entity1.id});
			const relation4 = new Relation({name: 'Savings impact on expenditure', type: 'positive', from: entity1.id, to: entity3.id});
			system.addEntity(entity1);
			system.addEntity(entity2);
			system.addEntity(entity3);
			system.addRelation(relation1);
			system.addRelation(relation2);
			system.addRelation(relation3);
			system.addRelation(relation4);
			system.detectLoops();
			assert.strictEqual(system.loops.length, 2);
			assert.deepEqual(system.loops[0].relations, [relation1.id, relation2.id]);
			assert.deepEqual(system.loops[1].relations, [relation3.id, relation4.id]);
			assert.deepEqual(system.loops[0].entities, [entity1.id, entity2.id]);
			assert.deepEqual(system.loops[1].entities, [entity3.id, entity1.id]);
			assert.equal(system.loops[0].type, 'reinforcing');
			assert.equal(system.loops[1].type, 'balancing');
		});
	});



});
