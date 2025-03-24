import { Loop } from "../../src/lib";
import assert from "assert";

describe('loop', () => {

	const loop = new Loop({ name: 'compounding interest', type: 'reinforcing' });
	const loop2 = new Loop({ name: 'interest rates and inflation', type: 'balancing' });

	describe('.id', () => {

		describe('when not passed an id', () => {
			it('should have a unique id assigned to it', () => {
				assert(loop.id !== undefined);
				assert(loop.id.length === 36);
			});
		});

		describe('when passed an id', () => {
			it('should have the id passed to it', () => {
				const loopWithId = new Loop({ id: '1234', name: 'compounding interest', type: 'reinforcing' });
				assert.strictEqual(loopWithId.id, '1234');
			});
		});
	});

	it('can have a name', () => {
		assert.strictEqual(loop.name, 'compounding interest');
	});

	it('should have a type of either balancing or reinforcing', () => {
		assert.strictEqual(loop.type, 'reinforcing');
		assert.strictEqual(loop2.type, 'balancing');
	});

	describe('.relations', () => {

		describe('when not passed any relations', () => {
			it('should have an empty array of relations', () => {
				assert.deepStrictEqual(loop.relations, []);
			});
		});

		describe('when passed an array of relations', () => {
			it('should have the relations passed to it', () => {
				const loopWithRelations = new Loop({ name: 'compounding interest', type: 'reinforcing', relations: ['1234', '5678'] });
				assert.deepStrictEqual(loopWithRelations.relations, ['1234', '5678']);
			});
		});
	});

	describe('.entities', () => {
		
		describe('when not passed any entities', () => {
			it('should have an empty array of entities', () => {
				assert.deepStrictEqual(loop.entities, []);
			});
		});

		describe('when passed an array of entities', () => {
			it('should have the entities passed to it', () => {
				const loopWithEntities = new Loop({ name: 'compounding interest', type: 'reinforcing', entities: ['1234', '5678'] });
				assert.deepStrictEqual(loopWithEntities.entities, ['1234', '5678']);
			});
		});
	});
});