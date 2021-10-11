const Entity = require('../../src/lib/entity');
const assert = require('assert');

describe('entity', () => {
  it('should have a unique id', () => {
    const entity = new Entity({ name: 'Buying volume' });
    const secondEntity = new Entity({ name: 'Selling volume' });
    assert(entity.id !== undefined);
    assert(entity.id !== secondEntity.id);
    assert.strictEqual(entity.id.length, 36);
    assert.strictEqual(secondEntity.id.length, 36);
  });
  it('can have a name', () => {
    const entity = new Entity({ name: 'Buying volume' });
    assert.strictEqual(entity.name, 'Buying volume');
  });
  it.todo('will have a type of either quantifiable or non-quantifiable');
});
