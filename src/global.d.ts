
// Entity

export type EntitySubType = 'quantifiable' | 'non-quantifiable';

export type EntityType = {
    id: string;
    name: string;
    type: EntitySubType;
}

// Relation

export type RelationSubType = 'positive' | 'negative';

export type RelationType = {
    id: string;
    name: string;
    type: RelationSubType;
    from: string;
    to: string;
}

// Loop

export type LoopSubType = 'reinforcing' | 'balancing';

export type LoopType = any;

