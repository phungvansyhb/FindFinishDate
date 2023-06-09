import { IBase } from "./IBase";

export interface IAbsentForm extends IBase{
    absentDate : string ,
    reason : string ,
    registerId : number,
    studentId : number
}