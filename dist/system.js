'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// Dependencies
var uuid_1 = require('uuid');
// The System Class
var System = /** @class */ (function () {
	function System(_a) {
		var name = _a.name;
		this.id = (0, uuid_1.v4)();
		this.name = name;
		this.entities = [];
		this.relations = [];
		this.loops = [];
	}
	System.prototype.addEntity = function (entity) {
		this.entities.push(entity);
	};
	System.prototype.addRelation = function (relation) {
		this.relations.push(relation);
	};
	System.prototype.addLoop = function (loop) {
		this.loops.push(loop);
	};
	System.prototype.detectLoopType = function (path) {
		var relations = this.relations.filter(function (r) { return path.includes(r.id); });
		var negativeAmount = relations.map(function (r) { return r.type === 'negative'; }).length;
		if (negativeAmount === 0 || negativeAmount % 2 === 0)
			return 'reinforcing';
		return 'balancing';
	};
	System.prototype.detectEntitiesInLoop = function (path) {
		var entities = [];
		this.relations.filter(function (r) { return path.includes(r.id); }).forEach(function (relation) {
			if (!entities.includes(relation.from))
				entities.push(relation.from);
			if (!entities.includes(relation.to))
				entities.push(relation.to);
		});
		return entities;
	};
	System.prototype.traverse = function (relation, path) {
		var _this = this;
		var id = relation.id, to = relation.to;
		if (path.includes(id)) {
			// We have looped, now check if the system has that loop, albeit in a different order?
			var matchFound_1 = false;
			this.loops.forEach(function (loop) {
				if (loop.relations.every(function (rId) { return path.includes(rId); })) {
					matchFound_1 = true;
				}
			});
			if (!matchFound_1) {
				var type = this.detectLoopType(path);
				var entities = this.detectEntitiesInLoop(path);
				this.loops.push({ type: type, relations: path, entities: entities });
			}
		}
		else {
			path.push(relation.id);
			var linkedFromRelations = this.relations.filter(function (r) { return r.from === to; });
			// No links onwards, end the loop
			if (linkedFromRelations.length === 0)
				return;
			// send the path and the linkedFromRelations to the next function
			linkedFromRelations.forEach(function (lfr) {
				_this.traverse(lfr, path);
			});
		}
	};
	System.prototype.detectLoops = function () {
		var _this = this;
		// for each relation in the system
		// take the first one
		this.relations.forEach(function (relation) {
			var path = [];
			path.push(relation.id);
			var to = relation.to;
			var linkedFromRelations = _this.relations.filter(function (r) { return r.from === to; });
			// No links onwards, end the loop
			if (linkedFromRelations.length === 0)
				return;
			linkedFromRelations.forEach(function (lfr) {
				_this.traverse(lfr, path);
			});
		});
	};
	return System;
}());
module.exports = System;
