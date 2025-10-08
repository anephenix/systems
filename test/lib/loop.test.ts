import { Loop } from "../../src/lib";
import { describe, expect, it } from "vitest";

describe("loop", () => {
	const loop = new Loop({ name: "compounding interest", type: "reinforcing" });
	const loop2 = new Loop({
		name: "interest rates and inflation",
		type: "balancing",
	});

	describe(".id", () => {
		describe("when not passed an id", () => {
			it("should have a unique id assigned to it", () => {
				expect(loop.id).toBeDefined();
				expect(loop.id.length).toBe(36);
			});
		});

		describe("when passed an id", () => {
			it("should have the id passed to it", () => {
				const loopWithId = new Loop({
					id: "1234",
					name: "compounding interest",
					type: "reinforcing",
				});
				expect(loopWithId.id).toBe("1234");
			});
		});
	});

	it("can have a name", () => {
		expect(loop.name).toBe("compounding interest");
	});

	it("should have a type of either balancing or reinforcing", () => {
		expect(loop.type).toBe("reinforcing");
		expect(loop2.type).toBe("balancing");
	});

	describe(".relations", () => {
		describe("when not passed any relations", () => {
			it("should have an empty array of relations", () => {
				expect(loop.relations).toEqual([]);
			});
		});

		describe("when passed an array of relations", () => {
			it("should have the relations passed to it", () => {
				const loopWithRelations = new Loop({
					name: "compounding interest",
					type: "reinforcing",
					relations: ["1234", "5678"],
				});
				expect(loopWithRelations.relations).toEqual(["1234", "5678"]);
			});
		});
	});

	describe(".entities", () => {
		describe("when not passed any entities", () => {
			it("should have an empty array of entities", () => {
				expect(loop.entities).toEqual([]);
			});
		});

		describe("when passed an array of entities", () => {
			it("should have the entities passed to it", () => {
				const loopWithEntities = new Loop({
					name: "compounding interest",
					type: "reinforcing",
					entities: ["1234", "5678"],
				});
				expect(loopWithEntities.entities).toEqual(["1234", "5678"]);
			});
		});
	});
});
