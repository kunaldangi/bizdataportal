import { schema } from "./schema";

export interface Response {
    status: string;
    message: string;
};

export { schema as responseSchema};