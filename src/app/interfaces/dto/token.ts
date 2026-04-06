import { DefaultDto } from "./defaultDto";

export interface Token extends DefaultDto{
    email: string;
    token: string;
}
