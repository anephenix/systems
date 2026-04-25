# Systems

A Node.js library for the logic used in Systems Thinking diagrams (also known as [Causal Loop Diagrams](https://en.wikipedia.org/wiki/Causal_loop_diagram)).

[![npm version](https://badge.fury.io/js/%40anephenix%2Fsystems.svg)](https://badge.fury.io/js/%40anephenix%2Fsystems) [![Node.js CI](https://github.com/anephenix/systems/actions/workflows/node.js.yml/badge.svg)](https://github.com/anephenix/systems/actions/workflows/node.js.yml) [![Socket Badge](https://socket.dev/api/badge/npm/package/@anephenix/systems)](https://socket.dev/npm/package/@anephenix/systems)

### Install

```shell
npm i @anephenix/systems
```

### Usage

To begin with, you need to create a System that can contain all of the entities, relations and loops that exist within it. For example, you could map out an ecological system like the populations of a predator and prey pair.

#### System

```typescript
import { System } from '@anephenix/systems';

const system = new System({ name: 'Ecological system' });
```

Once you have created a system, you can begin to add entities to it.

#### Entities

Entities are things that you want to measure or that have an impact within the system. A good example in the context of the ecological system is the number of predators and the number of prey. In the case of Yellowstone national park in the United States, wolves are a predator and elk are one of their prey.

```typescript
import { Entity } from '@anephenix/systems';

const wolves = new Entity({ name: 'Number of Wolves', type: 'quantifiable' });
const elk = new Entity({ name: 'Number of Elk', type: 'quantifiable' });
```

The `type` property indicates whether the entity can be measured numerically. We can count wolves, so the type is `'quantifiable'`.

The other type is `'non-quantifiable'`, for things that cannot be measured numerically — for example, emotional state or public confidence.

#### Relations

Relations are the directed links between entities. Each relation goes from one entity to another and has either a positive or negative polarity.

**Negative relation** — an increase in the source causes a decrease in the target (and vice versa). Wolves preying on elk is a negative link: more wolves means fewer elk.

```typescript
import { Entity, Relation } from '@anephenix/systems';

const wolves = new Entity({ name: 'Number of Wolves', type: 'quantifiable' });
const elk = new Entity({ name: 'Number of Elk', type: 'quantifiable' });

const wolvesEatElk = new Relation({
    name: 'Wolves eating Elk',
    type: 'negative',
    from: wolves.id,
    to: elk.id,
});
```

**Positive relation** — an increase in the source causes an increase in the target. Elk as a food source for wolves is a positive link: more elk eventually means more wolves.

```typescript
const elkAsFoodForWolves = new Relation({
    name: 'Elk as a food source for Wolves',
    type: 'positive',
    from: elk.id,
    to: wolves.id,
});
```

#### Adding entities and relations to the system

Use `addEntity` and `addRelation` on the system instance to register everything.

```typescript
import { System, Entity, Relation } from '@anephenix/systems';

const system = new System({ name: 'Ecological system' });

const wolves = new Entity({ name: 'Number of Wolves', type: 'quantifiable' });
const elk = new Entity({ name: 'Number of Elk', type: 'quantifiable' });

const wolvesEatElk = new Relation({
    name: 'Wolves eating Elk',
    type: 'negative',
    from: wolves.id,
    to: elk.id,
});

const elkAsFoodForWolves = new Relation({
    name: 'Elk as a food source for Wolves',
    type: 'positive',
    from: elk.id,
    to: wolves.id,
});

system.addEntity(wolves);
system.addEntity(elk);

system.addRelation(wolvesEatElk);
system.addRelation(elkAsFoodForWolves);
```

#### Detecting feedback loops

Feedback loops are cyclical patterns that emerge from the relationships between entities. Once all entities and relations have been added, call `detectLoops()` to find and classify every loop automatically.

```typescript
system.detectLoops();
console.log(system.loops);
```

Each loop in `system.loops` has an `id`, a `type` (`'balancing'` or `'reinforcing'`), and arrays of the entity and relation IDs that make it up.

Loops are re-detected automatically whenever you update or remove an entity or relation.

##### Balancing loops

A balancing loop is self-regulating — entities oscillate around an equilibrium. The wolves-and-elk system is a classic example: more wolves reduces elk, which eventually reduces wolves, which allows elk to recover, and so on.

##### Reinforcing loops

A reinforcing loop amplifies change in one direction. A savings account is a good example: a higher balance earns more interest, which further increases the balance.

#### Simulations

A `Simulation` takes a system with assigned initial values and runs it forward step by step, recording the value of every entity at each step.

##### Basic setup

```typescript
import { System, Entity, Relation, Simulation } from '@anephenix/systems';

const system = new System({ name: 'Ecological system' });

const wolves = new Entity({ name: 'Number of Wolves', type: 'quantifiable' });
const elk = new Entity({ name: 'Number of Elk', type: 'quantifiable' });

system.addEntity(wolves);
system.addEntity(elk);

const wolvesEatElk = new Relation({
    name: 'Wolves eating Elk',
    type: 'negative',
    from: wolves.id,
    to: elk.id,
});

const elkAsFoodForWolves = new Relation({
    name: 'Elk as a food source for Wolves',
    type: 'positive',
    from: elk.id,
    to: wolves.id,
});

system.addRelation(wolvesEatElk);
system.addRelation(elkAsFoodForWolves);

const simulation = new Simulation({
    system,
    initialValues: {
        [wolves.id]: 10,
        [elk.id]: 200,
    },
    steps: 50,  // number of time steps to run
    dt: 1,      // time delta per step (e.g. 1 = one season)
});
```

##### Running the simulation

Call `run()` to execute all steps at once. It returns the full history — an array of `{ step, time, values }` objects, one per step starting at step 0 (the initial state).

```typescript
const history = simulation.run();

for (const step of history) {
    console.log(step.step, step.time, step.values);
}
```

At each step, every entity's new value is computed from the previous step's values using the formula:

```
new_value = old_value + (sum of incoming relation deltas) × dt
```

For a positive relation the delta adds to the target; for a negative relation it subtracts. All entities update simultaneously, so no ordering bias is introduced.

##### Relation weights

By default each relation has a weight of `1.0`. You can override this per relation to control how strongly one entity influences another.

```typescript
const simulation = new Simulation({
    system,
    initialValues: {
        [wolves.id]: 10,
        [elk.id]: 200,
    },
    relationWeights: {
        [wolvesEatElk.id]: 0.05,       // each wolf removes 0.05 elk per step
        [elkAsFoodForWolves.id]: 0.008, // each elk adds 0.008 wolves per step
    },
    steps: 50,
});
```

##### Transfer functions

For relationships that are multiplicative rather than linear — for example, compound interest, or predator-prey dynamics where the interaction rate scales with both populations — you can supply a transfer function for any relation. The function receives `(sourceValue, targetValue)` and returns the delta magnitude; the relation's polarity is still applied on top.

```typescript
import { System, Entity, Relation, Simulation } from '@anephenix/systems';

const system = new System({ name: 'Bank account' });

const interestRate = new Entity({ name: 'Annual interest rate', type: 'quantifiable' });
const balance = new Entity({ name: 'Balance', type: 'quantifiable' });

system.addEntity(interestRate);
system.addEntity(balance);

const rateGrowsBalance = new Relation({
    name: 'Interest rate compounds balance',
    type: 'positive',
    from: interestRate.id,
    to: balance.id,
});

system.addRelation(rateGrowsBalance);

const simulation = new Simulation({
    system,
    initialValues: {
        [interestRate.id]: 0.0325, // 3.25% AER
        [balance.id]: 1000,
    },
    relationTransferFns: {
        // delta = rate × currentBalance gives exact compound growth
        [rateGrowsBalance.id]: (rate, currentBalance) => rate * currentBalance,
    },
    steps: 10,
    dt: 1, // 1 year per step
});

const history = simulation.run();
// balance after 10 years: £1,376.89 (= 1000 × 1.0325^10)
```

When a transfer function is provided for a relation, it takes precedence over any `relationWeights` entry for that same relation.

##### Stepping manually

Instead of `run()`, you can advance the simulation one step at a time using `advance()`. This is useful when you want to inspect or react to values between steps.

```typescript
const step1 = simulation.advance(); // returns { step: 1, time: 1, values: { ... } }
const step2 = simulation.advance(); // returns { step: 2, time: 2, values: { ... } }
```

If `advance()` is called before `run()`, the initial state (step 0) is recorded automatically.

##### Accessing history

`getValuesAt(n)` returns the entity values at a specific step number.

```typescript
simulation.run();

const initialState = simulation.getValuesAt(0);
const afterFiveSteps = simulation.getValuesAt(5);
```

##### Resetting

`reset()` clears the history so the simulation can be run again from the initial values, for example with different parameters.

```typescript
simulation.reset();
```

### Licence and Credits

&copy;2026; Anephenix Ltd.
