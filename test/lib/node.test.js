const Node = require('../../lib/node');
const assert = require('assert');

describe('node', () => {
    it('should have a unique id', () => {
        const node = new Node({ name: 'Buying volume' });
        const secondNode = new Node({ name: 'Selling volume' });
        assert(node.id !== undefined);
        assert(node.id !== secondNode.id);
        assert.strictEqual(node.id.length, 36);
        assert.strictEqual(secondNode.id.length, 36);
    });
    it('can have a name',() => {
        const node = new Node({ name: 'Buying volume' });
        assert.strictEqual(node.name, 'Buying volume' );
    });
    it.todo('will have a type of either quantifiable or non-quantifiable');
});