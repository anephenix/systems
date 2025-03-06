import { Loop } from "../../src/lib";
import assert from "assert";

describe('loop', () => {

	const loop = new Loop({ name: 'compounding interest', type: 'reinforcing' });
	const loop2 = new Loop({ name: 'interest rates and inflation', type: 'balancing' });

	it('should have a unique id', () => {
		assert(loop.id !== undefined);
		assert(loop.id.length === 36);
	});
	it('can have a name', () => {
		assert.strictEqual(loop.name, 'compounding interest');
	});

	it('should have a type of either balancing or reinforcing', () => {
		assert.strictEqual(loop.type, 'reinforcing');
		assert.strictEqual(loop2.type, 'balancing');
	});

	it('can have a list of entities', () => {
		assert.deepStrictEqual(loop.entities, []);
	});

	it('can have a list of relations', () => {
		assert.deepStrictEqual(loop.relations, []);
	});

});
