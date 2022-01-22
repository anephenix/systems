"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
var uuid_1 = require("uuid");
var Loop = /** @class */ (function () {
    function Loop(_a) {
        var name = _a.name, type = _a.type;
        this.id = (0, uuid_1.v4)();
        this.name = name;
        this.type = type;
        this.relations = [];
        this.entities = [];
    }
    return Loop;
}());
module.exports = Loop;
