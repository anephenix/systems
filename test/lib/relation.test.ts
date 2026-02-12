import { beforeAll, describe, expect, it } from "vitest";
import { Entity, Relation } from "../../src/lib";

describe("relation", () => {
	let firstRelation: Relation;
	let secondRelation: Relation;
	let firstEntity: Entity;
	let secondEntity: Entity;
	let thirdEntity: Entity;

	beforeAll(() => {
		// Create a relation between two entities
		firstEntity = new Entity({ name: "Revenue", type: "quantifiable" });
		secondEntity = new Entity({ name: "Costs", type: "quantifiable" });
		thirdEntity = new Entity({ name: "Profitability", type: "quantifiable" });

		firstRelation = new Relation({
			name: "Revenue impact on profitability",
			type: "positive",
			from: firstEntity.id,
			to: thirdEntity.id,
		});

		secondRelation = new Relation({
			name: "Cost impact on profitability",
			type: "negative",
			from: secondEntity.id,
			to: thirdEntity.id,
		});
	});

	it("should have a unique id", () => {
		expect(firstRelation.id).toBeDefined();
		expect(firstRelation.id.length).toBe(36);
	});

	it("can have a name", () => {
		expect(firstRelation.name).toBe("Revenue impact on profitability");
	});

	it("should have a type of either positive or negative", () => {
		expect(firstRelation.type).toBe("positive");
		expect(secondRelation.type).toBe("negative");
	});

	it("should have a from that points to an entity", () => {
		expect(firstRelation.from).toBe(firstEntity.id);
		expect(secondRelation.from).toBe(secondEntity.id);
	});

	it("should have a to that points to an entity", () => {
		expect(firstRelation.to).toBe(thirdEntity.id);
		expect(secondRelation.to).toBe(thirdEntity.id);
	});

	it("should not allow the from and to to be the same entity", () => {
		expect(() => {
			new Relation({
				name: "Invalid relation",
				type: "positive",
				from: firstEntity.id,
				to: firstEntity.id,
			});
		}).toThrow(/The from and to entities cannot be the same/);
	});
});
