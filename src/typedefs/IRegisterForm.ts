import { IBase } from "./IBase";
import { IClass } from "./IClass";
import { IStudent } from "./IStudent";

export interface IRegisterForm extends IBase {
    classId: string,
    studentId: string,
    paymentDate: string,
    startDate: string,
    receiveMoney: number,
    lessonCost: number,
    schedule: string[],
    findFinishDate(): string
}
export interface IRegisterFormDTO extends IRegisterForm {
    student: IStudent,
    class: IClass
}