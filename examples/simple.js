const { System, Entity, Relation, Loop } = require('../dist');

// Create a system
const system = new System({
  name: 'trading system',
});

// Create an entity
const entity = new Entity({
  name: 'buy volume',
  type: 'quantifiable',
});

// Create another entity
const secondEntity = new Entity({
  name: 'share price',
  type: 'quantifiable',
});

// Add an entity to the system
system.addEntity(entity);

// Add another node to the system
system.addEntity(secondEntity);

// Create a relation from the first entity to the second entity
const firstRelation = new Relation({
  name: 'buying volume drives share price increases',
  type: 'positive',
  from: entity.id,
  to: secondEntity.id,
});

// Create a relation from the second entity back to the first entity
const secondRelation = new Relation({
  name: 'share price increases drive others to purchase shares',
  type: 'positive',
  from: secondEntity.id,
  to: entity.id,
});

// Add the first relation to the system
system.addRelation(firstRelation);

// Add the second relation to the system
system.addRelation(secondRelation);

/**
 * TODO - how to do loop detection?
 *
 * pathwalking
 *
 * Take a node
 * find all from edges for that node
 * for each from edge:
 * - create a path array for each one
 * - add the from node to that path array
 * - look at the to node for that edge
 * -
 * - or path walk the edges, record their ids, if one pops up in a chain, then you have detected a loop
 *
 * - this is the next step to work out
 *
 *   At this point, it might be a good idea to start to implement a test suite for this code, and add it to GitHub, and do a few other things
 *
 *  */

/**
 * TODO LIST
 *
 * - Be able to create a system
 * - Be able to add nodes to that system
 * - Be able to remove nodes from that system
 * - Be able to rename a node
 * - Be able to add an edge between two nodes
 * - Be able to remove an edge between two nodes
 * - Be able to rename an edge
 * - Be able to change the type of an edge
 * - Be able to change where the edge is from
 * - Be able to change where the edge is to
 * - Detect loops that exist between nodes
 */
