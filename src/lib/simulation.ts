import type { SimulationStep } from "../global.js";
import type System from "./system.js";

type TransferFn = (sourceValue: number, targetValue: number) => number;

interface SimulationConfig {
	system: System;
	initialValues: Record<string, number>;
	relationWeights?: Record<string, number>;
	relationTransferFns?: Record<string, TransferFn>;
	steps?: number;
	dt?: number;
}

export default class Simulation {
	system: System;
	initialValues: Record<string, number>;
	relationWeights: Record<string, number>;
	relationTransferFns: Record<string, TransferFn>;
	steps: number;
	dt: number;
	history: SimulationStep[];

	constructor({
		system,
		initialValues,
		relationWeights = {},
		relationTransferFns = {},
		steps = 100,
		dt = 1.0,
	}: SimulationConfig) {
		this.system = system;
		this.initialValues = initialValues;
		this.relationWeights = relationWeights;
		this.relationTransferFns = relationTransferFns;
		this.steps = steps;
		this.dt = dt;
		this.history = [];
		this.validate();
	}

	validate() {
		if (Object.keys(this.initialValues).length === 0) {
			throw new Error("initialValues must not be empty");
		}
		for (const entityId of Object.keys(this.initialValues)) {
			if (!this.system.findEntity(entityId)) {
				throw new Error(`Entity "${entityId}" not found in system`);
			}
		}
		for (const relationId of Object.keys(this.relationWeights)) {
			if (!this.system.findRelation(relationId)) {
				throw new Error(`Relation "${relationId}" not found in system`);
			}
		}
		for (const relationId of Object.keys(this.relationTransferFns)) {
			if (!this.system.findRelation(relationId)) {
				throw new Error(`Relation "${relationId}" not found in system`);
			}
		}
		if (this.steps <= 0 || !Number.isInteger(this.steps)) {
			throw new Error("steps must be a positive integer");
		}
		if (this.dt <= 0) {
			throw new Error("dt must be a positive number");
		}
	}

	run(): SimulationStep[] {
		this.reset();
		this.history.push({
			step: 0,
			time: 0,
			values: { ...this.initialValues },
		});
		for (let i = 0; i < this.steps; i++) {
			this.advance();
		}
		return this.history;
	}

	advance(): SimulationStep {
		if (this.history.length === 0) {
			this.history.push({
				step: 0,
				time: 0,
				values: { ...this.initialValues },
			});
		}

		const current = this.history[this.history.length - 1];
		const nextValues: Record<string, number> = {};

		for (const entityId of Object.keys(this.initialValues)) {
			const incoming = this.system.relations.filter(
				(r) => r.to === entityId && r.from in this.initialValues,
			);

			let delta = 0;
			for (const relation of incoming) {
				const sourceValue = current.values[relation.from];
				if (sourceValue === undefined) continue;
				const polarity = relation.type === "positive" ? 1 : -1;

				const transferFn = this.relationTransferFns[relation.id];
				if (transferFn) {
					delta += transferFn(sourceValue, current.values[entityId]) * polarity;
				} else {
					const weight = this.relationWeights[relation.id] ?? 1.0;
					delta += weight * sourceValue * polarity;
				}
			}

			nextValues[entityId] = current.values[entityId] + delta * this.dt;
		}

		const next: SimulationStep = {
			step: current.step + 1,
			time: (current.step + 1) * this.dt,
			values: nextValues,
		};

		this.history.push(next);
		return next;
	}

	getValuesAt(step: number): Record<string, number> {
		const found = this.history.find((s) => s.step === step);
		if (!found) throw new Error(`Step ${step} not found in history`);
		return found.values;
	}

	reset() {
		this.history = [];
	}
}
