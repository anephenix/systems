import { Entity, Relation, Simulation, System } from "../dist/lib/index.js";

// Woodland Ecosystem Simulation
//
// Five animals/insects interact with vegetation and habitat in a network of
// predator-prey and resource feedback loops:
//
//   Habitat ──(+)──► Vegetation ──(+)──► Rabbits ──(+)──► Foxes
//                        │   ▲               │                │
//                        │   │(pollination)  │(grazing)       │(predation)
//                        │   │               ▼                ▼
//                        │  Bees ◄──(+)── Vegetation ◄──(-)── Rabbits
//                        │   ▲
//                        │   └── (food) ◄── Vegetation
//                        │
//                        └──(+)──► Caterpillars ──(+)──► Birds
//                                      ▲                     │
//                                      └──────(-)────────────┘
//                                              (predation)
//
// Transfer functions encode:
//   - Births proportional to population × food availability
//   - Deaths factored directly into food-source relations
//   - Predation proportional to predator × prey counts (Lotka-Volterra style)
//   - Vegetation logistic regrowth toward carrying capacity (12 × habitat)

const system = new System({ name: "Woodland ecosystem" });

// --- Entities ---

const habitat = new Entity({ name: "Habitat quality", type: "quantifiable" });
const vegetation = new Entity({ name: "Vegetation", type: "quantifiable" });
const rabbits = new Entity({ name: "Rabbits", type: "quantifiable" });
const foxes = new Entity({ name: "Foxes", type: "quantifiable" });
const caterpillars = new Entity({ name: "Caterpillars", type: "quantifiable" });
const birds = new Entity({ name: "Birds", type: "quantifiable" });
const bees = new Entity({ name: "Bees", type: "quantifiable" });

for (const e of [
	habitat,
	vegetation,
	rabbits,
	foxes,
	caterpillars,
	birds,
	bees,
]) {
	system.addEntity(e);
}

// --- Relations ---

// Habitat drives vegetation toward carrying capacity (12 × habitat = 1200)
const habitatRestoresVeg = new Relation({
	name: "Habitat restores vegetation",
	type: "positive",
	from: habitat.id,
	to: vegetation.id,
});

// Rabbits graze vegetation
const rabbitsGrazeVeg = new Relation({
	name: "Rabbits graze vegetation",
	type: "negative",
	from: rabbits.id,
	to: vegetation.id,
});

// Caterpillars consume vegetation
const caterpillarsConsumeVeg = new Relation({
	name: "Caterpillars consume vegetation",
	type: "negative",
	from: caterpillars.id,
	to: vegetation.id,
});

// Bees pollinate and strengthen vegetation (reinforcing loop with vegFeedsBees)
const beesPollinateVeg = new Relation({
	name: "Bees pollinate vegetation",
	type: "positive",
	from: bees.id,
	to: vegetation.id,
});

// Vegetation provides food for rabbits — net birth minus natural death
const vegSupportsRabbits = new Relation({
	name: "Vegetation supports rabbit population",
	type: "positive",
	from: vegetation.id,
	to: rabbits.id,
});

// Foxes hunt rabbits
const foxesPreyOnRabbits = new Relation({
	name: "Foxes predate rabbits",
	type: "negative",
	from: foxes.id,
	to: rabbits.id,
});

// Rabbits sustain foxes — net fox birth from prey minus fox natural death
const rabbitsSupplyFoxes = new Relation({
	name: "Rabbits sustain fox population",
	type: "positive",
	from: rabbits.id,
	to: foxes.id,
});

// Vegetation provides food for caterpillars — net birth minus natural death
const vegSupportsCaterpillars = new Relation({
	name: "Vegetation supports caterpillar population",
	type: "positive",
	from: vegetation.id,
	to: caterpillars.id,
});

// Birds eat caterpillars
const birdsPreyOnCaterpillars = new Relation({
	name: "Birds predate caterpillars",
	type: "negative",
	from: birds.id,
	to: caterpillars.id,
});

// Caterpillars sustain birds — net bird birth from prey minus bird natural death
const caterpillarsSupplyBirds = new Relation({
	name: "Caterpillars sustain bird population",
	type: "positive",
	from: caterpillars.id,
	to: birds.id,
});

// Vegetation provides nectar and habitat for bees — net birth minus natural death
const vegSupportsBees = new Relation({
	name: "Vegetation supports bee population",
	type: "positive",
	from: vegetation.id,
	to: bees.id,
});

// Some bird species eat bees
const birdsPreyOnBees = new Relation({
	name: "Birds predate bees",
	type: "negative",
	from: birds.id,
	to: bees.id,
});

for (const r of [
	habitatRestoresVeg,
	rabbitsGrazeVeg,
	caterpillarsConsumeVeg,
	beesPollinateVeg,
	vegSupportsRabbits,
	foxesPreyOnRabbits,
	rabbitsSupplyFoxes,
	vegSupportsCaterpillars,
	birdsPreyOnCaterpillars,
	caterpillarsSupplyBirds,
	vegSupportsBees,
	birdsPreyOnBees,
]) {
	system.addRelation(r);
}

system.detectLoops();

// --- Initial population values ---

const VEG_0 = 1000;

const simulation = new Simulation({
	system,
	initialValues: {
		[habitat.id]: 100, // carrying-capacity index (stays constant)
		[vegetation.id]: VEG_0,
		[rabbits.id]: 50,
		[foxes.id]: 5,
		[caterpillars.id]: 200,
		[birds.id]: 30,
		[bees.id]: 500,
	},
	relationTransferFns: {
		// Logistic regrowth: faster when vegetation is well below carrying capacity
		[habitatRestoresVeg.id]: (hab, veg) => (hab * 12 - veg) * 0.03,

		// Fixed consumption per individual
		[rabbitsGrazeVeg.id]: (r, _veg) => 0.05 * r,
		[caterpillarsConsumeVeg.id]: (c, _veg) => 0.02 * c,
		[beesPollinateVeg.id]: (b, _veg) => 0.001 * b,

		// Rabbit births scale with food availability; natural death is constant
		[vegSupportsRabbits.id]: (veg, r) => 0.04 * r * (veg / VEG_0) - 0.01 * r,

		// Fox predation scales with both populations
		[foxesPreyOnRabbits.id]: (f, r) => 0.005 * f * r,

		// Fox births scale with prey × foxes; natural mortality is constant
		[rabbitsSupplyFoxes.id]: (r, f) => 0.0008 * r * f - 0.03 * f,

		// Caterpillar births scale with food; natural death is constant
		[vegSupportsCaterpillars.id]: (veg, c) =>
			0.05 * c * (veg / VEG_0) - 0.015 * c,

		// Bird predation scales with both populations
		[birdsPreyOnCaterpillars.id]: (b, c) => 0.001 * b * c,

		// Bird births scale with prey × birds; natural mortality is constant
		[caterpillarsSupplyBirds.id]: (c, b) => 0.0005 * c * b - 0.02 * b,

		// Bee births scale with food availability; natural death is constant
		[vegSupportsBees.id]: (veg, be) => 0.025 * be * (veg / VEG_0) - 0.01 * be,

		// Bird predation on bees (minor pressure)
		[birdsPreyOnBees.id]: (b, be) => 0.0001 * b * be,
	},
	steps: 50,
	dt: 1,
});

const history = simulation.run();

// --- Output ---

const col = (n: number, w: number) =>
	Math.max(0, Math.round(n)).toString().padStart(w, " ");

console.log("Woodland Ecosystem Simulation — 50 time steps\n");
console.log(
	`Detected ${system.loops.length} feedback loop(s): ` +
		system.loops.map((l) => l.type).join(", ") +
		"\n",
);
console.log(
	"Step | Vegetation | Rabbits | Foxes | Caterpillars | Birds |   Bees",
);
console.log(
	"-----|------------|---------|-------|--------------|-------|-------",
);

for (const step of history) {
	if (step.step % 5 !== 0) continue;
	const v = step.values;
	console.log(
		`${String(step.step).padStart(4)} |` +
			`${col(v[vegetation.id], 11)} |` +
			`${col(v[rabbits.id], 8)} |` +
			`${col(v[foxes.id], 6)} |` +
			`${col(v[caterpillars.id], 13)} |` +
			`${col(v[birds.id], 6)} |` +
			`${col(v[bees.id], 7)}`,
	);
}
