import { Entity, Relation, Simulation, System } from "../dist/lib/index.js";

// Causal structure:
//
//   Annual Interest Rate ──(+)──► Balance
//
// A higher rate drives a higher balance — a reinforcing relationship. Because
// the interest earned each year depends on the *current* balance (not just the
// original principal), we supply a transfer function for the relation:
//
//   transferFn(rate, balance) => rate * balance
//
// This tells the simulation to compute the delta as rate × currentBalance
// rather than the default weight × sourceValue, giving exact compound growth:
//
//   Balance[n] = initialBalance × (1 + annualRate)^n

const initialBalance = 1000;
const annualRate = 0.0325; // 3.25% AER

const system = new System({ name: "Bank account" });

const balance = new Entity({ name: "Balance", type: "quantifiable" });
const interestRate = new Entity({
	name: "Annual interest rate",
	type: "quantifiable",
});

system.addEntity(balance);
system.addEntity(interestRate);

const rateGrowsBalance = new Relation({
	name: "Interest rate compounds balance",
	type: "positive",
	from: interestRate.id,
	to: balance.id,
});

system.addRelation(rateGrowsBalance);

const simulation = new Simulation({
	system,
	initialValues: {
		[interestRate.id]: annualRate,
		[balance.id]: initialBalance,
	},
	relationTransferFns: {
		[rateGrowsBalance.id]: (rate, currentBalance) => rate * currentBalance,
	},
	steps: 10,
	dt: 1, // 1 year per step
});

const history = simulation.run();

const trueCompound = (year: number) =>
	initialBalance * (1 + annualRate) ** year;

console.log("Bank Account Simulation — 3.25% AER, starting balance $1,000\n");
console.log("Year | Simulated ($) | True compound ($)");
console.log("-----|---------------|------------------");

for (const step of history) {
	const simVal = step.values[balance.id];
	const trueVal = trueCompound(step.step);

	const year = String(step.step).padStart(4, " ");
	const sim = simVal.toFixed(2).padStart(13, " ");
	const expected = trueVal.toFixed(2).padStart(18, " ");

	console.log(`${year} |${sim} |${expected}`);
}
