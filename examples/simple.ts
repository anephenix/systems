import { System, Entity, Relation } from '../dist';

// Create a system
const system = new System({
	name: 'trading system',
});

// Create an entity
const buyVolume = new Entity({
	name: 'buy volume',
	type: 'quantifiable',
});

// Create another entity
const sharePrice = new Entity({
	name: 'share price',
	type: 'quantifiable',
});

// Add an entity to the system
system.addEntity(buyVolume);

// Add another node to the system
system.addEntity(sharePrice);

// Create a relation from the first entity to the second entity
const driveUpPrice = new Relation({
	name: 'buying volume drives share price increases, and vice versa',
	type: 'positive',
	from: buyVolume.id,
	to: sharePrice.id,
});

// Create a relation from the second entity back to the first entity
const followTheFlock = new Relation({
	name:
	'share price increases drive others to purchase shares, increasing buy volume, and vice versa',
	type: 'positive',
	from: sharePrice.id,
	to: buyVolume.id,
});

// Add the first relation to the system
system.addRelation(driveUpPrice);

// Add the second relation to the system
system.addRelation(followTheFlock);

// Automatically create loops in the system from the entities
system.detectLoops();

console.log({ system });
console.log({ loops: system.loops });
console.log({ loop: system.loops[0] });

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
