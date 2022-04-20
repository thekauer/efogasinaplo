import { Species } from "../lib/spcecies";

export interface AggregateEntry {
  count: number;
  weight: number;
  date: Date;
}

export interface WaterAggregate {
  name: string;
  code: string;
  species: {
    [key: Species]: AggregateEntry;
  };
}

export interface Aggregate {
  dayCount: number;
  lastCatch?: Date;
  waters: {
    [waterCode: string]: WaterAggregate;
  };
  sum: {
    [key: Species]: number;
  };
}
