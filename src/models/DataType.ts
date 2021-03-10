import { Drone } from "./Drone";
import { Filter } from "./Filter";

type DataType = {
    selectAll: boolean;
    records: Drone[];
    perPage: number;
    currentPage: number;
    filters: Filter;
    pageOptions: number[];
    currentFlyOptions: string[];
    fields: object[];
};

export type { DataType };