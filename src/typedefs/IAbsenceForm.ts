import { Timestamp } from "firebase/firestore";
import { IBase } from "./IBase";
import { IClass } from "./IClass";

export interface IAbsenceForm extends IBase {
    absenceDate: Date | Timestamp,
    reason: string,
    classId: string,
    className: string,
    classRoom: IClass,
    status: boolean
}