import { beforeEach, describe, expect, it } from "vitest";
import { Entity, Relation, Simulation, System } from "../../src/lib";

describe("Simulation", () => {
	let system: System;
	let entityA: Entity;
	let entityB: Entity;
	let relation: Relation;

	beforeEach(() => {
		system = new System({ name: "Test system" });
		entityA = new Entity({ name: "Entity A", type: "quantifiable" });
		entityB = new Entity({ name: "Entity B", type: "quantifiable" });
		system.addEntity(entityA);
		system.addEntity(entityB);
		relation = new Relation({
			name: "A influences B",
			type: "positive",
			from: entityA.id,
			to: entityB.id,
		});
		system.addRelation(relation);
	});

	describe("constructor", () => {
		it("should create a simulation with default values", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
			});
			expect(sim.steps).toBe(100);
			expect(sim.dt).toBe(1.0);
			expect(sim.history).toEqual([]);
			expect(sim.relationWeights).toEqual({});
		});

		it("should accept custom steps and dt", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				steps: 50,
				dt: 0.5,
			});
			expect(sim.steps).toBe(50);
			expect(sim.dt).toBe(0.5);
		});

		it("should accept relation weights", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				relationWeights: { [relation.id]: 0.5 },
			});
			expect(sim.relationWeights[relation.id]).toBe(0.5);
		});
	});

	describe("validate()", () => {
		it("should throw if initialValues is empty", () => {
			expect(() => new Simulation({ system, initialValues: {} })).toThrow(
				"initialValues must not be empty",
			);
		});

		it("should throw if an entity ID is not in the system", () => {
			expect(
				() =>
					new Simulation({ system, initialValues: { "non-existent-id": 100 } }),
			).toThrow('Entity "non-existent-id" not found in system');
		});

		it("should throw if a relation weight references a relation not in the system", () => {
			expect(
				() =>
					new Simulation({
						system,
						initialValues: { [entityA.id]: 100 },
						relationWeights: { "non-existent-id": 0.5 },
					}),
			).toThrow('Relation "non-existent-id" not found in system');
		});

		it("should throw if steps is zero", () => {
			expect(
				() =>
					new Simulation({
						system,
						initialValues: { [entityA.id]: 100 },
						steps: 0,
					}),
			).toThrow("steps must be a positive integer");
		});

		it("should throw if steps is negative", () => {
			expect(
				() =>
					new Simulation({
						system,
						initialValues: { [entityA.id]: 100 },
						steps: -1,
					}),
			).toThrow("steps must be a positive integer");
		});

		it("should throw if steps is not an integer", () => {
			expect(
				() =>
					new Simulation({
						system,
						initialValues: { [entityA.id]: 100 },
						steps: 1.5,
					}),
			).toThrow("steps must be a positive integer");
		});

		it("should throw if dt is zero", () => {
			expect(
				() =>
					new Simulation({
						system,
						initialValues: { [entityA.id]: 100 },
						dt: 0,
					}),
			).toThrow("dt must be a positive number");
		});

		it("should throw if dt is negative", () => {
			expect(
				() =>
					new Simulation({
						system,
						initialValues: { [entityA.id]: 100 },
						dt: -1,
					}),
			).toThrow("dt must be a positive number");
		});
	});

	describe("run()", () => {
		it("should produce history with steps+1 entries (including step 0)", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				steps: 5,
				relationWeights: { [relation.id]: 0.1 },
			});
			sim.run();
			expect(sim.history.length).toBe(6);
		});

		it("should record step 0 as the initial values", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				steps: 5,
				relationWeights: { [relation.id]: 0.1 },
			});
			sim.run();
			expect(sim.history[0].step).toBe(0);
			expect(sim.history[0].time).toBe(0);
			expect(sim.history[0].values[entityA.id]).toBe(100);
			expect(sim.history[0].values[entityB.id]).toBe(0);
		});

		it("should return the history array", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				steps: 3,
				relationWeights: { [relation.id]: 0.1 },
			});
			const result = sim.run();
			expect(result).toBe(sim.history);
		});
	});

	describe("propagation", () => {
		it("should propagate a positive relation correctly", () => {
			// A=100, B=0, A→B positive weight=0.1, dt=1.0
			// step 1: B = 0 + (0.1 * 100 * +1) * 1.0 = 10
			// step 2: B = 10 + (0.1 * 100 * +1) * 1.0 = 20
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				steps: 2,
				relationWeights: { [relation.id]: 0.1 },
			});
			sim.run();
			expect(sim.history[1].values[entityB.id]).toBe(10);
			expect(sim.history[2].values[entityB.id]).toBe(20);
		});

		it("should propagate a negative relation correctly", () => {
			// A=100, B=50, A→B negative weight=0.1, dt=1.0
			// step 1: B = 50 + (0.1 * 100 * -1) * 1.0 = 40
			// step 2: B = 40 + (0.1 * 100 * -1) * 1.0 = 30
			const negativeRelation = new Relation({
				name: "A reduces B",
				type: "negative",
				from: entityA.id,
				to: entityB.id,
			});
			system.removeRelation(relation.id);
			system.addRelation(negativeRelation);

			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 50 },
				steps: 2,
				relationWeights: { [negativeRelation.id]: 0.1 },
			});
			sim.run();
			expect(sim.history[1].values[entityB.id]).toBe(40);
			expect(sim.history[2].values[entityB.id]).toBe(30);
		});

		it("should not change entities with no incoming relations", () => {
			// entityA has no incoming relations in this setup
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				steps: 5,
				relationWeights: { [relation.id]: 0.1 },
			});
			sim.run();
			for (const step of sim.history) {
				expect(step.values[entityA.id]).toBe(100);
			}
		});

		it("should scale the delta by dt", () => {
			// A=100, B=0, A→B positive weight=0.1, dt=2.0
			// step 1: B = 0 + (0.1 * 100 * +1) * 2.0 = 20
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				steps: 1,
				relationWeights: { [relation.id]: 0.1 },
				dt: 2.0,
			});
			sim.run();
			expect(sim.history[1].values[entityB.id]).toBe(20);
		});

		it("should record the correct time at each step", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				steps: 3,
				dt: 0.5,
				relationWeights: { [relation.id]: 0.1 },
			});
			sim.run();
			expect(sim.history[0].time).toBe(0);
			expect(sim.history[1].time).toBe(0.5);
			expect(sim.history[2].time).toBe(1.0);
			expect(sim.history[3].time).toBe(1.5);
		});

		it("should use weight 1.0 when no relation weight is supplied", () => {
			// A=100, B=0, A→B positive, default weight=1.0, dt=1.0
			// step 1: B = 0 + (1.0 * 100 * +1) * 1.0 = 100
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				steps: 1,
			});
			sim.run();
			expect(sim.history[1].values[entityB.id]).toBe(100);
		});
	});

	describe("advance()", () => {
		it("should advance a single step and return it", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				relationWeights: { [relation.id]: 0.1 },
			});
			const step = sim.advance();
			expect(step.step).toBe(1);
			expect(step.values[entityB.id]).toBe(10);
			expect(sim.history.length).toBe(2);
		});

		it("should initialise history with step 0 if called before run()", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				relationWeights: { [relation.id]: 0.1 },
			});
			sim.advance();
			expect(sim.history[0].step).toBe(0);
			expect(sim.history[0].values[entityA.id]).toBe(100);
		});

		it("should continue from the current state on subsequent calls", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				relationWeights: { [relation.id]: 0.1 },
			});
			sim.advance();
			const step2 = sim.advance();
			expect(step2.step).toBe(2);
			expect(step2.values[entityB.id]).toBe(20);
		});
	});

	describe("getValuesAt()", () => {
		it("should return values at a specific step", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				steps: 3,
				relationWeights: { [relation.id]: 0.1 },
			});
			sim.run();
			expect(sim.getValuesAt(0)[entityB.id]).toBe(0);
			expect(sim.getValuesAt(1)[entityB.id]).toBe(10);
			expect(sim.getValuesAt(2)[entityB.id]).toBe(20);
		});

		it("should throw if the step does not exist in history", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				steps: 2,
				relationWeights: { [relation.id]: 0.1 },
			});
			sim.run();
			expect(() => sim.getValuesAt(99)).toThrow("Step 99 not found in history");
		});
	});

	describe("relationTransferFns", () => {
		it("should accept transfer functions in the constructor", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 0.0325, [entityB.id]: 1000 },
				relationTransferFns: {
					[relation.id]: (rate, balance) => rate * balance,
				},
			});
			expect(typeof sim.relationTransferFns[relation.id]).toBe("function");
		});

		it("should throw if a transfer function references a relation not in the system", () => {
			expect(
				() =>
					new Simulation({
						system,
						initialValues: { [entityA.id]: 100 },
						relationTransferFns: { "non-existent-id": (s, t) => s * t },
					}),
			).toThrow('Relation "non-existent-id" not found in system');
		});

		it("should call the transfer function with (sourceValue, targetValue)", () => {
			const calls: Array<[number, number]> = [];
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 5, [entityB.id]: 20 },
				steps: 1,
				relationTransferFns: {
					[relation.id]: (src, tgt) => {
						calls.push([src, tgt]);
						return 0;
					},
				},
			});
			sim.run();
			expect(calls.length).toBe(1);
			expect(calls[0]).toEqual([5, 20]);
		});

		it("should use the transfer function result as the delta magnitude", () => {
			// A=5, B=20, transferFn returns 7 (fixed), polarity=+1, dt=1
			// step 1: B = 20 + 7 * 1 = 27
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 5, [entityB.id]: 20 },
				steps: 1,
				relationTransferFns: { [relation.id]: () => 7 },
			});
			sim.run();
			expect(sim.history[1].values[entityB.id]).toBe(27);
		});

		it("should apply relation polarity to the transfer function result", () => {
			// Same setup but relation is negative → delta = -7 → B = 20 - 7 = 13
			const negativeRelation = new Relation({
				name: "A reduces B",
				type: "negative",
				from: entityA.id,
				to: entityB.id,
			});
			system.removeRelation(relation.id);
			system.addRelation(negativeRelation);

			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 5, [entityB.id]: 20 },
				steps: 1,
				relationTransferFns: { [negativeRelation.id]: () => 7 },
			});
			sim.run();
			expect(sim.history[1].values[entityB.id]).toBe(13);
		});

		it("should produce exact compound interest using (rate, balance) => rate * balance", () => {
			// Balance grows at 3.25% AER: Balance[n] = 1000 * 1.0325^n
			// With transferFn = (rate, balance) => rate * balance:
			//   delta = rate * balance = 0.0325 * 1000 = 32.50 (year 1)
			//   Balance[1] = 1000 + 32.50 = 1032.50
			//   delta = 0.0325 * 1032.50 = 33.56 (year 2)
			//   Balance[2] = 1032.50 + 33.56 = 1066.06
			const interestRate = new Entity({
				name: "Interest rate",
				type: "quantifiable",
			});
			const bankBalance = new Entity({
				name: "Bank balance",
				type: "quantifiable",
			});
			const compoundSystem = new System({ name: "Compound interest" });
			compoundSystem.addEntity(interestRate);
			compoundSystem.addEntity(bankBalance);
			const compoundRelation = new Relation({
				name: "Rate compounds balance",
				type: "positive",
				from: interestRate.id,
				to: bankBalance.id,
			});
			compoundSystem.addRelation(compoundRelation);

			const sim = new Simulation({
				system: compoundSystem,
				initialValues: { [interestRate.id]: 0.0325, [bankBalance.id]: 1000 },
				steps: 10,
				relationTransferFns: {
					[compoundRelation.id]: (rate, balance) => rate * balance,
				},
			});
			sim.run();

			for (let year = 0; year <= 10; year++) {
				const expected = 1000 * 1.0325 ** year;
				const actual = sim.getValuesAt(year)[bankBalance.id];
				expect(actual).toBeCloseTo(expected, 8);
			}
		});
	});

	describe("reset()", () => {
		it("should clear the history", () => {
			const sim = new Simulation({
				system,
				initialValues: { [entityA.id]: 100, [entityB.id]: 0 },
				steps: 5,
				relationWeights: { [relation.id]: 0.1 },
			});
			sim.run();
			expect(sim.history.length).toBe(6);
			sim.reset();
			expect(sim.history.length).toBe(0);
		});
	});
});
