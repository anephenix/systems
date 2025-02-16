// Dependencies
import System from '../../dist/lib/system';
import Entity from '../../dist/lib/entity';
import Relation from '../../dist/lib/relation';
import assert from 'assert';

describe('system', () => {

	const system = new System({name: 'Financial market'});

	it('should have a unique id', () => {
		assert(system.id !== undefined);
		assert.strictEqual(system.id.length, 36);
	});
	it('can have a name', () => {
		assert.strictEqual(system.name, 'Financial market');
	});

	it('can have multiple entities');
	it('can have multiple relations');
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
});
