import { Entity, Relation } from "../../dist";
import assert from "assert";

describe('relation', () => {

  let relation;
  let firstEntity;
  let secondEntity;

  before(() => {
    // Create a relation between two entities
    firstEntity = new Entity({ name: 'Revenue' });
    secondEntity = new Entity({ name: 'Gross Profit' });
    relation = new Relation({
      name: 'Revenue impact on profitability',
      type: 'positive',
      from: firstEntity.id,
      to: secondEntity.id,
    });
  });

	it('should have a unique id', () => {
    assert(relation.id !== undefined);
    assert.strictEqual(relation.id.length, 36);
  });

  it('can have a name', () => {
    assert.strictEqual(relation.name, 'Revenue impact on profitability');
  });
	it('should have a type of either positive or negative');
	it('should have a from that points to an entity');
	it('should have a to that points to an entity');
	it('should not allow the from and to to be the same entity');
});
