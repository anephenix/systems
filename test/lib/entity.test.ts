import type { EntitySubType } from "../../src/global";
import Entity from "../../src/lib/entity";
import { describe, expect, it } from "vitest";

describe("entity", () => {
	it("should have a unique id", () => {
		const entity = new Entity({ name: "Buying volume", type: "quantifiable" });
		const secondEntity = new Entity({
			name: "Selling volume",
			type: "quantifiable",
		});
		expect(entity.id).toBeDefined();
		expect(entity.id).not.toBe(secondEntity.id);
		expect(entity.id.length).toBe(36);
		expect(secondEntity.id.length).toBe(36);
	});

	it("can have a name", () => {
		const entity = new Entity({ name: "Buying volume", type: "quantifiable" });
		expect(entity.name).toBe("Buying volume");
	});

	it("will have a type of either quantifiable or non-quantifiable", () => {
		expect(() => {
			new Entity({
				name: "Transaction volume",
				type: "numeric" as EntitySubType,
			});
		}).toThrow(
			/Invalid entity type - must be either quantifiable or non-quantifiable/,
		);
	});
});
