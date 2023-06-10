import { Timestamp } from "firebase/firestore";
import { IBase } from "./IBase";
import { IClass } from "./IClass";
import { IStudent } from "./IStudent";

export interface IRegisterForm extends IBase {
    status: boolean
    classId: string,
    className: string, // use can use className when class is not created
    studentId: string,
    studentName: string,
    paymentDate: Date | Timestamp,
    startDate: Date | Timestamp,
    receiveMoney: string,
    lessonCost: string,
    schedule: number[],
    nextPaymentDate: Date | Timestamp
    // findFinishDate(): string,
}
export interface IRegisterFormDTO extends IRegisterForm {
    student: IStudent,
    class: IClass
}