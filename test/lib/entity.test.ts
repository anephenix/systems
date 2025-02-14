import Entity from '../../dist/lib/entity';
import assert from 'assert';

describe('entity', () => {
	it('should have a unique id', () => {
		const entity = new Entity({ name: 'Buying volume', type: 'quantifiable' });
		const secondEntity = new Entity({ name: 'Selling volume', type: 'quantifiable' });
		assert(entity.id !== undefined);
		assert(entity.id !== secondEntity.id);
		assert.strictEqual(entity.id.length, 36);
		assert.strictEqual(secondEntity.id.length, 36);
	});

	it('can have a name', () => {
		const entity = new Entity({ name: 'Buying volume', type: 'quantifiable' });
		assert.strictEqual(entity.name, 'Buying volume');
	});

	it('will have a type of either quantifiable or non-quantifiable', () => {
		assert.throws(() => {
			new Entity({ name: 'Transaction volume', type: 'numeric' });
		}, /Invalid entity type - must be either quantifiable or non-quantifiable/);
	});
});
