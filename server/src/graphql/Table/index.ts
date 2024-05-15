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
    id: number;
    title: string;
    dataType: string;
    defaultValue: string;
}

export interface TableUser {
    id: number;
    username: number;
    email: number;
    permissions: TablePermissions;
}

export interface TablePermissions {
    writeEntry: false,
    manageRows: false,
    manageFields: false,
    manageTable: false,
    manageUsers: false
}

export type RowsData = FieldData[][];
export type RowData = FieldData[];

export interface FieldData {
    rowId: number;
    fieldId: number;
    title: string;
    value: string;
    createdat: string;
    updatedat: string;
}

