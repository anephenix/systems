# Systems

A Node.js library for the logic used in Systems Thinking diagrams (also known as [Causal Loop Diagrams](https://en.wikipedia.org/wiki/Causal_loop_diagram)).

[![npm version](https://badge.fury.io/js/%40anephenix%2Fsystems.svg)](https://badge.fury.io/js/%40anephenix%2Fsystems) [![Node.js CI](https://github.com/anephenix/systems/actions/workflows/node.js.yml/badge.svg)](https://github.com/anephenix/systems/actions/workflows/node.js.yml) [![Socket Badge](https://socket.dev/api/badge/npm/package/@anephenix/systems)](https://socket.dev/npm/package/@anephenix/systems)

### Install

```shell
npm i @anephenix/systems
```

### Usage

To begin with, you need to create a System that can contain all of the entities, relations and loops that exist within it. For example, you could map 
out an ecological system like the populations of a predator and prey pair.

#### System

```TypeScript
import { System } from '@anephenix/systems';

const system = new System({name: 'Ecological system'});
```

Once you have created a system, you can begin to add entities to it.

#### Entities

Entities are things that you want to measure or that have an impact within the system. A good example in the contect of the ecological system is the number of predators, and the number of prey. In the case of Yellowstone national park in the United States, Wolves are a predator and Elk are one of their prey.

You may therefore want to create an entity which represents the number of Wolves in Yellowstone national park.

```typescript
import { Entity } from '@anephenix/systems';

const wolves = new Entity({ name: 'Number of Wolves', type: 'quantifiable' });
const elk = new Entity({ name: 'Number of Elk', type: 'quantifiable' });
```

The `type` property is used to indicate whether the entity is something that can be measured in a numerical sense. We can count the number of Wolves so therefore it is quantifiable.

The other type is "non-quantifiable", and relates to things we can't measure numerically. Such examples might be our feelings or emotional state.

The idea is that we map out these entities, and then we start to look at the ways that they are connected to each other. This is where we begin to add relations.

#### Relations

Relations are the links between entities, going from one entity to another, and having either a positive or a negative impact on the target entity.

To give an example, if Wolves are predators to Elk, then if there was an increase in the number of Wolves in YellowStone national park, then we would end up with fewer Elk. And also vice-versa; the fewer Wolves there are in Yellowstone, the more Elk there are likely to be. This is what we would call a negative link.

We can model this relationship as a negative link, like this:

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

There is also another relationship to consider, that of the Elk as a food source to the Wolves.

If there are more Elk in Yellowstone, then there will eventually be more Wolves, and also the flip-side of that is true - the fewer Elk there are in Yellowstone, 
eventually the fewer Wolves there will be.

This is a positive link. The more of one the more of the other, and vice versa. We can model it like this:

```typescript
import { Entity, Relation } from '@anephenix/systems';

const wolves = new Entity({ name: 'Number of Wolves', type: 'quantifiable' });
const elk = new Entity({ name: 'Number of Elk', type: 'quantifiable' });

const ElkAsFoodForWolves = new Relation({
    name: 'Elk as a food source for Wolves',
    type: 'positive',
    from: wolves.id,
    to: elk.id,
});
```

Once you have defined entities and relations, you can add them to the system, which will give you the ability to later on detect feedback loops and determine what kind they are automatically.

#### Adding those entities & relations to the system.

You can add entities and relations to a system using the `addEntity` and `addRelation` functions on the system class instance.

```typescript
import { System, Entity, Relation } from '@anephenix/systems';

// Create the system
const system = new System({name: 'Ecological system'});

// Create the entities
const wolves = new Entity({ name: 'Number of Wolves', type: 'quantifiable' });
const elk = new Entity({ name: 'Number of Elk', type: 'quantifiable' });

// Create the relations
const wolvesEatElk = new Relation({
    name: 'Wolves eating Elk',
    type: 'negative',
    from: wolves.id,
    to: elk.id,
});

const elkAsFoodForWolves = new Relation({
    name: 'Elk as a food source for Wolves',
    type: 'positive',
    from: wolves.id,
    to: elk.id,
});

// Now add the entities to the system
system.addEntity(wolves);
system.addEntity(elk);

// THen add the relations to the system
system.addRelation(wolvesEatElk);
system.addRelation(elkAsFoodForWolves);
```

When you have added the entities and relations to the system, you will then be able to discover the feedback loops that exist in the system.

#### Detecting feedback loops

Feedback loops are cyclical patterns that emerge from the way that entities impact each other, and they can have significant effects within the system.

When drawing the causal loop diagrams by hand, it is easy to spot the feedback loops, as well as determine what kind of impact they have on tne entities they interact with.

Once you have added all of the entities and relations to the system, you can call a single function to detect the loops that exist in the system, as well as the kind that they are.

```typescript
system.detectLoops();
```

This will then populate a list of loops:

```typescript
system.loops;
```

This will not only find all of the feedback loops that exist in the system, but it will also determine what kind of feedback loops they are (balancing or reinforcing).

There are 2 kinds of feedback loops - balancing loops and reinforcing loops.

##### Balancing loops

These are loops where the entities will increase and decrease in a cyclical behaviour. The example of the wolves and the elk is a good example of a balancing loop, which in effect is self-regulating.

For context, an increase in Wolves will lead to a decrease in the number of Elk, 
which in turn will eventually lead to a decline in the number of Wolves, which then will lead to an increase in the number of Elk, which then will lead to an increase in Wolves, and so on.

##### Reinforcing loops

These are loops where the entities have an overall positive impact on each other. A good example of this is a savings bank account and the interest paid on it. An increase in the amount of money in the bank account leads to an increase to the amount of interest that will be earned, and an increase in the amount of interest earned will lead to an increase in the amount of money in the savings bank account.

#### Simulations

NOTE -This is a feature that is yet to be implemented. 

This feature will allow you to run simulations with the system, so that you can learn how systems might impact their entities.

### Licence and Credits

&copy;2025; Anephenix OÜ.
