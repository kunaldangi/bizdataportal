import { schema } from "./schema";
import { resolver } from "./resolver";

export { schema as tableSchema , resolver as tableResolver }

export interface Table {
    id: number;
    ownerId: number;
    name: string;
    description: string;
    fields: TableField[];
}

export interface TableField {
    title: string;
    dataType: string;
    defaultValue: string;
}