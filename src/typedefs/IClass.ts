import { IBase } from './IBase';
export interface IClass extends IBase {
    name: string,
    description: string,
    teacher: string,
    status: boolean,
    schedule: number[],
}