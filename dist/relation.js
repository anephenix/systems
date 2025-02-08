'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// Dependencies
var uuid_1 = require('uuid');
var Relation = /** @class */ (function () {
	function Relation(_a) {
		var name = _a.name, type = _a.type, from = _a.from, to = _a.to;
		this.id = (0, uuid_1.v4)();
		this.name = name;
		this.type = type || 'positive'; // Positive by default
		// An edge is between two entities
		this.from = from; // The ID of the from entity
		this.to = to; // The ID of the to entity
	}
	return Relation;
}());
module.exports = Relation;
