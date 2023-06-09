import { Timestamp } from "firebase/firestore";
import { IBase } from "./IBase";

export interface IStudent extends IBase {
    // code : string ,
    name: string,
    email: string,
    parent: string,
    phone: string,
    lastContactDate: Timestamp | Date,
    noteContact: string,
    grade: GRADE,
    school: string,
    entryTest: number, // diem dau vao
    social: string, //
    wom: WOM,
    channel: CHANNEL,
    // source : string ,
    note: string,
    location: string,
    status: boolean,
    // classID : string
}
export enum WOM {
    P = 'P',
    S = 'S',
    A = 'A',
    OTHER = 'Khác'
}
export enum CHANNEL {
    FACEBOOK = 'FaceBook',
    ZALO = 'Zalo',
    PHONE = 'Phone',
    OTHER = 'Khác'
}
export enum GRADE {
    GRADE5 = '5',
    GRADE6 = '6',
    GRADE7 = '7',
    GRADE8 = '8',
    GRADE9 = '9',
    GRADE10 = '10',
    GRADE11 = '11',
    GRADE12 = '12',
    STUDENT = 'Sinh viên',
    OTHER = 'Khác',
}
