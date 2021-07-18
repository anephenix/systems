const { System, Node, Edge, Loop } = require('../index');

// Create a system
const system = new System({
    name: 'trading system'
});

// Create a node
const node = new Node({
    name: 'buy volume',
    type: 'quantifiable'
});

// Create another node
const secondNode = new Node({
    name: 'share price',
    type: 'quantifiable'
});

// Add a node to the system
system.addNode(node);

// Add another node to the system
system.addNode(secondNode);

// Create an edge from the first node to the second node
const firstEdge = new Edge({
    name: 'buying volume drives share price increases',
    type: 'positive',
    from: node.id,
    to: secondNode.id
});

// Create an edge from the second node back to the second node
const secondEdge = new Edge({
    name: 'share price increases drive others to purchase shares',
    type: 'positive',
    from: secondNode.id,
    to: node.id
});

// Add the first edge to the system
system.addEdge(firstEdge);

// Add the second edge to the system
system.addEdge(secondEdge);


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