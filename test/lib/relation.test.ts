import { Entity, Relation } from "../../src/lib";
import assert from "assert";

describe('relation', () => {

  let firstRelation;
  let secondRelation;
  let firstEntity;
  let secondEntity;
  let thirdEntity;

  before(() => {
    // Create a relation between two entities
    firstEntity = new Entity({ name: 'Revenue', type: 'quantifiable' });
    secondEntity = new Entity({ name: 'Costs', type: 'quantifiable' });
    thirdEntity = new Entity({ name: 'Profitability', type: 'quantifiable' });

    firstRelation = new Relation({
      name: 'Revenue impact on profitability',
      type: 'positive',
      from: firstEntity.id,
      to: thirdEntity.id,
    });

    secondRelation = new Relation({
      name: 'Cost impact on profitability',
      type: 'negative',
      from: secondEntity.id,
      to: thirdEntity.id,
    });
  });

	it('should have a unique id', () => {
    assert(firstRelation.id !== undefined);
    assert.strictEqual(firstRelation.id.length, 36);
  });

  it('can have a name', () => {
    assert.strictEqual(firstRelation.name, 'Revenue impact on profitability');
  });

	it('should have a type of either positive or negative', () => {
    assert.strictEqual(firstRelation.type, 'positive');
    assert.strictEqual(secondRelation.type, 'negative');
  });

  it('should have a from that points to an entity', () => {
    assert.strictEqual(firstRelation.from, firstEntity.id);
    assert.strictEqual(secondRelation.from, secondEntity.id);
  });

  it('should have a to that points to an entity', () => {
    assert.strictEqual(firstRelation.to, thirdEntity.id);
    assert.strictEqual(secondRelation.to, thirdEntity.id);
  });

  it('should not allow the from and to to be the same entity', () => {
    assert.throws(() => {
      new Relation({
        name: 'Invalid relation',
        type: 'positive',
        from: firstEntity.id,
        to: firstEntity.id,
      });
    }, /The from and to entities cannot be the same/);
  });

});
